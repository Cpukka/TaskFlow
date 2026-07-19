import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import TaskBoard from '@/components/tasks/task-board'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string  // This should be PROJECT ID, not task ID
  }
}

export default async function TaskBoardPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch the PROJECT (not task) and its tasks
  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
      OR: [
        // Allow project owner OR members to access
        { owner: { email: session.user?.email } },
        { members: { some: { user: { email: session.user?.email } } } }
      ]
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: 'desc'
        },
        // Include files if needed
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
          }
        }
      },
      owner: {
        select: {
          name: true,
          email: true
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link 
                href={`/dashboard/projects/${project.id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2 text-sm"
              >
                ← Back to Project
              </Link>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                ></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{project.name} - Task Board</h1>
                  <p className="text-gray-600 text-sm">
                    {project.tasks.length} tasks • {isOwner ? 'Owner' : 'Member'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/dashboard/projects/${project.id}/tasks/new`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + New Task
              </Link>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
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