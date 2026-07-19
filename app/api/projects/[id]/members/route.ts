import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { broadcastEvent } from '../../../events/route'

interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Verify user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        OR: [
          { owner: { email: session.user.email } },
          { members: { some: { user: { email: session.user.email } } } }
        ]
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Get project members
    const members = await prisma.projectMember.findMany({
      where: {
        projectId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Include the project owner
    const owner = await prisma.user.findUnique({
      where: { id: project.ownerId },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    const allMembers = [
      {
        id: 'owner',
        role: 'OWNER' as const,
        user: owner,
        createdAt: project.createdAt
      },
      ...members
    ]

    return NextResponse.json(allMembers)
  } catch (error) {
    console.error('Error fetching project members:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    // Verify the requesting user is the project owner
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        owner: {
          email: session.user.email
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Remove member
    await prisma.projectMember.delete({
      where: {
        id: memberId,
        projectId: params.id,
        // Prevent removing the owner
        NOT: {
          role: 'OWNER'
        }
      }
    })

    // Broadcast real-time event
    broadcastEvent({
      type: 'MEMBER_REMOVED',
      memberId,
      projectId: params.id
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}