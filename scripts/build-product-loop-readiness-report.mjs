import { generateReadinessReport } from '../src/product-loop/product-loop-readiness-report.mjs';
import fs from 'fs';
import path from 'path';

const report = generateReadinessReport();
const outputPath = path.join(process.cwd(), 'site', 'data', 'product-loop-readiness-report.json');
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`Product loop readiness report built successfully.`);
