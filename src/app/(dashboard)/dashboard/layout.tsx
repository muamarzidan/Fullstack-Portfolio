import Sidebar from '../../../../components/Sidebar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt } from '../../../../lib/auth'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const sessionCookie = (await cookies()).get('session')?.value
    
    if (!sessionCookie) {
        redirect('/login')
    }
    
    try {
        await decrypt(sessionCookie)
    } catch (error) {
        redirect('/login')
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}