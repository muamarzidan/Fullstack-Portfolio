"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import ProjectCard from "../../../components/ProjectCard";

interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/projects");
            console.log("Response status:", response);
            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError("Failed to load projects");
            console.error("Error fetching projects:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading projects...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Our Projects
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore our portfolio of web development projects and applications
                    </p>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No projects found</div>
                        <p className="text-gray-400 mt-2">
                            Check back later for new projects!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                showActions={false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
