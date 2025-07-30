import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const secretKey = process.env.NEXTAUTH_SECRET
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    })
    return payload
}

export async function getSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    if (!session) return null
    return await decrypt(session)
}

export async function verifyCredentials(username: string, password: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return { id: user.id, username: user.username }
    } catch (error) {
        return null
    }
}