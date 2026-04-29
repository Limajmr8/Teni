import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './src/lib/supabase/middleware';

const protectedPaths = ['/checkout', '/orders', '/seller'];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const hasSession = request.cookies.get('sb-access-token');
    if (!hasSession) {
      const redirectUrl = new URL('/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
