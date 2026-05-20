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
[Automated CLI Scan] ──> [Evidence Gap & Review Lane Router (v0.3.0)]
                                     │
                                     ▼
                    [Enriched Export Candidate (Draft)]
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │      Targeted Multi-lane Review     │
                  │  - Technical Owner  - Security      │
                  │  - Legal Compliance - Privacy       │
                  │  - Vendor           - Risk          │
                  └──────────────────┬──────────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  ▼                                     ▼
        [Approve & Sign-off]                  [Reject / Ignore]
                  │                                     │
                  ▼                                     ▼
     [Ingest into Governance OS]              [Mark as Excluded]
```

1. **Draft Creation & Context Enrichment:** The offline scan runs and automatically classifies missing evidence gaps and routes findings to designated review lanes inside the generated candidates.
2. **Targeted Multi-lane Audit:** Relevant departments (e.g. Security for credentials, Legal/Vendor for SDK terms, Privacy for Vector DBs) address their designated review items.
3. **Evidence Readiness Scoring:** As reviewers resolve evidence gaps, the export readiness score moves up. Unresolved "blocking" gaps hard-cap readiness at `70%`.
4. **Compliance Verification & Ingestion:** When all lanes approve the candidate, the record is signed and ingested into Caesar AI Governance OS.
