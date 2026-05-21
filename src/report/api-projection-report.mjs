export function generateApiProjectionReport(projection) {
  let report = "Read-Only API Projection Report\n";
  report += `===============================\n`;
  report += `Version: ${projection.schema_version}\n`;
  report += `Projection ID: ${projection.projection_id}\n`;
  report += `Generated At: ${projection.generated_at}\n\n`;
  
  report += "Endpoints:\n";
  for (const [endpoint, path] of Object.entries(projection.endpoints)) {
    report += `  - ${endpoint}: ${path}\n`;
  }
  
  report += "\nCounts:\n";
  for (const [type, count] of Object.entries(projection.counts)) {
    report += `  - ${type}: ${count}\n`;
  }
  
  report += "\nSafety Flags:\n";
  for (const [flag, value] of Object.entries(projection.safety)) {
    report += `  - ${flag}: ${value}\n`;
  }
  
  report += "\nNOTE: This is a static/offline JSON projection, not a live API.\n";
  
  return report;
}
