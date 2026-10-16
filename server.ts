import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { runRuleBasedValidation } from './src/utils/ruleValidator.ts';
import { ChecklistItem, DocumentType, AnalysisReport } from './src/types/compliance.ts';
import { SAMPLE_DOCUMENTS } from './src/utils/checklists.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health & System Status Endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    ruleEngine: 'active',
    timestamp: new Date().toISOString(),
  });
});

// Sample Documents Endpoint
app.get('/api/samples', (req: Request, res: Response) => {
  res.json(SAMPLE_DOCUMENTS);
});

// PDF Text Extraction Helper using pdf-parse v2
async function extractPdfText(buffer: Buffer): Promise<{ text: string; numPages: number }> {
  // @ts-ignore
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText({ pageJoiner: '\n\n' });
  const numPages = result.total || (result.pages ? result.pages.length : 1);
  let text = result.text || '';
  if (!text.trim() && result.pages && result.pages.length > 0) {
    text = result.pages.map((p: any) => p.text).join('\n\n');
  }
  await parser.destroy();
  return { text: text.trim(), numPages };
}

// PDF Extraction Endpoint
app.post('/api/extract-pdf', async (req: Request, res: Response) => {
  try {
    const { base64, filename = 'document.pdf' } = req.body as {
      base64: string;
      filename?: string;
    };

    if (!base64 || typeof base64 !== 'string') {
      return res.status(400).json({ error: 'Base64 encoded PDF data is required.' });
    }

    // Strip data URI scheme if present (e.g., data:application/pdf;base64,...)
    const cleanBase64 = base64.replace(/^data:application\/pdf;base64,/, '').replace(/\s/g, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length === 0) {
      return res.status(400).json({ error: 'Uploaded file is empty.' });
    }

    if (buffer.length > 25 * 1024 * 1024) {
      return res.status(400).json({ error: 'PDF file exceeds 25MB maximum limit.' });
    }

    const { text, numPages } = await extractPdfText(buffer);

    if (!text || text.length === 0) {
      return res.status(422).json({
        error:
          'No readable text could be extracted from this PDF. It may consist of scanned images without an embedded OCR text layer.',
      });
    }

    const words = text.match(/\b[\w'-]+\b/g) || [];

    res.json({
      success: true,
      text,
      numPages,
      wordCount: words.length,
      charCount: text.length,
      filename,
    });
  } catch (err: any) {
    console.error('PDF extraction failed:', err);
    res.status(500).json({
      error: 'Failed to extract text from PDF.',
      details: err?.message || 'The PDF format may be encrypted, corrupted, or unsupported.',
    });
  }
});

// Download sample flawed PDF for live testing
app.get('/api/sample-pdf', (req: Request, res: Response) => {
  const samplePath = path.resolve(__dirname, 'public', 'sample-flawed-report.pdf');
  if (fs.existsSync(samplePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Sample_Flawed_Project_Report.pdf"');
    fs.createReadStream(samplePath).pipe(res);
  } else {
    res.status(404).json({ error: 'Sample PDF not found.' });
  }
});

// Download sample compliant PDF for live testing
app.get('/api/sample-compliant-pdf', (req: Request, res: Response) => {
  const samplePath = path.resolve(__dirname, 'public', 'sample-compliant-report.pdf');
  if (fs.existsSync(samplePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Sample_Compliant_Project_Report.pdf"');
    fs.createReadStream(samplePath).pipe(res);
  } else {
    res.status(404).json({ error: 'Sample Compliant PDF not found.' });
  }
});

// Primary Compliance Analysis Endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const {
      text,
      documentType = 'project_report',
      checklist,
      enableAi = true,
      customTitle,
    } = req.body as {
      text: string;
      documentType: DocumentType;
      checklist: ChecklistItem[];
      enableAi?: boolean;
      customTitle?: string;
    };

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Document text is required for analysis.' });
    }

    if (text.length > 150000) {
      return res.status(400).json({
        error: 'Document exceeds maximum size limit (150,000 characters). Please condense or analyze by chapter.',
      });
    }

    // Step 1: Run Deterministic Rule-Based Validation
    const baseReport: AnalysisReport = runRuleBasedValidation(
      text,
      documentType,
      checklist || [],
      customTitle
    );

    // If AI is disabled or API key not present, return deterministic result immediately
    if (!enableAi || !ai || !process.env.GEMINI_API_KEY) {
      const message = !process.env.GEMINI_API_KEY
        ? 'Analyzed using SmartCheck Rule Engine (100% deterministic & offline-safe). Configure GEMINI_API_KEY to unlock advanced semantic suggestions.'
        : 'Analyzed using Fast Deterministic Rule Mode.';

      return res.json({
        ...baseReport,
        aiEnriched: false,
        aiMessage: message,
      });
    }

    // Step 2: Gemini AI Semantic Enrichment
    try {
      const prompt = `You are SmartCheck AI, an expert document auditor for academic, career, and research compliance.
Review the following ${documentType.replace('_', ' ')} text against standard submission requirements.

Checklist items evaluated:
${(checklist || []).map((c) => `- ${c.label}: ${c.description} (Required: ${c.required})`).join('\n')}

Rule Engine Initial Findings:
- Base Score: ${baseReport.overallScore}/100
- Missing items identified: ${baseReport.missingRequiredSections.join(', ') || 'None'}
- Placeholder/Quality flags: ${baseReport.incompleteItems.join(', ') || 'None'}

Document Text:
"""
${text.slice(0, 15000)}
"""

Provide your objective evaluation:
1. An executive assessment (2-3 sentences) evaluating the document's submission readiness.
2. A list of 2-5 concrete semantic gaps or weaknesses (e.g. missing quantitative metrics, unbacked assertions, tone problems, vague methodologies).
3. 2-5 actionable suggestions with specific rewrite examples or recommendations.
4. A semantic score adjustment integer between -10 and +5 based on whether the document is exceptionally detailed or has unstated flaws.
5. A rigorous Problem-Solution-Conclusion synthesis:
   - identifiedProblem: The underlying operational challenge, scientific gap, or practical bottleneck the document/PDF targets.
   - proposedSolution: The specific technical, algorithmic, or organizational solution, stated explicitly and SEPARATELY.
   - properConclusion: A comprehensive, publication-ready conclusion paragraph that directly resolves the initial problem, synthesizes the results of the proposed solution, notes constraints, and outlines next steps.
   - impactSummary: A 1-2 sentence quantifiable impact summary.
   - actionableTakeaways: 2-4 key takeaways.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveAssessment: {
                type: Type.STRING,
                description: 'Brief executive critique of the document quality and readiness',
              },
              identifiedGaps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Key semantic or contextual weaknesses detected',
              },
              actionableSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: {
                      type: Type.STRING,
                      description: 'clarity, grammar, tone, or completeness',
                    },
                    issue: { type: Type.STRING, description: 'Description of the problem' },
                    originalSnippet: {
                      type: Type.STRING,
                      description: 'Exact or approximate excerpt from the document',
                    },
                    suggestion: {
                      type: Type.STRING,
                      description: 'Specific advice or improved rewrite',
                    },
                    severity: {
                      type: Type.STRING,
                      description: 'high, medium, or low',
                    },
                  },
                  required: ['category', 'issue', 'suggestion', 'severity'],
                },
              },
              semanticScoreAdjustment: {
                type: Type.INTEGER,
                description: 'Score adjustment from -10 to +5',
              },
              problemSolutionSynthesis: {
                type: Type.OBJECT,
                properties: {
                  identifiedProblem: {
                    type: Type.STRING,
                    description: 'The core problem or operational challenge addressed in the document',
                  },
                  proposedSolution: {
                    type: Type.STRING,
                    description: 'The proposed solution or system approach mentioned separately',
                  },
                  properConclusion: {
                    type: Type.STRING,
                    description: 'A proper conclusion resolving the problem with actionable outcomes',
                  },
                  impactSummary: {
                    type: Type.STRING,
                    description: '1-2 sentence quantifiable impact statement',
                  },
                  actionableTakeaways: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Bullet points on problem resolution and next steps',
                  },
                },
                required: [
                  'identifiedProblem',
                  'proposedSolution',
                  'properConclusion',
                  'impactSummary',
                  'actionableTakeaways',
                ],
              },
            },
            required: [
              'executiveAssessment',
              'identifiedGaps',
              'actionableSuggestions',
              'semanticScoreAdjustment',
              'problemSolutionSynthesis',
            ],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const aiData = JSON.parse(responseText);

        // Merge AI suggestions with rule-based clarity issues
        const aiClarityIssues = (aiData.actionableSuggestions || []).map((s: any) => ({
          type: (['clarity', 'grammar', 'tone', 'completeness'].includes(s.category)
            ? s.category
            : 'clarity') as any,
          issue: s.issue,
          originalSnippet: s.originalSnippet || undefined,
          suggestion: s.suggestion,
          severity: (['high', 'medium', 'low', 'info'].includes(s.severity)
            ? s.severity
            : 'medium') as any,
        }));

        // Merge gaps into incomplete items if novel
        const combinedIncomplete = Array.from(
          new Set([...baseReport.incompleteItems, ...(aiData.identifiedGaps || [])])
        );

        // Adjust score cautiously (clamp within 0-100)
        const adj = Number(aiData.semanticScoreAdjustment) || 0;
        let adjustedScore = Math.max(0, Math.min(100, baseReport.overallScore + adj));

        // If required sections are missing, still enforce score ceiling
        if (baseReport.missingRequiredSections.length >= 2 && adjustedScore > 65) {
          adjustedScore = 65;
        }

        let scoreTier: AnalysisReport['scoreTier'];
        if (adjustedScore >= 80) {
          scoreTier = 'Submission Ready';
        } else if (adjustedScore >= 60) {
          scoreTier = 'Needs Minor Revisions';
        } else if (adjustedScore >= 40) {
          scoreTier = 'Needs Significant Work';
        } else {
          scoreTier = 'High Risk of Rejection';
        }

        const enrichedReport: AnalysisReport = {
          ...baseReport,
          overallScore: adjustedScore,
          scoreTier,
          summary: `${baseReport.summary} AI Assessment: ${aiData.executiveAssessment}`,
          incompleteItems: combinedIncomplete,
          clarityIssues: [...baseReport.clarityIssues, ...aiClarityIssues],
          problemSolutionSynthesis: aiData.problemSolutionSynthesis || baseReport.problemSolutionSynthesis,
          aiEnriched: true,
          aiMessage: 'Enhanced with Google Gemini 3.8 Flash semantic reasoning & rewrite suggestions.',
        };

        return res.json(enrichedReport);
      }
    } catch (aiErr: any) {
      console.warn('Gemini API call failed, falling back to rule-based analysis:', aiErr?.message);
      // Gracefully fall back to rule-based validation
      return res.json({
        ...baseReport,
        aiEnriched: false,
        aiMessage: `Rule-based evaluation completed successfully. (AI analysis bypassed: ${aiErr?.message || 'service busy'}).`,
      });
    }

    return res.json(baseReport);
  } catch (err: any) {
    console.error('Analysis error:', err);
    return res.status(500).json({
      error: 'Failed to analyze document. Please check your document text and try again.',
      details: err?.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SmartCheck AI] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
