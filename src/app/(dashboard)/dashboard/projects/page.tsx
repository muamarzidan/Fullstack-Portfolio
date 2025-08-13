'use client'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { IProject, IProjectForm } from '../../../../../types/projects';
import ProjectCard from '../../../../../components/ProjectCardDashboard';

export default function DashboardProjectsPage() {
    const [projects, setProjects] = useState<IProject[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingProject, setEditingProject] = useState<IProject | null>(null)
    const [formData, setFormData] = useState<IProjectForm>({
        title: '',
        description: '',
        image: '',
        company: '',
        role: [],
        techStack: [],
        url: '',
        statusShow: true,
        gradient: 'linear-gradient(145deg,#4F46E5,#000)'
    })
    const [formLoading, setFormLoading] = useState(false)
    
    // For array inputs
    const [roleInput, setRoleInput] = useState('')
    const [techStackInput, setTechStackInput] = useState('')

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/projects')

            if (!response.ok) {
                throw new Error('Failed to fetch projects')
            }

            const data = await response.json()
            setProjects(data)
        } catch (err) {
            setError('Failed to load projects')
            toast.error('Failed to load projects')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingProject(null)
        setFormData({
            title: '',
            description: '',
            image: '',
            company: '',
            role: [],
            techStack: [],
            url: '',
            statusShow: true,
            gradient: 'linear-gradient(145deg,#4F46E5,#000)'
        })
        setRoleInput('')
        setTechStackInput('')
        setShowForm(true)
    }

    const handleEdit = (project: IProject) => {
        setEditingProject(project)
        setFormData({
            title: project.title,
            description: project.description,
            image: project.image,
            company: project.company,
            role: [...project.role],
            techStack: [...project.techStack],
            url: project.url,
            statusShow: project.statusShow,
            gradient: project.gradient
        })
        setRoleInput('')
        setTechStackInput('')
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) {
            return
        }

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to delete project')
            }

            toast.success('Project deleted successfully')
            await fetchProjects()
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete project')
        }
    }

    const addRole = () => {
        if (roleInput.trim() && !formData.role.includes(roleInput.trim())) {
            setFormData(prev => ({
                ...prev,
                role: [...prev.role, roleInput.trim()]
            }))
            setRoleInput('')
        }
    }

    const removeRole = (index: number) => {
        setFormData(prev => ({
            ...prev,
            role: prev.role.filter((_, i) => i !== index)
        }))
    }

    const addTechStack = () => {
        if (techStackInput.trim() && !formData.techStack.includes(techStackInput.trim())) {
            setFormData(prev => ({
                ...prev,
                techStack: [...prev.techStack, techStackInput.trim()]
            }))
            setTechStackInput('')
        }
    }

    const removeTechStack = (index: number) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validation
        if (formData.role.length === 0) {
            toast.error('At least one role is required')
            return
        }
        
        if (formData.techStack.length === 0) {
            toast.error('At least one tech stack item is required')
            return
        }
        
        setFormLoading(true)

        try {
            const url = editingProject
                ? `/api/projects/${editingProject.id}`
                : '/api/projects'

            const method = editingProject ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const responseData = await response.json()

            if (!response.ok) {
                if (responseData.details) {
                    // Handle validation errors
                    responseData.details.forEach((detail: any) => {
                        toast.error(`${detail.field}: ${detail.message}`)
                    })
                } else {
                    throw new Error(responseData.error || `Failed to ${editingProject ? 'update' : 'create'} project`)
                }
                return
            }

            setShowForm(false)
            setEditingProject(null)
            toast.success(`Project ${editingProject ? 'updated' : 'created'} successfully`)
            await fetchProjects()
        } catch (err: any) {
            toast.error(err.message || `Failed to ${editingProject ? 'update' : 'create'} project`)
        } finally {
            setFormLoading(false)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingProject(null)
        setRoleInput('')
        setTechStackInput('')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Loading projects...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">{error}</div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
                    <p className="text-gray-600 mt-2">Manage your portfolio projects</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add New Project
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingProject ? 'Edit Project' : 'Add New Project'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter project title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter company name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter project description"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL *
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.image}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project URL *
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://project-url.com"
                                    />
                                </div>
                            </div>

                            {/* Role Array Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Roles * (at least 1 required)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={roleInput}
                                        onChange={(e) => setRoleInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter role (e.g., Frontend Developer)"
                                    />
                                    <button
                                        type="button"
                                        onClick={addRole}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.role.map((role, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {role}
                                            <button
                                                type="button"
                                                onClick={() => removeRole(index)}
                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tech Stack Array Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tech Stack * (at least 1 required)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={techStackInput}
                                        onChange={(e) => setTechStackInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter technology (e.g., React, Node.js)"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTechStack}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.techStack.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                        >
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => removeTechStack(index)}
                                                className="ml-1 text-green-600 hover:text-green-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Gradient *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.gradient}
                                        onChange={(e) => setFormData(prev => ({ ...prev, gradient: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="linear-gradient(145deg,#4F46E5,#000)"
                                    />
                                    <div 
                                        className="w-full h-8 rounded mt-1"
                                        style={{ background: formData.gradient }}
                                    ></div>
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.statusShow}
                                            onChange={(e) => setFormData(prev => ({ ...prev, statusShow: e.target.checked }))}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Show Status Indicator</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formLoading ? 'Saving...' : (editingProject ? 'Update' : 'Create')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-gray-500 text-lg mb-2">No projects found</div>
                    <p className="text-gray-400 mb-4">Create your first project to get started</p>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            showActions={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
};