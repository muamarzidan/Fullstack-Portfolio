import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../../../lib/prisma';
import { getSession } from '../../../../../lib/auth';


export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession(request)
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { title, description, image } = await request.json()
        const { id } = await params

        const project = await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                image
            }
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error('Error updating project:', error)
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        )
    }
};

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession(request)
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        await prisma.project.delete({
            where: { id }
        })

        return NextResponse.json(
            { message: 'Project deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting project:', error)
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        )
    }
};