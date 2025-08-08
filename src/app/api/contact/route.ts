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

export async function POST(request: NextRequest) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
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

        return NextResponse.json(contact, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to create contact' },
            { status: 500 }
        );
    }
};