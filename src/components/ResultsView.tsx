import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Copy,
  Edit3,
  Sparkles,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Check,
  ListFilter,
  FileCode,
  BookOpen,
  HelpCircle,
  AlertOctagon,
  RefreshCw,
  ExternalLink,
  FileType,
  Target,
  CheckCheck,
  FilePlus
} from 'lucide-react';
import { AnalysisReport, CheckResult, ClarityIssue } from '../types/compliance';
import { exportReportAsHtml, copyReportMarkdown } from '../utils/reportExporter';

interface ResultsViewProps {
  report: AnalysisReport;
  onEditDocument: () => void;
  onAnalyzeAgain: () => void;
  onAppendConclusion?: (conclusionText: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  report,
  onEditDocument,
  onAnalyzeAgain,
  onAppendConclusion
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'problem_solution' | 'action_plan' | 'ai_insights' | 'document'>(
    'audit'
  );
  const [filterStatus, setFilterStatus] = useState<'all' | 'failed' | 'warning' | 'passed'>('all');
  const [copied, setCopied] = useState(false);
  const [copiedConclusion, setCopiedConclusion] = useState(false);

  // Score visual styling
  const score = report.overallScore;
  const scoreColor =
    score >= 80
      ? 'text-emerald-400 stroke-emerald-500'
      : score >= 60
      ? 'text-amber-400 stroke-amber-500'
      : 'text-rose-400 stroke-rose-500';

  const scoreBadgeBg =
    score >= 80
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : score >= 60
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  // SVG circular gauge calculation (Radius 58 -> Circumference = 2 * PI * 58 ≈ 364.4)
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleCopyMarkdown = () => {
    copyReportMarkdown(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyConclusion = () => {
    if (report.problemSolutionSynthesis?.properConclusion) {
      navigator.clipboard.writeText(report.problemSolutionSynthesis.properConclusion);
      setCopiedConclusion(true);
      setTimeout(() => setCopiedConclusion(false), 2500);
    }
  };

  const handleDownload = () => {
    exportReportAsHtml(report);
  };

  const filteredChecks = report.checks.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onEditDocument}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Edit Document
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {report.title}
              </h1>
              {report.pdfMeta && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-xs font-bold text-rose-300">
                  <FileType className="h-3.5 w-3.5 text-rose-400" />
                  PDF: {report.pdfMeta.filename} ({report.pdfMeta.numPages} Page{report.pdfMeta.numPages === 1 ? '' : 's'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {report.documentType.replace('_', ' ').toUpperCase()} • Audited on{' '}
              {new Date(report.timestamp).toLocaleDateString()} at{' '}
              {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all active:scale-95 shadow-md shadow-indigo-600/30"
          >
            <Download className="h-4 w-4" />
            <span>Download Audit Report (HTML)</span>
          </button>

          <button
            onClick={onAnalyzeAgain}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Re-run compliance evaluation"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Re-Audit</span>
          </button>
        </div>
      </div>

      {/* Hero Score & KPI Banner */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Circular Gauge Card */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
          <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Compliance Score
          </div>

          <div className="relative mt-2 flex items-center justify-center">
            {/* SVG Circular Meter */}
            <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                className={`${scoreColor} transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Score Text in Center */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold ${scoreColor}`}>{score}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
            </div>
          </div>

          <div className="mt-4">
            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${scoreBadgeBg}`}>
              {report.scoreTier}
            </span>
            <p className="mt-2 text-xs text-slate-400 max-w-xs">
              Calculated deterministically from {report.stats.totalChecks} checklist rules & penalties.
            </p>
          </div>
        </div>

        {/* Executive Summary & AI Note */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2 flex flex-col justify-between shadow-sm space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Executive Audit Summary
              </span>
              {report.aiEnriched ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="h-3 w-3" /> Gemini 3.8 Flash Enriched
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                  Deterministic Rule-Based
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {report.summary}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2 border-t border-slate-800/80">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center">
              <span className="text-lg font-bold text-emerald-400">{report.stats.passedChecks}</span>
              <span className="text-xs text-slate-400 block">Passed Checks</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center">
              <span className="text-lg font-bold text-rose-400">{report.stats.failedChecks}</span>
              <span className="text-xs text-slate-400 block">Missing Items</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center">
              <span className="text-lg font-bold text-amber-400">{report.stats.warningChecks}</span>
              <span className="text-xs text-slate-400 block">Incomplete / Warnings</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center">
              <span className="text-lg font-bold text-indigo-400">{report.stats.complianceRate}%</span>
              <span className="text-xs text-slate-400 block">Pass Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Checklist Verification ({report.checks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('problem_solution')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'problem_solution'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Problem, Solution & Conclusion</span>
        </button>

        <button
          onClick={() => setActiveTab('action_plan')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'action_plan'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertOctagon className="h-4 w-4" />
          <span>
            Action Plan & Issues (
            {report.missingRequiredSections.length + report.clarityIssues.length}
            )
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ai_insights')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ai_insights'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Gemini AI Insights & Clarity</span>
        </button>

        <button
          onClick={() => setActiveTab('document')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'document'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>Document Text ({report.wordCount} words)</span>
        </button>
      </div>

      {/* Tab 1: Checklist Verification Audit */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Status Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ListFilter className="h-3.5 w-3.5" />
              <span>Filter by Status:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: `All (${report.checks.length})` },
                { id: 'failed', label: `Failed (${report.stats.failedChecks})`, color: 'text-rose-400' },
                { id: 'warning', label: `Warnings (${report.stats.warningChecks})`, color: 'text-amber-400' },
                { id: 'passed', label: `Passed (${report.stats.passedChecks})`, color: 'text-emerald-400' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id as any)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    filterStatus === f.id
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                      : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                  } ${f.color || ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Check Items */}
          <div className="space-y-3">
            {filteredChecks.map((check) => {
              const isPassed = check.status === 'passed';
              const isFailed = check.status === 'failed';
              const isWarning = check.status === 'warning';

              return (
                <div
                  key={check.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isPassed
                      ? 'border-emerald-500/20 bg-emerald-950/10'
                      : isFailed
                      ? 'border-rose-500/30 bg-rose-950/15'
                      : 'border-amber-500/30 bg-amber-950/15'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      {isPassed && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
                      {isFailed && <XCircle className="h-5 w-5 text-rose-400 shrink-0" />}
                      {isWarning && <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />}
                      <span className="font-bold text-white text-base">{check.itemLabel}</span>
                      {check.required && (
                        <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20 uppercase">
                          Required
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">
                        Awarded: {check.scoreAwarded} / {check.maxScore} pts
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          isPassed
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isFailed
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {check.status}
                      </span>
                    </div>
                  </div>

                  {/* Explanation */}
                  <p className="text-sm text-slate-300 mt-1">{check.explanation}</p>

                  {/* Matched Excerpt if any */}
                  {check.matchedContent && (
                    <div className="mt-2 rounded-lg bg-slate-950/80 p-2.5 font-mono text-xs text-slate-400 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block font-sans uppercase font-bold mb-1">
                        Detected Section Evidence:
                      </span>
                      {check.matchedContent}
                    </div>
                  )}

                  {/* Recommendation / Fix Action */}
                  {(!isPassed || check.recommendation) && (
                    <div className="mt-2.5 rounded-lg bg-slate-900/80 border border-slate-800 p-3 text-xs text-slate-300 flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300">Action to satisfy:</strong>{' '}
                        {check.recommendation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Problem, Solution & Proper Conclusion Synthesis */}
      {activeTab === 'problem_solution' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Explanation Banner */}
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900 p-5 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
              <Target className="h-5 w-5" />
              <span>Problem-Solution-Conclusion Architecture</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Academic institutions, hackathon judges, and grant committees require clear demarcation between the <strong>Problem Statement</strong> and the <strong>Proposed Solution</strong>, sealed by a <strong>Proper Conclusion</strong> that directly resolves the initial challenge.
            </p>
          </div>

          {/* 1. Problem vs 2. Solution (Separated) Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem Card */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-6 space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-xs font-black">
                      1
                    </span>
                    <span>Identified Problem Statement</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">
                    Problem Space
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950/80 p-4 border border-rose-900/40 text-sm text-slate-200 leading-relaxed">
                  {report.problemSolutionSynthesis?.identifiedProblem ||
                    'Operational friction or research challenge identified in the document.'}
                </div>
              </div>

              <div className="pt-2 border-t border-rose-900/30 text-xs text-slate-400">
                <strong className="text-rose-300">Auditor Note:</strong> Clearly stating the root problem and its measurable cost before presenting the solution prevents reviewer confusion.
              </div>
            </div>

            {/* Proposed Solution Card (Separately Mentioned) */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/10 p-6 space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-base">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-black">
                      2
                    </span>
                    <span>Proposed Solution (Mentioned Separately)</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">
                    Solution Design
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950/80 p-4 border border-blue-900/40 text-sm text-slate-200 leading-relaxed">
                  {report.problemSolutionSynthesis?.proposedSolution ||
                    'Technical methodology and system architecture proposed in the document.'}
                </div>
              </div>

              <div className="pt-2 border-t border-blue-900/30 text-xs text-slate-400">
                <strong className="text-blue-300">Auditor Note:</strong> Describing the solution in a dedicated, distinct section demonstrates structural rigor and clarity of execution.
              </div>
            </div>
          </div>

          {/* 3. Proper Conclusion for the Problem Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-900 p-6 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base sm:text-lg">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-black">
                  3
                </span>
                <span>Proper Conclusion & Problem Resolution</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                  Ready to Apply
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyConclusion}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all active:scale-95 shadow-sm"
                >
                  {copiedConclusion ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedConclusion ? 'Copied to Clipboard!' : 'Copy Proper Conclusion'}</span>
                </button>

                {onAppendConclusion && (
                  <button
                    type="button"
                    onClick={() => {
                      if (report.problemSolutionSynthesis?.properConclusion) {
                        onAppendConclusion(report.problemSolutionSynthesis.properConclusion);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-all active:scale-95 shadow-md shadow-emerald-600/30"
                    title="Append this synthesized proper conclusion directly into your document draft"
                  >
                    <FilePlus className="h-3.5 w-3.5" />
                    <span>Append to Document Text</span>
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/90 border border-emerald-900/50 p-4 text-sm text-emerald-200 leading-relaxed font-normal">
              {report.problemSolutionSynthesis?.properConclusion}
            </div>

            {report.problemSolutionSynthesis?.impactSummary && (
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <strong className="text-emerald-400">Impact Assessment:</strong>
                <span>{report.problemSolutionSynthesis.impactSummary}</span>
              </div>
            )}

            {/* Actionable Takeaways */}
            {report.problemSolutionSynthesis?.actionableTakeaways &&
              report.problemSolutionSynthesis.actionableTakeaways.length > 0 && (
                <div className="border-t border-slate-800/80 pt-3 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recommendations for Submission & PDF Closure:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {report.problemSolutionSynthesis.actionableTakeaways.map((takeaway, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Tab 2: Action Plan & Issues */}
      {activeTab === 'action_plan' && (
        <div className="space-y-6">
          {/* Missing Required Items Card */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
              <XCircle className="h-5 w-5" />
              <span>Confirmed Missing Required Sections ({report.missingRequiredSections.length})</span>
            </div>
            {report.missingRequiredSections.length === 0 ? (
              <p className="text-sm text-slate-400">
                🎉 No critical sections missing. All required headers and mandatory fields were detected!
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  These missing sections violate standard submission policies and directly lower your compliance score:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.missingRequiredSections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-rose-900/40 bg-slate-950/80 p-3 text-sm text-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="font-semibold text-rose-200">{sec}</span>
                      </div>
                      <span className="text-[11px] text-rose-400 font-medium">Add Section</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Draft Placeholders & Incomplete Items */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <AlertTriangle className="h-5 w-5" />
              <span>Draft Placeholders & Truncated Text ({report.incompleteItems.length})</span>
            </div>
            {report.incompleteItems.length === 0 ? (
              <p className="text-sm text-slate-400">
                No unresolved draft tags (e.g. <code>[TODO]</code>, <code>[TBD]</code>) were detected.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  Draft placeholders and thin sections should be resolved prior to official review:
                </p>
                <div className="space-y-2">
                  {report.incompleteItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-amber-900/40 bg-slate-950/80 p-3 text-xs text-slate-300 font-mono"
                    >
                      ⚠️ {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Gemini AI Semantic Insights & Clarity */}
      {activeTab === 'ai_insights' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/10 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                <Sparkles className="h-5 w-5" />
                <span>Gemini 3.8 Flash Semantic Feedback</span>
              </div>
              <span className="text-xs text-slate-400">Clarity & Quality Analysis</span>
            </div>
            <p className="text-sm text-slate-300">
              {report.aiMessage || 'AI analysis completed.'}
            </p>
          </div>

          {/* Clarity & Grammar Issues List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Actionable Rewrites & Suggestions ({report.clarityIssues.length})
            </h3>
            {report.clarityIssues.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
                No major clarity or grammar issues detected.
              </div>
            ) : (
              report.clarityIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm flex items-center gap-2">
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 uppercase">
                        {issue.type}
                      </span>
                      {issue.issue}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        issue.severity === 'high'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {issue.severity} Priority
                    </span>
                  </div>

                  {issue.originalSnippet && (
                    <div className="rounded bg-slate-950 p-2 font-mono text-xs text-rose-300 border border-slate-800/80">
                      Original: {issue.originalSnippet}
                    </div>
                  )}

                  <div className="rounded bg-indigo-950/30 p-2.5 text-xs text-indigo-200 border border-indigo-900/30">
                    <strong>Suggested Fix / Rewrite:</strong> {issue.suggestion}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Raw Document Text */}
      {activeTab === 'document' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Document Text Inspection
            </span>
            <button
              onClick={onEditDocument}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Text
            </button>
          </div>
          <pre className="max-h-[500px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {report.rawText || 'Document content not available.'}
          </pre>
        </div>
      )}

      {/* Prominent Legal & Compliance Disclaimer */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 text-center text-xs text-slate-400">
        <p>
          <strong className="text-slate-300">Disclaimer:</strong> {report.disclaimer}
        </p>
      </div>
    </div>
  );
};
