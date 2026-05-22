# Decisions

- Use manifest-based control to ensure stub remains disabled by default.
- Use simple .mjs scripts without external dependencies to avoid any accidental database connection.
- Require deterministic report output to verify status.
- Strict adherence to offline-only execution: no database, network, Docker, or shell command execution is permitted.
