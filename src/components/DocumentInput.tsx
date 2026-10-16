import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Clipboard,
  Trash2,
  UploadCloud,
  PlayCircle,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FileType,
  FileCode,
  Download,
  Check,
  Loader2,
  X
} from 'lucide-react';
import { ChecklistItem, DocumentType } from '../types/compliance';
import { SAMPLE_DOCUMENTS } from '../utils/checklists';

export interface PdfMetadata {
  filename: string;
  numPages: number;
  sizeBytes: number;
}

interface DocumentInputProps {
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
  documentText: string;
  setDocumentText: (text: string) => void;
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  activeChecklist: ChecklistItem[];
  enableAi: boolean;
  setEnableAi: (enable: boolean) => void;
  hasGeminiKey: boolean;
  isAnalyzing: boolean;
  analysisStep: string;
  pdfMeta: PdfMetadata | null;
  setPdfMeta: (meta: PdfMetadata | null) => void;
  onAnalyze: () => void;
  onSelectSample: (
    type: 'project_report_flawed' | 'project_report_compliant' | 'resume_sample' | 'research_proposal_sample'
  ) => void;
  onManageCustomChecklist: () => void;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  documentType,
  setDocumentType,
  documentText,
  setDocumentText,
  documentTitle,
  setDocumentTitle,
  activeChecklist,
  enableAi,
  setEnableAi,
  hasGeminiKey,
  isAnalyzing,
  analysisStep,
  pdfMeta,
  setPdfMeta,
  onAnalyze,
  onSelectSample,
  onManageCustomChecklist,
}) => {
  const [showChecklistDrawer, setShowChecklistDrawer] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfExtractError, setPdfExtractError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Live metrics
  const clean = documentText.trim();
  const wordCount = clean ? (clean.match(/\b[\w'-]+\b/g) || []).length : 0;
  const charCount = clean.length;
  const lineCount = documentText ? documentText.split('\n').length : 0;
  const estReadTime = Math.max(1, Math.ceil(wordCount / 200));

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDocumentText(text);
        setPdfMeta(null);
      }
    } catch (e) {
      console.warn('Clipboard read failed:', e);
    }
  };

  const processPdfFile = async (file: File) => {
    setIsExtractingPdf(true);
    setPdfExtractError(null);

    try {
      // Read file as Base64 Data URL
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: base64Data,
          filename: file.name,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || 'Failed to extract text from PDF');
      }

      const data = await response.json();
      setDocumentText(data.text);
      setPdfMeta({
        filename: file.name,
        numPages: data.numPages,
        sizeBytes: file.size,
      });

      if (!documentTitle || documentTitle === 'Untitled Document') {
        const cleanTitle = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
        setDocumentTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
      }
    } catch (err: any) {
      console.error('PDF extraction failed:', err);
      setPdfExtractError(
        err.message || 'Could not parse PDF. Ensure it contains text, not scanned images.'
      );
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      processPdfFile(file);
    } else {
      // Plain text or markdown
      setPdfExtractError(null);
      setPdfMeta(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setDocumentText(content);
          if (!documentTitle || documentTitle === 'Untitled Document') {
            setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
          }
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        processPdfFile(file);
      } else {
        setPdfExtractError(null);
        setPdfMeta(null);
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            setDocumentText(content);
            if (!documentTitle || documentTitle === 'Untitled Document') {
              setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
            }
          }
        };
        reader.readAsText(file);
      }
    }
  };

  // Test Sample PDF with 1-click
  const handleLoadSamplePdf = async () => {
    setIsExtractingPdf(true);
    setPdfExtractError(null);

    try {
      const res = await fetch('/api/sample-pdf');
      if (!res.ok) throw new Error('Sample PDF file not found on server');
      const blob = await res.blob();
      const file = new File([blob], 'Sample_Flawed_Project_Report.pdf', {
        type: 'application/pdf',
      });
      await processPdfFile(file);
      setDocumentType('project_report');
    } catch (err: any) {
      console.warn('Failed to load sample PDF:', err);
      setPdfExtractError('Could not load sample PDF. Using text fallback.');
      onSelectSample('project_report_flawed');
    } finally {
      setIsExtractingPdf(false);
    }
  };

  // Test Compliant PDF (With Problem, Separated Solution, and Proper Conclusion)
  const handleLoadCompliantPdf = async () => {
    setIsExtractingPdf(true);
    setPdfExtractError(null);

    try {
      const res = await fetch('/api/sample-compliant-pdf');
      if (!res.ok) throw new Error('Sample Compliant PDF file not found on server');
      const blob = await res.blob();
      const file = new File([blob], 'Sample_Compliant_Project_Report.pdf', {
        type: 'application/pdf',
      });
      await processPdfFile(file);
      setDocumentType('project_report');
    } catch (err: any) {
      console.warn('Failed to load sample compliant PDF:', err);
      setPdfExtractError('Could not load sample compliant PDF. Using text fallback.');
      onSelectSample('project_report_compliant');
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleRemovePdf = () => {
    setPdfMeta(null);
    setDocumentText('');
    setPdfExtractError(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Audit Document Compliance</span>
            <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-400">
              PDF & Text Supported
            </span>
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Upload or drop a <strong>PDF document</strong>, paste draft content, or pick a sample scenario to audit.
          </p>
        </div>

        {/* Quick Sample Selector Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Instant Test:
          </span>
          <button
            onClick={handleLoadCompliantPdf}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 shadow-sm"
            title="Load and extract compliant PDF with Problem, Solution, and Proper Conclusion"
          >
            <FileType className="h-3.5 w-3.5 text-emerald-400" />
            PDF (Compliant)
          </button>
          <button
            onClick={handleLoadSamplePdf}
            className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 shadow-sm"
            title="Load and extract flawed PDF report (missing conclusion)"
          >
            <FileType className="h-3.5 w-3.5 text-rose-400" />
            PDF (Flawed)
          </button>
          <button
            onClick={() => {
              setPdfMeta(null);
              onSelectSample('project_report_flawed');
            }}
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
            title="Load flawed project report (Text)"
          >
            <PlayCircle className="h-3.5 w-3.5 text-amber-400" />
            Text Demo
          </button>
          <button
            onClick={() => {
              setPdfMeta(null);
              onSelectSample('project_report_compliant');
            }}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
          >
            Compliant Report
          </button>
          <button
            onClick={() => {
              setPdfMeta(null);
              onSelectSample('resume_sample');
            }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          >
            Resume
          </button>
        </div>
      </div>

      {/* Document Type Selector Tabs */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          1. Select Submission Type & Guidelines
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[
            { id: 'project_report', label: 'Project Report', desc: 'College / Engineering' },
            { id: 'resume', label: 'Resume / CV', desc: 'Job / ATS Screening' },
            { id: 'application', label: 'Application', desc: 'Grants / Admissions' },
            { id: 'research_proposal', label: 'Research Proposal', desc: 'Thesis / Scholarly' },
            { id: 'custom', label: 'Custom Checklist', desc: 'User-Defined Rules' },
          ].map((type) => {
            const isSelected = documentType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setDocumentType(type.id as DocumentType)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600/15 text-white shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span
                  className={`text-sm font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}
                >
                  {type.label}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">{type.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Active Checklist Preview Bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Active Criteria:</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-indigo-300">
              {activeChecklist.length} Requirements Active
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">
              {activeChecklist.filter((c) => c.required).length} Required /{' '}
              {activeChecklist.filter((c) => !c.required).length} Recommended
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowChecklistDrawer(!showChecklistDrawer)}
              className="inline-flex items-center gap-1 font-medium text-indigo-400 hover:text-indigo-300"
            >
              <Sliders className="h-3.5 w-3.5" />
              {showChecklistDrawer ? 'Hide Criteria Breakdown' : 'Inspect Criteria Breakdown'}
              {showChecklistDrawer ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
            {documentType === 'custom' && (
              <button
                type="button"
                onClick={onManageCustomChecklist}
                className="text-xs text-indigo-400 hover:underline font-semibold ml-2"
              >
                Edit Rules
              </button>
            )}
          </div>
        </div>

        {/* Expandable Checklist Drawer */}
        {showChecklistDrawer && (
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {activeChecklist.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.label}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        item.required
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.required ? 'Mandatory' : 'Bonus'} ({item.weight} pts)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Document Input Section with PDF Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border transition-all p-5 shadow-sm space-y-4 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/40'
            : 'border-slate-800 bg-slate-900/60'
        }`}
      >
        {/* Document Title & Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-lg">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Document Title / Identifier
            </label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="e.g., Final Year Capstone Project Report"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Upload PDF / Text Button */}
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all shadow-sm">
              <FileType className="h-4 w-4 text-rose-400" />
              Upload PDF / Document
              <input
                type="file"
                accept=".pdf,.txt,.md,.text"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handlePasteClipboard}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Paste text from clipboard"
            >
              <Clipboard className="h-3.5 w-3.5" />
              Paste
            </button>

            {documentText && (
              <button
                type="button"
                onClick={handleRemovePdf}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-colors"
                title="Clear text and PDF"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* PDF Extraction Loading State */}
        {isExtractingPdf && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 flex items-center gap-3 animate-pulse">
            <Loader2 className="h-5 w-5 text-rose-400 animate-spin" />
            <div className="text-xs">
              <span className="font-bold text-white">Extracting text from PDF...</span>
              <p className="text-slate-400">
                Parsing document pages, section titles, and layout structures...
              </p>
            </div>
          </div>
        )}

        {/* PDF Extraction Error Banner */}
        {pdfExtractError && (
          <div className="rounded-xl border border-rose-500/50 bg-rose-950/40 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-rose-300">PDF Extraction Notice</span>
              <p className="text-slate-300 mt-0.5">{pdfExtractError}</p>
            </div>
            <button
              onClick={() => setPdfExtractError(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* PDF Attachment Info Card (When a PDF is actively attached) */}
        {pdfMeta && (
          <div className="rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-900 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                <FileType className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{pdfMeta.filename}</span>
                  <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 uppercase">
                    PDF Document
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>{pdfMeta.numPages} Page{pdfMeta.numPages === 1 ? '' : 's'}</span>
                  <span>•</span>
                  <span>{formatFileSize(pdfMeta.sizeBytes)}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Text Extracted & Ready for Audit</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/api/sample-pdf"
                download="Sample_Flawed_Project_Report.pdf"
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                title="Download sample PDF"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save Sample</span>
              </a>
              <button
                type="button"
                onClick={handleRemovePdf}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950/40 hover:text-rose-400 transition-colors"
                title="Remove attached PDF"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Text Area & Drag-and-Drop Overlay */}
        <div className="relative">
          {isDragging && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-indigo-950/90 border-2 border-dashed border-indigo-400 backdrop-blur-sm pointer-events-none">
              <FileType className="h-12 w-12 text-indigo-300 animate-bounce" />
              <span className="text-base font-bold text-white mt-2">
                Drop PDF or Text Document Here
              </span>
              <span className="text-xs text-indigo-300 mt-1">
                Supports .pdf, .txt, and .md files
              </span>
            </div>
          )}

          <textarea
            value={documentText}
            onChange={(e) => {
              setDocumentText(e.target.value);
            }}
            placeholder="Upload or drop a PDF file above, or paste document content here... (Markdown, plain text, headers with #, sections, dates, and references)"
            rows={15}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
          />

          {/* Word & Char Status Overlay */}
          <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-3">
              <span><strong>{wordCount.toLocaleString()}</strong> words</span>
              <span>•</span>
              <span><strong>{charCount.toLocaleString()}</strong> characters</span>
              <span>•</span>
              <span><strong>{lineCount}</strong> lines</span>
              <span>•</span>
              <span>~{estReadTime} min read</span>
            </div>

            <div className="text-[11px] text-slate-400">
              Drag & Drop .pdf, .txt, or .md directly into this box
            </div>
          </div>
        </div>

        {/* AI Enhancement & Privacy Setting */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-semibold text-white">
                Google Gemini 3.8 Flash Semantic Reasoning
              </span>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                Server-Side Secure
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Provides deep clarity critiques, rewrite suggestions, and contradiction analysis on your PDF/text. When disabled or offline, SmartCheck automatically runs with 100% deterministic rule validation.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer shrink-0">
            <span className="text-xs font-medium text-slate-300">
              {enableAi ? 'AI Analysis Enabled' : 'Rule-Only (Instant)'}
            </span>
            <input
              type="checkbox"
              checked={enableAi}
              onChange={(e) => setEnableAi(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>

        {/* Submit Action Bar */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isAnalyzing || !documentText.trim() || isExtractingPdf}
            onClick={onAnalyze}
            className={`w-full rounded-2xl py-4 px-6 text-base font-bold shadow-xl transition-all flex items-center justify-center gap-3 ${
              isAnalyzing || !documentText.trim() || isExtractingPdf
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white hover:brightness-110 active:scale-[0.99] shadow-indigo-600/30'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{analysisStep || 'Auditing Document Compliance...'}</span>
              </div>
            ) : (
              <>
                <FileCheck className="h-5 w-5" />
                <span>
                  {pdfMeta ? `Run Compliance Audit on ${pdfMeta.filename}` : 'Run Intelligent Compliance Audit'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
