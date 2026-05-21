export const RUNTIME_MODES = {
  OFFLINE: 'offline_review_only',
  LOCAL_API: 'local_read_only_api',
  PLANNED_HOSTED: 'future_hosted_read_only_api'
};

export function checkRuntimeSafety(mode) {
  if (mode === 'live_ingestion') {
    throw new Error('Runtime mode "live_ingestion" is not supported in T017.');
  }
  return true;
}
