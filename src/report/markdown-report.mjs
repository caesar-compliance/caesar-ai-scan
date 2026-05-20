/**
 * Generates a high-fidelity Markdown report from a scan result.
 *
 * @param {Object} result - Scan result object from runScan.
 * @returns {string} Fully structured, visual Markdown report content.
 */
export function generateMarkdownReport(result) {
  const { scanner, scanned_at, target, summary, findings } = result;

  let md = `# Caesar AI Codebase Compliance Scan Report\n\n`;
  md += `## 📊 Scan Metadata\n\n`;
  md += `- **Target Directory:** \`${target}\`\n`;
  md += `- **Scan Run Time:** \`${new Date(scanned_at).toUTCString()}\`\n`;
  md += `- **Scanner Engine:** \`${scanner.name} (v${scanner.version})\`\n`;
  md += `- **Compliance Version:** \`v${result.schema_version}\`\n\n`;

  md += `## 🛡️ Executive Summary\n\n`;
  md += `| Metric | Count |\n`;
  md += `| :--- | :--- |\n`;
  md += `| Total Files Traversed | ${summary.total_files} |\n`;
  md += `| Total AI Usage Signals Detected | **${summary.total_findings}** |\n`;
  md += `| Dependency Warnings | ${summary.dependency_findings} |\n`;
  md += `| Plaintext Environment Variables | ${summary.env_var_findings} |\n`;
  md += `| Dedicated Prompt Artifacts | ${summary.prompt_findings} |\n`;
  md += `| Active Vector DB Code References | ${summary.vector_db_findings} |\n\n`;

  if (findings.length === 0) {
    md += `> [!NOTE]\n`;
    md += `> **No AI usage signals were detected.** Your codebase appears free of local AI models, vendor SDKs, or hardcoded AI credentials.\n\n`;
    return md;
  }

  md += `## 🚦 Findings Inventory\n\n`;
  md += `| Finding ID | Severity | Category | Match | File Path |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;

  for (const f of findings) {
    const severityBadge = f.severity === 'high' || f.severity === 'critical' 
      ? `🔴 **${f.severity.toUpperCase()}**` 
      : f.severity === 'medium' 
        ? `🟡 **${f.severity.toUpperCase()}**` 
        : `🟢 **${f.severity.toUpperCase()}**`;

    md += `| \`${f.finding_id}\` | ${severityBadge} | ${f.category} | \`${f.matched_name}\` | \`${f.file_path}\` |\n`;
  }
  md += `\n`;

  md += `## 🔍 Detailed Evidence & Recommended Reviews\n\n`;

  for (const f of findings) {
    const alertType = f.severity === 'high' || f.severity === 'critical' ? 'WARNING' : 'NOTE';

    md += `### Finding \`${f.finding_id}\`: ${f.category} (${f.matched_name})\n\n`;
    md += `- **File:** \`${f.file_path}\`\n`;
    md += `- **Severity:** \`${f.severity.toUpperCase()}\`\n`;
    md += `- **Detector Module:** \`${f.detector}\`\n`;
    md += `- **Rule Identification:** \`${f.rule_id}\`\n\n`;
    
    md += `> [!${alertType}]\n`;
    md += `> **Evidence Hint:**\n`;
    md += `> ${f.evidence_hint}\n\n`;

    md += `#### Recommended Compliance Review Action:\n`;
    md += `${f.recommended_review}\n\n`;
    md += `---\n\n`;
  }

  md += `*Report generated automatically by Caesar static analysis toolset. For questions or SaaS compliance integrations, visit [caesar.no](https://caesar.no).*`;

  return md;
}
