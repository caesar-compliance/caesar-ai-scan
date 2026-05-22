# Enablement Gate Guide

T024 establishes the gate logic to prevent accidental execution of Postgres tools.

## Safety Boundaries
- Default state: `closed`.
- Forbidden: All DB, shell, docker, and network commands.
- Only allowed: Static manifest/report generation.
