import fs from 'fs';
import path from 'path';

async function validate() {
    const reportPath = 'site/data/rehearsal/sql-compile-rehearsal-report.json';
    if (!fs.existsSync(reportPath)) {
        console.error('Report file not found.');
        process.exit(1);
    }
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    
    // Simple schema check
    if (!report.version || !report.status || !report.checks) {
        console.error('Invalid report schema.');
        process.exit(1);
    }

    const forwardSQL = fs.readFileSync(report.rehearsalFiles.forward, 'utf-8');
    const forbiddenPatterns = [/supabase link/, /supabase db push/, /wrangler deploy/, /http:\/\//, /https:\/\//];
    
    for (const pattern of forbiddenPatterns) {
        if (pattern.test(forwardSQL)) {
            console.error(`Forbidden pattern found: ${pattern}`);
            process.exit(1);
        }
    }

    console.log('Validation successful.');
}

validate().catch(console.error);
