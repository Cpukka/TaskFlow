import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProjectActions from '@/components/projects/project-actions'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
      owner: {
        email: session.user?.email
      }
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          assignee: {
            select: {
              name: true,
              email: true
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

  const tasksByStatus = {
    TODO: project.tasks.filter(task => task.status === 'TODO'),
    IN_PROGRESS: project.tasks.filter(task => task.status === 'IN_PROGRESS'),
    REVIEW: project.tasks.filter(task => task.status === 'REVIEW'),
    DONE: project.tasks.filter(task => task.status === 'DONE')
  }

  return (
    <div className="p-8">
      {/* Project Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            ></div>
            <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
          </div>
          <ProjectActions project={project} />
        </div>
        
        <p className="text-gray-600 mb-4">{project.description || 'No description provided.'}</p>
        
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Owner:</span>{' '}
            {project.owner.name}
          </div>
          <div>
            <span className="font-medium">Total Tasks:</span>{' '}
            {project.tasks.length}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-blue-600">{tasksByStatus.TODO.length}</div>
          <div className="text-sm text-gray-600">To Do</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-yellow-600">{tasksByStatus.IN_PROGRESS.length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-purple-600">{tasksByStatus.REVIEW.length}</div>
          <div className="text-sm text-gray-600">In Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-green-600">{tasksByStatus.DONE.length}</div>
          <div className="text-sm text-gray-600">Done</div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/projects/${project.id}/tasks/new`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              + New Task
            </Link>
            <Link
              href={`/dashboard/projects/${project.id}/board`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              📋 Task Board
            </Link>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {project.tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tasks yet</p>
            <Link
              href={`/dashboard/projects/${project.id}/tasks/new`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create Your First Task
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {project.tasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {task.description || 'No description'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full ${
                        task.status === 'TODO' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'REVIEW' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        task.priority === 'LOW' ? 'bg-gray-100 text-gray-800' :
                        task.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                        {task.priority} Priority
                      </span>
                      {task.dueDate && (
                        <span>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/tasks/${task.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium ml-4"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}