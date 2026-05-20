# Architectural Decision Log: T003 — Evidence Export Pack

This document records the key architectural and design decisions made during the T003 milestone development.

---

## 🚦 ADR 1: Zero-Dependency Offline Staging Bundle

### Context
Downstream ingestion into **Governance OS** or **Caesar AI Evidence** registers requires codebase scans to be easily transferable, air-gapped, and completely verifiable without network connectivity or API overhead.

### Decision
We packaged the scan outputs into a self-contained offline folder containing 7 standard JSON documents and a Markdown reviewer summary. By utilizing Node.js core modules (`fs/promises`, `path`, `crypto`), we avoided external npm packages, guaranteeing absolute offline security and portability.

---

## 🚦 ADR 2: Cryptographic Hash Determinism

### Context
Checksum validation requires that files written to disk can be hashed reliably, producing matching hashes during both in-memory assembly and subsequent read operations.

### Decision
We engineered `hashArtifact` and `writeExportPack` to format JSON with standard 2-space indentation:
```javascript
JSON.stringify(payload, null, 2)
```
This guarantees that file hashes computed in-memory before writing are identical to hashes computed over the files written to disk, ensuring determinism.

---

## 🚦 ADR 3: Hard-locked Draft Status and Manual Gate Isolation

### Context
Static analysis scanners can produce false positives or lack high-level business context. Direct ingestion into production registries could pollute compliance databases with unverified signals.

### Decision
We hard-locked candidate records to `"status": "draft"` and `"review_required": true`. Additionally, we disabled automated ingestion by locking `"can_import_automatically": false` and `"signoff_required": true`. This forces a human auditor review step in Governance OS before promotion.

---

*Architectural history tracking completed for Caesar AI Scan.*
