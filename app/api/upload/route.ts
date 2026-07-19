import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { broadcastEvent } from '../events/route'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const taskId = formData.get('taskId') as string

    if (!file || !taskId) {
      return NextResponse.json(
        { error: 'File and taskId are required' },
        { status: 400 }
      )
    }

    // Verify task exists and user has access
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        project: {
          owner: {
            email: session.user.email
          }
        }
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public/uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const fileExtension = originalName.split('.').pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Save file to disk
    await writeFile(filePath, buffer)

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        name: originalName,
        url: `/uploads/${fileName}`,
        size: file.size,
        type: file.type,
        taskId: taskId,
        uploadedById: user.id,
      },
      include: {
        uploadedBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Broadcast real-time event
    broadcastEvent({
      type: 'FILE_UPLOADED',
      file: fileRecord,
      taskId: taskId
    })

    return NextResponse.json(fileRecord)
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      )
    }

    // Verify file exists and user has access
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        task: {
          project: {
            owner: {
              email: session.user.email
            }
          }
        }
      }
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete file record
    await prisma.file.delete({
      where: {
        id: fileId
      }
    })

    // Broadcast real-time event
    broadcastEvent({
      type: 'FILE_DELETED',
      fileId: fileId,
      taskId: file.taskId
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('File delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}