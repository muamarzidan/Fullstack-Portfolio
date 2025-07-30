import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 12)

    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
        },
    })

    console.log('Created user:', user)

    // Sample projects
    const projects = await prisma.project.createMany({
        data: [
            {
                title: 'E-commerce Website',
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

    console.log('Created projects:', projects)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })