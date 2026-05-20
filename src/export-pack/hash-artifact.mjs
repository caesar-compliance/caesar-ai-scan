import { createHash } from 'crypto';

/**
 * Calculates standard SHA-256 hexadecimal hash for given string or JSON payload.
 *
 * @param {string|Object} payload - The content to hash.
 * @returns {string} SHA-256 hash in hexadecimal.
 */
export function hashArtifact(payload) {
  const content = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
  return createHash('sha256').update(content, 'utf8').digest('hex');
}
