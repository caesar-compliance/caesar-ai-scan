# Reference Lab Policy — Caesar AI Scan

## Purpose
This policy governs the use of the local AI Scan Reference Lab located at `../_reference-lab/scan`. The lab is a developer-only resource for accelerating the development of Caesar AI Scan through the study of established tools and frameworks.

## Allowed Use Cases
- **Architecture Study**: Analyzing engine structures, file walkers, and rule loaders.
- **Scanner UX Study**: Observing CLI flags, progress reporting, and output formatting.
- **Rule Model Study**: Understanding how AI-specific risks are mapped to detection patterns.
- **Finding Schema Ideas**: Studying JSON, SARIF, and other findings representations.
- **Validation Pattern Ideas**: Learning from established test suites and programmatic assertions.
- **Public Product Positioning**: Analyzing how competitors describe features and value.

## Prohibited Actions
- **No Direct Copying**: Third-party source code must NOT be copied into `caesar-ai-scan` source files without explicit approval and conversion to a formal dependency.
- **No License Stripping**: Original license headers and files in the reference lab must be preserved.
- **No Rebranding**: Do not modify third-party code to appear as Caesar property.
- **No Dependency Wiring**: Reference repositories must NOT be added to `package.json` or wired into the production build.
- **No Execution of Untrusted Code**: Do not run `npm install`, `pip install`, or execute third-party scripts/binaries within the reference lab.
- **No CI Dependency**: The production CI/CD pipeline must not depend on the presence of the reference lab.
- **No Production Build Dependency**: The production build must not require any assets from the reference lab.

## Governance
- The reference lab is outside the production source tree.
- Third-party code is strictly for reference material unless explicitly converted to a dependency.
- Developers are responsible for ensuring that study of reference material does not lead to accidental IP leakage or license violations.
