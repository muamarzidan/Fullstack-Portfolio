import { NextRequest } from 'next/server';

const attempts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(request: NextRequest, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    const ip = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const now = Date.now();
    const userAttempts = attempts.get(ip);

    if (userAttempts && now > userAttempts.resetTime) {
        attempts.delete(ip);
    }

    const currentAttempts = attempts.get(ip) || { count: 0, resetTime: now + windowMs };

    if (currentAttempts.count >= maxAttempts) {
        const remainingTime = Math.ceil((currentAttempts.resetTime - now) / 1000 / 60);
        return {
            success: false,
            message: `Too many login attempts. Try again in ${remainingTime} minutes.`,
            remainingTime
        };
    }

    currentAttempts.count++;
    attempts.set(ip, currentAttempts);

    return { success: true };
};

export function resetRateLimit(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';

    attempts.delete(ip);
};