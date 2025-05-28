import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value;

  if (!userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', userId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/:path*', '/convert'],
};

