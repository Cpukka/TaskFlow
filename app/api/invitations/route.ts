import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'
import { broadcastEvent } from '../events/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, role, projectId } = body

    if (!email || !projectId) {
      return NextResponse.json(
        { error: 'Email and project ID are required' },
        { status: 400 }
      )
    }

    // Verify project exists and user is the owner
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        owner: {
          email: session.user.email
        }
      },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMember = project.members.find(member => 
      member.user.email === email
    )

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this project' },
        { status: 400 }
      )
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        projectId,
        status: 'PENDING',
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Pending invitation already exists for this user' },
        { status: 400 }
      )
    }

    // Get inviting user
    const invitingUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!invitingUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Generate invitation token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email: email.toLowerCase(),
        role: role || 'MEMBER',
        token,
        expiresAt,
        projectId,
        invitedById: invitingUser.id,
      },
      include: {
        project: {
          select: {
            name: true,
            id: true
          }
        },
        invitedBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // In a real app, you would send an email here
    console.log('Invitation created:', {
      to: email,
      project: project.name,
      invitationLink: `${process.env.NEXTAUTH_URL}/invitations/accept?token=${token}`,
      expires: expiresAt
    })

    // Broadcast real-time event
    broadcastEvent({
      type: 'INVITATION_CREATED',
      invitation,
      projectId
    })

    return NextResponse.json(invitation)
  } catch (error) {
    console.error('Invitation creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Verify user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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

    // Get invitations for this project
    const invitations = await prisma.invitation.findMany({
      where: {
        projectId,
      },
      include: {
        invitedBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(invitations)
  } catch (error) {
    console.error('Error fetching invitations:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}