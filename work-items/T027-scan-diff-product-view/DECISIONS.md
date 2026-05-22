# Decisions - T027 Scan Diff Product View

## D001: Data Source
The product view will derive from the output of `src/history/scan-diff-builder.mjs`. 
If no real history is available, it will use deterministic sample data.

## D002: Dashboard Integration
The new view will be integrated into the existing static dashboard as a prominent section or enhanced tab.

## D003: "Product" Enrichment
We will aggregate raw findings from the diff into "Product" categories like:
- Providers (OpenAI, Anthropic, etc.)
- Frameworks (LangChain, LlamaIndex, etc.)
- Risk/Review Status impact.
