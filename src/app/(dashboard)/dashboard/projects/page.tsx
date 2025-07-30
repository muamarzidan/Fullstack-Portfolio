'use client'

import { useEffect, useState } from 'react'
import ProjectCard from '../../../../../components/ProjectCard'

interface Project {
    id: string
    title: string
    description: string
    image: string
    createdAt: string
    updatedAt: string
}

interface ProjectForm {
    title: string
    description: string
    image: string
}

export default function DashboardProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [formData, setFormData] = useState<ProjectForm>({
        title: '',
        description: '',
        image: ''
    })
    const [formLoading, setFormLoading] = useState(false)

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
            console.error('Error fetching projects:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingProject(null)
        setFormData({ title: '', description: '', image: '' })
        setShowForm(true)
    }

    const handleEdit = (project: Project) => {
        setEditingProject(project)
        setFormData({
            title: project.title,
            description: project.description,
            image: project.image
        })
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
                throw new Error('Failed to delete project')
            }

            await fetchProjects()
        } catch (err) {
            alert('Failed to delete project')
            console.error('Error deleting project:', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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

            if (!response.ok) {
                throw new Error(`Failed to ${editingProject ? 'update' : 'create'} project`)
            }

            setShowForm(false)
            setEditingProject(null)
            setFormData({ title: '', description: '', image: '' })
            await fetchProjects()
        } catch (err) {
            alert(`Failed to ${editingProject ? 'update' : 'create'} project`)
            console.error('Error submitting form:', err)
        } finally {
            setFormLoading(false)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingProject(null)
        setFormData({ title: '', description: '', image: '' })
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
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add New Project
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingProject ? 'Edit Project' : 'Add New Project'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter project title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter project description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={formData.image}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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
}