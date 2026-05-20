# Decisions Log: T002 — Review Workflow + Evidence Gap Classification

## 1. Zero-dependency Scorer Design
- **Decision:** The export readiness score is calculated as a numeric percentage mapping the ratio of completed (non-blocking) fields to overall required evidence parameters.
- **Rationale:** Simple to implement, deterministic, and highly auditable offline without external statistical engines.

## 2. Evidence Gap Mapping Matrix
- **Decision:** Define a clear static mapping of detected AI signals to review lanes and missing evidence requirements (e.g. AI SDK requires `vendor_review`, while env vars trigger `security_review` and pgvector triggers `privacy_review`).
- **Rationale:** Ensures clean-room Caesar original rule logic that provides direct, context-specific compliance recommendations for human developers and auditors.

## 3. Preservation of Draft Safety Boundary
- **Decision:** Even if a candidate scores a perfect `100%` on export readiness, its status remains `draft` or `needs_human_review`.
- **Rationale:** Retains the core architectural constraint that AI scanners never make automated legal conclusions or bypass human review.
