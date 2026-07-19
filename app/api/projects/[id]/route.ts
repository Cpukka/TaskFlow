import { broadcastEvent } from '../../events/route'

// After deleting the project:
await prisma.project.delete({
  where: {
    id: params.id
  }
})

// Broadcast event to all connected clients
broadcastEvent({
  type: 'PROJECT_DELETED',
  projectId: params.id
})

return new NextResponse(null, { status: 204 })