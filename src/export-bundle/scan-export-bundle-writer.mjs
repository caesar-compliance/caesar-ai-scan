import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export async function writeExportBundle(bundleDir, data) {
  await fs.mkdir(bundleDir, { recursive: true });

  const checksums = {};

  for (const [filename, content] of Object.entries(data)) {
    const filePath = path.join(bundleDir, filename);
    const fileContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    await fs.writeFile(filePath, fileContent);
    checksums[filename] = crypto.createHash('sha256').update(fileContent).digest('hex');
  }

  // Update manifest with checksums
  const manifest = data['manifest.json'];
  manifest.artifact_checksums = checksums;
  await fs.writeFile(path.join(bundleDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
}
