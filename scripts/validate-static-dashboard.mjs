import { existsSync, readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const rootDir = resolve('.');
const dashboardDataDir = join(rootDir, 'site', 'data', 'dashboard');

function assert(condition, message) {
  if (!condition) {
    throw new Error('❌ Assertion Failed: ' + message);
  }
}

function runDashboardValidation() {
  console.log('🚀 Validating static dashboard prototype...');

  // Verify dashboard data
  const dataFiles = ['manifest.json', 'health.json', 'dashboard-summary.json', 'inventory-components.json'];
  for (const file of dataFiles) {
    const filePath = join(dashboardDataDir, file);
    assert(existsSync(filePath), 'Data file missing: ' + file);
    JSON.parse(readFileSync(filePath, 'utf8'));
  }

  // Verify dashboard page
  const dashboardHtml = join(rootDir, 'site', 'dashboard.html');
  assert(existsSync(dashboardHtml), 'Dashboard page missing: site/dashboard.html');
  
  const content = readFileSync(dashboardHtml, 'utf8');
  assert(!content.includes('http://') && !content.includes('https://'), 'Dashboard contains external URLs');
  
  console.log('✅ Dashboard validation PASSED.');
}

runDashboardValidation();
