import React from 'react';
import { ShieldCheck, FileCheck, Sparkles, CheckCircle2, History, PlusCircle, Settings, Award, Trash2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'analyze' | 'results' | 'checklists' | 'about';
  setActiveTab: (tab: 'dashboard' | 'analyze' | 'results' | 'checklists' | 'about') => void;
  hasActiveReport: boolean;
  hasGeminiKey: boolean;
  historyCount: number;
  onClearHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveReport,
  hasGeminiKey,
  historyCount,
  onClearHistory
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo and App Title */}
        <div
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-md shadow-indigo-500/25">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">SmartCheck</span>
              <span className="rounded bg-gradient-to-r from-blue-500 to-indigo-500 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                AI
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">Intelligent Document Compliance</p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'analyze'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Analyze</span>
          </button>

          {hasActiveReport && (
            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                activeTab === 'results'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:bg-slate-800 hover:text-emerald-300'
              }`}
            >
              <FileCheck className="h-4 w-4" />
              <span>Results</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('checklists')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'checklists'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Checklists</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'about'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Award className="h-4 w-4" />
            <span className="hidden lg:inline">Hackathon & Deploy</span>
            <span className="lg:hidden">Info</span>
          </button>
        </nav>

        {/* Engine Status & Clear Data */}
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 sm:flex">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-slate-400">Rule Engine</span>
            <span className="text-slate-600">|</span>
            {hasGeminiKey ? (
              <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                <Sparkles className="h-3 w-3" /> Gemini 3.8 Flash
              </span>
            ) : (
              <span className="text-amber-400 font-normal">Offline Ready</span>
            )}
          </div>

          {historyCount > 0 && (
            <button
              onClick={onClearHistory}
              title="Clear Local History (Privacy)"
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:border-red-900/50 hover:bg-red-950/30 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Clear Data</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
