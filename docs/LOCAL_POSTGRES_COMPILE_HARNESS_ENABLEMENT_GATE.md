# Local Postgres Compile Harness Enablement Gate (T024)

This file defines the strict safety requirements for the local Postgres compile harness.

## Status: CLOSED
- The harness is **DISABLED**.
- No database is connected.
- No shell commands are executed.
- No migration or docker processes run.

Future enablement requires a separate explicit Control Tower approval task.
