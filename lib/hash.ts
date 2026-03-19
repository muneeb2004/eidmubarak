import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

/**
 * Generate a secure hash from a UUID
 * Uses SHA-256 truncated to 16 characters for URL-friendly format
 * 16 hex chars = 64-bit entropy, sufficient against brute-force attacks
 */
export function generateWishHash(): string {
  const uuid = uuidv4()
  const hash = crypto
    .createHash('sha256')
    .update(uuid)
    .digest('hex')
    .substring(0, 16)

  return hash
}

/**
 * Validate if a string is a valid wish hash
 * Ensures hash is exactly 16 hexadecimal characters
 * Prevents: invalid format, SQL injection, path traversal
 */
export function isValidHash(hash: string): boolean {
  // Strictly validate: 16 hex characters only
  if (typeof hash !== 'string' || hash.length !== 16) {
    return false
  }
  return /^[a-f0-9]{16}$/.test(hash)
}

/**
 * Generate a secure filename from hash
 */
export function getWishFilePath(hash: string): string {
  if (!isValidHash(hash)) {
    throw new Error('Invalid hash format')
  }
  return `wishes/${hash}.json`
}
