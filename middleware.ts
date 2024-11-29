import { decodeJwt } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Public routes that can be accessed without authentication
  const publicRoutes = ['/', '/sign-up'];

  // If there's a token, prevent access to public routes
  if (token && publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url)); // Redirect to the dashboard
  }

  // If there's no token and trying to access a protected route
  if (!token && !publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to the home page
  }

  // If token is present, check role-based access
  if (token) {
    try {
      const payload = decodeJwt(token);
      const role = payload.role as string;

      // Define allowed routes based on the role
      const roleRoutes: Record<string, string[]> = {
        admin_siap: ['/dashboard-admin'],
        mahasiswa: ['/dashboard'],
        koor_mbkm: ['/dashboard-koordinator'],
        dosbing: ['/dashboard-dosbing']
      };

      const allowedRoutes = roleRoutes[role] || [];
      const isAllowed = allowedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
      );

      // If the user is not allowed to access this route, redirect to unauthorized
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // If the route is allowed, proceed with the request
      return NextResponse.next();
    } catch (error) {
      console.error('Token decoding failed:', error);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // If the token is missing and not accessing public routes, redirect to home
  return NextResponse.redirect(new URL('/', req.url));
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard-admin/:path*',
    '/dashboard-dosbing/:path*',
    '/dashboard-koordinator/:path*',
    '/profile/:path*',
    '/unauthorized',
    '/sign-up'
  ]
};
