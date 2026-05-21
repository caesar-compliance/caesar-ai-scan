#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { dirname, resolve } from 'path';
import crypto from 'crypto';
import { runScan } from './scanner/scan-runner.mjs';
import { exportEvidenceCandidates } from './export/evidence-candidate-exporter.mjs';
import { generateMarkdownReport } from './report/markdown-report.mjs';
import { buildReviewWorkflow } from './review/review-workflow-builder.mjs';
import { generateReviewReport } from './report/review-workflow-report.mjs';
import { buildExportPack } from './export-pack/export-pack-builder.mjs';
import { writeExportPack } from './export-pack/write-export-pack.mjs';
import { parseConfig } from './scanner/scope-resolver.mjs';
import { generateScopeReport } from './report/scope-report.mjs';
import { writeScanHistory } from './history/scan-history-writer.mjs';
import { readHistoryIndex, getPreviousRun } from './history/scan-history-reader.mjs';
import { buildScanDiff } from './history/scan-diff-builder.mjs';
import { writeDiffReport } from './report/scan-diff-report.mjs';
import { buildExportBundleMetadata } from './export-bundle/scan-export-bundle-builder.mjs';
import { writeExportBundle } from './export-bundle/scan-export-bundle-writer.mjs';
import { generateBundleReport } from './report/scan-export-bundle-report.mjs';

function parseArgs(args) {
  const options = {
    target: null,
    format: 'markdown',
    out: null,
    exportEvidenceCandidates: null,
    reviewOut: null,
    reviewReport: null,
    exportPack: null,
    config: null,
    scopeOut: null,
    scopeReport: null,
    exclude: [],
    historyDir: null,
    recordHistory: false,
    diffPrevious: false,
    historyReport: null,
    inventoryOut: null,
    inventoryReport: null,
    bundleDir: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--format') {
      options.format = args[++i];
    } else if (arg === '--out') {
      options.out = args[++i];
    } else if (arg === '--export-evidence-candidates') {
      options.exportEvidenceCandidates = args[++i];
    } else if (arg === '--review-out') {
      options.reviewOut = args[++i];
    } else if (arg === '--review-report') {
      options.reviewReport = args[++i];
    } else if (arg === '--export-pack') {
      options.exportPack = args[++i];
    } else if (arg === '--config') {
      options.config = args[++i];
    } else if (arg === '--scope-out') {
      options.scopeOut = args[++i];
    } else if (arg === '--scope-report') {
      options.scopeReport = args[++i];
    } else if (arg === '--exclude') {
      const patterns = args[++i];
      if (patterns) {
        options.exclude = patterns.split(',').map(p => p.trim());
      }
    } else if (arg === '--history-dir') {
      options.historyDir = args[++i];
    } else if (arg === '--record-history') {
      options.recordHistory = true;
    } else if (arg === '--diff-previous') {
      options.diffPrevious = true;
    } else if (arg === '--history-report') {
      options.historyReport = args[++i];
    } else if (arg === '--inventory-out') {
      options.inventoryOut = args[++i];
    } else if (arg === '--inventory-report') {
      options.inventoryReport = args[++i];
    } else if (arg === '--bundle-dir') {
      options.bundleDir = args[++i];
    } else if (!arg.startsWith('--')) {
      options.target = arg;
    }
  }

  return options;
}

function writeOutput(filePath, content) {
  const resolvedPath = resolve(filePath);
  const dir = dirname(resolvedPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolvedPath, content, 'utf8');
}

async function main() {
  const args = process.argv.slice(2);
  const cliOptions = parseArgs(args);

  try {
    // 1. Resolve configuration files and CLI overrides
    const targetDir = resolve(cliOptions.target || '.');

    let configPath = cliOptions.config;
    if (!configPath) {
      const targetConfig = resolve(targetDir, 'caesar-scan.config.json');
      const localConfig = resolve('./caesar-scan.config.json');
      if (existsSync(targetConfig)) {
        configPath = targetConfig;
      } else if (existsSync(localConfig)) {
        configPath = localConfig;
      }
    }

    const fileConfig = parseConfig(configPath);
    if (configPath && existsSync(configPath)) {
      console.log(`⚙️ Loaded scan configuration from: ${configPath}`);
    }

    // CLI overrides take absolute priority, falls back to config file
    const mergedOptions = {
      target: cliOptions.target || fileConfig.target || '.',
      format: cliOptions.format !== 'markdown' ? cliOptions.format : (fileConfig.format || 'markdown'),
      out: cliOptions.out || (fileConfig.outputs && fileConfig.outputs.scan_result) || null,
      exportEvidenceCandidates: cliOptions.exportEvidenceCandidates || (fileConfig.outputs && fileConfig.outputs.evidence_candidates) || null,
      reviewOut: cliOptions.reviewOut || (fileConfig.outputs && fileConfig.outputs.review_out) || null,
      reviewReport: cliOptions.reviewReport || (fileConfig.outputs && fileConfig.outputs.review_report) || null,
      exportPack: cliOptions.exportPack || (fileConfig.outputs && fileConfig.outputs.export_pack) || null,
      scopeOut: cliOptions.scopeOut || (fileConfig.outputs && fileConfig.outputs.scope_out) || null,
      scopeReport: cliOptions.scopeReport || (fileConfig.outputs && fileConfig.outputs.scope_report) || null,
      inventoryOut: cliOptions.inventoryOut || (fileConfig.outputs && fileConfig.outputs.inventory_out) || null,
      inventoryReport: cliOptions.inventoryReport || (fileConfig.outputs && fileConfig.outputs.inventory_report) || null,
      exclude: [...(cliOptions.exclude || []), ...(fileConfig.exclude || [])],
      rulesPath: fileConfig.rulesPath || null
    };

    const finalTargetPath = resolve(mergedOptions.target);
    console.log(`🔍 Starting Caesar AI Static Scan on target: ${finalTargetPath}...`);
    
    // 2. Perform the static scan (this resolves scope internally and scans only included files)
    const scanResult = runScan(finalTargetPath, mergedOptions);
    const { summary, findings, scope } = scanResult;

    console.log(`✅ Scan completed. Found ${summary.total_findings} AI usage signals.`);

    // 3. Write scope files if configured
    if (scope) {
      const scopeData = {
        schema_version: scanResult.schema_version,
        target: scanResult.target,
        resolved_at: scanResult.scanned_at,
        summary: {
          total_found: scope.included_count + scope.excluded_count + scope.skipped_count,
          included_count: scope.included_count,
          excluded_count: scope.excluded_count,
          skipped_count: scope.skipped_count
        },
        files: scope.files
      };

      if (mergedOptions.scopeOut) {
        writeOutput(mergedOptions.scopeOut, JSON.stringify(scopeData, null, 2));
        console.log(`📁 Scope JSON report written to: ${mergedOptions.scopeOut}`);
      }

      if (mergedOptions.scopeReport) {
        const scopeMd = generateScopeReport(scopeData);
        writeOutput(mergedOptions.scopeReport, scopeMd);
        console.log(`📁 Scope Markdown report written to: ${mergedOptions.scopeReport}`);
      }
    }

    // 4. Produce scan results output
    let outputContent = '';
    if (mergedOptions.format === 'json') {
      outputContent = JSON.stringify(scanResult, null, 2);
    } else {
      outputContent = generateMarkdownReport(scanResult);
    }

    if (mergedOptions.out) {
      writeOutput(mergedOptions.out, outputContent);
      console.log(`📁 Scan report written to: ${mergedOptions.out}`);
    } else {
      console.log('\n--- SCAN REPORT ---');
      console.log(outputContent);
      console.log('-------------------\n');
    }

    // 5. Build review workflow if requested
    let reviewWorkflow = null;
    if (mergedOptions.reviewOut || mergedOptions.reviewReport || mergedOptions.exportEvidenceCandidates || mergedOptions.exportPack) {
      reviewWorkflow = buildReviewWorkflow(scanResult);
    }

    // 6. Write review JSON and MD report if requested
    if (mergedOptions.reviewOut && reviewWorkflow) {
      const reviewContent = JSON.stringify(reviewWorkflow, null, 2);
      writeOutput(mergedOptions.reviewOut, reviewContent);
      console.log(`📁 Review workflow written to: ${mergedOptions.reviewOut}`);
    }

    if (mergedOptions.reviewReport && reviewWorkflow) {
      const reviewReportContent = generateReviewReport(reviewWorkflow);
      writeOutput(mergedOptions.reviewReport, reviewReportContent);
      console.log(`📁 Review report written to: ${mergedOptions.reviewReport}`);
    }

    // 7. Export evidence candidates if requested
    let candidates = null;
    if (mergedOptions.exportEvidenceCandidates || mergedOptions.exportPack) {
      candidates = exportEvidenceCandidates(findings, reviewWorkflow);
    }

    if (mergedOptions.exportEvidenceCandidates && candidates) {
      const candidatesContent = JSON.stringify(candidates, null, 2);
      writeOutput(mergedOptions.exportEvidenceCandidates, candidatesContent);
      console.log(`📁 Evidence export candidates written to: ${mergedOptions.exportEvidenceCandidates}`);
    }

    // 8. Build and write export pack if requested
    if (mergedOptions.exportPack) {
      const exportPack = buildExportPack({
        targetProjectPath: finalTargetPath,
        scanResult,
        evidenceCandidates: candidates,
        reviewWorkflow
      });
      await writeExportPack(exportPack, resolve(mergedOptions.exportPack));
      console.log(`📁 Evidence export pack written to: ${mergedOptions.exportPack}`);
    }

    // 9. Record scan history and compute diff if requested
    if (cliOptions.recordHistory && cliOptions.historyDir) {
      const historyDir = resolve(cliOptions.historyDir);
      const runId = `run_${new Date().toISOString().replace(/[:.]/g, '-')}_${crypto.randomBytes(2).toString('hex')}`;

      const { historyIndex } = writeScanHistory(historyDir, runId, {
        scanResultPath: resolve(mergedOptions.out || 'tmp/scan-result.json'),
        evidenceCandidatesPath: mergedOptions.exportEvidenceCandidates ? resolve(mergedOptions.exportEvidenceCandidates) : null,
        reviewWorkflowPath: mergedOptions.reviewOut ? resolve(mergedOptions.reviewOut) : null,
        exportPackPath: mergedOptions.exportPack ? resolve(mergedOptions.exportPack) : null,
        targetProject: finalTargetPath
      });
      console.log(`📂 Scan run recorded to history: ${historyDir}/runs/${runId}`);

      if (cliOptions.diffPrevious) {
        const prevRun = getPreviousRun(historyDir, runId);
        const baselineResult = prevRun ? prevRun.scanResult : null;
        const baselineRunId = prevRun ? prevRun.scanRun.run_id : null;
        const diff = buildScanDiff(baselineRunId, runId, baselineResult, scanResult);

        const diffJsonPath = resolve(historyDir, 'latest-diff.json');
        writeFileSync(diffJsonPath, JSON.stringify(diff, null, 2), 'utf8');
        console.log(`📁 Scan diff JSON written to: ${diffJsonPath}`);

        const diffMdPath = cliOptions.historyReport ? resolve(cliOptions.historyReport) : resolve(historyDir, 'latest-diff.md');
        writeDiffReport(diff, diffMdPath);
        console.log(`📁 Scan diff report written to: ${diffMdPath}`);
      }
    }

    // 10. Build and write export bundle if requested
    if (cliOptions.bundleDir) {
      const bundleDir = resolve(cliOptions.bundleDir);
      
      const scanResultCopy = JSON.parse(JSON.stringify(scanResult));
      
      const bundleMetadata = buildExportBundleMetadata(scanResultCopy, null, {
        targetPath: finalTargetPath,
        isFixture: true,
        evidenceCandidatesCount: candidates?.length || 0
      });

      const bundleData = {
        'manifest.json': bundleMetadata,
        'scan-result.json': scanResultCopy,
        'review-summary.md': generateBundleReport(bundleMetadata)
      };

      if (candidates) bundleData['evidence-candidates.json'] = JSON.parse(JSON.stringify(candidates));
      
      await writeExportBundle(bundleDir, bundleData);
      console.log(`📁 Backend-ready scan export bundle written to: ${bundleDir}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Critical Error during scan execution:', error.stack || error.message);
    process.exit(1);
  }
}

main();
