// app/dashboard/projects/[id]/board/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import TaskBoard from '@/components/tasks/task-board'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default async function TaskBoardPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch the PROJECT and its tasks with proper includes
  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
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
          assignee: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  })

  if (!project) {
    notFound()
  }

  // Check if user has access (owner or member)
  const isOwner = project.owner.email === session.user?.email
  const isMember = project.members.some(member => member.user.email === session.user?.email)
  
  if (!isOwner && !isMember) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Link 
                href={`/dashboard/projects/${project.id}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-2 text-sm"
              >
                ← Back to Project
              </Link>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color || '#3b82f6' }}
                ></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{project.name} - Task Board</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {project.tasks.length} tasks • {isOwner ? 'Owner' : 'Member'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/dashboard/projects/${project.id}/tasks/new`}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + New Task
              </Link>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                List View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Task Board */}
      <div className="container mx-auto px-6 py-8">
        <TaskBoard tasks={project.tasks} projectId={project.id} />
      </div>
    </div>
  )
}