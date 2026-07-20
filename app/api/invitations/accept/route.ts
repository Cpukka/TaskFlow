import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { broadcastEvent } from '../../events/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Invitation token is required' },
        { status: 400 }
      )
    }

    // Find the invitation - CORRECTED: prisma.invitation (not prisma.invitation)
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      )
    }

    // Check if invitation is expired
    if (new Date() > invitation.expiresAt) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' }
      })
      
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      )
    }

    // Check if invitation is already accepted
    if (invitation.status === 'ACCEPTED') {
      return NextResponse.json(
        { error: 'Invitation has already been accepted' },
        { status: 400 }
      )
    }

    // Check if the email matches the logged-in user
    if (invitation.email !== session.user.email) {
      return NextResponse.json(
        { error: 'This invitation is for a different email address' },
        { status: 400 }
      )
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: invitation.projectId,
          userId: user.id
        }
      }
    })

    if (existingMember) {
      // Update invitation status
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' }
      })

      return NextResponse.json(
        { error: 'You are already a member of this project' },
        { status: 400 }
      )
    }

    // Add user as project member - CORRECTED: prisma.projectMember (not prisma.projectMember)
    const projectMember = await prisma.projectMember.create({
      data: {
        role: invitation.role,
        projectId: invitation.projectId,
        userId: user.id,
      },
      include: {
        project: {
          select: {
            name: true,
            id: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Update invitation status
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: 'ACCEPTED' }
    })

    // Broadcast real-time event
    broadcastEvent({
      type: 'MEMBER_ADDED',
      member: projectMember,
      projectId: invitation.projectId
    })

    return NextResponse.json({
      message: 'Successfully joined the project',
      project: projectMember.project
    })
  } catch (error) {
    console.error('Invitation acceptance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}