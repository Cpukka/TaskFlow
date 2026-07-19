import { useEffect, useRef, useCallback } from 'react'

interface RealTimeEvent {
  type: string
  task?: any
  project?: any
  taskId?: string
  projectId?: string
}

interface UseRealTimeProps {
  onEvent: (event: RealTimeEvent) => void
  projectId?: string
}

export function useRealTime({ onEvent, projectId }: UseRealTimeProps) {
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource('/api/events')
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log('Real-time connection established')
      // Clear any reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }

    eventSource.onmessage = (event) => {
      try {
        const data: RealTimeEvent = JSON.parse(event.data)
        
        // Filter events by projectId if provided
        if (projectId) {
          if (data.projectId === projectId || data.task?.projectId === projectId) {
            onEvent(data)
          }
        } else {
          onEvent(data)
        }
      } catch (error) {
        console.error('Error parsing real-time event:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('Real-time connection error:', error)
      eventSource.close()
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect...')
        connect()
      }, 3000)
    }

    return eventSource
  }, [onEvent, projectId])

  useEffect(() => {
    const eventSource = connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [connect])

  return {
    disconnect: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }
}