# Caesar AI Scan

> Offline-first AI governance scan toolkit for evidence-ready checks, local validation, scan history, and diff-ready compliance workflows.

**Live site:** [ai-scan.caesar.no](https://ai-scan.caesar.no/) — static demo with sample data only (see [docs/PUBLIC_SITE_CONTENT_POLICY.md](docs/PUBLIC_SITE_CONTENT_POLICY.md)).

| | |
|---|---|
| **Status** | v0.19.0 — offline scan pipeline through local API projection, Supabase storage draft, Cloudflare Worker boundary (local mock only) |
| **Mode** | Offline CLI — no live API calls, no remote ingestion |
| **Scope** | Local static analysis, review workflow, evidence export candidates |
| **Safety** | Draft-only exports; human review required — not legal advice |

Part of the [Caesar AI Governance Hub](https://github.com/caesar-compliance/caesar-ai-governance-hub) ecosystem.

---

## What it does

- **Static scan (Rule Pack v1)** — Detects 40+ AI API providers, orchestration frameworks (LangChain, LangGraph, etc.), RAG/Vector DBs, ML artifacts, prompts, and credential signals.
- **Review workflow** — Assigns review lanes, classifies evidence gaps, and scores export readiness offline.
- **Evidence export pack** — Builds a self-contained offline pack for [caesar-ai-evidence](https://github.com/caesar-compliance/caesar-ai-evidence) integration (draft, review-required).
- **Scope control** — `caesar-scan.config.json` and `.caesarignore` for bounded scan targets.
- **Scan history & diff** — Records offline scan runs and produces diff reports between runs (no cloud sync).
- **Public static demo** — GitHub Pages site at [ai-scan.caesar.no](https://ai-scan.caesar.no/) with synthetic sample outputs only.
- **Reference Lab** — Developer-only local lab at `../_reference-lab/scan` for architectural study and product benchmarking (see [docs/REFERENCE_LAB_POLICY.md](docs/REFERENCE_LAB_POLICY.md)).

## What it is not

- **Not legal advice** — findings are signals for governance review, not compliance proof.
- **Not automated compliance** — all export candidates stay `draft` with `review_required: true`.
- **Not connected to live systems** — no network ingestion, no user-repo CI scanning in this repo version.
- **Not publishing real client data** — the public site uses sample/fixture data only.

---

## Quick start

Requires Node.js 18+.

```bash
npm install
npm run scan:sample
npm run review:sample
npm run pack:sample
npm run history:sample
npm run check:all-offline
```

Individual validators: `validate:samples`, `validate:review`, `validate:pack`, `validate:scope`, `validate:history`, `validate:site`, `check:syntax`.

Full CLI example:

```bash
node src/cli.mjs fixtures/sample-ai-project \
  --format json \
  --out tmp/sample-scan-result.json \
  --export-evidence-candidates tmp/sample-evidence-candidates.json \
  --review-out tmp/sample-review-workflow.json \
  --review-report tmp/sample-review-workflow.md \
  --export-pack tmp/sample-evidence-export-pack
```

---

## CLI overview

| Flag | Purpose |
|---|---|
| `<target>` | Directory to scan (default `.`) |
| `--format json\|markdown` | Report format |
| `--out <path>` | Scan report output |
| `--export-evidence-candidates <path>` | Evidence candidate JSON |
| `--review-out` / `--review-report` | Review workflow JSON and Markdown |
| `--export-pack <dir>` | Full offline evidence export pack |
| `--scope-out` / `--scope-report` | Scope resolution outputs |
| `--history-dir` / `--record-history` / `--diff-previous` | Offline history and diff |

---

## Who it is for

- **Developers & DevOps** — inventory AI dependencies locally or in CI prep.
- **Security teams** — map AI integrations and credential exposure signals.
- **Compliance & audit leads** — surface evidence gaps and review lanes before export.

---

## Ecosystem

`caesar-ai-scan` feeds structured scan and review artifacts into the Caesar AI Governance Hub pipeline, aligned with [caesar-ai-evidence](https://github.com/caesar-compliance/caesar-ai-evidence) schemas.

---

## Important disclaimer

> `caesar-ai-scan` is an offline technical static-analysis utility. It identifies governance review needs, not final legal conclusions. Regulatory compliance is determined by qualified experts and competent authorities. The public site hosts synthetic sample data only.

---

## Repository documentation

| File | Role |
|---|---|
| [SPEC.md](SPEC.md) | Scan specifications and detection model |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Engine flow and modules |
| [PROJECT_STATE.md](PROJECT_STATE.md) | Phase, version, boundaries |
| [NEXT_ACTIONS.md](NEXT_ACTIONS.md) | Prioritized next steps |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [docs/PUBLIC_DEPLOYMENT.md](docs/PUBLIC_DEPLOYMENT.md) | Public site architecture |
| [docs/GITHUB_PAGES_DEPLOYMENT.md](docs/GITHUB_PAGES_DEPLOYMENT.md) | Pages deployment notes |
| [docs/REPOSITORY_PRESENTATION_POLISH.md](docs/REPOSITORY_PRESENTATION_POLISH.md) | Repository presentation polish record |
