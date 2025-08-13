import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../../../lib/prisma';
import { getSession } from '../../../../../lib/auth';
import { rateLimit } from '../../../../../lib/rateLimit';


function validateProject(data: any) {
    const errors: { field: string; message: string }[] = [];

    if (!data.title || typeof data.title !== 'string') {
        errors.push({ field: 'title', message: 'Title is required' });
    } else if (data.title.trim().length === 0) {
        errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (data.title.length > 100) {
        errors.push({ field: 'title', message: 'Title must be less than 100 characters' });
    };

    if (!data.description || typeof data.description !== 'string') {
        errors.push({ field: 'description', message: 'Description is required' });
    } else if (data.description.trim().length === 0) {
        errors.push({ field: 'description', message: 'Description cannot be empty' });
    } else if (data.description.length > 500) {
        errors.push({ field: 'description', message: 'Description must be less than 500 characters' });
    };

    if (!data.image || typeof data.image !== 'string') {
        errors.push({ field: 'image', message: 'Image URL is required' });
    } else {
        try {
            new URL(data.image);
        } catch {
            errors.push({ field: 'image', message: 'Invalid image URL' });
        }
    }

    if (!data.company || typeof data.company !== 'string') {
        errors.push({ field: 'company', message: 'Company is required' });
    } else if (data.company.trim().length === 0) {
        errors.push({ field: 'company', message: 'Company cannot be empty' });
    } else if (data.company.length > 100) {
        errors.push({ field: 'company', message: 'Company name must be less than 100 characters' });
    };

    if (!Array.isArray(data.role)) {
        errors.push({ field: 'role', message: 'Role must be an array' });
    } else if (data.role.length === 0) {
        errors.push({ field: 'role', message: 'At least one role is required' });
    } else {
        data.role.forEach((role: any, index: number) => {
            if (typeof role !== 'string' || role.trim().length === 0) {
                errors.push({ field: `role[${index}]`, message: 'Role cannot be empty' });
            }
        });
    };

    if (!Array.isArray(data.techStack)) {
        errors.push({ field: 'techStack', message: 'Tech stack must be an array' });
    } else if (data.techStack.length === 0) {
        errors.push({ field: 'techStack', message: 'At least one tech stack item is required' });
    } else {
        data.techStack.forEach((tech: any, index: number) => {
            if (typeof tech !== 'string' || tech.trim().length === 0) {
                errors.push({ field: `techStack[${index}]`, message: 'Tech stack item cannot be empty' });
            }
        });
    };

    if (!data.url || typeof data.url !== 'string') {
        errors.push({ field: 'url', message: 'Project URL is required' });
    } else {
        try {
            new URL(data.url);
        } catch {
            errors.push({ field: 'url', message: 'Invalid project URL' });
        }
    };

    if (typeof data.statusShow !== 'boolean') {
        errors.push({ field: 'statusShow', message: 'Status show must be a boolean' });
    };

    if (!data.gradient || typeof data.gradient !== 'string') {
        errors.push({ field: 'gradient', message: 'Gradient is required' });
    } else if (data.gradient.trim().length === 0) {
        errors.push({ field: 'gradient', message: 'Gradient cannot be empty' });
    };

    return {
        isValid: errors.length === 0,
        errors,
        data: errors.length === 0 ? {
            title: data.title.trim(),
            description: data.description.trim(),
            image: data.image,
            company: data.company.trim(),
            role: data.role.map((r: string) => r.trim()),
            techStack: data.techStack.map((t: string) => t.trim()),
            url: data.url,
            statusShow: data.statusShow,
            gradient: data.gradient.trim()
        } : null
    };
};

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const rateLimitResult = rateLimit(request, 5, 10 * 60 * 1000); // 5 updates per 10 minutes
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: rateLimitResult.message },
                { status: 429 }
            );
        };

        const session = await getSession(request);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        };

        const { id } = await params;
        const body = await request.json();
        const validation = validateProject(body);

        if (!validation.isValid) {
            return NextResponse.json(
                { 
                    error: 'Validation failed', 
                    details: validation.errors
                },
                { status: 400 }
            );
        };

        const project = await prisma.$transaction(async (tx) => {
            const existingProject = await tx.project.findUnique({
                where: { id }
            });

            if (!existingProject) {
                throw new Error('ProjectNotFound');
            };

            const duplicateTitleProject = await tx.project.findFirst({
                where: { 
                    title: validation.data!.title,
                    id: { not: id }
                }
            });

            if (duplicateTitleProject) {
                throw new Error('ProjectTitleExists');
            };

            const updatedProject = await tx.project.update({
                where: { id },
                data: {
                    ...validation.data!,
                    updatedAt: new Date()
                }
            });

            return updatedProject;
        }, {
            maxWait: 5000, // Maximum wait time
            timeout: 10000, // Maximum transaction time
            isolationLevel: 'Serializable' // Highest isolation level
        });

        return NextResponse.json(project);
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case 'ProjectNotFound':
                    return NextResponse.json(
                        { error: 'Project not found' },
                        { status: 404 }
                    );
                case 'ProjectTitleExists':
                    return NextResponse.json(
                        { error: 'Project with this title already exists' },
                        { status: 409 }
                    );
            }

            if (error.message.includes('Transaction')) {
                return NextResponse.json(
                    { error: 'Database transaction failed. Please try again.' },
                    { status: 503 }
                );
            }
        };

        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
};

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const rateLimitResult = rateLimit(request, 5, 10 * 60 * 1000); // 5 deletions per 10 minutes
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: rateLimitResult.message },
                { status: 429 }
            );
        };
        
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        };

        const { id } = await params;

        const result = await prisma.$transaction(async (tx) => {
            const existingTitleProject = await tx.project.findUnique({
                where: { id },
                select: { id: true, title: true }
            });

            if (!existingTitleProject) {
                throw new Error('ProjectNotFound');
            };

            await tx.project.delete({
                where: { id }
            });

            return {
                deletedProject: existingTitleProject,
                message: 'Project deleted successfully'
            };
        }, {
            maxWait: 5000, // Maximum wait time
            timeout: 10000, // Maximum transaction time
            isolationLevel: 'Serializable' // Highest isolation level
        });

        return NextResponse.json(
            { 
                message: result.message,
                deletedId: result.deletedProject.id
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ProjectNotFound') {
                return NextResponse.json(
                    { error: 'Project not found' },
                    { status: 404 }
                );
            };

            if (error.message.includes('Transaction')) {
                return NextResponse.json(
                    { error: 'Database transaction failed. Please try again.' },
                    { status: 503 }
                );
            };
        };

        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
};