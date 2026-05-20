# T005 Validation Suite

## Local Validation Commands

To execute and verify the entire build, static site generator, security checks, and offline validator pipelines, run:

```bash
npm run check:all-offline
```

This runs the following sequential checks:
1. `npm run check:syntax` - Validates JavaScript syntax of core CLI and scripts.
2. `npm run scan:sample` - Generates raw scan results.
3. `npm run validate:samples` - Verifies structure of generated scan results.
4. `npm run review:sample` - Generates review workflow JSON.
5. `npm run validate:review` - Verifies review workflow structure.
6. `npm run pack:sample` - Generates compliance export pack.
7. `npm run validate:pack` - Validates export pack schema and files.
8. `npm run scope:sample` - Generates scope control output.
9. `npm run validate:scope` - Validates scope control rules and ignore matches.
10. `npm run build:site` - Builds the public static site structure and writes metadata.
11. `npm run validate:site` - Programmatically inspects public artifacts for secret leaks, external CDNs, tracking scripts, and CNAME correctness.

## GitHub Pages Deployment Verification

Following a successful merge and push to the `main` branch, the deployment workflow should be tracked on GitHub:

1. Inspect the workflow runs:
   ```bash
   gh run list --workflow deploy-pages.yml --limit 3
   ```
2. Verify output of deployment steps:
   - Check if `deploy` environment is set to `github-pages`.
   - Validate deployed URL at [https://ai-scan.caesar.no/](https://ai-scan.caesar.no/).
3. Test connectivity across protocols:
   - **Secure connection**: `curl -sI https://ai-scan.caesar.no/`
   - **HTTP fallback/redirect**: `curl -sI http://ai-scan.caesar.no/`
