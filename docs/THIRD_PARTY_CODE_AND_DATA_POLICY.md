# Third-Party Code and Data Policy

This document governs the use, inclusion, and study of third-party assets, licenses, and data repositories within the `caesar-ai-scan` component.

---

## 🛡️ License Compliance Principles

1. **Original Caesar Implementations:**
   - All parser modules, filesystem walkers, detectors, and reports are designed as clean-room implementations.
   - We do not copy competitor source code (such as VerifyWise or other commercial packages).
   - Competitor/open-source tools may be studied exclusively as high-level conceptual benchmarks.

2. **Attribute and Notice Requirements:**
   - Any permissive third-party dependency (MIT, Apache-2.0, BSD) must preserve its original copyright notice.
   - All external packages must be documented inside a `THIRD_PARTY_NOTICES.md` if added to dependencies.

3. **No Strong Copyleft Dependencies:**
   - The scanner avoids GPL, AGPL, or custom restricted-use libraries in its execution core to prevent viral copyleft exposure.

---

## 🚫 Safe Usage & Legal Disclaimer

- **Prototype Limits:** `caesar-ai-scan` is an offline static-analysis helper tool.
- **No Compliance Guarantees:** Scanning and exporting candidates does not guarantee regulatory compliance (such as EU AI Act conformity or GDPR validation).
- **Human Oversight:** The tools serve to detect codebase assets to enable manual governance review. Automated outputs must never bypass expert compliance assessment.
