import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/account', '/cart', '/checkout'];
const adminPaths = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  if (!isProtected && !isAdminPath) return NextResponse.next();

  const token = request.cookies.get('auth_token')?.value;
  const emailVerified = request.cookies.get('email_verified')?.value === 'true';
  const userRole = request.cookies.get('user_role')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!emailVerified) {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  if (isAdminPath && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/cart/:path*', '/checkout/:path*', '/admin/:path*'],
};
