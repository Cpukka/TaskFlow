import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { broadcastEvent } from '../../events/route'

interface RouteContext {
  params: {
    id: string
  }
}

// GET - Get a single task
export async function GET(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
        project: {
          OR: [
            { owner: { email: session.user.email } },
            { members: { some: { user: { email: session.user.email } } } }
          ]
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        assignee: {
          select: {
            name: true,
            email: true
          }
        },
        files: {
          include: {
            uploadedBy: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!task) {
      return new NextResponse('Task not found', { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// PATCH - Update a task
export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Verify task exists and user has access
    const existingTask = await prisma.task.findUnique({
      where: {
        id: params.id,
        project: {
          OR: [
            { owner: { email: session.user.email } },
            { members: { some: { user: { email: session.user.email } } } }
          ]
        }
      }
    })

    if (!existingTask) {
      return new NextResponse('Task not found or access denied', { status: 404 })
    }

    const body = await request.json()
    const { title, description, status, priority, dueDate, assigneeId } = body

    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description?.trim()
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId

    const updatedTask = await prisma.task.update({
      where: {
        id: params.id
      },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        assignee: {
          select: {
            name: true,
            email: true
          }
        },
        files: {
          include: {
            uploadedBy: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    // Broadcast real-time event
    broadcastEvent({
      type: 'TASK_UPDATED',
      task: updatedTask,
      projectId: updatedTask.projectId
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
export async function DELETE(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Verify task exists and user has access
    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
        project: {
          OR: [
            { owner: { email: session.user.email } },
            { members: { some: { user: { email: session.user.email } } } }
          ]
        }
      }
    })

    if (!task) {
      return new NextResponse('Task not found or access denied', { status: 404 })
    }

    // Delete task (files will be cascade deleted due to schema relation)
    await prisma.task.delete({
      where: {
        id: params.id
      }
    })

    // Broadcast real-time event
    broadcastEvent({
      type: 'TASK_DELETED',
      taskId: params.id,
      projectId: task.projectId
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}