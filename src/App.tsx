import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { DocumentInput } from './components/DocumentInput';
import { ResultsView } from './components/ResultsView';
import { ChecklistEditor } from './components/ChecklistEditor';
import { HackathonAbout } from './components/HackathonAbout';
import {
  AnalysisReport,
  ChecklistItem,
  DocumentType
} from './types/compliance';
import {
  PROJECT_REPORT_CHECKLIST,
  RESUME_CHECKLIST,
  APPLICATION_CHECKLIST,
  RESEARCH_PROPOSAL_CHECKLIST,
  SAMPLE_DOCUMENTS
} from './utils/checklists';
import { runRuleBasedValidation } from './utils/ruleValidator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyze' | 'results' | 'checklists' | 'about'>('dashboard');
  const [documentType, setDocumentType] = useState<DocumentType>('project_report');
  const [documentText, setDocumentText] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [enableAi, setEnableAi] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [pdfMeta, setPdfMeta] = useState<{ filename: string; numPages: number; sizeBytes: number } | null>(null);

  // Custom Checklist State (persisted to localStorage)
  const [customChecklist, setCustomChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('smartcheck_custom_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved custom checklist');
      }
    }
    return [...PROJECT_REPORT_CHECKLIST];
  });

  // History State (persisted to localStorage)
  const [history, setHistory] = useState<AnalysisReport[]>(() => {
    const saved = localStorage.getItem('smartcheck_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved history');
      }
    }
    return [];
  });

  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(() => {
    return history.length > 0 ? history[0] : null;
  });

  // Save history on change
  useEffect(() => {
    localStorage.setItem('smartcheck_history', JSON.stringify(history));
  }, [history]);

  // Save custom checklist on change
  useEffect(() => {
    localStorage.setItem('smartcheck_custom_checklist', JSON.stringify(customChecklist));
  }, [customChecklist]);

  // Check backend server & Gemini API status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.hasGeminiKey === 'boolean') {
          setHasGeminiKey(data.hasGeminiKey);
        }
      })
      .catch((err) => {
        console.warn('Backend status check returned:', err);
      });
  }, []);

  // Compute active checklist based on selected documentType
  const getActiveChecklist = (): ChecklistItem[] => {
    switch (documentType) {
      case 'project_report':
        return PROJECT_REPORT_CHECKLIST;
      case 'resume':
        return RESUME_CHECKLIST;
      case 'application':
        return APPLICATION_CHECKLIST;
      case 'research_proposal':
        return RESEARCH_PROPOSAL_CHECKLIST;
      case 'custom':
        return customChecklist;
      default:
        return PROJECT_REPORT_CHECKLIST;
    }
  };

  const handleAnalyze = async () => {
    if (!documentText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep('Step 1: Running deterministic rule validation...');

    const activeList = getActiveChecklist();
    const resolvedTitle = documentTitle.trim() || 'Untitled Document';

    try {
      // Step simulation for realistic feedback
      setTimeout(() => {
        setAnalysisStep('Step 2: Checking section completeness & draft tags...');
      }, 350);

      if (enableAi) {
        setTimeout(() => {
          setAnalysisStep('Step 3: Querying Gemini 3.8 Flash for semantic clarity...');
        }, 750);
      }

      // Send to server API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: documentText,
          documentType,
          checklist: activeList,
          enableAi,
          customTitle: resolvedTitle
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const report: AnalysisReport = await response.json();
      report.sourceType = pdfMeta ? 'pdf' : 'text';
      report.pdfMeta = pdfMeta || undefined;

      setCurrentReport(report);
      setHistory((prev) => [report, ...prev.filter((p) => p.id !== report.id)].slice(0, 20));
      setActiveTab('results');
    } catch (err: any) {
      console.warn('API call failed, falling back to in-browser rule validator:', err);
      // Instant offline fallback to ensure the app NEVER crashes or fails
      const fallbackReport = runRuleBasedValidation(
        documentText,
        documentType,
        activeList,
        resolvedTitle
      );
      fallbackReport.aiEnriched = false;
      fallbackReport.aiMessage = 'Analyzed in-browser via SmartCheck Deterministic Rule Engine (Network Offline Mode).';
      fallbackReport.sourceType = pdfMeta ? 'pdf' : 'text';
      fallbackReport.pdfMeta = pdfMeta || undefined;

      setCurrentReport(fallbackReport);
      setHistory((prev) => [fallbackReport, ...prev].slice(0, 20));
      setActiveTab('results');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // One-click Demo Scenario Runner
  const handleRunDemoReport = async (type: 'flawed' | 'compliant') => {
    const sample =
      type === 'flawed'
        ? SAMPLE_DOCUMENTS.project_report_flawed
        : SAMPLE_DOCUMENTS.project_report_compliant;

    setDocumentType(sample.type);
    setDocumentText(sample.content);
    setDocumentTitle(sample.title);

    setIsAnalyzing(true);
    setAnalysisStep('Step 1: Running rule-based compliance check on demo report...');

    try {
      setTimeout(() => {
        setAnalysisStep('Step 2: Identifying missing sections & TODO tags...');
      }, 300);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sample.content,
          documentType: sample.type,
          checklist: PROJECT_REPORT_CHECKLIST,
          enableAi: false, // Demo mode uses deterministic sample results directly
          customTitle: sample.title
        })
      });

      let report: AnalysisReport;
      if (response.ok) {
        report = await response.json();
      } else {
        report = runRuleBasedValidation(
          sample.content,
          sample.type,
          PROJECT_REPORT_CHECKLIST,
          sample.title
        );
      }

      report.aiMessage = 'Evaluated in Demo Mode (Deterministic Rule Engine). Demonstrates exact compliance scoring and missing requirement detection without requiring an API key.';

      setCurrentReport(report);
      setHistory((prev) => [report, ...prev.filter((p) => p.id !== report.id)].slice(0, 20));
      setActiveTab('results');
    } catch (e) {
      const report = runRuleBasedValidation(
        sample.content,
        sample.type,
        PROJECT_REPORT_CHECKLIST,
        sample.title
      );
      report.aiMessage = 'Evaluated in Demo Mode (Deterministic Rule Engine). Demonstrates exact compliance scoring without requiring an API key.';
      setCurrentReport(report);
      setHistory((prev) => [report, ...prev.filter((p) => p.id !== report.id)].slice(0, 20));
      setActiveTab('results');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleSelectSample = (
    sampleKey: 'project_report_flawed' | 'project_report_compliant' | 'resume_sample' | 'research_proposal_sample'
  ) => {
    const sample = SAMPLE_DOCUMENTS[sampleKey];
    if (sample) {
      setPdfMeta(null);
      setDocumentType(sample.type);
      setDocumentText(sample.content);
      setDocumentTitle(sample.title);
      setActiveTab('analyze');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all stored document audits and history? (This removes local cache).')) {
      setHistory([]);
      setCurrentReport(null);
      localStorage.removeItem('smartcheck_history');
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((p) => p.id !== id));
    if (currentReport?.id === id) {
      setCurrentReport(history.find((p) => p.id !== id) || null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveReport={Boolean(currentReport)}
        hasGeminiKey={hasGeminiKey}
        historyCount={history.length}
        onClearHistory={handleClearHistory}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            history={history}
            onSelectReport={(report) => {
              setCurrentReport(report);
              setActiveTab('results');
            }}
            onNavigateToAnalyze={() => setActiveTab('analyze')}
            onRunDemoReport={handleRunDemoReport}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            hasGeminiKey={hasGeminiKey}
          />
        )}

        {activeTab === 'analyze' && (
          <DocumentInput
            documentType={documentType}
            setDocumentType={setDocumentType}
            documentText={documentText}
            setDocumentText={setDocumentText}
            documentTitle={documentTitle}
            setDocumentTitle={setDocumentTitle}
            activeChecklist={getActiveChecklist()}
            enableAi={enableAi}
            setEnableAi={setEnableAi}
            hasGeminiKey={hasGeminiKey}
            isAnalyzing={isAnalyzing}
            analysisStep={analysisStep}
            pdfMeta={pdfMeta}
            setPdfMeta={setPdfMeta}
            onAnalyze={handleAnalyze}
            onSelectSample={handleSelectSample}
            onManageCustomChecklist={() => setActiveTab('checklists')}
          />
        )}

        {activeTab === 'results' && currentReport && (
          <ResultsView
            report={currentReport}
            onEditDocument={() => setActiveTab('analyze')}
            onAnalyzeAgain={handleAnalyze}
            onAppendConclusion={(conclusionText) => {
              setDocumentText((prev) => prev.trim() + '\n\n## Proper Conclusion & Problem Resolution\n' + conclusionText);
              setActiveTab('analyze');
            }}
          />
        )}

        {activeTab === 'checklists' && (
          <ChecklistEditor
            customChecklist={customChecklist}
            setCustomChecklist={setCustomChecklist}
            onResetDefaults={() => setCustomChecklist([...PROJECT_REPORT_CHECKLIST])}
            onDone={() => {
              setDocumentType('custom');
              setActiveTab('analyze');
            }}
          />
        )}

        {activeTab === 'about' && <HackathonAbout />}
      </main>

      {/* Application Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SmartCheck AI</span>
            <span>—</span>
            <span>Intelligent Document Compliance Engine</span>
          </div>

          <div className="text-slate-400 max-w-xl text-center sm:text-right">
            Privacy First: Document text is analyzed ephemerally without persistent database storage. Automated checks do not constitute legal certification.
          </div>
        </div>
      </footer>
    </div>
  );
}
