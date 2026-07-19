'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import EditTaskForm from './edit-task-form'

interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: Date | null
  createdAt: Date
  projectId: string
}

interface TaskCardProps {
  task: Task
  onDragStart: (task: Task) => void
  onTaskUpdated?: (updatedTask: Task) => void
  onTaskDeleted?: (taskId: string) => void
}

export default function TaskCard({ task, onDragStart, onTaskUpdated, onTaskDeleted }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-200 text-gray-800'
      case 'MEDIUM': return 'bg-orange-200 text-orange-800'
      case 'HIGH': return 'bg-red-200 text-red-800'
      case 'URGENT': return 'bg-pink-200 text-pink-800'
      default: return 'bg-gray-200 text-gray-800'
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(task)
    e.dataTransfer.setData('text/plain', task.id)
  }

  const handleEdit = () => {
    setIsMenuOpen(false)
    setIsEditModalOpen(true)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onTaskDeleted?.(task.id)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete task')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting the task')
    } finally {
      setIsDeleting(false)
      setIsMenuOpen(false)
    }
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    onTaskUpdated?.(updatedTask)
  }

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        className="bg-white rounded-lg shadow-sm border p-4 cursor-move hover:shadow-md transition-shadow relative group"
      >
        {/* Action Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              disabled={isDeleting}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border z-20">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Priority Indicator */}
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {isOverdue && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Overdue
            </span>
          )}
        </div>

        {/* Task Title */}
        <Link 
          href={`/dashboard/tasks/${task.id}`}
          className="block font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {task.title}
        </Link>

        {/* Task Description Preview */}
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditTaskForm
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  )
}