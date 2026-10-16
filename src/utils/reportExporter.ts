import { AnalysisReport } from '../types/compliance';

export function exportReportAsHtml(report: AnalysisReport): void {
  const scoreColor =
    report.overallScore >= 80 ? '#10b981' : report.overallScore >= 60 ? '#f59e0b' : '#ef4444';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Compliance Audit Report - ${report.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; padding: 40px; margin: 0; }
    .container { max-width: 900px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
    .meta { font-size: 13px; color: #64748b; margin-top: 4px; }
    .score-badge { display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: ${scoreColor}; color: #ffffff; font-size: 28px; font-weight: 800; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }
    .stat-card { background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 20px; font-weight: 700; color: #0f172a; }
    .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .section-title { font-size: 18px; font-weight: 600; color: #1e293b; margin-top: 30px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .check-item { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .check-passed { border-left: 4px solid #10b981; }
    .check-failed { border-left: 4px solid #ef4444; }
    .check-warning { border-left: 4px solid #f59e0b; }
    .check-header { display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 6px; }
    .badge { font-size: 11px; padding: 3px 8px; border-radius: 9999px; font-weight: 700; text-transform: uppercase; }
    .badge-passed { background: #d1fae5; color: #065f46; }
    .badge-failed { background: #fee2e2; color: #991b1b; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .recommendation { background: #f8fafc; border-radius: 6px; padding: 10px 14px; margin-top: 8px; font-size: 13px; color: #334155; }
    .disclaimer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
    @media print { body { background: #ffffff; padding: 0; } .container { box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="title">${report.title}</h1>
        <div class="meta">
          Document Type: <strong>${report.documentType.replace('_', ' ').toUpperCase()}</strong> | 
          Audited: <strong>${new Date(report.timestamp).toLocaleDateString()} ${new Date(report.timestamp).toLocaleTimeString()}</strong> | 
          Word Count: <strong>${report.wordCount}</strong>
          ${report.pdfMeta ? ` | Source File: <strong>PDF (${report.pdfMeta.filename}, ${report.pdfMeta.numPages} Pages)</strong>` : ''}
        </div>
      </div>
      <div style="text-align: right;">
        <div class="score-badge">${report.overallScore}</div>
        <div style="font-size: 12px; font-weight: 600; margin-top: 4px; color: ${scoreColor};">${report.scoreTier}</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${report.stats.passedChecks}/${report.stats.totalChecks}</div>
        <div class="stat-label">Checks Passed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${report.stats.failedChecks}</div>
        <div class="stat-label">Critical Gaps</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${report.stats.warningChecks}</div>
        <div class="stat-label">Warnings</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${report.stats.complianceRate}%</div>
        <div class="stat-label">Compliance Rate</div>
      </div>
    </div>

    <div class="section-title">Executive Summary</div>
    <p style="background: #f8fafc; padding: 14px; border-radius: 8px; font-size: 14px;">${report.summary}</p>

    <div class="section-title">Checklist Verification Audit</div>
    ${report.checks
      .map(
        (c) => `
      <div class="check-item check-${c.status}">
        <div class="check-header">
          <span>${c.itemLabel} ${c.required ? '<span style="color: #ef4444; font-size: 12px;">(Required)</span>' : ''}</span>
          <span class="badge badge-${c.status}">${c.status}</span>
        </div>
        <div style="font-size: 13px; color: #475569;">${c.explanation}</div>
        <div class="recommendation">
          <strong>Recommended Action:</strong> ${c.recommendation}
        </div>
      </div>
    `
      )
      .join('')}

    ${
      report.problemSolutionSynthesis
        ? `
      <div class="section-title">Problem, Solution & Conclusion Synthesis</div>
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
        <div style="margin-bottom: 12px;">
          <strong style="color: #b91c1c; font-size: 14px; text-transform: uppercase;">1. Identified Problem Statement:</strong>
          <p style="margin: 4px 0 0 0; font-size: 13.5px; color: #334155;">${report.problemSolutionSynthesis.identifiedProblem}</p>
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: #1d4ed8; font-size: 14px; text-transform: uppercase;">2. Proposed Solution (Mentioned Separately):</strong>
          <p style="margin: 4px 0 0 0; font-size: 13.5px; color: #334155;">${report.problemSolutionSynthesis.proposedSolution}</p>
        </div>
        <div style="margin-bottom: 12px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 12px;">
          <strong style="color: #047857; font-size: 14px; text-transform: uppercase;">3. Proper Conclusion & Problem Resolution:</strong>
          <p style="margin: 4px 0 0 0; font-size: 13.5px; color: #065f46; font-weight: 500;">${report.problemSolutionSynthesis.properConclusion}</p>
        </div>
        ${report.problemSolutionSynthesis.impactSummary ? `<div style="font-size: 12px; color: #64748b;"><strong>Impact Summary:</strong> ${report.problemSolutionSynthesis.impactSummary}</div>` : ''}
      </div>
    `
        : ''
    }

    ${
      report.clarityIssues.length > 0
        ? `
      <div class="section-title">Draft Placeholders & Actionable Suggestions</div>
      ${report.clarityIssues
        .map(
          (issue) => `
        <div class="check-item check-${issue.severity === 'high' ? 'failed' : 'warning'}">
          <div class="check-header">
            <span>${issue.issue}</span>
            <span class="badge badge-${issue.severity === 'high' ? 'failed' : 'warning'}">${issue.type}</span>
          </div>
          ${issue.originalSnippet ? `<div style="font-size: 12px; font-family: monospace; background: #e2e8f0; padding: 6px; border-radius: 4px; margin: 4px 0;">Excerpt: ${issue.originalSnippet}</div>` : ''}
          <div style="font-size: 13px; color: #334155; margin-top: 4px;"><strong>Fix:</strong> ${issue.suggestion}</div>
        </div>
      `
        )
        .join('')}
    `
        : ''
    }

    <div class="disclaimer">
      ${report.disclaimer}<br/>
      Generated by SmartCheck AI — Intelligent Document Compliance Engine
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SmartCheck-Compliance-Report-${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyReportMarkdown(report: AnalysisReport): string {
  const text = `# SmartCheck AI Compliance Report: ${report.title}
**Score:** ${report.overallScore}/100 (${report.scoreTier})
**Date:** ${new Date(report.timestamp).toLocaleDateString()}
**Document Type:** ${report.documentType.toUpperCase()}
**Compliance Rate:** ${report.stats.complianceRate}% (${report.stats.passedChecks}/${report.stats.totalChecks} checks passed)

## Executive Summary
${report.summary}

${
  report.problemSolutionSynthesis
    ? `## Problem & Solution Synthesis
### 1. Identified Problem
${report.problemSolutionSynthesis.identifiedProblem}

### 2. Proposed Solution (Separately Stated)
${report.problemSolutionSynthesis.proposedSolution}

### 3. Proper Conclusion & Problem Resolution
${report.problemSolutionSynthesis.properConclusion}
`
    : ''
}

## Checklist Status
${report.checks.map((c) => `- [${c.status === 'passed' ? 'x' : ' '}] **${c.itemLabel}** (${c.status.toUpperCase()}): ${c.explanation}\n  *Action:* ${c.recommendation}`).join('\n')}

${
  report.clarityIssues.length > 0
    ? `\n## Identified Issues & Suggestions\n${report.clarityIssues.map((i) => `- [${i.severity.toUpperCase()}] **${i.issue}**: ${i.suggestion}`).join('\n')}`
    : ''
}

---
*Disclaimer: ${report.disclaimer}*`;

  navigator.clipboard.writeText(text);
  return text;
}
