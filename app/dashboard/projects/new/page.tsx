import CreateProjectForm from '@/components/dashboard/create-project-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <CreateProjectForm />
    </div>
  )
}