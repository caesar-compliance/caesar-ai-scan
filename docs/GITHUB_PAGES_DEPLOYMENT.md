# GitHub Pages Deployment Configuration

This guide details the integration parameters, environment triggers, and pipeline steps for GitHub Pages deployment.

## Pipeline Integration

Deployment is fully automated using GitHub Actions. It is triggered by the `.github/workflows/deploy-pages.yml` file.

### Triggers
- **Main Commit Push**: Executed automatically whenever changes are successfully merged/pushed into the `main` branch.
- **Workflow Dispatch**: Manual execution triggerable from the GitHub Actions dashboard.

### Environment Specification
- **Environment Name**: `github-pages`
- **Permissions Context**:
  - `contents: read`
  - `pages: write`
  - `id-token: write`
- **Output Pages URL**: Generated dynamically by the official GitHub Pages deployment step.

## Build and Validation Pipeline

Every deployment workflow execution enforces the complete suite of offline validation scripts before uploading the artifact:
1. **Checkout & Node Setup**: Prepares Node.js v20 execution environment.
2. **Offline Tests Verification**: Runs `npm run check:all-offline` to execute all syntax checks, static scanner outputs, and evidence/scope validation suites.
3. **Site Build**: Runs `npm run build:site` to copy sample data into the `site/data/` directory and write the `site-build.json` metadata.
4. **Programmatic Validation**: Runs `npm run validate:site` to guarantee no secrets exist, verify that `CNAME` contains exactly `ai-scan.caesar.no`, and verify that absolutely zero external CDNs, Google Fonts, or tracking scripts are included.
5. **Artifact Upload**: Deploys only the verified `site/` subdirectory as the static build bundle.

## Troubleshooting HTTPS Certificates

- **DNS Configured**: The custom domain `ai-scan.caesar.no` is configured via external DNS CNAME pointing to Caesar's GitHub Pages domain.
- **Certificate Issuance**: When first deploying or redeploying, GitHub Pages initiates an automated SSL certificate check. HTTPS enforcement might be delayed.
- **Enforcement Status**: If HTTPS yields certificate errors immediately after pipeline execution, allow up to 24 hours for Let's Encrypt / GitHub automated SSL certificate issuance to finalize. Do not change the DNS settings or delete `site/CNAME` during this period.
