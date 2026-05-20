# Public Deployment Reference

This document serves as the guide for the public static deployment architecture of Caesar AI Scan.

## Strategic Purpose

The goal of this deployment is to provide a public, minimal MVP static site that demonstrates the core capabilities of Caesar AI Scan at its public URL.

- **Public Domain**: [https://ai-scan.caesar.no/](https://ai-scan.caesar.no/)
- **Target URL (Non-secure backup)**: [http://ai-scan.caesar.no/](http://ai-scan.caesar.no/)
- **Deployment Platform**: GitHub Pages
- **Deployment Source**: GitHub Actions CI/CD Pipeline

## Deployment Architecture

The site operates on a pure static, client-side model:
1. **No External Libraries/Fonts/CDNs**: CSS and JavaScript are fully self-contained and loaded locally from within the repository to uphold high compliance standards and work perfectly under offline/air-gapped bounds.
2. **CNAME Mapping**: The site contains a [CNAME](file:///Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/site/CNAME) file containing exactly `ai-scan.caesar.no`. Do not remove or alter this domain configuration.
3. **Data Files**: Built using programmatically isolated mock/sample JSON outputs representing the scan pipelines. No dynamic databases, endpoints, or backend API queries are executed.

## Safety and Privacy Boundaries

- **Static Samples Only**: Under no circumstances should real production scan outputs or actual customer codebase structures be published to the site.
- **Credential Safety**: Programmatic scans (`scripts/validate-site.mjs`) verify that no private keys, passwords, or cloud credentials are present in the static files.
- **DNS Boundaries**: The DNS settings for `ai-scan.caesar.no` are managed within the Caesar DNS provider panel. Do not attempt to modify the repository DNS from GitHub UI or manual domain transfers.
