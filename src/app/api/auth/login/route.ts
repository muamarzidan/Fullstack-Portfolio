import { NextRequest, NextResponse } from 'next/server';

import { verifyCredentials, encrypt } from '../../../../../lib/auth';
import { rateLimit, resetRateLimit } from '../../../../../lib/rateLimit';
import { sanitizeInput } from '../../../../../lib/security';


export async function POST(request: NextRequest) {
    try {
        const rateLimitResult = rateLimit(request, 5, 60 * 1000); // 5 attempts per 1 minute
        
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: rateLimitResult.message },
                { status: 429 }
            )
        };

        const { username, password } = await request.json();

        const sanitizedUsername = sanitizeInput(username);
        const sanitizedPassword = sanitizeInput(password);

        if (!sanitizedUsername || !sanitizedPassword) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            )
        };

        const user = await verifyCredentials(sanitizedUsername, sanitizedPassword);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        };

        resetRateLimit(request);

        const sessionData = {
            userId: user.id,
            username: user.username,
            iat: Math.floor(Date.now() / 1000),
        };

        const session = await encrypt(sessionData);

        const response = NextResponse.json(
            { message: 'Login successful', user: { username: user.username } },
            { status: 200 }
        );

        response.cookies.set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60,
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    };
};