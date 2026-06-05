import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  if (host.includes('exactly5.com')) {
    return NextResponse.redirect('https://memgenius.com/exactly5', 301)
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
