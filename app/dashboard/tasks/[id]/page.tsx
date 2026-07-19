'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import EditTaskForm from '@/components/tasks/edit-task-form'
import FileUpload from '@/components/tasks/file-upload'
import FileList from '@/components/tasks/file-list'
import { useRealTime } from '@/hooks/useRealTime'

interface TaskFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  createdAt: string
  uploadedBy: {
    name: string
    email: string
  }
}

interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: string | null
  createdAt: string
  updatedAt: string
  project: {
    id: string
    name: string
    color: string
  }
  files: TaskFile[]
}

interface PageProps {
  initialTask: Task
  initialFiles?: TaskFile[]
}

export default function TaskDetailPage({ initialTask, initialFiles = [] }: PageProps) {
  const [task, setTask] = useState<Task>(initialTask)
  const [files, setFiles] = useState<TaskFile[]>(initialFiles)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const router = useRouter()

  // Real-time file updates
  useRealTime({
    taskId: task.id,
    onEvent: (event) => {
      switch (event.type) {
        case 'TASK_UPDATED':
          if (event.task?.id === task.id) {
            setTask(event.task)
          }
          break
        
        case 'FILE_UPLOADED':
          if (event.taskId === task.id) {
            setFiles(prev => {
              const exists = prev.find(f => f.id === event.file.id)
              return exists ? prev : [event.file, ...prev]
            })
          }
          break
        
        case 'FILE_DELETED':
          if (event.taskId === task.id) {
            setFiles(prev => prev.filter(file => file.id !== event.fileId))
          }
          break
      }
    }
  })

  const handleTaskUpdated = (updatedTask: Task) => {
    setTask(updatedTask)
    router.refresh()
  }

  const handleFileUploaded = (file: TaskFile) => {
    setFiles(prev => [file, ...prev])
  }

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
      case 'REVIEW': return 'bg-purple-100 text-purple-800'
      case 'DONE': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800'
      case 'MEDIUM': return 'bg-orange-100 text-orange-800'
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'URGENT': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Link 
              href={`/dashboard/projects/${task.project.id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Back to {task.project.name}
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Edit Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Attachments</h2>
              
              {/* File Upload */}
              <div className="mb-6">
                <FileUpload
                  taskId={task.id}
                  onFileUploaded={handleFileUploaded}
                  onFileDeleted={handleFileDeleted}
                />
              </div>

              {/* File List */}
              <FileList
                files={files}
                onFileDeleted={handleFileDeleted}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Project</label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: task.project.color }}
                    ></div>
                    <Link 
                      href={`/dashboard/projects/${task.project.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {task.project.name}
                    </Link>
                  </div>
                </div>

                {task.dueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
                    <p className="text-gray-800">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Created</label>
                  <p className="text-gray-800">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                  <p className="text-gray-800">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href={`/dashboard/projects/${task.project.id}/board`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Go to Task Board
                </Link>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="block w-full text-center border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <EditTaskForm
          task={task}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      </div>
    </div>
  )
}