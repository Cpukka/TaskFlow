// types/index.ts
export interface User {
  id: string
  email: string
  name: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  color: string
  createdAt: Date
  updatedAt: Date
  ownerId: string
  tasks: Task[]
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: Date | null
  createdAt: Date
  updatedAt: Date
  projectId: string
  assigneeId: string | null
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
    }
  }
}