export function buildInventory(scanFindings, scanMetadata) {
  const inventory = {
    provider_sdks: [],
    orchestration_frameworks: [],
    rag_vector_stack: [],
    model_artifacts: [],
    prompt_assets: [],
    config_signals: []
  };

  scanFindings.forEach(finding => {
    const entry = {
      id: finding.finding_id,
      path: finding.file_path,
      details: finding.details || {},
      category: finding.detection_category
    };

    switch (finding.detection_category) {
      case 'provider_sdk': inventory.provider_sdks.push(entry); break;
      case 'orchestration_framework': inventory.orchestration_frameworks.push(entry); break;
      case 'rag_vector': inventory.rag_vector_stack.push(entry); break;
      case 'model_artifact': inventory.model_artifacts.push(entry); break;
      case 'prompt_asset': inventory.prompt_assets.push(entry); break;
      case 'config_signal': inventory.config_signals.push(entry); break;
    }
  });

  // Sort and deduplicate
  Object.keys(inventory).forEach(key => {
    inventory[key].sort((a, b) => a.id.localeCompare(b.id));
    // Simple deduplication based on ID
    const seen = new Set();
    inventory[key] = inventory[key].filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  });

  return {
    schema_version: "0.1.0",
    generated_at: new Date().toISOString(),
    tool_name: "caesar-ai-scan",
    tool_version: "0.10.0",
    scan_metadata: scanMetadata,
    inventory,
    review_required: true,
    export_status: "draft",
    safety_flags: []
  };
}
