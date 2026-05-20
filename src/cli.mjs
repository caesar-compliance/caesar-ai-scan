#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { runScan } from './scanner/scan-runner.mjs';
import { exportEvidenceCandidates } from './export/evidence-candidate-exporter.mjs';
import { generateMarkdownReport } from './report/markdown-report.mjs';

function parseArgs(args) {
  const options = {
    target: null,
    format: 'markdown',
    out: null,
    exportEvidenceCandidates: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--format') {
      options.format = args[++i];
    } else if (arg === '--out') {
      options.out = args[++i];
    } else if (arg === '--export-evidence-candidates') {
      options.exportEvidenceCandidates = args[++i];
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

function main() {
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

    // 2. Export evidence candidates if requested
    if (options.exportEvidenceCandidates) {
      const candidates = exportEvidenceCandidates(findings);
      const candidatesContent = JSON.stringify(candidates, null, 2);
      writeOutput(options.exportEvidenceCandidates, candidatesContent);
      console.log(`📁 Evidence export candidates written to: ${options.exportEvidenceCandidates}`);
    }

    // Fail-safe exit
    process.exit(0);
  } catch (error) {
    console.error('❌ Critical Error during scan execution:', error.message);
    process.exit(1);
  }
}

main();
