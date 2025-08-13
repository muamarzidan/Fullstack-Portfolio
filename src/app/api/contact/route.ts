import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';


export async function GET(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        };

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        // Build where clause for search
        const whereClause = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
                { message: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {};

        const totalContacts = await prisma.contact.count({
            where: whereClause
        });

        const contacts = await prisma.contact.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(totalContacts / limit);

        return NextResponse.json({
            contacts,
            pagination: {
                currentPage: page,
                totalPages,
                totalContacts,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch contacts' },
            { status: 500 }
        )
    }
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const sanitizeInput = (input: string): string => {
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/[<>]/g, '')
        .trim();
};
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const checkRateLimit = (ip: string): boolean => {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minutes
    const maxRequests = 5; // Max 5 requests per 1 minutes

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    };

    const limit = rateLimitMap.get(ip)!;

    if (now > limit.resetTime) {
        limit.count = 1;
        limit.resetTime = now + windowMs;
        return true;
    };

    if (limit.count >= maxRequests) {
        return false;
    };

    limit.count++;
    return true;
};
export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { message: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        };

        const body = await request.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { message: 'All fields are required.' },
                { status: 400 }
            );
        };

        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedMessage = sanitizeInput(message);

        if (sanitizedName.length < 2 || sanitizedName.length > 70) {
            return NextResponse.json(
                { message: 'Name must be between 2 and 70 characters.' },
                { status: 400 }
            );
        };

        if (sanitizedMessage.length < 2 || sanitizedMessage.length > 1000) {
            return NextResponse.json(
                { message: 'Message must be between 2 and 1000 characters.' },
                { status: 400 }
            );
        };

        if (!isValidEmail(sanitizedEmail)) {
            return NextResponse.json(
                { message: 'Please provide a valid email address.' },
                { status: 400 }
            );
        };

        const spamKeywords = ['ngentot', 'anjing', 'bangsat', 'kunyuk', 'tolol', 'bodoh'];
        const messageText = sanitizedMessage.toLowerCase();
        const hasSpam = spamKeywords.some(keyword => messageText.includes(keyword));

        if (hasSpam) {
            return NextResponse.json(
                { message: 'Message contains prohibited content.' },
                { status: 400 }
            );
        };

        const contact = await prisma.$transaction(async (tx) => {
            return await tx.contact.create({
                data: {
                    name,
                    email,
                    message
                }
            });
        });

        return NextResponse.json(
            { ...contact, message: 'Message sent successfully!' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { message: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}
// export async function POST(request: NextRequest) {
//     try {
//         const { name, email, message } = await request.json();

//         if (!name || !email || !message) {
//             return NextResponse.json(
//                 { error: 'Missing required fields' },
//                 { status: 400 }
//             );
//         };

//         const contact = await prisma.$transaction(async (tx) => {
//             return await tx.contact.create({
//                 data: {
//                     name,
//                     email,
//                     message
//                 }
//             });
//         });

//         return NextResponse.json(contact, { status: 201 });
//     } catch (error: any) {
//         return NextResponse.json(
//             { error: error.message || 'Failed to create contact' },
//             { status: 500 }
//         );
//     }
// };