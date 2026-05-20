/**
 * Generates tailored compliance and review questions for a given scan finding.
 * 
 * @param {Object} finding - A scan finding.
 * @returns {Array<string>} List of targeted questions.
 */
export function getRecommendedQuestions(finding) {
  const detector = finding.detector || '';
  const name = finding.matched_name || 'unknown';
  const file = finding.file_path || 'unknown file';

  if (detector === 'dependency-detector') {
    return [
      `Who is the designated technical and business owner for the AI dependency '${name}'?`,
      `Which specific external AI model (e.g. gpt-4o) and endpoint does '${name}' connect to?`,
      `Has the commercial SLA and Data Processing Agreement (DPA) been approved for this third-party provider?`,
      `What is the formal risk tier classification (Minimal, Limited, High, Unacceptable) registered for this AI library?`
    ];
  } else if (detector === 'env-var-detector') {
    return [
      `Are the credentials for '${name}' safely managed via a secure secrets manager rather than plaintext environments?`,
      `Which model provider endpoint does the '${name}' credential authorize?`,
      `Has a security review been completed to verify the access control and usage limits of this credential?`
    ];
  } else if (detector === 'prompt-file-detector') {
    return [
      `What is the concrete business purpose of processing user data using the prompt template in '${file}'?`,
      `Are inputs sanitized before prompt assembly to mitigate prompt injection and data exfiltration risks?`,
      `What logging, retention, and data-scrubbing policies apply to model prompts and completions?`,
      `Is there a human-in-the-loop validation or automated guardrail system checking output quality and safety?`
    ];
  } else if (detector === 'vector-db-detector') {
    return [
      `Does the vector database '${name}' store or process user personally identifiable information (PII)?`,
      `Has a formal Data Protection Impact Assessment (DPIA) been completed for this vector search pipeline?`,
      `What is the data retention and purging policy for vector embeddings and metadata index databases?`
    ];
  }

  return [
    `Who is the owner responsible for the AI usage signal '${name}' found in '${file}'?`,
    `What are the security, privacy, and compliance implications of this AI component?`
  ];
}

/**
 * Generates tailored recommended actions for a given scan finding.
 * 
 * @param {Object} finding - A scan finding.
 * @returns {Array<string>} List of recommended actions.
 */
export function getRecommendedActions(finding) {
  const detector = finding.detector || '';
  const name = finding.matched_name || 'unknown';

  if (detector === 'dependency-detector') {
    return [
      `Assign a lead software engineer or system owner to assume responsibility for the component in the inventory.`,
      `Review model provider terms to verify training exclusion and data privacy protections.`,
      `Map this component to the corporate AI use case registry.`
    ];
  } else if (detector === 'env-var-detector') {
    return [
      `Migrate development environment credentials to verified secrets managers immediately.`,
      `Rotate any keys that have been exposed in plain text in local development environments.`,
      `Ensure key usage permissions follow the principle of least privilege.`
    ];
  } else if (detector === 'prompt-file-detector') {
    return [
      `Document human oversight procedures and validation gates implemented for LLM outputs.`,
      `Verify if user disclosures are required and ensure notices are present on front-end components.`,
      `Define prompt/completion log aggregation constraints and specify standard data purging intervals.`
    ];
  } else if (detector === 'vector-db-detector') {
    return [
      `Conduct a Data Protection Impact Assessment (DPIA) to evaluate privacy risks of data transfer to vector storage.`,
      `Verify that stored embedding collections exclude un-hashed user identifiers.`,
      `Establish clear procedures for processing data subject deletion requests within vector indexes.`
    ];
  }

  return [
    `Perform a manual review of the codebase component.`,
    `Document system data flow, third-party integrations, and compliance requirements.`
  ];
}
