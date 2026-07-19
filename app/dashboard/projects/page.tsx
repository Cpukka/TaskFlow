// app/dashboard/projects/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiArchive,
  FiStar
} from 'react-icons/fi'

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const projects = await prisma.project.findMany({
    where: {
      owner: {
        email: session.user?.email
      }
    },
    include: {
      tasks: true,
      _count: {
        select: { tasks: true }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage all your projects in one place</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
            <FiFilter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Sort
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FiPlus className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first project to get started</p>
          <Link
            href="/dashboard/projects/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow group">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color || '#3B82F6' }}
                  />
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiMoreVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">
                    {project._count.tasks} tasks
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View →
                </Link>
              </div>

              {/* Progress Bar */}
              {project._count.tasks > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 rounded-full h-1.5 transition-all"
                      style={{ 
                        width: `${Math.round(
                          (project.tasks.filter(t => t.status === 'COMPLETED').length / project._count.tasks) * 100
                        )}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}