import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    console.log('No token found. Redirecting to login.');
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Convert the secret to a Uint8Array for verification
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    
    const { payload } = await jwtVerify(token, secretKey);
    
    console.log('Decoded token payload:', payload);
    
    const role = payload.role as string;
    
    const roleRoutes: Record<string, string[]> = {
      admin: ['/dashboard'],
      mahasiswa: ['/profile', '/settings'],
      koor_mbkm: ['/dashboard'],
      dosbing: ['/dashboard']
    };

    const allowedRoutes = roleRoutes[role] || [];
    
    console.log('Current pathname:', req.nextUrl.pathname);
    console.log('Role:', role);
    console.log('Allowed routes:', allowedRoutes);
    
    const isAllowed = allowedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );
    
    console.log('Is allowed:', isAllowed);

    if (!isAllowed) {
      console.log('Access denied. Redirecting to unauthorized.');
      const unauthorizedUrl = new URL('/unauthorized', req.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*']
};