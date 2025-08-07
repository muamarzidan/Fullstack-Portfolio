import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
        
        const response = NextResponse.next();
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
