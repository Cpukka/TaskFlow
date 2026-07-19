'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TaskCard from './task-card'
import { useRealTime } from '@/hooks/useRealTime'

interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: Date | null
  createdAt: Date
  updatedAt: Date
  projectId: string
}

interface TaskBoardProps {
  tasks: Task[]
  projectId: string
}

interface Column {
  id: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  title: string
  color: string
  tasks: Task[]
}

export default function TaskBoard({ tasks: initialTasks, projectId }: TaskBoardProps) {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [columns, setColumns] = useState<Column[]>([])
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  // Real-time updates
  useRealTime({
    projectId,
    onEvent: (event) => {
      switch (event.type) {
        case 'TASK_CREATED':
          setTasks(prev => {
            const exists = prev.find(t => t.id === event.task.id)
            return exists ? prev : [event.task, ...prev]
          })
          break
        
        case 'TASK_UPDATED':
          setTasks(prev => prev.map(task => 
            task.id === event.task.id ? event.task : task
          ))
          break
        
        case 'TASK_DELETED':
          setTasks(prev => prev.filter(task => task.id !== event.taskId))
          break
      }
    }
  })

  useEffect(() => {
    const initialColumns: Column[] = [
      {
        id: 'TODO',
        title: 'To Do',
        color: 'bg-blue-50 border-blue-200',
        tasks: tasks.filter(task => task.status === 'TODO')
      },
      {
        id: 'IN_PROGRESS',
        title: 'In Progress',
        color: 'bg-yellow-50 border-yellow-200',
        tasks: tasks.filter(task => task.status === 'IN_PROGRESS')
      },
      {
        id: 'REVIEW',
        title: 'Review',
        color: 'bg-purple-50 border-purple-200',
        tasks: tasks.filter(task => task.status === 'REVIEW')
      },
      {
        id: 'DONE',
        title: 'Done',
        color: 'bg-green-50 border-green-200',
        tasks: tasks.filter(task => task.status === 'DONE')
      }
    ]
    setColumns(initialColumns)
  }, [tasks])

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent, columnId: Column['id']) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, columnId: Column['id']) => {
    e.preventDefault()
    
    if (!draggedTask || draggedTask.status === columnId) {
      setDraggedTask(null)
      return
    }

    // Add these handlers to your TaskBoard component:

const handleTaskUpdated = (updatedTask: Task) => {
  setTasks(prev => prev.map(task => 
    task.id === updatedTask.id ? updatedTask : task
  ))
}

const handleTaskDeleted = (taskId: string) => {
  setTasks(prev => prev.filter(task => task.id !== taskId))
}

// Update the TaskCard in the render to pass the handlers:
<TaskCard
  key={task.id}
  task={task}
  onDragStart={handleDragStart}
  onTaskUpdated={handleTaskUpdated}
  onTaskDeleted={handleTaskDeleted}
/>

    // Optimistic update
    const previousTasks = [...tasks]
    const updatedTasks = tasks.map(task => 
      task.id === draggedTask.id ? { ...task, status: columnId } : task
    )
    setTasks(updatedTasks)

    try {
      const response = await fetch(`/api/tasks/${draggedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: columnId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task status')
      }

      // The real-time update will handle the refresh
    } catch (error) {
      console.error('Error updating task status:', error)
      // Revert optimistic update on error
      setTasks(previousTasks)
      alert('Failed to update task status')
    }

    setDraggedTask(null)
  }

  const getColumnStats = (column: Column) => {
    const total = column.tasks.length
    const urgent = column.tasks.filter(task => task.priority === 'URGENT').length
    const high = column.tasks.filter(task => task.priority === 'HIGH').length

    return { total, urgent, high }
  }

  return (
    <div className="p-6">
      {/* Board Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Board</h1>
        <p className="text-gray-600">Drag and drop tasks to update their status</p>
        <div className="flex items-center space-x-2 mt-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Real-time updates active</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const stats = getColumnStats(column)
          
          return (
            <div
              key={column.id}
              className={`rounded-lg border-2 ${column.color} min-h-[600px]`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{column.title}</h3>
                  <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                    {stats.total}
                  </span>
                </div>
                <div className="flex space-x-2 text-xs">
                  {stats.urgent > 0 && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                      {stats.urgent} urgent
                    </span>
                  )}
                  {stats.high > 0 && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      {stats.high} high
                    </span>
                  )}
                </div>
              </div>

              {/* Tasks */}
              <div className="p-4 space-y-4">
                {column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={handleDragStart}
                  />
                ))}
                
                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks</p>
                    <p className="text-sm mt-1">Drag tasks here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Drag Hint */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        💡 Drag and drop tasks between columns to update their status
      </div>
    </div>
  )
}