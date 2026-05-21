import os
from langchain.llms import OpenAI
from langgraph.graph import StateGraph
import qdrant_client

# This is a sample agent
def run_agent():
    api_key = os.getenv("OPENAI_API_KEY")
    client = qdrant_client.QdrantClient(host="localhost", port=6333)
    # ... logic here ...
    pass
