document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.selector-tab');
  const jsonViewer = document.getElementById('json-viewer');
  const metricValues = {
    findings: document.getElementById('metric-findings'),
    files: document.getElementById('metric-files'),
    readiness: document.getElementById('metric-readiness'),
    gaps: document.getElementById('metric-gaps')
  };
  const buildInfoElements = {
    version: document.getElementById('build-version'),
    generatedAt: document.getElementById('build-date'),
    commit: document.getElementById('build-commit')
  };

  let loadedData = {
    scanResult: null,
    evidenceCandidates: null,
    reviewWorkflow: null,
    manifest: null,
    readiness: null,
    historySummary: null,
    latestDiff: null,
    build: null,
    productLoop: null,
    sqlRehearsal: null,
    postgresGate: null
  };

  // Setup Tab Clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTabContent(tab.dataset.tab);
    });
  });

  // Fetch all JSON artifacts
  async function loadAllData() {
    try {
      const fetchJson = async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await res.json();
        } catch (e) {
          console.warn(`Failed to fetch ${url}:`, e);
          return null;
        }
      };

      loadedData.build = await fetchJson('data/site-build.json');
      loadedData.scanResult = await fetchJson('data/sample-scan-result.json');
      loadedData.evidenceCandidates = await fetchJson('data/sample-evidence-candidates.json');
      loadedData.reviewWorkflow = await fetchJson('data/sample-review-workflow.json');
      loadedData.manifest = await fetchJson('data/sample-export-pack-manifest.json');
      loadedData.readiness = await fetchJson('data/sample-import-readiness.json');
      loadedData.historySummary = await fetchJson('data/sample-history-summary.json');
      loadedData.latestDiff = await fetchJson('data/sample-latest-diff.json');
      loadedData.productLoop = await fetchJson('data/product-loop-readiness-report.json');
      loadedData.sqlRehearsal = await fetchJson('data/rehearsal/sql-compile-rehearsal-report.json');
      loadedData.postgresGate = await fetchJson('data/rehearsal/local-postgres-compile-harness-enable-gate-report.json');

      updateMetrics();
      updateBuildInfo();
      updateProductStatus();
      updateProductLoopSection();
      updateSafetyGates();
      
      // Default initial tab
      renderTabContent('scan');
    } catch (err) {
      console.error('Error initializing site data dashboard:', err);
      jsonViewer.textContent = '// Failed to load offline static data files.\n// Run npm run build:site to generate assets.';
    }
  }

  function updateProductStatus() {
    const statusContainer = document.getElementById('product-status-container');
    if (!statusContainer || !loadedData.productLoop) return;

    const loop = loadedData.productLoop;
    statusContainer.innerHTML = `
      <div class="metric-card">
        <div class="status-badge ${loop.product_loop_readiness_status === 'ready' ? 'status-ready' : 'status-blocked'}">
          ${loop.product_loop_readiness_status}
        </div>
        <div class="label">Product Readiness</div>
      </div>
      <div class="metric-card">
        <div class="status-badge ${loop.local_demo_ready ? 'status-ready' : 'status-blocked'}">
          ${loop.local_demo_ready ? 'READY' : 'NOT READY'}
        </div>
        <div class="label">Local Demo Status</div>
      </div>
      <div class="metric-card">
        <div class="status-badge status-disabled">DISABLED</div>
        <div class="label">Backend Execution</div>
      </div>
      <div class="metric-card">
        <div class="status-badge status-disabled">DISABLED</div>
        <div class="label">Live Services</div>
      </div>
    `;
  }

  function updateProductLoopSection() {
    const container = document.getElementById('product-loop-timeline');
    if (!container || !loadedData.productLoop) return;

    const stages = loadedData.productLoop.pipeline_readiness_pack.stages;
    container.innerHTML = stages.map(stage => `
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <h4>${stage.stage_name} <span class="status-badge ${stage.status === 'ready' ? 'status-ready' : 'status-pending'}">${stage.status}</span></h4>
          <div class="meta">Script: <code>${stage.package_script}</code> | Validator: <code>${stage.validation_script}</code></div>
          <p>${stage.product_value_summary}</p>
          <div class="details">
            <strong>Output:</strong> <code>${stage.primary_output}</code><br>
            <small><em>Safety Note: ${stage.safety_note}</em></small>
          </div>
        </div>
      </div>
    `).join('');
  }

  function updateSafetyGates() {
    const container = document.getElementById('safety-gates-container');
    if (!container) return;

    let html = '';

    if (loadedData.postgresGate) {
      const gate = loadedData.postgresGate;
      html += `
        <div class="card">
          <h3>T024 Postgres Harness Gate <span class="status-badge ${gate.gate_status === 'closed' ? 'status-blocked' : 'status-ready'}">${gate.gate_status === 'closed' ? 'Gate Closed' : 'Gate Open'}</span></h3>
          <p>${gate.safety_check_summary}</p>
          <div class="meta">Last Evaluated: ${gate.evaluated_at}</div>
        </div>
      `;
    }

    if (loadedData.sqlRehearsal) {
      const sql = loadedData.sqlRehearsal;
      html += `
        <div class="card">
          <h3>SQL Compile Rehearsal <span class="status-badge ${sql.rehearsal_status === 'success' ? 'status-ready' : 'status-pending'}">${sql.rehearsal_status}</span></h3>
          <p>Schema: ${sql.target_schema}</p>
          <div class="meta">Compiler: ${sql.local_sql_compiler_version}</div>
        </div>
      `;
    }

    container.innerHTML = html || '<p>No safety gate data available.</p>';
  }

  function updateMetrics() {
    if (loadedData.scanResult) {
      metricValues.findings.textContent = loadedData.scanResult.summary.total_findings || '0';
      metricValues.files.textContent = loadedData.scanResult.summary.scanned_files || '0';
    }
    if (loadedData.readiness) {
      metricValues.readiness.textContent = `${loadedData.readiness.metrics.readiness_score || 0}%`;
      metricValues.gaps.textContent = loadedData.readiness.metrics.total_gaps_found || '0';
    }
  }

  function updateBuildInfo() {
    if (loadedData.build) {
      buildInfoElements.version.textContent = `v${loadedData.build.version || '0.6.0'}`;
      buildInfoElements.generatedAt.textContent = loadedData.build.generated_at ? new Date(loadedData.build.generated_at).toLocaleString() : 'N/A';
      buildInfoElements.commit.textContent = loadedData.build.source_commit ? loadedData.build.source_commit.substring(0, 8) : 'N/A';
    }
  }

  function renderTabContent(tabName) {
    if (!jsonViewer) return;

    if (tabName === 'scan') {
      if (!loadedData.scanResult) {
        jsonViewer.textContent = '// Scan results data not loaded.';
        return;
      }
      
      // Render clean summary markdown/text
      let summary = `🛡️ CAESAR AI SCAN SUMMARY\n`;
      summary += `==========================================\n`;
      summary += `Target Directory : ${loadedData.scanResult.target}\n`;
      summary += `Scanned At       : ${loadedData.scanResult.scanned_at}\n`;
      summary += `Version          : ${loadedData.scanResult.scanner.version}\n\n`;
      
      summary += `📊 Findings Breakdown:\n`;
      summary += `- Dependency Signalings : ${loadedData.scanResult.summary.dependency_findings}\n`;
      summary += `- Plaintext Env Keys    : ${loadedData.scanResult.summary.env_var_findings}\n`;
      summary += `- Prompt Configurations : ${loadedData.scanResult.summary.prompt_findings}\n`;
      summary += `- High-dimensional DBs  : ${loadedData.scanResult.summary.vector_db_findings}\n`;
      summary += `------------------------------------------\n`;
      summary += `Total AI Signals Found  : ${loadedData.scanResult.summary.total_findings}\n\n`;

      summary += `🔍 Findings List:\n`;
      loadedData.scanResult.findings.forEach((finding, index) => {
        summary += `\n[${index + 1}] Detector: ${finding.detector}\n`;
        summary += `    Category: ${finding.category} | Severity: ${finding.severity}\n`;
        summary += `    File Path: ${finding.file_path}\n`;
        if (finding.evidence_key) {
          summary += `    Evidence Key: "${finding.evidence_key}"\n`;
        }
        if (finding.line_number) {
          summary += `    Line Number: ${finding.line_number}\n`;
        }
        if (finding.matched_content) {
          summary += `    Matched Line: ${finding.matched_content.trim()}\n`;
        }
      });

      jsonViewer.textContent = summary;
    } else if (tabName === 'candidates') {
      if (!loadedData.evidenceCandidates) {
        jsonViewer.textContent = '// Evidence candidates data not loaded.';
        return;
      }

      let summary = `📋 CAESAR AI EVIDENCE EXPORT CANDIDATES\n`;
      summary += `==========================================\n`;
      summary += `Schema Version: ${loadedData.evidenceCandidates.schema_version || '0.5.0'}\n`;
      summary += `Global Lock Status: DRAFT (Review required)\n\n`;

      loadedData.evidenceCandidates.candidates.forEach((c, idx) => {
        summary += `[Candidate ${idx + 1}] ID: ${c.candidate_id}\n`;
        summary += `  Ecosystem Sign-off Lane: ${c.lane || 'N/A'}\n`;
        summary += `  Readiness Score Mapping: ${c.readiness_score || 0}%\n`;
        summary += `  Status Flag: ${c.status || 'draft'}\n`;
        summary += `  Review Status: ${c.review_required ? '⚠️ Pending Human Action' : '✅ Completed'}\n`;
        summary += `  Source File: ${c.source_finding.file_path}\n`;
        summary += `  Reasoning: ${c.description || 'N/A'}\n`;
        summary += `------------------------------------------\n`;
      });

      jsonViewer.textContent = summary;
    } else if (tabName === 'workflow') {
      if (!loadedData.reviewWorkflow) {
        jsonViewer.textContent = '// Review workflow data not loaded.';
        return;
      }

      let summary = `🔄 AUDITOR REVIEW WORKFLOW\n`;
      summary += `==========================================\n`;
      summary += `Export Readiness Status: ${loadedData.reviewWorkflow.readiness_assessment?.status || 'BLOCKER_DETECTED'}\n`;
      summary += `Overall Readiness Score: ${loadedData.reviewWorkflow.readiness_assessment?.readiness_score || 0}%\n\n`;

      summary += `❌ GAPS LOGGED BY CLASSIFIER:\n`;
      const gaps = loadedData.reviewWorkflow.gaps || [];
      if (gaps.length === 0) {
        summary += `  No compliance evidence gaps detected.\n`;
      } else {
        gaps.forEach((gap, idx) => {
          summary += `  [Gap ${idx + 1}] ID: ${gap.gap_id} (${gap.type})\n`;
          summary += `    Compliance Lane: ${gap.lane} | Impact Level: ${gap.severity}\n`;
          summary += `    Missing Evidence: ${gap.required_evidence_type}\n`;
          summary += `    Resolution Steps: ${gap.remediation_guidance || 'N/A'}\n`;
          if (gap.recommended_questions) {
            summary += `    Auditor Questions:\n`;
            gap.recommended_questions.forEach(q => {
              summary += `      - ${q}\n`;
            });
          }
          summary += `\n`;
        });
      }

      jsonViewer.textContent = summary;
    } else if (tabName === 'history') {
      if (!loadedData.historySummary || !loadedData.latestDiff) {
        jsonViewer.textContent = '// Scan history or diff data not loaded.';
        return;
      }
      
      let summary = `📜 CAESAR AI SCAN HISTORY SUMMARY\n`;
      summary += `==========================================\n`;
      summary += `Total Runs Recorded: ${loadedData.historySummary.run_count}\n`;
      summary += `Latest Run ID      : ${loadedData.historySummary.latest_run_id}\n\n`;

      summary += `📊 LATEST DIFF REPORT (${loadedData.latestDiff.current_run_id})\n`;
      summary += `------------------------------------------\n`;
      summary += `- Added Findings   : ${loadedData.latestDiff.summary.added_count}\n`;
      summary += `- Removed Findings : ${loadedData.latestDiff.summary.removed_count}\n`;
      summary += `- Changed Findings : ${loadedData.latestDiff.summary.changed_count}\n`;
      summary += `- Unchanged        : ${loadedData.latestDiff.summary.unchanged_count}\n`;
      summary += `Total Findings     : ${loadedData.latestDiff.summary.total_current}\n\n`;

      if (loadedData.latestDiff.summary.added_count > 0) {
        summary += `➕ NEW FINDINGS INTRODUCED:\n`;
        loadedData.latestDiff.added_findings.forEach(f => {
          summary += `  - [${f.rule_id}] ${f.matched_name} in ${f.file_path}\n`;
        });
        summary += `\n`;
      }

      summary += `🕒 Diff Generated At: ${loadedData.latestDiff.generated_at}\n`;
      
      jsonViewer.textContent = summary;
    } else if (tabName === 'raw') {
      jsonViewer.textContent = JSON.stringify({
        scanResult: loadedData.scanResult,
        evidenceCandidates: loadedData.evidenceCandidates,
        reviewWorkflow: loadedData.reviewWorkflow,
        manifest: loadedData.manifest,
        readiness: loadedData.readiness,
        historySummary: loadedData.historySummary,
        latestDiff: loadedData.latestDiff
      }, null, 2);
    }
  }

  loadAllData();
});
