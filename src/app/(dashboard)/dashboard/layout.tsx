import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { decrypt } from '../../../../lib/auth';
import Sidebar from '../../../../components/admin/Sidebar';


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const sessionCookie = (await cookies()).get('session')?.value
    
    if (!sessionCookie) {
        redirect('/login')
    };
    
    try {
        await decrypt(sessionCookie)
    } catch (error) {
        redirect('/login')
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                <main className="flex-1 overflow-y-auto p-6 py-4">
                    {children}
                </main>
            </div>
        </div>
    )
};