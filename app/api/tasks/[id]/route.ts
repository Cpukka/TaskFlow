// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch a single task
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const task = await prisma.task.findFirst({
      where: {
        id: id,
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
        },
        files: true
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update a task
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const { status, title, description, priority, dueDate, assigneeId } = body

    // Verify task exists and belongs to user's project
    const existingTask = await prisma.task.findFirst({
      where: {
        id: id,
        project: {
          owner: {
            email: session.user?.email
          }
        }
      }
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Update the task - using assigneeId (not assignedTo)
    const updatedTask = await prisma.task.update({
      where: {
        id: id
      },
      data: {
        status: status || existingTask.status,
        title: title || existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        priority: priority || existingTask.priority,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existingTask.dueDate,
        assigneeId: assigneeId !== undefined ? assigneeId : existingTask.assigneeId,
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
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// DELETE - Delete a task
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    // Verify task exists and belongs to user's project
    const existingTask = await prisma.task.findFirst({
      where: {
        id: id,
        project: {
          owner: {
            email: session.user?.email
          }
        }
      }
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Delete the task
    await prisma.task.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}