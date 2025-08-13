import { NextRequest } from 'next/server';


const attempts = new Map<string, { count: number; resetTime: number }>();
export function rateLimit(request: NextRequest, maxAttempts: number = 5, windowMs: number = 60 * 1000) { // Max 5 requests per minute
    const ip = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const now = Date.now();
    const userAttempts = attempts.get(ip);

    if (userAttempts && now > userAttempts.resetTime) {
        attempts.delete(ip);
    };

    const currentAttempts = attempts.get(ip) || { count: 0, resetTime: now + windowMs };

    if (currentAttempts.count >= maxAttempts) {
        return {
            success: false,
            message: "Too many requests. Try again in later."
        };
    };

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