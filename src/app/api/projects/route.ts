import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';


export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(projects)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
};

export async function POST(request: NextRequest) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        };

        const { title, description, image } = await request.json();

        if (!title || !description || !image) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        };

        const project = await prisma.project.create({
            data: {
                title,
                description,
                image
            }
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
};