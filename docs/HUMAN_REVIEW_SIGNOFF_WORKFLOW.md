# Human Review Sign-off Workflow

This document describes the manual compliance sign-off workflow and verification checklist procedures for auditing Caesar AI Scan export packages.

---

## 🚦 Why Human Review is Mandatory

By ecosystem design, static code analysis provides automated discovery signals but cannot verify the complete operational context of AI integrations. Therefore:
- The readiness state is set to `can_import_automatically: false`.
- Auditor verification is hard-locked to `signoff_required: true`.
- The export package cannot be finalized for compliance registers without explicit auditor signature confirmations.

---

## 🚏 Review Lanes and Routing

When a scan is completed, findings are parsed and routed to specialized organizational review lanes:

1. **`technical_owner_review`**: Verifies that every AI component (e.g. library, prompt, database) has a designated system owner.
2. **`security_review`**: Ensures credentials are secure and masks/rotates any exposed plain-text environment keys.
3. **`legal_compliance_review` & `vendor_review`**: Checks commercial licensing compliance and vendor commercial agreements.
4. **`privacy_review`**: Evaluates data protection assessments for user personal data transfers to vector search indexes.

---

## 📋 Sign-off Certification Checklist

To complete a review cycle, the human auditor must manually certify the following 4 core compliance declarations (as compiled in `REVIEW_SUMMARY.md`):

- [ ] **Dependency Governance:** "I confirm that all detected AI dependencies have designated technical and business owners."
- [ ] **Secrets Isolation:** "I confirm that no plain-text credentials are saved in configuration templates or local source code."
- [ ] **Data Protection:** "I confirm that vector database storage operations comply with data processing assessments."
- [ ] **Prompt Security:** "I confirm that system prompts have been verified to prevent instruction leakage or security jailbreaks."

---

*Guides the offline human-in-the-loop validation process. Built for Caesar AI Scan version 0.4.0.*
