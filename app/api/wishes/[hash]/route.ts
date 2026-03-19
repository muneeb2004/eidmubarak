import { NextRequest, NextResponse } from 'next/server'
import { isValidHash } from '@/lib/hash'
import { getWish } from '@/lib/db'

/**
 * GET /api/wishes/[hash]
 * Retrieves a wish by its secure hash
 * 
 * Security:
 * - Validates hash format (16 hex chars)
 * - Returns 404 for invalid hashes (prevents enumeration)
 * - Includes rate limiting headers
 * - No sensitive info in error messages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params

    // Validate hash format strictly
    if (!isValidHash(hash)) {
      // Return 404 for invalid format (not 400) to prevent hash enumeration
      return NextResponse.json(
        { error: 'Wish not found' },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'public, max-age=60', // Cache 404 responses
          },
        }
      )
    }

    // Retrieve wish from database
    const wish = await getWish(hash)

    if (!wish) {
      // Return 404 without exposing why (expired, deleted, or never existed)
      return NextResponse.json(
        { error: 'Wish not found' },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'public, max-age=60',
          },
        }
      )
    }

    // Success response with privacy headers
    return NextResponse.json(wish, { 
      status: 200,
      headers: {
        // Allow moderate caching for wish data
        'Cache-Control': 'private, max-age=3600',
        // Prevent embedded content
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    // Don't expose internal error details
    return NextResponse.json(
      { error: 'Wish not found' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/wishes/[hash]
 * Deletes a wish by its secure hash
 * 
 * Security:
 * - Requires 'admin_token' cookie
 * - Validates hash format
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    // Admin checking
    const token = request.cookies.get('admin_token')
    if (!token || token.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { hash } = await params

    if (!isValidHash(hash)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    const { deleteWish } = await import('@/lib/db')
    const success = await deleteWish(hash)
    
    if (success) {
      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      return NextResponse.json({ error: 'Deletion failed or not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('API Error during deletion:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
