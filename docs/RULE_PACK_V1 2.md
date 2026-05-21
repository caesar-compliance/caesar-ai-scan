# Caesar AI Scan: Rule Pack v1

## Purpose
Rule Pack v1 expands Caesar AI Scan from a basic dependency scanner into a comprehensive AI usage and framework detector. It provides deep visibility into the AI/ML stack used within a repository, enabling governance teams to identify risks related to proprietary SDKs, autonomous agents, and unsafe model loading.

## Detection Categories

### A. AI Provider SDKs (`provider_sdk`)
Detects official client libraries for major AI providers.
- **Ecosystems:** OpenAI, Anthropic, Google Gemini, Azure OpenAI, Mistral, Cohere, Ollama, Groq, Replicate, Together AI, Perplexity, Vercel AI SDK.
- **Evidence:** `package.json` dependencies, `requirements.txt` packages.

### B. AI Orchestration Frameworks (`orchestration_framework`)
Identifies libraries used for building complex AI applications, agents, and RAG pipelines.
- **Frameworks:** LangChain, LangGraph, LlamaIndex, Semantic Kernel, Haystack, CrewAI, AutoGen, Pydantic AI, smolagents, Agno, Model Context Protocol (MCP).
- **Evidence:** Dependency lists.

### C. RAG & Vector Stack (`rag_vector`)
Detects integration with vector databases and retrieval systems.
- **Systems:** Pinecone, Weaviate, Chroma DB, Qdrant, Milvus, FAISS, pgvector.
- **Evidence:** Dependencies and active library initialization in source code (.js, .py, .ts, etc.).

### D. ML & Model Artifacts (`model_artifact`)
Detects the use of machine learning libraries and the presence of serialized model weights.
- **Libraries:** Transformers, PyTorch, TensorFlow, Keras, Scikit-learn.
- **Artifacts:** `.pkl`, `.pickle`, `.joblib`, `.onnx`, `.h5`, `.pt`, `.pth`, `.safetensors`.
- **Evidence:** Dependencies and filename patterns.

### E. Prompt & Policy Assets (`prompt_asset`)
Identifies files dedicated to prompt engineering or AI system configuration.
- **Files:** `*.prompt.md`, `system_prompt.txt`, `agent_config.json`, `model-card.md`, `ai-policy.yaml`.
- **Evidence:** Filename and directory patterns.

### F. Configuration Signals (`config_signal`)
Detects references to AI-related environment variables and credentials.
- **Signals:** `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, etc.
- **Evidence:** Text patterns in configuration files (e.g., `.env.example`).
- **Safety:** Actual secret values are automatically masked in evidence logs.

## Confidence Model
- **High:** Explicit package dependency or unambiguous filename match.
- **Medium:** Naming convention match (e.g., `prompts/` folder) or source code library reference.
- **Low:** Generic keyword match in non-standard locations.

## Severity & Risk Guidance
- **Critical:** Not currently used in v1.
- **High:** Agent frameworks with autonomous code execution (e.g., AutoGen, CrewAI) or potential plaintext credentials.
- **Medium:** Standard AI SDKs and Vector DBs.
- **Low:** Prompt templates and model cards.

## Reference Lab Lessons
Rule Pack v1 was informed by research in the Caesar AI Scan Reference Lab:
1. **Multi-Ecosystem Support:** Inspired by tools like Syft and Trivy, we prioritized both Node.js and Python support.
2. **Behavioral Detection:** Inspired by Gitleaks and Semgrep, we moved beyond just dependencies to detect library initialization in code.
3. **Privacy First:** We adopted strict masking policies for credentials, ensuring Caesar remains a "safe" scanner that doesn't create new leak risks.
4. **Governance Context:** Unlike general security scanners, Rule Pack v1 explicitly maps findings to "Governance Relevance" to help auditors understand *why* a detection matters.

## Limitations
- **Static Only:** Does not detect runtime-only dynamic imports or network-level AI calls.
- **Signature Based:** Relies on known package names and patterns; obscure or custom-built frameworks may be missed.
- **No Value Validation:** Detects key names, but does not validate if keys are active or valid.

## Future Expansion
- **Vercel AI SDK sub-provider detection:** Identifying which underlying model is used via Vercel's abstraction.
- **Docker-level AI Detection:** Scanning `Dockerfile` and `docker-compose.yaml` for AI service images (e.g., local Ollama or Chroma containers).
- **Hugging Face Hub Integration:** Detecting specific model IDs referenced in code.
