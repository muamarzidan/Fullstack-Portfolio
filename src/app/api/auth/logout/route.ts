import { NextResponse } from 'next/server'

export async function POST() {
    const response = NextResponse.json(
        { message: 'Logout successful' },
        { status: 200 }
    )

    // Set cookie with proper deletion parameters
    response.cookies.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
        expires: new Date(0), // Ensure cookie is expired
    })

    return response
}