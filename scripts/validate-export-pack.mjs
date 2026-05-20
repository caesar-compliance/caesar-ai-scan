#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';

// ANSI terminal colors for premium output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

function calculateFileHash(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

async function validateExportPack(packDir) {
  console.log(`\n${BLUE}==================================================${RESET}`);
  console.log(`🛡️  Caesar AI Compliance: Starting Export Pack Audit`);
  console.log(`📂 Target Directory: ${packDir}`);
  console.log(`${BLUE}==================================================${RESET}\n`);

  const requiredFiles = [
    'export-pack.json',
    'manifest.json',
    'scan-result.json',
    'evidence-candidates.json',
    'review-workflow.json',
    'import-readiness.json',
    'human-review-checklist.json',
    'REVIEW_SUMMARY.md'
  ];

  const contents = {};

  // 1. Verify existence, size, and parseability of all files
  for (const filename of requiredFiles) {
    const filePath = path.resolve(packDir, filename);
    try {
      const stat = await fs.stat(filePath);
      if (stat.size === 0) {
        throw new Error(`File is empty (0 bytes).`);
      }
      const data = await fs.readFile(filePath, 'utf8');
      contents[filename] = data;
      console.log(`  [✅] ${filename} exists and is non-empty (${stat.size} bytes).`);
    } catch (error) {
      console.error(`  [❌] ${RED}Validation Failed on ${filename}:${RESET} ${error.message}`);
      process.exit(1);
    }
  }

  // 2. Parse JSON files
  const jsonFiles = requiredFiles.filter(f => f.endsWith('.json'));
  const parsed = {};
  for (const filename of jsonFiles) {
    try {
      parsed[filename] = JSON.parse(contents[filename]);
    } catch (error) {
      console.error(`  [❌] ${RED}JSON Parse Error in ${filename}:${RESET} ${error.message}`);
      process.exit(1);
    }
  }
  console.log(`\n  ${GREEN}All JSON files are valid and parseable.${RESET}\n`);

  const exportPack = parsed['export-pack.json'];
  const manifest = parsed['manifest.json'];
  const scanResult = parsed['scan-result.json'];
  const evidenceCandidates = parsed['evidence-candidates.json'];
  const reviewWorkflow = parsed['review-workflow.json'];
  const importReadiness = parsed['import-readiness.json'];
  const humanReviewChecklist = parsed['human-review-checklist.json'];

  // 3. Manifest Consistency & Hash Determinism Verification
  console.log(`🔍 Checking Manifest Mappings & Cryptographic SHA-256 Hashes:`);
  
  const manifestArtifacts = manifest.included_artifacts || [];
  const expectedArtifacts = [
    'scan-result.json',
    'evidence-candidates.json',
    'review-workflow.json',
    'import-readiness.json',
    'human-review-checklist.json'
  ];

  for (const artifact of expectedArtifacts) {
    if (!manifestArtifacts.includes(artifact)) {
      console.error(`  [❌] ${RED}Manifest Error:${RESET} Missing '${artifact}' from included_artifacts.`);
      process.exit(1);
    }

    // Direct hash calculation on file content written to disk
    const diskHash = calculateFileHash(contents[artifact]);
    const manifestHash = manifest.hash_summary[artifact];

    if (!manifestHash) {
      console.error(`  [❌] ${RED}Manifest Hash Missing:${RESET} No hash recorded for '${artifact}'.`);
      process.exit(1);
    }

    if (diskHash !== manifestHash) {
      console.error(`  [❌] ${RED}Manifest Hash Mismatch for '${artifact}':${RESET}`);
      console.error(`       On-Disk SHA-256: ${diskHash}`);
      console.error(`       Manifest SHA-256: ${manifestHash}`);
      process.exit(1);
    }
    console.log(`  [✅] ${artifact} hash matches manifest exactly: ${GREEN}${diskHash.slice(0, 8)}...${RESET}`);
  }

  // 4. Nested In-Memory Alignment Verification
  console.log(`\n🔍 Verifying In-Memory Alignment with Parent Export Pack:`);
  
  const jsonStringifyCompare = (objA, objB, name) => {
    const strA = JSON.stringify(objA, null, 2);
    const strB = JSON.stringify(objB, null, 2);
    if (strA !== strB) {
      console.error(`  [❌] ${RED}Export Pack Misalignment:${RESET} Nested '${name}' does not match its standalone file content.`);
      process.exit(1);
    }
    console.log(`  [✅] Nested '${name}' matches standalone file exactly.`);
  };

  jsonStringifyCompare(exportPack.manifest, manifest, 'manifest');
  jsonStringifyCompare(exportPack.scan_result, scanResult, 'scan_result');
  jsonStringifyCompare(exportPack.evidence_candidates, evidenceCandidates, 'evidence_candidates');
  jsonStringifyCompare(exportPack.review_workflow, reviewWorkflow, 'review_workflow');
  jsonStringifyCompare(exportPack.import_readiness, importReadiness, 'import_readiness');
  jsonStringifyCompare(exportPack.human_review_checklist, humanReviewChecklist, 'human_review_checklist');

  // 5. Schema Versions Constraints & Compatibility
  console.log(`\n🔍 Checking Schema Versions:`);
  const versionsToVerify = {
    'export-pack.json': exportPack.schema_version,
    'scan-result.json': scanResult.schema_version,
    'review-workflow.json': reviewWorkflow.schema_version,
    'manifest.json': manifest.compatibility.schema_version
  };

  for (const [file, version] of Object.entries(versionsToVerify)) {
    if (version !== '0.5.0') {
      console.error(`  [❌] ${RED}Version Constraint Violated in ${file}:${RESET} expected '0.5.0', got '${version}'`);
      process.exit(1);
    }
    console.log(`  [✅] ${file} is compliant with schema version 0.5.0.`);
  }

  // 6. Hard-locked Boundaries & Policies Enforcements
  console.log(`\n🔒 Asserting Export Pack Security & Policy Enforcements:`);

  // Policy A: Draft Hardlock Boundary
  console.log(`  Checking Policy A (Draft Hardlock Boundary)...`);
  if (!manifest.safety_flags.all_candidates_are_drafts) {
    console.error(`  [❌] ${RED}Policy Violated:${RESET} manifest.safety_flags.all_candidates_are_drafts is not true.`);
    process.exit(1);
  }
  for (let i = 0; i < evidenceCandidates.length; i++) {
    const candidate = evidenceCandidates[i];
    if (candidate.status !== 'draft') {
      console.error(`  [❌] ${RED}Policy Violated:${RESET} Candidate status must be 'draft', got '${candidate.status}' at index ${i}`);
      process.exit(1);
    }
    if (candidate.review_required !== true) {
      console.error(`  [❌] ${RED}Policy Violated:${RESET} Candidate review_required must be true, got false at index ${i}`);
      process.exit(1);
    }
  }
  console.log(`  [✅] Policy A Enforced: All ${evidenceCandidates.length} evidence candidates are hard-locked to draft status with review required.`);

  // Policy B: Automated Ingestion Isolation
  console.log(`  Checking Policy B (Automated Ingestion Isolation)...`);
  if (importReadiness.can_import_automatically !== false) {
    console.error(`  [❌] ${RED}Policy Violated:${RESET} import_readiness.can_import_automatically is not false.`);
    process.exit(1);
  }
  if (humanReviewChecklist.signoff_required !== true) {
    console.error(`  [❌] ${RED}Policy Violated:${RESET} human_review_checklist.signoff_required is not true.`);
    process.exit(1);
  }
  console.log(`  [✅] Policy B Enforced: Automated import is disabled, manual sign-off required.`);

  // Policy C: Secret Exposure Safety Flag
  console.log(`  Checking Policy C (Secret Exposure Safety Flag)...`);
  const envVarFindings = scanResult.summary.env_var_findings || 0;
  const noPlaintextCreds = manifest.safety_flags.no_plaintext_credentials_exposed;
  if (envVarFindings > 0 && noPlaintextCreds === true) {
    console.error(`  [❌] ${RED}Policy Violated:${RESET} Plaintext credentials exposed in findings but safety flag claims otherwise.`);
    process.exit(1);
  } else if (envVarFindings === 0 && noPlaintextCreds === false) {
    console.error(`  [❌] ${RED}Policy Violated:${RESET} No plaintext credentials exposed but safety flag claims they are.`);
    process.exit(1);
  }
  console.log(`  [✅] Policy C Enforced: Plaintext credential flags align perfectly with scan findings.`);

  console.log(`\n${GREEN}==================================================${RESET}`);
  console.log(`🎉 Caesar AI Compliance: Export Pack Audit PASSED!`);
  console.log(`   The generated package is offline, secure, and fully compliant.`);
  console.log(`${GREEN}==================================================${RESET}\n`);
}

const args = process.argv.slice(2);
const packDir = args[0] || 'tmp/sample-evidence-export-pack';
validateExportPack(packDir).catch(err => {
  console.error(`\n❌ Validation runner crashed:`, err);
  process.exit(1);
});
