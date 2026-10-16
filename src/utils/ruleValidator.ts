import {
  AnalysisReport,
  ChecklistItem,
  CheckResult,
  ClarityIssue,
  DocumentType
} from '../types/compliance';

export function runRuleBasedValidation(
  text: string,
  documentType: DocumentType,
  checklist: ChecklistItem[],
  customTitle?: string
): AnalysisReport {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // Basic document statistics
  const words = cleanText ? cleanText.match(/\b[\w'-]+\b/g) || [] : [];
  const wordCount = words.length;
  const charCount = cleanText.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Extract paragraphs (separated by 2 or more newlines)
  const rawParagraphs = cleanText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Extract headers and sections
  const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);
  const detectedHeaders: string[] = [];
  lines.forEach((line) => {
    // Markdown headers (# Header) or all caps headers
    const mdMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (mdMatch) {
      detectedHeaders.push(mdMatch[1].toLowerCase().trim());
    } else if (
      line.length < 60 &&
      line === line.toUpperCase() &&
      /[A-Z]/.test(line) &&
      !line.includes('.')
    ) {
      detectedHeaders.push(line.toLowerCase().trim());
    }
  });

  const checkResults: CheckResult[] = [];
  const missingRequiredSections: string[] = [];
  const incompleteItems: string[] = [];
  const clarityIssues: ClarityIssue[] = [];

  // 1. Detect Placeholders in Document
  const placeholderPatterns = [
    { regex: /\[todo[:\s\w-]*\]/gi, label: 'TODO placeholder tag' },
    { regex: /\btodo\b[:\s]/gi, label: 'TODO instruction note' },
    { regex: /\[tbd\]|\btbd\b/gi, label: 'TBD (To Be Determined) tag' },
    { regex: /\[insert\s+[^\]]+\]/gi, label: '[Insert ...] placeholder note' },
    { regex: /lorem\s+ipsum/gi, label: 'Lorem Ipsum dummy text' },
    { regex: /\[replace\s+this\]/gi, label: '[Replace this] draft note' }
  ];

  placeholderPatterns.forEach(({ regex, label }) => {
    const matches = cleanText.match(regex);
    if (matches && matches.length > 0) {
      clarityIssues.push({
        type: 'placeholder',
        issue: `Unresolved draft placeholder: "${matches[0]}"`,
        originalSnippet: matches[0],
        suggestion: `Replace this placeholder with verified factual details before submission. Leaving ${label} in final copies often leads to immediate rejection.`,
        severity: 'high'
      });
      incompleteItems.push(`Unresolved placeholder: ${matches[0]}`);
    }
  });

  // 2. Detect Duplicate / Repeated Paragraphs
  const seenParagraphs = new Map<string, number>();
  rawParagraphs.forEach((p, idx) => {
    // Only check substantial paragraphs (> 40 chars)
    if (p.length > 40 && !p.startsWith('#')) {
      const normalized = p.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenParagraphs.has(normalized)) {
        clarityIssues.push({
          type: 'contradiction',
          issue: `Duplicated paragraph detected at paragraph #${idx + 1}`,
          originalSnippet: p.substring(0, 100) + '...',
          suggestion: 'A nearly identical paragraph appears earlier in the document. Review and delete redundant text to maintain professional conciseness.',
          severity: 'medium'
        });
      } else {
        seenParagraphs.set(normalized, idx);
      }
    }
  });

  // 3. Evaluate Each Checklist Requirement
  let totalMaxWeight = 0;
  let totalEarnedWeight = 0;

  checklist.forEach((item) => {
    totalMaxWeight += item.weight;

    let matched = false;
    let matchedSnippet = '';
    let isSubstantial = true;

    // Check custom patterns if specified (e.g. Email regex, Phone regex)
    if (item.patterns && item.patterns.length > 0) {
      for (const patternStr of item.patterns) {
        const reg = new RegExp(patternStr, 'i');
        const match = cleanText.match(reg);
        if (match) {
          matched = true;
          matchedSnippet = match[0];
          break;
        }
      }
    }

    // Check keyword presence in headers or document body
    if (!matched) {
      for (const kw of item.keywords) {
        const kwLower = kw.toLowerCase();
        // Check if keyword is in detected headers (stronger signal)
        const inHeader = detectedHeaders.some((h) => h.includes(kwLower));
        if (inHeader) {
          matched = true;
          matchedSnippet = `Section header matching "${kw}" detected.`;
          break;
        }

        // Check if keyword exists in body
        const kwIndex = lowerText.indexOf(kwLower);
        if (kwIndex !== -1) {
          matched = true;
          const snippetStart = Math.max(0, kwIndex - 20);
          const snippetEnd = Math.min(cleanText.length, kwIndex + kw.length + 50);
          matchedSnippet = `..."${cleanText.substring(snippetStart, snippetEnd).trim()}"...`;
          break;
        }
      }
    }

    // If matched, verify that section has sufficient content
    if (matched && item.category === 'section') {
      // Find where this keyword/header is and check following text
      for (const kw of item.keywords) {
        const kwIdx = lowerText.indexOf(kw.toLowerCase());
        if (kwIdx !== -1) {
          const followingText = cleanText.substring(kwIdx + kw.length, kwIdx + kw.length + 300);
          const sectionWords = followingText.match(/\b[\w'-]+\b/g) || [];
          if (sectionWords.length < 8 && cleanText.length > 200) {
            isSubstantial = false;
          }
          break;
        }
      }
    }

    // Determine status & score
    if (matched && isSubstantial) {
      checkResults.push({
        id: item.id,
        itemLabel: item.label,
        category: item.category,
        status: 'passed',
        severity: 'info',
        explanation: `Requirement satisfied. ${matchedSnippet}`,
        recommendation: 'Meets criteria. Ensure data remains accurate and up to date.',
        matchedContent: matchedSnippet,
        required: item.required,
        scoreAwarded: item.weight,
        maxScore: item.weight
      });
      totalEarnedWeight += item.weight;
    } else if (matched && !isSubstantial) {
      const halfScore = Math.round(item.weight / 2);
      checkResults.push({
        id: item.id,
        itemLabel: item.label,
        category: item.category,
        status: 'warning',
        severity: 'medium',
        explanation: `Section header exists, but contains very little descriptive content (appears truncated or incomplete).`,
        recommendation: item.helpFix,
        matchedContent: matchedSnippet,
        required: item.required,
        scoreAwarded: halfScore,
        maxScore: item.weight
      });
      totalEarnedWeight += halfScore;
      incompleteItems.push(item.label);
    } else {
      checkResults.push({
        id: item.id,
        itemLabel: item.label,
        category: item.category,
        status: 'failed',
        severity: item.required ? 'high' : 'low',
        explanation: `Missing requirement: ${item.description}`,
        recommendation: item.helpFix,
        required: item.required,
        scoreAwarded: 0,
        maxScore: item.weight
      });

      if (item.required) {
        missingRequiredSections.push(item.label);
      }
    }
  });

  // Calculate base score percentage (0-100) strictly from checklist weights
  let baseScore = totalMaxWeight > 0 ? (totalEarnedWeight / totalMaxWeight) * 100 : 0;

  // Deductions for quality violations
  let penalties = 0;
  if (clarityIssues.filter((c) => c.type === 'placeholder').length > 0) {
    penalties += 8; // Penalty for leftover TODOs
  }
  if (clarityIssues.filter((c) => c.type === 'contradiction').length > 0) {
    penalties += 5; // Penalty for redundant sections
  }
  if (wordCount < 100) {
    penalties += 20; // Extremely brief document
  }

  // Calculate final score
  let finalScore = Math.max(0, Math.min(100, Math.round(baseScore - penalties)));

  // If critical required items are missing, cap the score so it never falsely reports "Ready"
  if (missingRequiredSections.length >= 3 && finalScore > 55) {
    finalScore = 52;
  } else if (missingRequiredSections.length >= 1 && finalScore > 78) {
    finalScore = 74;
  }

  // Determine score tier
  let scoreTier: AnalysisReport['scoreTier'];
  if (finalScore >= 80) {
    scoreTier = 'Submission Ready';
  } else if (finalScore >= 60) {
    scoreTier = 'Needs Minor Revisions';
  } else if (finalScore >= 40) {
    scoreTier = 'Needs Significant Work';
  } else {
    scoreTier = 'High Risk of Rejection';
  }

  const passedCount = checkResults.filter((c) => c.status === 'passed').length;
  const failedCount = checkResults.filter((c) => c.status === 'failed').length;
  const warningCount = checkResults.filter((c) => c.status === 'warning').length;

  // Document title extraction
  let docTitle = customTitle || 'Untitled Document';
  if (!customTitle || customTitle === 'Untitled Document') {
    const firstLine = lines[0] || '';
    if (firstLine.startsWith('#')) {
      docTitle = firstLine.replace(/^#+\s*/, '').trim();
    } else if (firstLine.length > 0 && firstLine.length < 80) {
      docTitle = firstLine;
    }
  }

  // Generate clear summary
  let summary = '';
  if (missingRequiredSections.length === 0 && finalScore >= 85) {
    summary = `Strong compliance! All ${checklist.length} core requirements and structural sections were detected with adequate depth. Minimal to no formatting gaps identified.`;
  } else if (missingRequiredSections.length > 0) {
    summary = `Document scored ${finalScore}/100. Detected ${missingRequiredSections.length} missing required item(s): [${missingRequiredSections.join(', ')}]. Immediate revision is recommended before official submission.`;
  } else {
    summary = `Document scored ${finalScore}/100. Key sections were present, but incomplete sections or draft placeholders prevent a top-tier compliance rating.`;
  }

  // Synthesize Problem, Solution, and Proper Conclusion
  let identifiedProblem = 'Operational inefficiency or unaddressed domain bottleneck requiring automated resolution.';
  let proposedSolution = 'Technical methodology, edge algorithms, or structural process proposed in the document.';
  let properConclusion = '';

  // Extract problem section snippet
  for (let i = 0; i < rawParagraphs.length; i++) {
    const p = rawParagraphs[i];
    const pLower = p.toLowerCase();
    if (pLower.includes('problem') || pLower.includes('challenge') || pLower.includes('bottleneck')) {
      identifiedProblem = p.replace(/^#+\s*.*?\n/i, '').replace(/^(1\.|2\.)?\s*problem.*?:/i, '').trim();
      break;
    }
  }

  // Extract solution section snippet (mentioned separately)
  for (let i = 0; i < rawParagraphs.length; i++) {
    const p = rawParagraphs[i];
    const pLower = p.toLowerCase();
    if (pLower.includes('proposed solution') || (pLower.includes('solution') && !pLower.includes('problem')) || pLower.includes('approach') || pLower.includes('architecture')) {
      proposedSolution = p.replace(/^#+\s*.*?\n/i, '').replace(/^(1\.|2\.)?\s*proposed solution.*?:/i, '').trim();
      break;
    }
  }

  // Check if conclusion already exists
  let existingConclusion = '';
  for (let i = 0; i < rawParagraphs.length; i++) {
    const p = rawParagraphs[i];
    if (p.toLowerCase().includes('conclusion')) {
      existingConclusion = p.replace(/^#+\s*.*?\n/i, '').replace(/^conclusion.*?:/i, '').trim();
      break;
    }
  }

  if (existingConclusion && existingConclusion.length > 50) {
    properConclusion = existingConclusion;
  } else {
    // Synthesize a proper conclusion directly resolving the identified problem!
    const problemExcerpt = identifiedProblem.length > 80 ? identifiedProblem.slice(0, 80) + '...' : identifiedProblem;
    properConclusion = `In addressing the critical challenge (${problemExcerpt}), the proposed solution establishes an effective and measurable approach. By resolving the primary operational bottleneck identified in this paper, the system demonstrates that focused implementation eliminates manual overhead while ensuring high reliability. Future work should focus on scaling field trials and integrating automated monitoring protocols.`;
  }

  const problemSolutionSynthesis = {
    identifiedProblem: identifiedProblem.slice(0, 350),
    proposedSolution: proposedSolution.slice(0, 350), // Mentioned separately!
    properConclusion: properConclusion.slice(0, 500), // Proper conclusion resolving the problem
    impactSummary: 'Validates automated resolution of the core problem with measurable efficiency gains and reduced error.',
    actionableTakeaways: [
      'Ensure the Problem Statement explicitly states the quantifiable impact before introducing the solution.',
      'Detail the Proposed Solution in a dedicated, distinct section rather than combining it with background theory.',
      'Ensure the Conclusion directly references the original problem and verifies how the results resolve it.',
      'Include future expansion pathways and limitations in the closing remarks.'
    ]
  };

  return {
    id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: docTitle,
    documentType,
    timestamp: new Date().toISOString(),
    wordCount,
    charCount,
    readingTimeMinutes,
    overallScore: finalScore,
    scoreTier,
    summary,
    checks: checkResults,
    stats: {
      totalChecks: checklist.length,
      passedChecks: passedCount,
      failedChecks: failedCount,
      warningChecks: warningCount,
      complianceRate: checklist.length > 0 ? Math.round((passedCount / checklist.length) * 100) : 0
    },
    missingRequiredSections,
    incompleteItems,
    clarityIssues,
    problemSolutionSynthesis,
    aiEnriched: false,
    rawText: cleanText,
    disclaimer:
      'SmartCheck AI is an automated compliance evaluation and document analysis tool. It does not provide legal advice, accreditation, or guarantee institutional acceptance.'
  };
}
