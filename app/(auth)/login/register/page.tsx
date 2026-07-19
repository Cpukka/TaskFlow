import { redirect } from 'next/navigation'

export default function RegisterRedirect() {
  // The canonical register page is now at /register
  redirect('/register')
}