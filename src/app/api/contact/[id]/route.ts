import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../../../lib/prisma';
import { getSession } from '../../../../../lib/auth';


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
            );
        };

        const { name, email, message } = await request.json();
        const { id } = await params;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        };

        // Use transaction for data integrity
        const contact = await prisma.$transaction(async (tx) => {
            const existingContact = await tx.contact.findUnique({
                where: { id }
            });

            if (!existingContact) {
                throw new Error('Contact not found');
            }

            return await tx.contact.update({
                where: { id },
                data: {
                    name,
                    email,
                    message
                }
            });
        });

        return NextResponse.json(contact);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to update contact' },
            { status: 500 }
        );
    }
};

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        };

        const { id } = await params;

        // Use transaction for data integrity
        await prisma.$transaction(async (tx) => {
            const existingContact = await tx.contact.findUnique({
                where: { id }
            });

            if (!existingContact) {
                throw new Error('Contact not found');
            }

            await tx.contact.delete({
                where: { id }
            });
        });

        return NextResponse.json(
            { message: 'Contact deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to delete contact' },
            { status: 500 }
        );
    }
};