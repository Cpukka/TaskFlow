'use client'

import { useState, useEffect } from 'react'
import { Users, Crown, Shield, User, Trash2, AlertCircle } from 'lucide-react'

interface ProjectMember {
  id: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface ProjectMembersProps {
  projectId: string
  isOwner: boolean
}

export default function ProjectMembers({ projectId, isOwner }: ProjectMembersProps) {
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [projectId])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${projectId}/members`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load members')
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the project?')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/members?memberId=${memberId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMembers(prev => prev.filter(member => member.id !== memberId))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to remove member')
      }
    } catch (error) {
      console.error('Remove member error:', error)
      alert('An error occurred while removing the member')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER': return <Crown className="w-4 h-4 text-yellow-600" />
      case 'ADMIN': return <Shield className="w-4 h-4 text-blue-600" />
      case 'MEMBER': return <User className="w-4 h-4 text-green-600" />
      case 'VIEWER': return <User className="w-4 h-4 text-gray-600" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'OWNER': return 'Owner'
      case 'ADMIN': return 'Admin'
      case 'MEMBER': return 'Member'
      case 'VIEWER': return 'Viewer'
      default: return role
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Project Members</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Project Members</h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
          <button
            onClick={fetchMembers}
            className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Project Members</h3>
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center space-x-2 min-w-[80px]">
                {getRoleIcon(member.role)}
                <span className="text-sm font-medium text-gray-700">
                  {getRoleName(member.role)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{member.user.name}</p>
                <p className="text-sm text-gray-500 truncate">{member.user.email}</p>
              </div>
              
              <div className="text-xs text-gray-400">
                Joined {new Date(member.createdAt).toLocaleDateString()}
              </div>
            </div>

            {isOwner && member.role !== 'OWNER' && (
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-2"
                title="Remove member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {members.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg">No members yet</p>
            <p className="text-sm mt-1">Invite team members to collaborate</p>
          </div>
        )}
      </div>
    </div>
  )
}