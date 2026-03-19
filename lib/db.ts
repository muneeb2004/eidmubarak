import fs from 'fs/promises'
import path from 'path'
import { generateWishHash } from './hash'

export interface Wish {
  hash: string
  recipientName: string
  message: string
  createdAt: string
  expiresAt?: string
}

const WISHES_DIR = path.join(process.cwd(), 'data', 'wishes')

/**
 * Ensure the wishes directory exists
 */
async function ensureWishesDir(): Promise<void> {
  try {
    await fs.mkdir(WISHES_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create wishes directory:', error)
  }
}

/**
 * Generate a unique wish with hash and store it
 */
export async function createWish(
  recipientName: string,
  message: string
): Promise<Wish> {
  await ensureWishesDir()

  const hash = generateWishHash()
  const now = new Date()

  const wish: Wish = {
    hash,
    recipientName,
    message,
    createdAt: now.toISOString(),
    // Optional: set expiration to 30 days from creation
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }

  const filePath = path.join(WISHES_DIR, `${hash}.json`)

  try {
    await fs.writeFile(filePath, JSON.stringify(wish, null, 2))
    return wish
  } catch (error) {
    console.error('Failed to create wish:', error)
    throw new Error('Failed to create wish')
  }
}

/**
 * Retrieve a wish by hash
 */
export async function getWish(hash: string): Promise<Wish | null> {
  const filePath = path.join(WISHES_DIR, `${hash}.json`)

  try {
    const data = await fs.readFile(filePath, 'utf-8')
    const wish: Wish = JSON.parse(data)

    // Check if wish has expired
    if (wish.expiresAt) {
      const expirationDate = new Date(wish.expiresAt)
      if (new Date() > expirationDate) {
        // Optionally delete expired wish
        await deleteWish(hash)
        return null
      }
    }

    return wish
  } catch (error) {
    // File not found or parsing error
    return null
  }
}

/**
 * Delete a wish by hash
 */
export async function deleteWish(hash: string): Promise<boolean> {
  const filePath = path.join(WISHES_DIR, `${hash}.json`)

  try {
    await fs.unlink(filePath)
    return true
  } catch (error) {
    return false
  }
}

/**
 * List all active wishes (admin use only)
 */
export async function listWishes(): Promise<Wish[]> {
  try {
    await ensureWishesDir()
    const files = await fs.readdir(WISHES_DIR)
    const wishes: Wish[] = []

    for (const file of files) {
      if (file.endsWith('.json')) {
        const hash = file.replace('.json', '')
        const wish = await getWish(hash)
        if (wish) {
          wishes.push(wish)
        }
      }
    }

    return wishes.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error('Failed to list wishes:', error)
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
