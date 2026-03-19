import { NextRequest, NextResponse } from 'next/server'
import { createWish, validateWishInput, listWishes } from '@/lib/db'

/**
 * GET /api/wishes
 * Lists all generated wishes for the admin dashboard.
 * Requires admin_token cookie.
 */
export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin_token')
    
    if (!adminToken || adminToken.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishes = await listWishes()
    return NextResponse.json(wishes, {
      headers: {
        'Cache-Control': 'no-store', // Never cache admin lists
      }
    })
  } catch (error) {
    console.error('API Error listing wishes:', error)
    return NextResponse.json({ error: 'Failed to list wishes' }, { status: 500 })
  }
}

/**
 * POST /api/wishes
 * Creates a new wish with a secure hash
 * 
 * Security:
 * - Validates input length and format
 * - Generates unpredictable hash (16 hex chars from SHA-256)
 * - Returns only hash and URL (no sensitive data)
 * - Includes security headers
 */
export async function POST(request: NextRequest) {
  try {
    // Check for missing Redis configuration at runtime
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.error('[DATABASE_ERROR] Redis environment variables are not configured.')
      return NextResponse.json({ error: 'Database configuration missing. Please add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel settings.' }, { status: 500 })
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid or missing request body' }, { status: 400 })
    }

    const { recipientName, message, senderName } = body

    // Validate input
    const validation = validateWishInput(recipientName, message)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Create wish with secure hash
    const wish = await createWish(recipientName, message, senderName || 'Eid Mubarak')

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
    console.error('[API_ERROR] POST /api/wishes:', error)
    return NextResponse.json(
      { error: 'An unexpected server error occurred' },
      { status: 500 }
    )
  }
}
