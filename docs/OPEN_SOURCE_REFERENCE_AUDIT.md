# Open Source Reference Audit — Caesar AI Scan

This document tracks the open-source reference repositories cloned into the Reference Lab.

| Project | URL | Local Path | Category | License/Status | Useful Lessons | Use Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **getregula** | https://github.com/kuzivaai/getregula.git | `direct-ai-compliance-scanners/getregula` | Direct AI Compliance | EUPL | EU AI Act mapping | reference_only |
| **mcp-eu-ai-act** | https://github.com/ark-forge/mcp-eu-ai-act.git | `direct-ai-compliance-scanners/mcp-eu-ai-act` | Direct AI Compliance | MIT | MCP server pattern | reference_only |
| **airblackbox-gateway** | https://github.com/airblackbox/gateway.git | `direct-ai-compliance-scanners/airblackbox-gateway` | Direct AI Compliance | Apache-2.0 | AI Gateway patterns | reference_only |
| **semgrep** | https://github.com/semgrep/semgrep.git | `scanner-engines/semgrep` | Scanner Engine | LGPL-2.1 | Rule engine structure | architecture_reference |
| **opengrep** | https://github.com/opengrep/opengrep.git | `scanner-engines/opengrep` | Scanner Engine | LGPL-2.1 | OSS fork management | architecture_reference |
| **gitleaks** | https://github.com/gitleaks/gitleaks.git | `security-scanners/gitleaks` | Security Scanner | MIT | Secret detection regex | architecture_reference |
| **trivy** | https://github.com/aquasecurity/trivy.git | `security-scanners/trivy` | Security Scanner | Apache-2.0 | Multi-target scanning | architecture_reference |
| **scorecard** | https://github.com/ossf/scorecard.git | `security-scanners/scorecard` | Security Scanner | Apache-2.0 | Scoring math | reference_only |
| **syft** | https://github.com/anchore/syft.git | `bom-inventory/syft` | BOM/Inventory | Apache-2.0 | Cataloging patterns | architecture_reference |
| **cdxgen** | https://github.com/CycloneDX/cdxgen.git | `bom-inventory/cdxgen` | BOM/Inventory | Apache-2.0 | SBOM generation | architecture_reference |
| **cyclonedx-spec** | https://github.com/CycloneDX/specification.git | `bom-inventory/cyclonedx-specification` | Standards | Apache-2.0 | SBOM schema design | standards_reference |
| **garak** | https://github.com/NVIDIA/garak.git | `llm-ai-security/garak` | LLM Security | Apache-2.0 | LLM vulnerability types | product_benchmark |
| **modelscan** | https://github.com/protectai/modelscan.git | `llm-ai-security/modelscan` | LLM Security | Apache-2.0 | Model file scanning | product_benchmark |
| **verifywise** | https://github.com/verifywise-ai/verifywise.git | `governance-platforms/verifywise` | Governance | MIT | Compliance dashboard | product_benchmark |
| **credoai-lens** | https://github.com/credo-ai/credoai_lens.git | `governance-platforms/credoai-lens` | Governance | Apache-2.0 | Assessment logic | product_benchmark |
| **credoai-connect** | https://github.com/credo-ai/credoai_connect.git | `governance-platforms/credoai-connect` | Governance | Apache-2.0 | Platform integration | product_benchmark |
| **responsible-ai-toolbox** | https://github.com/microsoft/responsible-ai-toolbox.git | `governance-platforms/responsible-ai-toolbox` | Governance | MIT | Debugging/Visualization | architecture_reference |
| **aif360** | https://github.com/Trusted-AI/AIF360.git | `governance-platforms/aif360` | Governance | Apache-2.0 | Bias detection metrics | architecture_reference |
| **owasp-ai-guide** | https://github.com/OWASP/www-project-ai-security-and-privacy-guide.git | `standards-taxonomies/owasp-ai-security-and-privacy-guide` | Standards | CC-BY-SA-4.0 | Privacy/Security guide | standards_reference |
| **owasp-llm-top-10** | https://github.com/OWASP/www-project-top-10-for-large-language-model-applications.git | `standards-taxonomies/owasp-llm-top-10` | Standards | CC-BY-SA-4.0 | LLM risk taxonomy | standards_reference |

## Audit Recommendations
- **syft/cdxgen**: Study for T010 (AI-BOM) export formats.
- **gitleaks**: Study for enhancing secret detection patterns in AI configs.
- **credoai-lens**: Study for assessment workflow integration.
- **semgrep**: Study for future AST parsing integration.
