import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
      const msg = 'ADMIN_PASSWORD environment variable is missing in Vercel settings.'
      console.error(`[AUTH_ERROR] ${msg}`)
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    const body = await request.json().catch(() => ({}))
    const { password } = body

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true }, { status: 200 })
      
      // Set HTTP-only cookie for 30 days
      response.cookies.set('admin_token', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })
      
      return response
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
