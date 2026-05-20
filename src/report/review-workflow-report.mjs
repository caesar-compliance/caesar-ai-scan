import { loadReviewTaxonomy } from '../review/load-review-taxonomy.mjs';

/**
 * Generates a beautiful, premium markdown report summarizing the Caesar compliance review workflow.
 * 
 * @param {Object} reviewWorkflow - The review workflow JSON object.
 * @returns {string} Markdown formatted report.
 */
export function generateReviewReport(reviewWorkflow) {
  const taxonomy = loadReviewTaxonomy();
  const summary = reviewWorkflow.summary || {};
  const items = reviewWorkflow.review_items || [];
  
  // Aggregate gaps by gap_type
  const gapCounts = {};
  const allGaps = [];
  for (const item of items) {
    for (const gap of item.evidence_gaps) {
      allGaps.push(gap);
      gapCounts[gap.gap_type] = (gapCounts[gap.gap_type] || 0) + 1;
    }
  }

  // Create lanes table
  let lanesSection = '';
  if (summary.triggered_lanes && summary.triggered_lanes.length > 0) {
    lanesSection += '| Lane Identifier | Name | Description |\n';
    lanesSection += '| :--- | :--- | :--- |\n';
    for (const laneId of summary.triggered_lanes) {
      const laneInfo = taxonomy.review_lanes[laneId] || { name: laneId, description: 'No description available' };
      lanesSection += `| \`${laneId}\` | **${laneInfo.name}** | ${laneInfo.description} |\n`;
    }
  } else {
    lanesSection = '*No review lanes triggered.*';
  }

  // Create gaps summary table
  let gapsSection = '';
  if (allGaps.length > 0) {
    gapsSection += '| Gap Type | Severity | Count | Required For | Blocks Export |\n';
    gapsSection += '| :--- | :--- | :---: | :--- | :---: |\n';
    const uniqueGapTypes = [...new Set(allGaps.map(g => g.gap_type))];
    for (const type of uniqueGapTypes) {
      const exampleGap = allGaps.find(g => g.gap_type === type);
      const severityEmoji = exampleGap.severity === 'high' || exampleGap.severity === 'critical' ? '🔴' : (exampleGap.severity === 'medium' ? '🟡' : '🟢');
      gapsSection += `| \`${type}\` | ${severityEmoji} ${exampleGap.severity} | **${gapCounts[type]}** | \`${exampleGap.required_for}\` | ${exampleGap.blocks_export ? 'Yes (Strict)' : 'No'} |\n`;
    }
  } else {
    gapsSection = '*No evidence gaps identified.*';
  }

  // Create detailed items section
  let detailedItemsSection = '';
  for (const item of items) {
    const statusEmoji = item.review_status === 'blocked_missing_context' ? '❌' : '⚠️';
    const readinessProgress = '█'.repeat(Math.round(item.export_readiness / 10)) + '░'.repeat(10 - Math.round(item.export_readiness / 10));
    
    detailedItemsSection += `### Finding: \`${item.matched_name}\` (${item.category})\n\n`;
    detailedItemsSection += `- **Review Item ID:** \`${item.review_item_id}\`\n`;
    detailedItemsSection += `- **Raw Finding Ref:** \`${item.finding_ref}\`\n`;
    detailedItemsSection += `- **Signal Severity:** \`${item.severity}\`\n`;
    detailedItemsSection += `- **Review Status:** ${statusEmoji} **${item.review_status.replace(/_/g, ' ')}**\n`;
    detailedItemsSection += `- **Assigned Review Lanes:** ${item.assigned_review_lanes.map(l => `\`${l}\``).join(', ')}\n`;
    detailedItemsSection += `- **Export Readiness Score:** \`${item.export_readiness}%\` \n`;
    detailedItemsSection += `  \`[${readinessProgress}]\`\n`;
    detailedItemsSection += `- **Integration Notes:** *${item.integration_notes}*\n\n`;

    if (item.evidence_gaps && item.evidence_gaps.length > 0) {
      detailedItemsSection += `#### 🛑 Unresolved Evidence Gaps:\n`;
      for (const gap of item.evidence_gaps) {
        const gapSeverityEmoji = gap.severity === 'high' || gap.severity === 'critical' ? '🔴' : (gap.severity === 'medium' ? '🟡' : '🟢');
        detailedItemsSection += `- [ ] **[${gap.gap_type}]** (${gapSeverityEmoji} ${gap.severity}): ${gap.reason}\n`;
        detailedItemsSection += `  - *Required for:* \`${gap.required_for}\` | *Resolution:* ${gap.recommended_resolution}\n`;
      }
      detailedItemsSection += `\n`;
    }

    if (item.recommended_questions && item.recommended_questions.length > 0) {
      detailedItemsSection += `#### 💬 Recommended Reviewer Questions:\n`;
      for (const q of item.recommended_questions) {
        detailedItemsSection += `- [ ] *${q}*\n`;
      }
      detailedItemsSection += `\n`;
    }

    if (item.recommended_actions && item.recommended_actions.length > 0) {
      detailedItemsSection += `#### ⚙️ Recommended Remediation Actions:\n`;
      for (const a of item.recommended_actions) {
        detailedItemsSection += `- [ ] *${a}*\n`;
      }
      detailedItemsSection += `\n`;
    }

    detailedItemsSection += `---\n\n`;
  }

  // Recommended next actions
  let nextActionsSection = '';
  if (items.length > 0) {
    nextActionsSection += `1. **Assign System Owners**: Identify engineers for each blocked component to resolve the \`missing_system_owner\` and \`missing_export_authorization\` gaps.\n`;
    
    if (allGaps.some(g => g.gap_type === 'missing_security_review')) {
      nextActionsSection += `2. **Address Plaintext Credentials**: Immediately migrate credentials detected as plain environment variables to an approved secure secrets manager to resolve \`missing_security_review\`.\n`;
    }
    if (allGaps.some(g => g.gap_type === 'missing_data_processing_assessment')) {
      nextActionsSection += `3. **Conduct Privacy & Data Assessments**: Complete the Data Protection Impact Assessment (DPIA) for vector storage to resolve \`missing_data_processing_assessment\`.\n`;
    }
    if (allGaps.some(g => g.gap_type === 'missing_vendor_terms_review')) {
      nextActionsSection += `4. **Review Vendor SaaS Agreements**: Retrieve and audit SaaS SLAs or enterprise DPAs for third-party LLM providers to satisfy \`missing_vendor_terms_review\`.\n`;
    }
    nextActionsSection += `5. **Run Verification Re-scan**: Once compliance metrics are documented in the repository, execute a new re-scan to verify score updates.\n`;
  } else {
    nextActionsSection = '*No actions required. No AI usage signals detected.*';
  }

  return `# Caesar AI Scan — Governance Review Report

> [!IMPORTANT]
> **Prototype System Notice**  
> Caesar AI Scan is an offline static-analysis utility. This report identifies compliance review needs and tracks evidence gaps based on codebase heuristics. It does not formulate final legal conclusions, nor does it guarantee compliance or indicate proof of non-compliance. All evidence candidate exports are generated in a draft state and require explicit human review and cryptographic sign-off before Caesar Governance OS ingestion.

## 📊 Executive Summary

| Metrics | Value |
| :--- | :--- |
| **Total AI Usage Findings** | ${summary.total_findings} |
| **Total Governance Review Items** | ${summary.total_review_items} |
| **Blocked Evidence Candidates** | ${summary.blocked_items} ❌ |
| **Ready for Review / Unblocked** | ${summary.ready_items} ⚠️ |
| **Generated At** | \`${reviewWorkflow.generated_at}\` |
| **Target Directory** | \`${reviewWorkflow.source_scan.target}\` |

---

## 🗺️ Triggered Compliance Lanes

These governance review lanes have been automatically triggered based on the type of AI usage signatures detected:

${lanesSection}

---

## 🔍 Identified Evidence Gaps

The following missing governance requirements were classified during static analysis. Each of these gaps must be answered before a candidate can be promoted from draft status:

${gapsSection}

---

## 🛠️ Detailed Finding Reviews

${detailedItemsSection}

## 📋 Recommended Next Steps

To resolve the identified evidence gaps and prepare these candidates for governance registration, the following sequence is recommended:

${nextActionsSection}

---

## ⚖️ Disclaimers and Safety Boundaries
- **No Ingestion**: This report operates strictly offline. No remote connections or Governance OS calls have been executed.
- **Manual Gatekeeping**: Evidence candidate status remains in \`draft\` / \`needs_human_review\` even for items with a high readiness percentage.
- **Scope limitation**: Static codebase analysis is highly effective at discovering code-level AI APIs and configurations, but cannot evaluate human workflows or production infrastructure configurations.

*Report compiled by Caesar AI Scan v0.3.0.*
`;
}
