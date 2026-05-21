export function generateInventoryReport(inventoryData) {
  let report = `# AI Usage Inventory Summary\n\n`;
  report += `- **Generated at:** ${inventoryData.generated_at}\n`;
  report += `- **Tool:** ${inventoryData.tool_name} v${inventoryData.tool_version}\n\n`;

  report += `## Component Counts\n`;
  Object.entries(inventoryData.inventory).forEach(([category, components]) => {
    report += `- **${category}:** ${components.length}\n`;
  });

  report += `\n## Review Requirements\n`;
  report += inventoryData.review_required 
    ? `- [ ] **Review Required:** Yes. This inventory is in draft status.\n` 
    : `- [x] **Review Required:** No.\n`;

  return report;
}
