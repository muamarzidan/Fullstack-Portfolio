"use client";
import { useEffect, useState } from "react";
import { 
    FolderIcon,
    CheckCircleIcon,
    UserIcon,
    RocketLaunchIcon,
    PlusIcon,
    EyeIcon,
    ArrowTrendingUpIcon,
    ClockIcon
} from '@heroicons/react/24/outline';


export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        loading: true,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/projects");
            if (response.ok) {
                const projects = await response.json();
                setStats({
                    totalProjects: projects.length,
                    loading: false,
                });
            }
        } catch (error) {
            setStats((prev) => ({ ...prev, loading: false }));
        }
    };

    const statsCards = [
        {
            name: 'Total Projects',
            value: stats.loading ? '...' : stats.totalProjects,
            icon: FolderIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            change: '+12%',
            changeType: 'increase'
        },
        {
            name: 'Active Status',
            value: 'Online',
            icon: CheckCircleIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            change: '100%',
            changeType: 'increase'
        },
        {
            name: 'Admin Users',
            value: '1',
            icon: UserIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            change: '0%',
            changeType: 'neutral'
        },
        {
            name: 'Version',
            value: '1.0',
            icon: RocketLaunchIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            change: 'Latest',
            changeType: 'neutral'
        }
    ];
    const quickActions = [
        {
            name: 'Add New Project',
            description: 'Create a new project',
            href: '/dashboard/projects/new',
            icon: PlusIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            name: 'View Projects',
            description: 'Manage existing projects',
            href: '/dashboard/projects',
            icon: FolderIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            name: 'View Website',
            description: 'Open public portfolio',
            href: '/',
            icon: EyeIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            external: true
        },
        {
            name: 'Analytics',
            description: 'View site statistics',
            href: '/dashboard/analytics',
            icon: ArrowTrendingUpIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                        <p className="text-gray-600 mt-1">Here's what's happening with your portfolio</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <div className="flex items-baseline">
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    {stat.change && (
                                        <span className={`ml-2 text-sm font-medium ${
                                            stat.changeType === 'increase' 
                                                ? 'text-green-600' 
                                                : stat.changeType === 'decrease' 
                                                    ? 'text-red-600' 
                                                    : 'text-gray-500'
                                        }`}>
                                            {stat.change}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <a
                            key={action.name}
                            href={action.href}
                            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="group relative p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
                        >
                            <div>
                                <div className={`inline-flex p-3 rounded-lg ${action.bgColor}`}>
                                    <action.icon className={`h-6 w-6 ${action.color}`} />
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700">
                                        {action.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                        <ClockIcon className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-500 text-lg">No recent activity</p>
                    <p className="text-gray-400 text-sm mt-1">Activity will appear here as you use the dashboard</p>
                </div>
            </div>
        </div>
    );
};