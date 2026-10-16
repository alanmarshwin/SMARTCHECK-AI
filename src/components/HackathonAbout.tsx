import React, { useState } from 'react';
import {
  Award,
  Cloud,
  CheckCircle2,
  Code,
  Terminal,
  ShieldCheck,
  Sparkles,
  Server,
  Layers,
  Copy,
  Check,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const HackathonAbout: React.FC = () => {
  const [copiedAppYaml, setCopiedAppYaml] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);

  const appYamlContent = `name: smartcheck-ai
region: nyc
services:
  - name: web
    github:
      branch: main
      deploy_on_push: true
      repo: your-username/smartcheck-ai
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    http_port: 3000
    envs:
      - key: NODE_ENV
        value: production
      - key: GEMINI_API_KEY
        type: secret
        scope: RUN_TIME
      - key: PORT
        value: "3000"`;

  const bashContent = `# 1. Clone repository
git clone https://github.com/your-username/smartcheck-ai.git
cd smartcheck-ai

# 2. Install dependencies
npm install

# 3. Configure environment variable
cp .env.example .env
# Edit .env and insert GEMINI_API_KEY="your-gemini-key"

# 4. Run local full-stack development server
npm run dev
# Server will run on http://localhost:3000 with Vite middleware

# 5. Production build test
npm run build
npm start`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
          <Award className="h-4 w-4 text-indigo-400" />
          Hackathon Showcase & Production Deploy Guide
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
          SmartCheck AI — Project Presentation & Architecture
        </h1>
        <p className="mt-2 text-slate-300 max-w-3xl leading-relaxed">
          An enterprise-grade document compliance verification engine built to eliminate preventable submission disqualifications in academia, recruitment, and grant committees.
        </p>
      </div>

      {/* Hackathon Pitch Grid: Problem, Solution, Architecture, Impact */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Problem Card */}
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/60 p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
              <span className="font-bold text-sm">01</span>
            </div>
            <h3 className="text-lg font-bold text-white">The Real-World Problem</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every year, thousands of students, researchers, and job candidates face immediate rejection—not because their ideas lack merit, but because of preventable formatting defects:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
            <li>Missing mandatory sections (Abstract, Evaluation, Methodology, References)</li>
            <li>Unresolved draft markers left behind (<code>[TODO: verify numbers]</code>, <code>[TBD]</code>)</li>
            <li>Omitted contact details, missing submission dates, or missing signatures</li>
            <li>Contradictory claims or accidental copy-pasted duplicate paragraphs</li>
          </ul>
        </div>

        {/* Solution Card */}
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
              <span className="font-bold text-sm">02</span>
            </div>
            <h3 className="text-lg font-bold text-white">The SmartCheck Solution</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            A dual-engine automated auditor that combines deterministic certainty with generative semantic intelligence:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
            <li><strong>100% Deterministic Rule Engine:</strong> Instantly evaluates structural integrity, regex patterns, and calculates an honest 0–100 score with zero false positives.</li>
            <li><strong>Google Gemini 3.8 Flash AI:</strong> Reads document semantics to spot subtle gaps, unbacked assertions, tone problems, and generates paragraph rewrites.</li>
            <li><strong>Zero Database Requirement:</strong> Respects sensitive document privacy by performing audit ephemerally and storing history strictly in client-side storage.</li>
          </ul>
        </div>

        {/* Technical Architecture */}
        <div className="rounded-2xl border border-blue-500/30 bg-slate-900/60 p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <span className="font-bold text-sm">03</span>
            </div>
            <h3 className="text-lg font-bold text-white">Technical Architecture</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Engineered for security, high throughput, and seamless portability:
          </p>
          <div className="rounded-xl bg-slate-950 p-3 font-mono text-xs text-indigo-300 space-y-1 border border-slate-800">
            <div>[Frontend] React 19 + TypeScript + Tailwind CSS</div>
            <div>   ↓ REST JSON API</div>
            <div>[Backend] Express 4 + Node 22 (server.ts)</div>
            <div>   ↓ Secure Proxy (Keys hidden from client)</div>
            <div>[AI Engine] @google/genai SDK (Gemini 3.8 Flash)</div>
          </div>
        </div>

        {/* Hackathon Impact */}
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <span className="font-bold text-sm">04</span>
            </div>
            <h3 className="text-lg font-bold text-white">Hackathon Impact & Scalability</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Delivers instant value without subscription locks or cloud cost burdens:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
            <li>Works 100% offline in demo mode without requiring an API key.</li>
            <li>Provides printable/downloadable HTML compliance certificates for academic proof.</li>
            <li>Customizable checklists enable universities, hackathons, and companies to distribute their own rubrics via JSON import/export.</li>
          </ul>
        </div>
      </div>

      {/* DigitalOcean App Platform Deployment Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
            <Cloud className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              DigitalOcean App Platform Deployment Guide
            </h2>
            <p className="text-xs text-slate-400">
              Step-by-step instructions to deploy this application to DigitalOcean App Platform.
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                1
              </span>
              <span>Push Source Code to GitHub</span>
            </h4>
            <p className="text-xs text-slate-300 pl-7 leading-relaxed">
              Create a new repository on GitHub and push your SmartCheck AI codebase. Ensure your <code>.gitignore</code> excludes <code>.env</code> and <code>node_modules</code>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                2
              </span>
              <span>Create App on DigitalOcean App Platform</span>
            </h4>
            <p className="text-xs text-slate-300 pl-7 leading-relaxed">
              Log into DigitalOcean Cloud Console → Navigate to <strong>Apps</strong> → Click <strong>Create App</strong> → Select <strong>GitHub</strong> as your source and choose your repository.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                3
              </span>
              <span>Configure Build & Run Settings</span>
            </h4>
            <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Build Command:</span>
                <code className="text-emerald-400 font-mono text-sm">npm run build</code>
              </div>
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Run Command:</span>
                <code className="text-emerald-400 font-mono text-sm">npm start</code>
              </div>
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block font-semibold">HTTP Port:</span>
                <code className="text-emerald-400 font-mono text-sm">3000</code>
              </div>
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Environment:</span>
                <code className="text-emerald-400 font-mono text-sm">Node.js (LTS)</code>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                4
              </span>
              <span>Set Environment Variables (Secrets)</span>
            </h4>
            <p className="text-xs text-slate-300 pl-7 leading-relaxed">
              In the App Platform <strong>Environment Variables</strong> panel, add the following key:
            </p>
            <div className="pl-7">
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div><span className="text-indigo-400">GEMINI_API_KEY</span> = <span className="text-slate-500">[Your Google Gemini API Key - Set as Encrypted Secret]</span></div>
                <div><span className="text-indigo-400">NODE_ENV</span> = <span className="text-emerald-400">production</span></div>
                <div><span className="text-indigo-400">PORT</span> = <span className="text-emerald-400">3000</span></div>
              </div>
            </div>
          </div>

          {/* App Spec (app.yaml) for 1-Click DO Deploy */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                <span>Declarative App Spec (app.yaml)</span>
              </h4>
              <button
                onClick={() => copyToClipboard(appYamlContent, setCopiedAppYaml)}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                {copiedAppYaml ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedAppYaml ? 'Copied YAML!' : 'Copy app.yaml'}</span>
              </button>
            </div>
            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              {appYamlContent}
            </pre>
          </div>

          {/* Local Development Commands */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <span>Local Setup & Run Commands</span>
              </h4>
              <button
                onClick={() => copyToClipboard(bashContent, setCopiedBash)}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
              >
                {copiedBash ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedBash ? 'Copied Commands!' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              {bashContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
