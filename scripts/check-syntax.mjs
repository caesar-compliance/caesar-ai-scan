import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const rootDir = resolve('.');

function getFiles(dir) {
  const results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === 'fixtures' || file === 'tmp') continue;
    const path = join(dir, file);
    const stat = statSync(path);
    if (stat && stat.isDirectory()) {
      results.push(...getFiles(path));
    } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
      results.push(path);
    }
  }
  return results;
}

try {
  const srcFiles = getFiles(join(rootDir, 'src'));
  const scriptFiles = getFiles(join(rootDir, 'scripts'));
  const allFiles = [...srcFiles, ...scriptFiles];

  console.log(`Checking syntax for ${allFiles.length} files...`);
  for (const file of allFiles) {
    execSync(`node --check "${file}"`, { stdio: 'inherit' });
  }
  console.log('✅ Syntax check passed for all files.');
} catch (error) {
  console.error('❌ Syntax check failed:', error.message);
  process.exit(1);
}
