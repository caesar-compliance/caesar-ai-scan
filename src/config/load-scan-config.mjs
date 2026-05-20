import { existsSync, readFileSync } from 'fs';
import { DEFAULT_SCAN_CONFIG } from './default-scan-config.mjs';

/**
 * Parses the JSON config file.
 */
export function parseConfig(configPath) {
  if (!configPath || !existsSync(configPath)) {
    return {};
  }
  try {
    const content = readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.warn(`⚠️ Warning: Failed to parse config JSON at ${configPath}: ${err.message}`);
    return {};
  }
}

/**
 * Loads the effective scan configuration, merging it hierarchically:
 * (CLI Options) > (Loaded File Config) > (Default Scan Config)
 */
export function loadScanConfig(configPath) {
  const fileConfig = parseConfig(configPath);
  
  return {
    ...DEFAULT_SCAN_CONFIG,
    ...fileConfig,
    outputs: {
      ...DEFAULT_SCAN_CONFIG.outputs,
      ...(fileConfig.outputs || {})
    }
  };
}
