import { readFileSync } from 'fs';

const VECTOR_DB_PATTERNS = [
  { id: 'vector_pinecone', pattern: /pinecone/i, name: 'Pinecone', description: 'Pinecone Vector DB connection or initialization.' },
  { id: 'vector_weaviate', pattern: /weaviate/i, name: 'Weaviate', description: 'Weaviate Vector DB connection or initialization.' },
  { id: 'vector_chroma', pattern: /chromadb|chroma/i, name: 'Chroma DB', description: 'Chroma DB Vector storage connection or initialization.' },
  { id: 'vector_qdrant', pattern: /qdrant/i, name: 'Qdrant', description: 'Qdrant Vector engine connection or initialization.' },
  { id: 'vector_milvus', pattern: /milvus/i, name: 'Milvus', description: 'Milvus Vector search engine usage.' },
  { id: 'vector_faiss', pattern: /faiss/i, name: 'FAISS', description: 'FAISS Vector search index usage.' },
  { id: 'vector_pgvector', pattern: /pgvector/i, name: 'pgvector', description: 'pgvector PostgreSQL extension usage.' }
];

/**
 * Scans code files (.js, .mjs, .py, .ts, etc.) to detect active vector database library initializations or imports.
 *
 * @param {Object} file - File object returned by walkFiles.
 * @param {Array<Object>} rules - Dependency rules to sync metadata from.
 * @returns {Array<Object>} List of findings.
 */
export function detectVectorDBs(file, rules) {
  const findings = [];
  const { relativePath, fullPath, name } = file;

  // Only scan source files for code-level DB client references
  const isSourceFile = /\.(js|mjs|ts|py|go|rs|cs)$/i.test(name);
  if (!isSourceFile) return findings;

  try {
    const content = readFileSync(fullPath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Avoid matching comments
      if (line.trim().startsWith('//') || line.trim().startsWith('#')) continue;

      for (const item of VECTOR_DB_PATTERNS) {
        if (item.pattern.test(line)) {
          // Double check: if it matches standard packages, we find which rule corresponds
          const matchingRule = rules.find(r => r.id.includes(item.id.split('_')[1]));
          
          findings.push({
            finding_id: `find_vector_${Math.random().toString(36).substring(2, 10)}`,
            rule_pack_version: 'v1',
            category: matchingRule ? matchingRule.category : 'Vector DB',
            detection_category: matchingRule ? matchingRule.detection_category : 'rag_vector',
            severity: matchingRule ? matchingRule.severity : 'medium',
            confidence: matchingRule ? matchingRule.confidence : 'medium',
            detector: 'vector-db-detector',
            detector_id: 'vector_lib_reference',
            signal_type: 'rag_vector',
            evidence_kind: 'text_pattern',
            rule_id: matchingRule ? matchingRule.id : item.id,
            matched_name: item.name,
            file_path: relativePath,
            evidence_hint: `Detected vector database library reference on line ${i + 1}: '${line.trim()}'`,
            governance_relevance: matchingRule ? matchingRule.governance_relevance : `Active usage of ${item.name} vector database in source code.`,
            recommended_review: matchingRule ? matchingRule.recommended_review : `Review usage of vector database ${item.name}. Verify that no unencrypted personal data or protected keys are stored as vector metadata.`
          });

          // Break to next line if matched to prevent multiple matches on the same line
          break;
        }
      }
    }
  } catch (error) {
    // Return empty if file is unreadable
  }

  return findings;
}
