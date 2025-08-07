import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminUsername || !adminPassword) {
        throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required')
    };

    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    const user = await prisma.user.upsert({
        where: {
            username: adminUsername,
        },
        update: {},
        create: {
            username: adminUsername,
            password: hashedPassword,
        },
    })
    const projects = await prisma.project.createMany({
        data: [
            {
                title: 'E-commerce Websitessss',
                description: 'Modern e-commerce platform built with Next.js and Stripe integration',
                image: 'https://via.placeholder.com/400x300?text=E-commerce'
            },
            {
                title: 'Task Management App',
                description: 'Collaborative task management application with real-time updates',
                image: 'https://via.placeholder.com/400x300?text=Task+Management'
            },
            {
                title: 'Blog Platform',
                description: 'Content management system for blogging with rich text editor',
                image: 'https://via.placeholder.com/400x300?text=Blog+Platform'
            }
        ]
    })
    const contacts = await prisma.contact.createMany({
        data: [
            {
                name: 'John Doe',
                email: 'dwddwd@gmail.com',
                message: 'Interested in your projects, especially the e-commerce site. Would love to collaborate!',
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@gmail.com',
                message: 'I have some ideas for the blog platform. Can we discuss?',
            }
        ]
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        await prisma.$disconnect()
        process.exit(1)
    });