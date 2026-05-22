import { pathToFileURL } from 'url';

const reportBuilder = 'src/local-postgres-compile-harness/local-postgres-compile-harness-enable-gate-report.mjs';

// Simple execution without child_process
import(pathToFileURL(reportBuilder).href)
  .then(() => console.log('Successfully built enablement gate report.'))
  .catch(err => {
    console.error('Failed to build report:', err);
    process.exit(1);
  });
