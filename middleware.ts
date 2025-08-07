import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getSession } from './lib/auth';


export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    };

    if (request.nextUrl.pathname === '/login') {
        const session = await getSession(request);

        if (session) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    };

    return NextResponse.next();
};

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
};