#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { runScan } from './scanner/scan-runner.mjs';
import { exportEvidenceCandidates } from './export/evidence-candidate-exporter.mjs';
import { generateMarkdownReport } from './report/markdown-report.mjs';
import { buildReviewWorkflow } from './review/review-workflow-builder.mjs';
import { generateReviewReport } from './report/review-workflow-report.mjs';
import { buildExportPack } from './export-pack/export-pack-builder.mjs';
import { writeExportPack } from './export-pack/write-export-pack.mjs';

function parseArgs(args) {
  const options = {
    target: null,
    format: 'markdown',
    out: null,
    exportEvidenceCandidates: null,
    reviewOut: null,
    reviewReport: null,
    exportPack: null
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
    } else if (!arg.startsWith('--')) {
      options.target = arg;
    }
  }

  // Default target is current working directory
  if (!options.target) {
    options.target = '.';
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
  const options = parseArgs(args);

  try {
    const targetPath = resolve(options.target);
    console.log(`🔍 Starting Caesar AI Static Scan on target: ${targetPath}...`);
    
    const scanResult = runScan(targetPath);
    const { summary, findings } = scanResult;

    console.log(`✅ Scan completed. Found ${summary.total_findings} AI usage signals.`);

    // 1. Produce scan results output
    let outputContent = '';
    if (options.format === 'json') {
      outputContent = JSON.stringify(scanResult, null, 2);
    } else {
      outputContent = generateMarkdownReport(scanResult);
    }

    if (options.out) {
      writeOutput(options.out, outputContent);
      console.log(`📁 Scan report written to: ${options.out}`);
    } else {
      // Print to stdout if no output file is provided
      console.log('\n--- SCAN REPORT ---');
      console.log(outputContent);
      console.log('-------------------\n');
    }

    // 2. Build review workflow if requested or if candidates/packs are being exported
    let reviewWorkflow = null;
    if (options.reviewOut || options.reviewReport || options.exportEvidenceCandidates || options.exportPack) {
      reviewWorkflow = buildReviewWorkflow(scanResult);
    }

    // 3. Write review JSON and MD report if requested
    if (options.reviewOut && reviewWorkflow) {
      const reviewContent = JSON.stringify(reviewWorkflow, null, 2);
      writeOutput(options.reviewOut, reviewContent);
      console.log(`📁 Review workflow written to: ${options.reviewOut}`);
    }

    if (options.reviewReport && reviewWorkflow) {
      const reviewReportContent = generateReviewReport(reviewWorkflow);
      writeOutput(options.reviewReport, reviewReportContent);
      console.log(`📁 Review report written to: ${options.reviewReport}`);
    }

    // 4. Export evidence candidates if requested or if export pack is requested
    let candidates = null;
    if (options.exportEvidenceCandidates || options.exportPack) {
      candidates = exportEvidenceCandidates(findings, reviewWorkflow);
    }

    if (options.exportEvidenceCandidates && candidates) {
      const candidatesContent = JSON.stringify(candidates, null, 2);
      writeOutput(options.exportEvidenceCandidates, candidatesContent);
      console.log(`📁 Evidence export candidates written to: ${options.exportEvidenceCandidates}`);
    }

    // 5. Build and write export pack if requested
    if (options.exportPack) {
      const targetProjectPath = targetPath;
      const exportPack = buildExportPack({
        targetProjectPath,
        scanResult,
        evidenceCandidates: candidates,
        reviewWorkflow
      });
      await writeExportPack(exportPack, resolve(options.exportPack));
      console.log(`📁 Evidence export pack written to: ${options.exportPack}`);
    }

    // Fail-safe exit
    process.exit(0);
  } catch (error) {
    console.error('❌ Critical Error during scan execution:', error.stack || error.message);
    process.exit(1);
  }
}

main();

