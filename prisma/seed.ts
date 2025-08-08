import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

async function main() {
    // const adminUsername = process.env.ADMIN_USERNAME;
    // const adminPassword = process.env.ADMIN_PASSWORD;
    // if (!adminUsername || !adminPassword) {
    //     throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required')
    // };
    // const hashedPassword = await bcrypt.hash(adminPassword, 12)
    // await prisma.user.upsert({
    //     where: {
    //         username: adminUsername,
    //     },
    //     update: {},
    //     create: {
    //         username: adminUsername,
    //         password: hashedPassword,
    //     },
    // })
    // const projects = await prisma.project.createMany({
    //     data: [
    //         {
    //             title: 'E-commerce Websitessss',
    //             description: 'Modern e-commerce platform built with Next.js and Stripe integration',
    //             image: 'https://via.placeholder.com/400x300?text=E-commerce'
    //         },
    //         {
    //             title: 'Task Management App',
    //             description: 'Collaborative task management application with real-time updates',
    //             image: 'https://via.placeholder.com/400x300?text=Task+Management'
    //         },
    //         {
    //             title: 'Blog Platform',
    //             description: 'Content management system for blogging with rich text editor',
    //             image: 'https://via.placeholder.com/400x300?text=Blog+Platform'
    //         }
    //     ]
    // })
    // for (let i = 0; i < 100; i++) {
    //     await prisma.contact.create({
    //         data: {
    //             name: `Contact ${i + 1}`,
    //             email: `contact${i + 1}@example.com`,
    //             message: `contact${i + 1} message`
    //         }
    //     })
    // }
};

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        await prisma.$disconnect()
        process.exit(1)
    });