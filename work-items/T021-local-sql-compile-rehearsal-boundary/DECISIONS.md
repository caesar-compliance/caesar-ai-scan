# Decisions: T021

- **Decision:** Use a manifest-based approach to point to rehearsal SQL files.
- **Rationale:** Keeps validation logic decoupled from SQL file structure changes.
- **Decision:** Store the SQL validation report in `site/data/rehearsal/`.
- **Rationale:** Consistent with other generated artifact paths.
