import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, encrypt } from '../../../../../lib/auth'

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json()

        const user = await verifyCredentials(username, password)

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        const sessionData = {
            userId: user.id,
            username: user.username,
        }

        const session = await encrypt(sessionData)

        const response = NextResponse.json(
            { message: 'Login successful', user: { username: user.username } },
            { status: 200 }
        )

        response.cookies.set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}