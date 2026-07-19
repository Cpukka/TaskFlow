// app/dashboard/calendar/page.tsx
'use client'

import { useState } from 'react'
import { 
  FiChevronLeft, 
  FiChevronRight,
  FiPlus,
  FiCalendar,
  FiClock
} from 'react-icons/fi'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const days = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1))
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">View and manage your schedule</p>
        </div>
        <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg">
          <FiPlus className="w-5 h-5" />
          New Event
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {monthName} {year}
          </h2>
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Week headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="h-24 p-2 bg-gray-50/50"></div>
          ))}
          {Array.from({ length: days }, (_, i) => {
            const day = i + 1
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentDate.getMonth() &&
                           new Date().getFullYear() === currentDate.getFullYear()
            const hasEvent = day % 3 === 0 // Mock events
            const eventCount = hasEvent ? Math.ceil(Math.random() * 3) : 0

            return (
              <div 
                key={day} 
                className={`h-24 p-2 border-b border-r border-gray-100 hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {day}
                </div>
                {eventCount > 0 && (
                  <div className="mt-1 space-y-1">
                    {Array.from({ length: Math.min(eventCount, 2) }, (_, idx) => (
                      <div key={idx} className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded truncate">
                        Event {idx + 1}
                      </div>
                    ))}
                    {eventCount > 2 && (
                      <div className="text-xs text-gray-500">+{eventCount - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {[
            { title: 'Team Meeting', time: '2:00 PM', project: 'Development' },
            { title: 'Design Review', time: '3:30 PM', project: 'Design' },
            { title: 'Client Presentation', time: '5:00 PM', project: 'Marketing' }
          ].map((event, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiCalendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.project}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiClock className="w-4 h-4" />
                {event.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}