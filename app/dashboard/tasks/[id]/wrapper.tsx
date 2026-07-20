// app/dashboard/tasks/[id]/wrapper.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import TaskDetailPage from './page'

interface PageProps {
  params: {
    id: string
  }
}

export default async function TaskDetailPageWrapper({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/login')
  }

  const task = await prisma.task.findUnique({
    where: {
      id: params.id,
      project: {
        OR: [
          { owner: { email: session.user.email } },
          { members: { some: { user: { email: session.user.email } } } }
        ]
      }
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          color: true
        }
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      files: {
        include: {
          uploadedBy: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!task) {
    notFound()
  }

  // Format dates to strings for serialization
  const serializedTask = {
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    files: task.files.map(file => ({
      ...file,
      createdAt: file.createdAt.toISOString()
    })),
    comments: task.comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString()
    }))
  }

  // Pass the serialized task as props to the page component
  // The page component will use this as initial data
  return <TaskDetailPage task={serializedTask} />
}