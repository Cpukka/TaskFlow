// components/tasks/task-card.tsx
'use client'

import { useState } from 'react'
import { FiMoreVertical, FiEdit2, FiTrash2, FiCheck, FiClock, FiAlertCircle, FiFlag } from 'react-icons/fi'
import { format } from 'date-fns'
import type { Task } from '@prisma/client'

interface TaskCardProps {
  task: Task
  onDragStart: (task: Task) => void
  onTaskUpdated?: (task: Task) => void
  onTaskDeleted?: (taskId: string) => void
}

export default function TaskCard({ task, onDragStart, onTaskUpdated, onTaskDeleted }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const priorityColors = {
    LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  const statusColors = {
    TODO: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    REVIEW: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    DONE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        if (onTaskDeleted) {
          onTaskDeleted(task.id)
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task)}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-all group relative"
    >
      {/* Priority Badge */}
      <div className="absolute top-3 right-3">
        <span className={`px-2 py-0.5 text-xs rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-medium text-gray-900 dark:text-white text-sm pr-16 mb-2">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <FiClock className="w-3 h-3" />
            {format(new Date(task.dueDate), 'MMM d')}
          </div>
        )}

        {/* Status Badge */}
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}