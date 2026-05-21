# Reference to Roadmap — Caesar AI Scan

Insights from the Reference Lab mapped to future development tasks in Caesar AI Scan.

## Upcoming Tasks (T009 - T015)

### T009: Rule Pack v1 / AI Framework Detection Expansion
- **Reference**: `getregula`, `semgrep`
- **Status**: **Implemented (v0.9.0)**
- **Goal**: Expand detection rules to cover more AI frameworks and specific regulatory requirements.
- **Action**: Rule Pack v1 implemented with 6 categories and 40+ signals.

### T010: AI-BOM / AI Usage Inventory Export
- **Reference**: `syft`, `cdxgen`, `cyclonedx-specification`
- **Goal**: Implement standard-compliant AI-BOM exports.
- **Action**: study `cdxgen` AI-BOM implementation for CycloneDX compatibility.

### T011: GitHub Action Scanner Mode Planning Pack
- **Reference**: `trivy-action`, `gitleaks-action`
- **Goal**: Design a dedicated GitHub Action for scanning user repositories.
- **Action**: Analyze UX and configuration patterns from security scanner actions.

### T012: SARIF / PR Annotation Planning Pack
- **Reference**: `semgrep`, `gitleaks`, `trivy`
- **Goal**: Implement SARIF 2.1.0 output for GitHub PR annotations.
- **Action**: study SARIF generation logic in `semgrep`.

### T013: Scanner Severity/Risk Taxonomy Expansion
- **Reference**: `scorecard`, `owasp-llm-top-10`
- **Goal**: Develop a robust risk scoring model for detected AI signals.
- **Action**: Align Caesar scoring with `scorecard` and `OWASP` taxonomies.

### T014: Local HTML/PDF Audit Report Prototype
- **Reference**: `getregula`, `verifywise`
- **Goal**: Create premium visual audit reports for stakeholders.
- **Action**: study report layouts and data visualization in governance platforms.

### T015: Public Demo Product Positioning Upgrade
- **Reference**: `verifywise`, `credoai-lens`
- **Goal**: Enhance the public demo site to reflect enterprise governance capabilities.
- **Action**: study messaging and dashboard aesthetics from top governance platforms.
