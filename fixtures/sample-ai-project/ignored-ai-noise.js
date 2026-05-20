// Mock AI Noise File
// This file is matched in .caesarignore and must be excluded from active static scanning.
// If scanned, it would produce findings because of the package import and API key.

import openai from 'openai';

const apiKey = "sk-mockKeyInIgnoredFileThatShouldNeverBeDiscoveredByCaesarScan";

function initializeChat() {
  console.log("Initializing OpenAI client with key:", apiKey);
  return new openai.OpenAI({ apiKey });
}

export { initializeChat };
