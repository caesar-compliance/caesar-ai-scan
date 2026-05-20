# Public Site Content Policy

This policy document governs what content, static data, scripts, and identifiers are permitted on the public website.

## Content Boundaries

1. **Static and Simulated Samples Only**: 
   - No actual corporate, client, or user codebase scans may ever be committed to the `site/data` directory.
   - All scans visible on the public dashboard are synthetically generated mock assets (`fixtures/sample-ai-project`).

2. **Absolute Zero Real Secrets**:
   - The public site must never host API keys, password fragments, private encryption keys, or specific system pathnames.
   - Programmatic regex validation in `scripts/validate-site.mjs` enforces this policy with non-zero exit codes.

3. **No Dynamic Active Ingestion**:
   - The site does not ingestion scan results dynamically from client pipelines.
   - There is no automated Caesar AI Evidence context mapping, live database state synchronization, or integration with active Caesar Governance OS services.

## Disclaimer and Legal Declarations

The public site must display prominent compliance disclaimers:
- **Scan Finding Signals**: Scan results represent static code analysis signals indicating possible AI usage. They do not constitute formal legal conclusions or regulatory certification.
- **Human Auditor Review Required**: Evidence candidates are static drafts. No automated approval or evidence recording occurs without manual auditor validation and digital sign-off.
- **Offline / Sandbox Scope**: Caesar AI Scan operates purely offline and air-gapped. The public website is a demonstration dashboard only.

## Privacy and Tracking Exclusions

To uphold the absolute privacy architecture of Caesar:
- **No External CDNs**: All scripts, styles, and assets must be self-hosted locally in `site/assets/`.
- **No Tracking/Analytics Scripts**: Google Analytics, Mixpanel, Fathom, or other tracking frameworks are strictly prohibited.
- **No External Typography Services**: Browser default sans-serif font cascades are utilized to guarantee zero external typography tracking (e.g., Google Fonts or Adobe Typekit).
