import fs from 'fs/promises';
import path from 'path';
import { generateExportPackReport } from '../report/export-pack-report.mjs';

/**
 * Handles physical workspace disk writes by recursively creating the target
 * export pack folder structure and writing all 7 JSON files and the Markdown report.
 *
 * @param {Object} exportPack - The full built CaesarEvidenceExportPack in-memory object.
 * @param {string} outputDir - The output directory path where the package should be written.
 * @returns {Promise<Array<string>>} List of absolute paths of the files written.
 */
export async function writeExportPack(exportPack, outputDir) {
  // Ensure target directory exists recursively
  await fs.mkdir(outputDir, { recursive: true });

  const filesToWrite = [
    { name: 'export-pack.json', content: JSON.stringify(exportPack, null, 2) },
    { name: 'manifest.json', content: JSON.stringify(exportPack.manifest, null, 2) },
    { name: 'scan-result.json', content: JSON.stringify(exportPack.scan_result, null, 2) },
    { name: 'evidence-candidates.json', content: JSON.stringify(exportPack.evidence_candidates, null, 2) },
    { name: 'review-workflow.json', content: JSON.stringify(exportPack.review_workflow, null, 2) },
    { name: 'import-readiness.json', content: JSON.stringify(exportPack.import_readiness, null, 2) },
    { name: 'human-review-checklist.json', content: JSON.stringify(exportPack.human_review_checklist, null, 2) },
    { name: 'REVIEW_SUMMARY.md', content: generateExportPackReport(exportPack) }
  ];

  const writtenPaths = [];

  for (const file of filesToWrite) {
    const filePath = path.resolve(outputDir, file.name);
    await fs.writeFile(filePath, file.content, 'utf8');
    writtenPaths.push(filePath);
  }

  return writtenPaths;
}
