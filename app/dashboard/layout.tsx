import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin_token')

  if (!adminToken || adminToken.value !== 'true') {
    redirect('/login?redirect=/dashboard')
  }

  return <>{children}</>
}
