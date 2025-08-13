"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoSidebarExpand } from "react-icons/go";
import { 
    HomeIcon, 
    FolderIcon, 
    EnvelopeIcon,
} from '@heroicons/react/24/outline';


const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderIcon },
    { name: 'Contact', href: '/dashboard/contacts', icon: EnvelopeIcon },
];

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div 
                    className={`fixed inset-0 bg-black transition-opacity ${
                        sidebarOpen ? 'opacity-50' : 'opacity-0'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                />

                {/* Mobile Sidebar */}
                <div className={`relative flex-1 flex flex-col max-w-[280px] w-full bg-white transition-transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    {/* <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XMarkIcon className="h-6 w-6 text-white" />
                        </button>
                    </div> */}
                    <div className="flex flex-col h-full px-2">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        </div>
                        <SidebarContent navigation={navigation} pathname={pathname} />
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${
                collapsed ? 'lg:w-16' : 'lg:w-64'
            }`}>
                <div className="flex flex-col w-full min-h-screen">
                    <div className={`flex flex-col h-full px-2 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
                        collapsed ? 'items-center' : ''
                    }`}>
                        {/* Toggle button */}
                        <div className="flex items-center justify-between flex-shrink-0 px-2 py-4">
                            {!collapsed ? (
                                <>
                                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                                    <button
                                        onClick={() => setCollapsed(!collapsed)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <GoSidebarExpand className="h-5 w-5 text-gray-800" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setCollapsed(!collapsed)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <GoSidebarExpand className="h-5 w-5 text-gray-800 rotate-180" />
                                </button>
                            )}
                        </div>

                        <hr className="bg-gray-300 h-[1px] w-full rounded-full" />

                        <SidebarContent 
                            navigation={navigation} 
                            pathname={pathname} 
                            collapsed={collapsed} 
                        />
                    </div>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="sticky min-h-screen px-2 py-4 flex items-center flex-col top-0 z-10 shadow lg:hidden bg-white">
                <button
                    type="button"
                    className="lg:hidden cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition-colors"
                    onClick={() => setSidebarOpen(true)}
                >
                    <GoSidebarExpand className="h-5 w-5 text-gray-800 rotate-180" />
                </button>

                <hr className="bg-gray-300 h-[1px] w-full rounded-full mt-3" />

                <SidebarContent
                    navigation={navigation}
                    pathname={pathname}
                    collapsed={collapsed}
                    isMobile={true}
                />
            </div>
        </>
    )
};

function SidebarContent({ 
    navigation, 
    pathname, 
    collapsed = false,
    isMobile = false
}: { 
    navigation: any[], 
    pathname: string, 
    collapsed?: boolean,
    isMobile?: boolean
}) {
    return (
        <nav className="mt-5 px-1 flex-1 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex justify-center items-center py-3 text-sm rounded-md transition-colors cursor-pointer ${
                            isActive
                                ? 'font-semibold bg-blue-50 text-blue-950'
                                : 'font-normal text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        } ${collapsed ? 'justify-center' : ''}`}
                        title={collapsed ? item.name : ''}
                    >
                        <item.icon
                            className={`flex-shrink-0 h-5 w-5 mx-3 ${
                                isActive ? 'text-blue-950' : 'text-gray-600 group-hover:text-gray-900'
                            }`}
                        />
                        {
                            isMobile ? null : (
                                <span className={`flex-1 ${collapsed ? 'hidden' : ''}`}>
                                    {item.name}
                                </span>
                            )
                        }
                    </Link>
                )
            })}
        </nav>
    )
};