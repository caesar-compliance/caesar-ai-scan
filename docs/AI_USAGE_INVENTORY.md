# AI Usage Inventory (AI-BOM)

The AI Usage Inventory provides a deterministic, structured, and backend-ready contract for inventorying AI assets within a repository.

## Purpose
- Provide a standardized AI-BOM format.
- Enable automated ingestion by Caesar Governance OS.
- Support compliance and reporting without exposing sensitive data.
- Maintain an offline/deterministic source of truth.

## Contract Structure
The inventory follows the `schemas/ai-usage-inventory.schema.json` schema:

- **Metadata:** Schema version, tool version, and run timestamp.
- **Components:** Grouped by detection category:
  - `provider_sdks`
  - `orchestration_frameworks`
  - `rag_vector_stack`
  - `model_artifacts`
  - `prompt_assets`
  - `config_signals`
- **Governance:** Review requirements, export status, and safety flags.

## Integration
The inventory is exported via the Caesar AI Scan CLI using:
`--inventory-out <path>`
`--inventory-report <path>` (optional markdown summary)
