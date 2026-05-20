/**
 * Formats scope resolution analytics into a premium, human-readable Markdown report.
 * 
 * @param {Object} scope - Scope resolution result returned by resolveScanScope.
 * @returns {string} Fully formatted Markdown scope report.
 */
export function generateScopeReport(scope) {
  const { target, resolved_at, summary, files } = scope;
  
  let md = `# 🛡️ Caesar AI Scan: Scope Control Report\n\n`;
  md += `This report outlines the resolved static-analysis scope for the target repository. It validates file inclusion, exclusion boundaries, and skip rationales according to local policies and ignore settings.\n\n`;
  
  md += `## 🚦 Scope Summary\n\n`;
  md += `| Metric | Count | Description |\n`;
  md += `| :--- | :---: | :--- |\n`;
  md += `| 📂 **Total Discovered** | **${summary.total_found}** | Total filesystem objects encountered |\n`;
  md += `| ✅ **Included & Scanned** | **${summary.included_count}** | Active text/code files parsed for compliance findings |\n`;
  md += `| 🚫 **Excluded (Custom)** | **${summary.excluded_count}** | Excluded via \`.caesarignore\` or configuration ignore lists |\n`;
  md += `| ⚙️ **Skipped (Standard)** | **${summary.skipped_count}** | Skipped due to standard ignores or binary file types |\n\n`;
  
  md += `*   **Target Directory:** \`${target}\`\n`;
  md += `*   **Resolved At:** \`${resolved_at}\`\n\n`;

  md += `## ✅ Included Files (${summary.included_count})\n\n`;
  if (files.included.length === 0) {
    md += `*No files were included for scanning.*\n\n`;
  } else {
    md += `These files were actively parsed and evaluated against AI rules:\n\n`;
    files.included.forEach(file => {
      md += `- \`${file}\`\n`;
    });
    md += `\n`;
  }

  md += `## 🚫 Excluded Files (${summary.excluded_count})\n\n`;
  if (files.excluded.length === 0) {
    md += `*No files were explicitly excluded.*\n\n`;
  } else {
    md += `These files matched custom ignore rules and were strictly bypassed:\n\n`;
    md += `| File Path | Exclusion Rule Matching |\n`;
    md += `| :--- | :--- |\n`;
    files.excluded.forEach(file => {
      md += `| \`${file.relativePath}\` | \`${file.reason}\` |\n`;
    });
    md += `\n`;
  }

  md += `## ⚙️ Skipped Files & Folders (${summary.skipped_count})\n\n`;
  if (files.skipped.length === 0) {
    md += `*No files were skipped.*\n\n`;
  } else {
    md += `These items were skipped due to system defaults or file compatibility limits:\n\n`;
    md += `| Path | Type | Skip Rationale |\n`;
    md += `| :--- | :---: | :--- |\n`;
    files.skipped.forEach(file => {
      md += `| \`${file.relativePath}\` | \`${file.type || 'file'}\` | \`${file.reason}\` |\n`;
    });
    md += `\n`;
  }

  md += `---\n\n`;
  md += `*Generated automatically by Caesar AI Scope Control Engine (v0.5.0).*`;
  
  return md;
}
