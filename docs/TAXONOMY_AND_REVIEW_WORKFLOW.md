# Taxonomy and Review Workflow

This document explains the detection classifications (taxonomy) used by `caesar-ai-scan` and outlines the standard operational review pipeline required to validate candidates before central ingestion.

> [!WARNING]
> **Audit Assistant Only:**
> This scanner is designed to assist audits by identifying potential evidence gaps. It does not provide automated legal validation or guarantee compliance. Human reviewers must inspect and approve all candidate entries.

---

## 🏛️ Detection Taxonomy

Findings are categorized under four pillars of the Caesar AI Asset Taxonomy:

1. **AI SDKs (`AI SDK`):**
   - Direct dependencies on third-party model APIs (e.g. OpenAI, Anthropic, Gemini).
   - High importance for privacy and data transmission analysis.

2. **AI Frameworks (`AI Framework`):**
   - Orchestration systems (e.g. LangChain, LlamaIndex, CrewAI).
   - Trace dynamic prompt compilation and agent execution loops.

3. **Vector DBs (`Vector DB`):**
   - Vector indexes (e.g. Pinecone, Chroma, pgvector).
   - Review is critical to ensure high-dimensional embeddings do not leak user identifiers or sensitive proprietary text in raw vector metadata.

4. **Prompt Artifacts (`AI Prompt Artifact`):**
   - Dedicated files or directories housing instruction sets (e.g. `.prompt.md`).
   - Essential to trace system prompts and guard against jailbreaking vulnerabilities.

---

## 🔄 Human Review Workflow

```
[Automated CLI Scan] ──> [Evidence Export Candidate (Draft)]
                                     │
                                     ▼
                        [Security & Developer Review]
                                     │
                  ┌──────────────────┴──────────────────┐
                  ▼                                     ▼
        [Approve & Sign-off]                  [Reject / Ignore]
                  │                                     │
                  ▼                                     ▼
     [Ingest into Governance OS]              [Mark as Excluded]
```

1. **Draft Creation:** The offline scan generates draft evidence candidates.
2. **Technical Verification:** A developer verifies that the matched package or file is utilized for authorized functions.
3. **Compliance Review:** Security managers confirm that the data protection agreements (DPAs) for the target models are compliant with current legal frameworks.
4. **Official Ingestion:** Approved candidates are signed and ingested into Caesar AI Governance registers.
