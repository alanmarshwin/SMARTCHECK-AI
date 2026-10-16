# SmartCheck AI — Intelligent Document Compliance Checker

> **"Make Every Document Submission Ready."**  
> An automated compliance verification engine that audits project reports, resumes, and academic proposals against strict institutional checklists, detects missing sections and draft placeholders, calculates an un-inflated compliance score, and provides actionable rewrite suggestions.

Built for college hackathons, researchers, academic institutions, and professionals to eliminate preventable desk rejections.

---

## 1. Hackathon Presentation & Problem Statement

### The Problem
Every year, thousands of students, researchers, job applicants, and grant writers face immediate desk rejections—not because their ideas lack merit, but because of preventable formatting and structural omissions:
- **Missing Mandatory Sections:** Final year project reports missing Results, Conclusions, or Bibliographies.
- **Unresolved Draft Markers:** Embarrassing placeholders left behind, such as `[TODO: insert metrics]` or `[TBD]`.
- **Omitted Contact & Credential Fields:** Resumes missing valid contact phone numbers, emails, or quantitative impact metrics.
- **Redundant Information:** Duplicated paragraphs copy-pasted across sections that weaken credibility.

### The Solution: SmartCheck AI
A dual-engine automated compliance auditor that combines:
1. **Multi-Format Input (PDF, Markdown, & Text):** Direct drag-and-drop or file upload for `.pdf`, `.txt`, and `.md` files. Server-side PDF engine parses multi-page documents, extracts text layers, and auto-detects section headers.
2. **Deterministic Rule Engine (100% Reliable & Offline-Safe):** Strictly inspects headings, regex patterns (emails, dates), and keyword frequencies. Awards points based on weighted checklist items. Never inflates scores when requirements fail.
3. **Google Gemini 3.8 Flash AI:** Performs deep semantic analysis on tone, coherence, unbacked claims, and generates context-aware paragraph rewrites.
4. **Privacy by Design:** Zero database dependency for initial setup. All user document text is analyzed ephemerally and history is preserved only in the user's local browser storage.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons
- **Backend / API:** Node.js (v22+), Express 4
- **AI Integration:** Google Gemini API via `@google/genai` (Model: `gemini-3.8-flash`)
- **Build & Dev Tooling:** Vite 8, `tsx`
- **Target Cloud:** DigitalOcean App Platform (Node.js PaaS)

---

## 3. Project Structure

```text
/
├── index.html                   # HTML entry point with metadata
├── package.json                 # Scripts and dependencies
├── server.ts                    # Full-stack Express server with Vite middleware
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration
├── metadata.json                # AI Studio capabilities
├── .env.example                 # Environment variables template
├── README.md                    # Documentation & DigitalOcean deploy guide
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Root app component & state management
    ├── index.css                # Global Tailwind CSS imports
    ├── types/
    │   └── compliance.ts        # Type definitions for reports, checks & checklists
    ├── utils/
    │   ├── checklists.ts        # Pre-configured criteria & sample documents
    │   ├── ruleValidator.ts     # Deterministic compliance verification engine
    │   └── reportExporter.ts    # HTML & Markdown audit report generator
    └── components/
        ├── Navbar.tsx           # Global navigation and engine status
        ├── Dashboard.tsx        # Analytics KPIs, history table, and quick demo
        ├── DocumentInput.tsx    # Text editor, sample selectors & criteria drawer
        ├── ResultsView.tsx      # Circular score gauge, audit tabs & export actions
        ├── ChecklistEditor.tsx  # Dynamic custom rule & weight builder
        └── HackathonAbout.tsx   # Presentation pitch & DigitalOcean guide
```

---

## 4. Local Installation & Development

### Prerequisites
- Node.js `v20` or `v22` (v22 recommended)
- `npm` or `bun`

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/your-username/smartcheck-ai.git
cd smartcheck-ai

# 2. Install all dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

Open `.env` and set your Google Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```
*(Note: If you run without a Gemini API key, SmartCheck AI automatically runs in Deterministic Offline Mode with full rule-based scoring and flaw detection!)*

```bash
# 4. Start the full-stack development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 5. Pre-Built Demo Scenarios

SmartCheck AI includes built-in scenarios that test both failure cases and passing criteria with zero typing needed:

1. **Flawed Project Report (Hackathon Showcase):**
   - Click **"Run Flawed Report Demo"** on the Dashboard.
   - Accurately detects:
     - Missing **Results & Evaluation** section
     - Missing **Conclusions** section
     - Missing **References / Bibliography**
     - Missing submission date
     - Unresolved **`[TODO: Insert flight test bench...]`** draft tag
     - Duplicated paragraph in Methodology
   - Drops score to ~52/100 ("Needs Significant Work"), providing actionable remedies for every flaw.

2. **Compliant Engineering Report:**
   - Demonstrates a 95+/100 "Submission Ready" audit.

3. **Software Engineer Resume:**
   - Demonstrates missing contact details (email/phone detection via regex).

---

## 6. DigitalOcean App Platform Deployment

This project is built to deploy natively on **DigitalOcean App Platform** as a full-stack Node.js application.

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial commit of SmartCheck AI"
git branch -M main
git remote add origin https://github.com/your-username/smartcheck-ai.git
git push -u origin main
```

### Step 2: Create App on DigitalOcean
1. Log in to [DigitalOcean Cloud Console](https://cloud.digitalocean.com/).
2. Click **Apps** in the sidebar → Click **Create App**.
3. Choose **GitHub** as the source repository and select `smartcheck-ai`.
4. Branch: `main` with **Autodeploy** enabled.

### Step 3: Configure Build & Run Commands
In the App Platform configuration wizard:
- **Build Command:** `npm run build`
- **Run Command:** `npm start`
- **HTTP Port:** `3000`
- **Resource Size:** Basic (512MB RAM / 1 vCPU is plenty)

### Step 4: Configure Environment Variables (Secrets)
In the **App Spec / Environment Variables** tab:
| Variable Name | Value | Type |
|---|---|---|
| `NODE_ENV` | `production` | Plain Text |
| `PORT` | `3000` | Plain Text |
| `GEMINI_API_KEY` | `your_actual_gemini_api_key` | **Secret** (Encrypted) |

### Step 5: Declarative App Spec (`app.yaml`)
Alternatively, deploy in one click using `doctl` or by pasting this DigitalOcean App Spec:

```yaml
name: smartcheck-ai
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
        value: "3000"
```

---

## 7. Security & Privacy Disclaimers

- **Zero Key Exposure:** API keys are restricted strictly to the server-side proxy in `server.ts`. Frontend bundles never contain secrets.
- **Privacy First:** Documents are parsed in-memory; no raw document text is logged or stored to disk or database.
- **Disclaimer:** SmartCheck AI is an automated compliance evaluation tool. It provides advisory assessments and does not constitute official legal or academic accreditation.
