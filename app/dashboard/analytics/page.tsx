// app/dashboard/analytics/page.tsx
'use client'

import { 
  FiTrendingUp, 
  FiTrendingDown,
  FiBarChart2,
  FiPieChart,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi'

export default function AnalyticsPage() {
  // Mock data - replace with real data from your database
  const stats = {
    totalProjects: 12,
    totalTasks: 45,
    completionRate: 68,
    activeUsers: 8,
    tasksByStatus: {
      todo: 12,
      inProgress: 8,
      completed: 25
    },
    projectStats: [
      { name: 'Project A', progress: 85, tasks: 15 },
      { name: 'Project B', progress: 45, tasks: 12 },
      { name: 'Project C', progress: 70, tasks: 10 },
      { name: 'Project D', progress: 30, tasks: 8 }
    ]
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your productivity and project insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProjects}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <FiBarChart2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <FiTrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600">+12%</span>
            <span className="text-gray-500">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTasks}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <FiTrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600">+8%</span>
            <span className="text-gray-500">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completionRate}%</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <FiPieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 rounded-full h-2 transition-all"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl">
              <FiUsers className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <FiTrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-red-600">-2%</span>
            <span className="text-gray-500">from last month</span>
          </div>
        </div>
      </div>

      {/* Task Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status</h3>
          <div className="space-y-4">
            {[
              { label: 'To Do', count: stats.tasksByStatus.todo, color: 'bg-gray-400' },
              { label: 'In Progress', count: stats.tasksByStatus.inProgress, color: 'bg-yellow-400' },
              { label: 'Completed', count: stats.tasksByStatus.completed, color: 'bg-green-400' }
            ].map((status) => (
              <div key={status.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{status.label}</span>
                  <span className="font-medium text-gray-900">{status.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`${status.color} rounded-full h-2 transition-all`}
                    style={{ 
                      width: `${(status.count / stats.totalTasks) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
          <div className="space-y-4">
            {stats.projectStats.map((project) => (
              <div key={project.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{project.name}</span>
                  <div className="flex gap-4">
                    <span className="text-gray-500">{project.tasks} tasks</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 rounded-full h-2 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Completed task "Design Homepage"', time: '2 hours ago', user: 'John Doe' },
            { action: 'Created new project "Mobile App"', time: '5 hours ago', user: 'Jane Smith' },
            { action: 'Updated task "Fix login bug"', time: '1 day ago', user: 'Mike Johnson' },
            { action: 'Completed project "Website Redesign"', time: '2 days ago', user: 'Sarah Wilson' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiClock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}