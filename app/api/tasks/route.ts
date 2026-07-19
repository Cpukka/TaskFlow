import { broadcastEvent } from '../events/route'

// In your POST function, after creating the task:
const task = await prisma.task.create({
  data: {
    title: title.trim(),
    description: description?.trim(),
    status: status || 'TODO',
    priority: priority || 'MEDIUM',
    dueDate: dueDate ? new Date(dueDate) : null,
    projectId: projectId,
  },
  include: {
    project: {
      select: {
        name: true,
        color: true,
        id: true
      }
    },
    assignee: {
      select: {
        name: true,
        email: true
      }
    }
  }
})

// Broadcast event to all connected clients
broadcastEvent({
  type: 'TASK_CREATED',
  task,
  projectId
})

return NextResponse.json(task)