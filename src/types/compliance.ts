export type DocumentType =
  | 'project_report'
  | 'resume'
  | 'application'
  | 'research_proposal'
  | 'custom';

export type CheckCategory =
  | 'section'
  | 'required_field'
  | 'quality'
  | 'structure'
  | 'policy';

export type CheckStatus = 'passed' | 'failed' | 'warning';
export type SeverityLevel = 'high' | 'medium' | 'low' | 'info';

export interface ChecklistItem {
  id: string;
  label: string;
  category: CheckCategory;
  description: string;
  required: boolean;
  weight: number; // 5 to 30 points
  keywords: string[];
  patterns?: string[];
  helpFix: string;
}

export interface CheckResult {
  id: string;
  itemLabel: string;
  category: CheckCategory;
  status: CheckStatus;
  severity: SeverityLevel;
  explanation: string;
  recommendation: string;
  matchedContent?: string;
  required: boolean;
  scoreAwarded: number;
  maxScore: number;
}

export interface ClarityIssue {
  type: 'clarity' | 'grammar' | 'tone' | 'placeholder' | 'contradiction';
  issue: string;
  originalSnippet?: string;
  suggestion: string;
  severity: SeverityLevel;
}

export interface AnalysisReport {
  id: string;
  title: string;
  documentType: DocumentType;
  timestamp: string;
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
  overallScore: number; // 0 - 100
  scoreTier:
    | 'Submission Ready'
    | 'Needs Minor Revisions'
    | 'Needs Significant Work'
    | 'High Risk of Rejection';
  summary: string;
  checks: CheckResult[];
  stats: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
    complianceRate: number; // percentage (0-100)
  };
  missingRequiredSections: string[];
  incompleteItems: string[];
  clarityIssues: ClarityIssue[];
  aiEnriched: boolean;
  aiMessage?: string;
  rawText?: string;
  sourceType?: 'pdf' | 'text' | 'sample';
  pdfMeta?: {
    filename: string;
    numPages: number;
    sizeBytes: number;
  };
  problemSolutionSynthesis?: {
    identifiedProblem: string;
    proposedSolution: string; // Mentioned separately
    properConclusion: string; // Proper conclusion for the problem
    impactSummary?: string;
    actionableTakeaways: string[];
  };
  disclaimer: string;
}

export interface CustomChecklistPreset {
  id: string;
  name: string;
  description: string;
  targetType: DocumentType;
  items: ChecklistItem[];
  isCustom?: boolean;
}
