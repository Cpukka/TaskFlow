// app/dashboard/teams/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { 
  FiPlus, 
  FiUsers, 
  FiUserPlus,
  FiMail,
  FiMoreVertical,
  FiSettings
} from 'react-icons/fi'

export default async function TeamsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Mock data - you'll need to implement Team model in Prisma
  const teams = [
    {
      id: '1',
      name: 'Development Team',
      description: 'Core development team',
      members: 5,
      projects: 3,
      color: '#3B82F6'
    },
    {
      id: '2',
      name: 'Design Team',
      description: 'UI/UX Design team',
      members: 3,
      projects: 2,
      color: '#8B5CF6'
    }
  ]

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-1">Manage your teams and collaborate</p>
        </div>
        <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg">
          <FiPlus className="w-5 h-5" />
          New Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${team.color}20` }}
                >
                  <FiUsers className="w-6 h-6" style={{ color: team.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-500">{team.members} members</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">{team.description}</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{team.projects} projects</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1">
                  <FiUserPlus className="w-4 h-4" />
                  Invite
                </button>
                <button className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Invite Team Members</h3>
            <p className="text-gray-600 text-sm">Collaborate with your team on projects</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <input
              type="email"
              placeholder="Enter email address"
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium flex items-center gap-2">
              <FiMail className="w-4 h-4" />
              Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}