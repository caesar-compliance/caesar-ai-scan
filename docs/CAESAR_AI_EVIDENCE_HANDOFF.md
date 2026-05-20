# Caesar AI Evidence Handoff Contract

This document specifies the relational data model and handoff conventions mapping static analysis outputs from `caesar-ai-scan` to standard register templates in `caesar-ai-evidence`.

---

## 🔗 Relational Data Mapping

To enable structured auditing, every exported candidate retains a solid relational chain back to its source finding and parent codebase targets:

| File Reference | Relational Key | Description |
| :--- | :--- | :--- |
| **`evidence-candidates.json`** | `candidate_id` | Prefixed unique ID (`ec_<random>`) identifying the draft candidate. |
| **`evidence-candidates.json`** | `finding_ref` | Relational reference pointing directly to `finding_id` in `scan-result.json`. |
| **`review-workflow.json`** | `finding_ref` | Relational reference linking the review item directly to the source finding. |

---

## 📁 Evidence Categories & Types Mapping

During candidate generation, raw code detector findings are classified into downstream Caesar AI Evidence types:

1. **`codebase_dependency`**: Mapped from the `dependency-detector` engine. Represents active AI SDKs and libraries (e.g. `openai`, `langchain`, `llama-index`).
2. **`environment_credential`**: Mapped from the `env-var-detector` engine. Identifies potential plain-text AI service keys, requiring secrets isolation review.
3. **`prompt_configuration`**: Mapped from the `prompt-file-detector` engine. Flags custom model instructions and prompt template files.
4. **`vector_storage`**: Mapped from the `vector-db-detector` engine. Tracks connection and usage of high-dimensional vector search engines (e.g. pgvector, Pinecone).

---

## 🛡️ Staging Safety Policies

- All candidates start with a status of `"draft"` to ensure they do not mutate official production compliance logs without verification.
- Downstream register adapters in `caesar-ai-evidence` must verify that the `source_tool.version` matches `0.4.0` and that the secure checksum recorded in `manifest.json` matches the actual candidate payload integrity hash.

---

*Specifies downstream data models and mappings only. Air-gapped offline protocol version 0.4.0.*
