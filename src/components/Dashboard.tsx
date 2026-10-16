import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Clock,
  PlayCircle,
  FileCheck,
  ChevronRight,
  Trash2,
  ExternalLink,
  FileType
} from 'lucide-react';
import { AnalysisReport } from '../types/compliance';

interface DashboardProps {
  history: AnalysisReport[];
  onSelectReport: (report: AnalysisReport) => void;
  onNavigateToAnalyze: () => void;
  onRunDemoReport: (type: 'flawed' | 'compliant') => void;
  onDeleteHistoryItem: (id: string) => void;
  hasGeminiKey: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  history,
  onSelectReport,
  onNavigateToAnalyze,
  onRunDemoReport,
  onDeleteHistoryItem,
  hasGeminiKey
}) => {
  // Aggregate Stats
  const totalChecked = history.length;
  const avgScore =
    totalChecked > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.overallScore, 0) / totalChecked)
      : 0;

  const totalIssuesDetected = history.reduce(
    (acc, curr) => acc + curr.stats.failedChecks + curr.incompleteItems.length,
    0
  );

  const passingDocuments = history.filter((h) => h.overallScore >= 80).length;
  const complianceRate = totalChecked > 0 ? Math.round((passingDocuments / totalChecked) * 100) : 0;

  return (
    <div className="space-y-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Next-Gen Submission Verification
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Make Every Document <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">Submission Ready.</span>
          </h1>

          <p className="mt-3 text-base text-slate-300 sm:text-lg leading-relaxed">
            Eliminate desk rejections before they happen. SmartCheck AI audits project reports, resumes, and academic proposals against strict institutional checklists, detecting missing sections, draft placeholders, and contradictory data in seconds.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToAnalyze}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:brightness-110 active:scale-95"
            >
              <FileCheck className="h-4 w-4" />
              Analyze Document Now
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onRunDemoReport('flawed')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-medium text-slate-200 transition-all hover:bg-slate-700/80 hover:text-white"
            >
              <PlayCircle className="h-4 w-4 text-amber-400" />
              Run Flawed Report Demo
            </button>

            <button
              onClick={() => onRunDemoReport('compliant')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              View Perfect Report Demo
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Statistics Overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Audited</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">{totalChecked}</p>
          <p className="mt-1 text-xs text-slate-400">Documents evaluated</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Avg. Score</span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{avgScore}</span>
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Across all audits</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Issues Flagged</span>
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">{totalIssuesDetected}</p>
          <p className="mt-1 text-xs text-slate-400">Gaps & draft placeholders</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Ready Rate</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">{complianceRate}%</p>
          <p className="mt-1 text-xs text-slate-400">Scored ≥ 80 / 100</p>
        </div>
      </div>

      {/* Demo Scenario Highlight Box */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                HACKATHON DEMO READY
              </span>
              <span className="text-xs text-slate-400">No API key required for full demo</span>
            </div>
            <h3 className="text-lg font-bold text-white">Realistic Flawed Project Report Scenario</h3>
            <p className="text-sm text-slate-300 max-w-2xl">
              Tests an autonomous drone engineering report with deliberately omitted Results & Evaluation sections, unreferenced bibliography, an unresolved <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">[TODO]</code> placeholder, and a duplicated paragraph.
            </p>
          </div>
          <button
            onClick={() => onRunDemoReport('flawed')}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md hover:bg-amber-400 transition-colors active:scale-95"
          >
            <PlayCircle className="h-4 w-4" />
            Test Flawed Report
          </button>
        </div>
      </div>

      {/* Recent History Table / Cards */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Recent Document Audits</h2>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
              {history.length}
            </span>
          </div>

          {history.length > 0 && (
            <button
              onClick={onNavigateToAnalyze}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              New Analysis <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 py-12 text-center">
            <div className="rounded-full bg-slate-800/80 p-3 text-slate-400">
              <FileCheck className="h-8 w-8" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-slate-200">No Audits Run Yet</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-md">
              Start by pasting a project report, resume, or proposal to verify required sections, detect missing contact details, and calculate an exact compliance score.
            </p>
            <button
              onClick={onNavigateToAnalyze}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Analyze Your First Document
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {history.map((item) => {
              const scoreBg =
                item.overallScore >= 80
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : item.overallScore >= 60
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 transition-colors hover:bg-slate-850/40 px-2 rounded-lg"
                >
                  <div
                    className="cursor-pointer space-y-1 flex-1"
                    onClick={() => onSelectReport(item)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white hover:text-indigo-300 transition-colors">
                        {item.title}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 uppercase">
                        {item.documentType.replace('_', ' ')}
                      </span>
                      {item.pdfMeta && (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-300">
                          <FileType className="h-2.5 w-2.5 text-rose-400" /> PDF ({item.pdfMeta.numPages}p)
                        </span>
                      )}
                      {item.aiEnriched && (
                        <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400">
                          <Sparkles className="h-2.5 w-2.5" /> AI
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>{item.wordCount} words</span>
                      <span>•</span>
                      <span className="text-slate-300 font-medium">
                        {item.stats.passedChecks}/{item.stats.totalChecks} Checks Passed
                      </span>
                      {item.stats.failedChecks > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-rose-400 font-medium">
                            {item.stats.failedChecks} Missing
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className={`rounded-xl border px-3 py-1 text-center font-bold text-sm ${scoreBg}`}>
                      {item.overallScore}
                      <span className="text-[10px] block font-normal opacity-80">{item.scoreTier}</span>
                    </div>

                    <button
                      onClick={() => onSelectReport(item)}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      View Report
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950/40 hover:text-rose-400 transition-colors"
                      title="Delete this audit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Value Pillars & Anti-Rejection Architecture */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-bold text-white">Zero Guesswork Scoring</h3>
          <p className="mt-2 text-sm text-slate-300">
            Scores are deterministically mapped to explicit checklist criteria. If core sections like Results or References are omitted, the score reflects the genuine shortfall without artificial inflation.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-bold text-white">Draft Gaps & TODO Detection</h3>
          <p className="mt-2 text-sm text-slate-300">
            Catches embarrassing unresolved tags like <code>[TODO]</code>, <code>[Insert Date]</code>, and duplicate copy-pasted blocks that slip past manual proofreaders and cause immediate rejection.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-bold text-white">Actionable Rewrite Advice</h3>
          <p className="mt-2 text-sm text-slate-300">
            Combines strict rule verification with Google Gemini 3.8 Flash to suggest concrete improvements, metric additions, and high-impact rewrites for each weak section.
          </p>
        </div>
      </div>
    </div>
  );
};
