"use client";

import { useEffect, useState } from "react";

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
            console.error("Error fetching stats:", error);
            setStats((prev) => ({ ...prev, loading: false }));
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to the admin dashboard</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="text-3xl text-primary mr-4">📁</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Projects
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.loading ? "..." : stats.totalProjects}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="text-3xl text-green-500 mr-4">✅</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Status</p>
                            <p className="text-2xl font-bold text-gray-900">Active</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="text-3xl text-blue-500 mr-4">👤</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Admin User</p>
                            <p className="text-2xl font-bold text-gray-900">1</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="text-3xl text-purple-500 mr-4">🚀</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Version</p>
                            <p className="text-2xl font-bold text-gray-900">1.0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="/dashboard/projects"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="text-2xl mr-4">📁</div>
                        <div>
                            <h3 className="font-medium text-gray-900">Manage Projects</h3>
                            <p className="text-sm text-gray-600">
                                Add, edit, or delete projects
                            </p>
                        </div>
                    </a>

                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="text-2xl mr-4">🌐</div>
                        <div>
                            <h3 className="font-medium text-gray-900">View Website</h3>
                            <p className="text-sm text-gray-600">Open the public website</p>
                        </div>
                    </a>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Recent Activity
                </h2>
                <div className="text-gray-500">
                    <p>Welcome to your dashboard! Start by managing your projects.</p>
                </div>
            </div>
        </div>
    );
}
