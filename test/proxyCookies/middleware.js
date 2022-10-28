import { NextResponse } from 'next/server'

export function middleware(request) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('cookie', '')
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: '/proxy/api/event',
}
