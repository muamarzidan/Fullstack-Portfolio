import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';


const secretKey = process.env.NEXTAUTH_SECRET;
const key = new TextEncoder().encode(secretKey);

if (!secretKey) {
    throw new Error('NEXTAUTH_SECRET environment variable is required');
};

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .setSubject(payload.userId.toString())
        .sign(key);
};

export async function decrypt(input: string): Promise<any> {
    try {
        console.log('Attempting to decrypt session token');
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        console.log('Decryption successful');
        return payload;
    } catch (error) {
        console.error('JWT verification failed:', error);
        throw error;
    }
};

export async function getSession(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value;
    console.log('getSession called, cookie value:', sessionCookie ? 'exists' : 'not found');
    
    if (!sessionCookie) return null;
    
    try {
        const decrypted = await decrypt(sessionCookie);
        console.log('Session decrypted successfully:', decrypted);
        return decrypted;
    } catch (error) {
        console.error('Session decryption failed:', error);
        return null;
    }
};

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
        console.error('Credential verification failed:', error)
        return null
    };
};

// Helper function to hash passwords with proper salt
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // Increased from default for better security
    return await bcrypt.hash(password, saltRounds);
};