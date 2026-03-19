import { NextRequest, NextResponse } from 'next/server'
import { createWish, validateWishInput } from '@/lib/db'

/**
 * POST /api/wishes
 * Creates a new wish with a secure hash
 * 
 * Security:
 * - Validates input length and format
 * - Generates unpredictable hash (16 hex chars from SHA-256)
 * - Returns only hash and URL (no sensitive data)
 * - Includes security headers
 * - No listing endpoint available
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting should be implemented at reverse proxy/CDN level
    // For now, basic validation is in place

    const body = await request.json()
    const { recipientName, message } = body

    // Validate input
    const validation = validateWishInput(recipientName, message)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Create wish with secure hash
    const wish = await createWish(recipientName, message)

    // Return minimal info: only hash and generated URL
    return NextResponse.json(
      {
        success: true,
        hash: wish.hash,
        url: `/wish/${wish.hash}`,
      },
      { 
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        },
      }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create wish' },
      { status: 500 }
    )
  }
}
