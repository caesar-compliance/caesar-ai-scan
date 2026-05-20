# Decisions Log: T001 — Evidence Export Candidate Pipeline Foundation

## 1. Zero External Dependency Architecture
- **Decision:** We use only Node.js built-in core modules (`fs`, `path`, `crypto`, `readline`).
- **Rationale:** Minimizes ecosystem risks, keeps the runtime fast and offline-capable without relying on external registry network calls, and aligns with pure ESM structure.

## 2. Rule Configuration Schema
- **Decision:** We define rules in a single `data/detection-rules.ai-usage.json` JSON file.
- **Rationale:** Separates code from rules, enabling the rules to be easily updated or versioned independently.

## 3. Evidence Candidate Isolation
- **Decision:** Evidence candidates are designed as draft compliance records that do not bypass human validation.
- **Rationale:** Caesar AI Governance principles mandate that automated findings are labeled as "export candidates" that require a human reviewer to approve before they are officially ingested into Governance OS or `caesar-ai-evidence` stores.

## 4. AST vs Regex Pattern Matching
- **Decision:** For the first functional offline pipeline foundation (v0.2.0), we focus on fast static regex-based detection across source files and structural detectors for project manifest files (like `package.json` and `requirements.txt`).
- **Rationale:** Keeps runtime fast, simple, and zero-dependency, while fully achieving the offline prototype goal of AI signal detection.
