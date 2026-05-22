import fs from 'fs';
import path from 'path';

const reportPath = path.join(process.cwd(), 'site', 'data', 'product-loop-readiness-report.json');

if (!fs.existsSync(reportPath)) {
    console.error(`Readiness report not found at ${reportPath}`);
    process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

if (report.backend_execution_enabled !== false) {
    console.error("Backend execution must be disabled");
    process.exit(1);
}

if (report.live_services_enabled !== false) {
    console.error("Live services must be disabled");
    process.exit(1);
}

console.log("Product loop readiness validation passed.");
