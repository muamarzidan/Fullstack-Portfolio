import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';
import { rateLimit } from '../../../../lib/rateLimit';


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
    };

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

export async function GET(request: NextRequest) {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
};

export async function POST(request: NextRequest) {
    try {
        const rateLimitResult = rateLimit(request, 5, 60 * 1000); // 5 requests per minute
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

        // Database transaction with proper isolation
        const result = await prisma.$transaction(async (tx) => {
            const existingTitleProject = await tx.project.findFirst({
                where: { title: validation.data!.title }
            });

            if (existingTitleProject) {
                throw new Error('ProjectExists');
            }

            const project = await tx.project.create({
                data: validation.data!
            });

            return project;
        }, {
            maxWait: 5000,
            timeout: 10000,
            isolationLevel: 'Serializable'
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === 'ProjectExists') {
            return NextResponse.json(
                { error: 'Project with this title already exists' },
                { status: 409 }
            );
        };

        if (error instanceof Error && error.message.includes('Transaction')) {
            return NextResponse.json(
                { error: 'Database transaction failed. Please try again.' },
                { status: 503 }
            );
        };

        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
};