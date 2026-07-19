// app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import type { Project, Task } from '@prisma/client'
import Link from 'next/link'
import { 
  FiFolder, 
  FiCheckCircle, 
  FiClock, 
  FiTrendingUp,
  FiPlus,
  FiArrowRight,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiActivity
} from 'react-icons/fi'
import { format } from 'date-fns'

type ProjectWithTasks = Project & { tasks: Task[] }

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Get user's projects with tasks
  const projects: ProjectWithTasks[] = await prisma.project.findMany({
    where: {
      owner: {
        email: session.user?.email
      }
    },
    include: {
      tasks: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  // Calculate statistics
  const totalProjects = projects.length
  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0)
  
  // Task status breakdown
  const completedTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'COMPLETED').length, 0
  )
  const inProgressTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'IN_PROGRESS').length, 0
  )
  const todoTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'TODO').length, 0
  )
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Get recent tasks (last 5 across all projects)
  const recentTasks = await prisma.task.findMany({
    where: {
      project: {
        owner: {
          email: session.user?.email
        }
      }
    },
    include: {
      project: true
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 5
  })

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link
            href="/dashboard/projects/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalProjects}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <FiFolder className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {totalProjects > 0 ? `${totalProjects} active projects` : 'No projects yet'}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalTasks}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {completedTasks} completed · {inProgressTasks} in progress
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{completionRate}%</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 rounded-full h-2 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">To Do</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{todoTasks}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl">
              <FiClock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Tasks awaiting attention
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <Link 
              href="/dashboard/projects"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiFolder className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No projects yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first project to get started</p>
              <Link 
                href="/dashboard/projects/new"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/dashboard/projects/${project.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {project.name}
                      </Link>
                      {project.description && (
                        <p className="text-sm text-gray-500 truncate">{project.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{project.tasks.length} tasks</span>
                    <div className="flex -space-x-2">
                      {/* You could add avatars here */}
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {format(new Date(project.updatedAt), 'MMM d')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity / Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link 
              href="/dashboard/tasks"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FiActivity className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'COMPLETED' ? 'bg-green-500' :
                      task.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                      'bg-gray-300'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {task.project.name}
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(task.updatedAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}