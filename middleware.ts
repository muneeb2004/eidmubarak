import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require admin authentication
const protectedRoutes = ['/create', '/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtected) {
    const adminToken = request.cookies.get('admin_token')
    
    // If no valid token is found, redirect to login
    if (!adminToken || adminToken.value !== 'true') {
      const loginUrl = new URL('/login', request.url)
      // Save the redirect URL so we can send them back after login
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect root to wish/create or login if auth exists/doesn't exist? 
  // For now, let's keep it simple: allow root, but `Open Letter` on root will go to `/login` if not authed.
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
