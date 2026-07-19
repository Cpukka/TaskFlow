import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  })

  console.log('Created test user:', user.email)

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      name: 'My First Project',
      description: 'This is a sample project to get started',
      color: '#3b82f6',
      ownerId: user.id,
    },
  })

  console.log('Created sample project:', project.name)

  // Create sample tasks
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: 'Plan project structure',
        description: 'Define the main components and pages',
        status: 'DONE',
        priority: 'HIGH',
        projectId: project.id,
      },
      {
        title: 'Set up database',
        description: 'Create Prisma schema and seed data',
        status: 'DONE',
        priority: 'HIGH',
        projectId: project.id,
      },
      {
        title: 'Implement authentication',
        description: 'Add login and registration',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        projectId: project.id,
      },
      {
        title: 'Create task board',
        description: 'Build the main task management interface',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: project.id,
      },
    ],
  })

  console.log(`Created ${tasks.count} sample tasks`)
  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })