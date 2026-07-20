// app/dashboard/tasks/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiFlag,
  FiUser,
  FiCalendar,
  FiClock,
  FiPaperclip,
  FiMessageSquare,
  FiDownload,
  FiX
} from 'react-icons/fi'
import { format } from 'date-fns'

// Define the props interface
interface TaskPageProps {
  task?: any // Initial task data from server
}

export default function TaskDetailPage({ task: initialTask }: TaskPageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [task, setTask] = useState(initialTask || null)
  const [loading, setLoading] = useState(!initialTask)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!initialTask) {
      // Fetch task client-side if not provided
      const taskId = window.location.pathname.split('/').pop()
      if (taskId) {
        fetchTask(taskId)
      }
    }
  }, [initialTask])

  const fetchTask = async (taskId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tasks/${taskId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Task not found')
        } else {
          setError('Failed to load task')
        }
        return
      }

      const data = await response.json()
      setTask(data)
    } catch (err) {
      console.error('Error fetching task:', err)
      setError('An error occurred while loading the task')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push(`/dashboard/projects/${task.projectId}`)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete task')
      }
    } catch (err) {
      console.error('Error deleting task:', err)
      setError('An error occurred while deleting the task')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      TODO: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      REVIEW: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      DONE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
    return colors[status as keyof typeof colors] || colors.TODO
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
    return colors[priority as keyof typeof colors] || colors.MEDIUM
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading task...</p>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {error || 'Task not found'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The task you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/dashboard/tasks"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Tasks
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/dashboard/projects/${task.projectId}`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Project
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/dashboard/tasks/${task.id}/edit`)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors text-red-500 hover:text-red-700"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Task Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          {/* Title and Status */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {task.title}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>

          {/* Project */}
          <Link
            href={`/dashboard/projects/${task.projectId}`}
            className="inline-flex items-center gap-2 mb-4 text-sm"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: task.project?.color || '#3b82f6' }}
            />
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              {task.project?.name || 'Unknown Project'}
            </span>
          </Link>

          {/* Description */}
          {task.description && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <FiFlag className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <FiUser className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Assignee</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {task.assignee?.name || 'Unassigned'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <FiCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <FiClock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Updated</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {format(new Date(task.updatedAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          </div>

          {/* Files */}
          {task.files && task.files.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <FiPaperclip className="w-4 h-4" />
                Attachments ({task.files.length})
              </h3>
              <div className="space-y-2">
                {task.files.map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <FiPaperclip className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(file.size / 1024)} KB • Uploaded by {file.uploadedBy?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <a
                      href={file.url}
                      download
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                    >
                      <FiDownload className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FiMessageSquare className="w-4 h-4" />
              Comments ({task.comments?.length || 0})
            </h3>
            <div className="space-y-4">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment: any) => (
                  <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {comment.author?.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {comment.author?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                  No comments yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Task</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Task'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}