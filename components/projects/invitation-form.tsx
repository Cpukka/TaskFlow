'use client'

import { useState } from 'react'
import { Send, UserPlus } from 'lucide-react'

interface InvitationFormProps {
  projectId: string
  onInvitationSent: () => void
}

export default function InvitationForm({ projectId, onInvitationSent }: InvitationFormProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'MEMBER' | 'ADMIN' | 'VIEWER'>('MEMBER')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
          projectId,
        }),
      })

      if (response.ok) {
        setEmail('')
        setRole('MEMBER')
        onInvitationSent()
        alert('Invitation sent successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to send invitation')
      }
    } catch (error) {
      console.error('Invitation error:', error)
      alert('An error occurred while sending the invitation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <UserPlus className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Invite Team Members</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="team@example.com"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="VIEWER">Viewer</option>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {role === 'VIEWER' && 'Can view projects and tasks but cannot make changes'}
            {role === 'MEMBER' && 'Can create and edit tasks, but cannot manage project settings'}
            {role === 'ADMIN' && 'Can manage tasks and project settings, but cannot delete the project'}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Sending Invitation...' : 'Send Invitation'}
        </button>
      </div>
    </form>
  )
}