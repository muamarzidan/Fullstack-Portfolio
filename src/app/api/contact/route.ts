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

        const contactsData = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(contactsData);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch contact data' },
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
            )
        };

        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                message
            }
        })

        return NextResponse.json(contact, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create contact' },
            { status: 500 }
        );
    }
};

export async function DELETE(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        };

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Missing contact ID' },
                { status: 400 }
            )
        };

        await prisma.contact.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Contact deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete contact' },
            { status: 500 }
        );
    }
};

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        };

        const { name, email, message } = await request.json();
        const { id } = await params;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        };

        const contact = await prisma.contact.update({
            where: { id },
            data: {
                name,
                email,
                message
            }
        });

        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update contact' },
            { status: 500 }
        );
    }
};