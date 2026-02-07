import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/account', '/cart', '/checkout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('auth_token')?.value;
  const emailVerified = request.cookies.get('email_verified')?.value === 'true';

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!emailVerified) {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/cart/:path*', '/checkout/:path*'],
};
