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
  
  // Task status breakdown - Using correct enum values
  const doneTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'DONE').length, 0
  )
  const inProgressTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'IN_PROGRESS').length, 0
  )
  const todoTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'TODO').length, 0
  )
  const reviewTasks = projects.reduce((acc, project) => 
    acc + project.tasks.filter(task => task.status === 'REVIEW').length, 0
  )
  
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

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
      project: true,
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session.user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link
            href="/dashboard/projects/new"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalProjects}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
              <FiFolder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {totalProjects > 0 ? `${totalProjects} active projects` : 'No projects yet'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalTasks}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {doneTasks} done · {inProgressTasks} in progress
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{completionRate}%</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-xl">
              <FiTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-600 dark:bg-purple-400 rounded-full h-2 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">To Do</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{todoTasks}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-xl">
              <FiClock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Tasks awaiting attention
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
            <Link 
              href="/dashboard/projects"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiFolder className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No projects yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Create your first project to get started</p>
              <Link 
                href="/dashboard/projects/new"
                className="inline-block mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/dashboard/projects/${project.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {project.name}
                      </Link>
                      {project.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{project.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{project.tasks.length} tasks</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {format(new Date(project.updatedAt), 'MMM d')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity / Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <Link 
              href="/dashboard/tasks"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FiActivity className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'DONE' ? 'bg-green-500' :
                      task.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                      task.status === 'REVIEW' ? 'bg-purple-500' :
                      'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.project.name}
                      </span>
                      <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(task.updatedAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    task.status === 'DONE' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    task.status === 'IN_PROGRESS' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    task.status === 'REVIEW' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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