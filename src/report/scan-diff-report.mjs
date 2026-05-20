import fs from 'fs';
import path from 'path';

export function generateDiffMarkdown(diff) {
  const { summary, baseline_run_id, current_run_id, added_findings, removed_findings } = diff;

  let md = `# Caesar AI Scan History Diff\n\n`;
  md += `**Generated At:** ${diff.generated_at}\n`;
  md += `**Current Run ID:** ${current_run_id}\n`;
  md += `**Baseline Run ID:** ${baseline_run_id || 'None (First Run)'}\n\n`;

  md += `## Summary\n\n`;
  md += `- **Total Baseline:** ${summary.total_baseline}\n`;
  md += `- **Total Current:** ${summary.total_current}\n`;
  md += `- **Added:** ${summary.added_count}\n`;
  md += `- **Removed:** ${summary.removed_count}\n`;
  md += `- **Changed:** ${summary.changed_count}\n`;
  md += `- **Unchanged:** ${summary.unchanged_count}\n\n`;

  if (diff.recommended_review_actions.length > 0) {
    md += `## Recommended Actions\n\n`;
    diff.recommended_review_actions.forEach(act => {
      md += `- ${act}\n`;
    });
    md += `\n`;
  }

  md += `## Added Findings (${added_findings.length})\n\n`;
  if (added_findings.length === 0) {
    md += `*No new findings added.*\n\n`;
  } else {
    added_findings.forEach(f => {
      md += `- **[${f.severity.toUpperCase()}]** ${f.category}: ${f.matched_name} in \`${f.file_path}\`\n`;
    });
    md += `\n`;
  }

  md += `## Removed Findings (${removed_findings.length})\n\n`;
  if (removed_findings.length === 0) {
    md += `*No findings removed.*\n\n`;
  } else {
    removed_findings.forEach(f => {
      md += `- **[RESOLVED]** ${f.category}: ${f.matched_name} in \`${f.file_path}\`\n`;
    });
    md += `\n`;
  }

  return md;
}

export function writeDiffReport(diff, outPath) {
  const md = generateDiffMarkdown(diff);
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, md, 'utf8');
}
