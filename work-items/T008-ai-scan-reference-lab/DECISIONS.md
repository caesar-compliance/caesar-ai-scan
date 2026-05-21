# DECISIONS: T008 AI Scan Reference Lab

## [DEC-T008-001] AI Scan Reference Lab Isolation
- **Decision**: The Reference Lab must remain outside the `caesar-ai-scan` repository to prevent accidental commitment of third-party code and to keep the production repository lean.
- **Rationale**: Security and legal safety.

## [DEC-T008-002] Shallow Clone Strategy
- **Decision**: Use `git clone --depth 1 --filter=blob:none` for all reference repositories.
- **Rationale**: Minimize storage and bandwidth usage while still allowing for architectural study.

## [DEC-T008-003] Usage vs. Dependency
- **Decision**: Reference repositories are for study only. Any transition to a formal dependency must be handled through a separate, explicitly approved task.
- **Rationale**: Maintain strict control over the project's dependency graph and license compliance.
