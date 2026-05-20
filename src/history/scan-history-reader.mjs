import fs from 'fs';
import path from 'path';

export function readHistoryIndex(historyDir) {
  const indexPath = path.join(historyDir, 'history-index.json');
  if (!fs.existsSync(indexPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
}

export function readRun(historyDir, runId) {
  const runDir = path.join(historyDir, 'runs', runId);
  const runPath = path.join(runDir, 'scan-run.json');
  const resultPath = path.join(runDir, 'scan-result.json');
  
  if (!fs.existsSync(runPath) || !fs.existsSync(resultPath)) {
    return null;
  }
  
  return {
    scanRun: JSON.parse(fs.readFileSync(runPath, 'utf8')),
    scanResult: JSON.parse(fs.readFileSync(resultPath, 'utf8')),
    runDir
  };
}

export function getPreviousRun(historyDir, currentRunId) {
  const index = readHistoryIndex(historyDir);
  if (!index || !index.runs || index.runs.length < 2) return null;
  
  // Find current run index
  const currentIndex = index.runs.findIndex(r => r.run_id === currentRunId);
  if (currentIndex <= 0) return null; // No previous run before this one
  
  const prevRunId = index.runs[currentIndex - 1].run_id;
  return readRun(historyDir, prevRunId);
}
