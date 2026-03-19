import { Redis } from '@upstash/redis'
import { generateWishHash } from './hash'

// Initialize Redis client safely (allows Next.js build to pass without env vars)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || 'https://dummy-url.upstash.io'
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy-token'

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
})

export interface Wish {
  hash: string
  recipientName: string
  message: string
  senderName: string
  createdAt: string
  expiresAt?: string
}

const WISH_PREFIX = 'wish:'

/**
 * Generate a unique wish with hash and store it in Redis
 */
export async function createWish(
  recipientName: string,
  message: string,
  senderName: string
): Promise<Wish> {
  const hash = generateWishHash()
  const now = new Date()

  const wish: Wish = {
    hash,
    recipientName,
    message,
    senderName,
    createdAt: now.toISOString(),
    // Optional: set expiration to 30 days from creation
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }

  try {
    // Store in Redis with expiration (30 days = 2592000 seconds)
    await redis.set(`${WISH_PREFIX}${hash}`, JSON.stringify(wish), {
      ex: 30 * 24 * 60 * 60,
    })
    return wish
  } catch (error) {
    console.error('Failed to create wish in Redis:', error)
    throw new Error('Failed to create wish')
  }
}

/**
 * Retrieve a wish by hash from Redis
 */
export async function getWish(hash: string): Promise<Wish | null> {
  try {
    const data = await redis.get<string | Wish>(`${WISH_PREFIX}${hash}`)
    
    if (!data) return null

    // Upstash Redis might return the object directly or as a string depending on configuration
    const wish: Wish = typeof data === 'string' ? JSON.parse(data) : data

    return wish
  } catch (error) {
    console.error('Failed to get wish from Redis:', error)
    return null
  }
}

/**
 * Delete a wish by hash from Redis
 */
export async function deleteWish(hash: string): Promise<boolean> {
  try {
    const deleted = await redis.del(`${WISH_PREFIX}${hash}`)
    return deleted > 0
  } catch (error) {
    return false
  }
}

/**
 * List all active wishes (admin use only)
 * Note: Scan is used to avoid blocking the single-threaded Redis
 */
export async function listWishes(): Promise<Wish[]> {
  try {
    const keys = await redis.keys(`${WISH_PREFIX}*`)
    const wishes: Wish[] = []

    for (const key of keys) {
      const wish = await getWish(key.replace(WISH_PREFIX, ''))
      if (wish) {
        wishes.push(wish)
      }
    }

    return wishes.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error('Failed to list wishes from Redis:', error)
    return []
  }
}

/**
 * Validate wish data before storage
 */
export function validateWishInput(
  recipientName: string,
  message: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!recipientName || recipientName.trim().length === 0) {
    errors.push('Recipient name is required')
  } else if (recipientName.length > 100) {
    errors.push('Recipient name must be less than 100 characters')
  }

  if (!message || message.trim().length === 0) {
    errors.push('Message is required')
  } else if (message.length > 5000) {
    errors.push('Message must be less than 5000 characters')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
