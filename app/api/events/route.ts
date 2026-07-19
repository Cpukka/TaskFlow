import { NextRequest } from 'next/server'

// Store connected clients
const clients: { id: number; controller: ReadableStreamDefaultController }[] = []
let clientId = 0

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // Add client to list
      const id = clientId++
      clients.push({ id, controller })

      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: 'connected', id })}\n\n`
      controller.enqueue(new TextEncoder().encode(data))

      // Remove client when connection closes
      request.signal.addEventListener('abort', () => {
        const index = clients.findIndex(client => client.id === id)
        if (index !== -1) {
          clients.splice(index, 1)
        }
      })
    },
    cancel() {
      // Clean up when stream is cancelled
      console.log('Client disconnected')
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
    },
  })
}

// Helper function to broadcast events to all connected clients
export function broadcastEvent(event: any) {
  const data = `data: ${JSON.stringify(event)}\n\n`
  
  clients.forEach(client => {
    try {
      client.controller.enqueue(new TextEncoder().encode(data))
    } catch (error) {
      console.error('Error sending event to client:', error)
    }
  })
}