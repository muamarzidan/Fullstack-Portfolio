'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'


export default function Sidebar() {
    const pathname = usePathname()

    const sidebarItems = [
        {
            href: '/dashboard',
            label: 'Dashboard',
            icon: '🏠'
        },
        {
            href: '/dashboard/projects',
            label: 'Projects',
            icon: '📁'
        },
        {
            href: '/dashboard/contacts',
            label: 'Contacts',
            icon: '📧'
        }
    ]

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            return;
        }
    };

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>

                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname === item.href
                                    ? 'bg-primary text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                    >
                        <span className="text-lg">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
};