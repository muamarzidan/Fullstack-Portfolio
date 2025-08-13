'use client'
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

import { IProject, IProjectForm, IProjectsResponse } from '../../../../../types/projects';
import { IPaginationData } from '../../../../../types/common';
import ProjectCard from '../../../../../components/ProjectCardDashboard';

interface IFormErrors {
    title?: string;
    description?: string;
    image?: string;
    company?: string;
    role?: string;
    techStack?: string;
    url?: string;
    gradient?: string;
}
export default function DashboardProjectsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [projects, setProjects] = useState<IProject[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<IProject | null>(null);
    const [formData, setFormData] = useState<IProjectForm>({
        title: '',
        description: '',
        image: '',
        company: '',
        role: [],
        techStack: [],
        url: '',
        statusShow: true,
        gradient: 'linear-gradient(145deg,#070083FF,#000)'
    });
    const [formLoading, setFormLoading] = useState(false);
    const [roleInput, setRoleInput] = useState('');
    const [techStackInput, setTechStackInput] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProjects: 0,
        hasNext: false,
        hasPrev: false,
        limit: 15
    });
    const [formErrors, setFormErrors] = useState<IFormErrors>({});
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState('');


    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    const initialSearch = searchParams.get('search') || '';

    useEffect(() => {
        setSearchInput(initialSearch);
        fetchProjects(initialPage, initialSearch);
    }, []);

    const updateURL = useCallback((page: number, search: string) => {
        const params = new URLSearchParams();
        if (page > 1) params.set('page', page.toString());
        if (search.trim()) params.set('search', search.trim());

        const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.push(newURL, { scroll: false });
    }, [router]);

    const fetchProjects = async (page = 1, search = '') => {
        try {
            if (page === 1 && !search) {
                setLoading(true);
            } else {
                setSearchLoading(true);
            };

            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(search.trim() && { search: search.trim() })
            });

            const response = await fetch(`/api/projects?${params}`);

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            };

            const data: IProjectsResponse = await response.json();

            setProjects(data.projects);
            setPagination(data.pagination);
            setError('');
        } catch (err: any) {
            setError('Failed to load projects');
        } finally {
            setLoading(false);
            setSearchLoading(false);
        };
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchTerm = searchInput.trim();
        updateURL(1, searchTerm);
        fetchProjects(1, searchTerm);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        updateURL(1, '');
        fetchProjects(1, '');
    };

    const goToPage = (page: number) => {
        const currentSearch = searchParams.get('search') || '';
        updateURL(page, currentSearch);
        fetchProjects(page, currentSearch);
    };

    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(pagination.totalPages);

    const handleOpenModalToCreate = () => {
        setEditingProject(null);
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
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleOpenModalToEdit = (project: IProject) => {
        setEditingProject(project);
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
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) {
            return;
        };

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete project');
            };

            toast.success('Project deleted successfully');

            // Refresh current page
            const currentPage = pagination.currentPage;
            const currentSearch = searchParams.get('search') || '';
            await fetchProjects(currentPage, currentSearch);
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete project');
        };
    };

    const addRole = () => {
        if (roleInput.trim() && !formData.role.includes(roleInput.trim())) {
            setFormData(prev => ({
                ...prev,
                role: [...prev.role, roleInput.trim()]
            }));
            setRoleInput('');
        };
    };

    const removeRole = (index: number) => {
        setFormData(prev => ({
            ...prev,
            role: prev.role.filter((_, i) => i !== index)
        }));
    };

    const addTechStack = () => {
        if (techStackInput.trim() && !formData.techStack.includes(techStackInput.trim())) {
            setFormData(prev => ({
                ...prev,
                techStack: [...prev.techStack, techStackInput.trim()]
            }));
            setTechStackInput('');
        };
    };

    const removeTechStack = (index: number) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter((_, i) => i !== index)
        }));
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProject(null);
        setRoleInput('');
        setTechStackInput('');
    };

    const validateForm = (): boolean => {
        const errors: IFormErrors = {};
        
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.image.trim()) errors.image = 'Image URL is required';
        if (!formData.company.trim()) errors.company = 'Company is required';
        if (formData.role.length === 0) errors.role = 'At least one role is required';
        if (formData.techStack.length === 0) errors.techStack = 'At least one tech stack is required';
        if (!formData.url.trim()) errors.url = 'Project URL is required';
        if (!formData.gradient.trim()) errors.gradient = 'Gradient is required';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setFormLoading(true);

        try {
            const url = editingProject
                ? `/api/projects/${editingProject.id}`
                : '/api/projects';
            const method = editingProject ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (responseData.details) {
                    responseData.details.forEach((detail: any) => {
                        toast.error(`${detail.field}: ${detail.message}`);
                    });
                } else {
                    throw new Error(responseData.error || `Failed to ${editingProject ? 'update' : 'create'} project`);
                }
                return;
            }

            setShowForm(false);
            setEditingProject(null);
            toast.success(`Project ${editingProject ? 'updated' : 'created'} successfully`);

            const currentPage = pagination.currentPage;
            const currentSearch = searchParams.get('search') || '';
            await fetchProjects(currentPage, currentSearch);
        } catch (err: any) {
            toast.error(err.message || `Failed to ${editingProject ? 'update' : 'create'} project`);
        } finally {
            setFormLoading(false);
        };
    };

    if (error && !projects.length) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-2">{error}</div>
                    <button
                        onClick={() => fetchProjects()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    };

    const currentSearch = searchParams.get('search') || '';

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="">
                    <div className="flex flex-col justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Projects Management</h2>
                        <p className="text-gray-600 mt-1 text-sm">
                            {pagination.totalProjects} total projects
                        </p>
                    </div>
                </div>

                {
                    loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-lg text-gray-600">Loading projects...</div>
                        </div>
                    ) : (
                        <div className="space-y-4 bg-white p-4 rounded-xl border-1 border-gray-100">
                            {/* Search & Create */}
                            <div>
                                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 relative min-w-[320px]">
                                            <input
                                                type="text"
                                                placeholder="Search by title..."
                                                value={searchInput}
                                                onChange={(e) => setSearchInput(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 text-sm border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950 focus:border-transparent"
                                            />
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            {searchLoading && (
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-sm bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                                            >
                                                Search
                                            </button>
                                            {currentSearch && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearSearch}
                                                    className="px-4 py-2 text-sm bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleOpenModalToCreate}
                                        className="inline-flex text-sm gap-2 items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 transition-colors cursor-pointer"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        Add Project
                                    </button>
                                </form>
                                {currentSearch && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Searching for: <span className="font-medium">&quot;{currentSearch}&quot;</span>
                                    </div>
                                )}
                            </div>

                            {/* Body Content */}
                            {projects.length === 0 && !loading ? (
                                <div className="text-center py-12 bg-white rounded-lg shadow">
                                    <div className="text-gray-500 text-lg mb-2">
                                        {currentSearch ? 'No projects found for your search' : 'No projects found'}
                                    </div>
                                    <p className="text-gray-400 mb-4">
                                        {currentSearch ? 'Try a different search term' : 'Create your first project to get started'}
                                    </p>
                                    {currentSearch ? (
                                        <button
                                            onClick={handleClearSearch}
                                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                                        >
                                            Clear Search
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleOpenModalToCreate}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Add Project
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {/* Responsive Grid - Adjusts based on sidebar state */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                        {projects.map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                showActions={true}
                                                onEdit={handleOpenModalToEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg mt-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 flex justify-between sm:hidden">
                                                    <button
                                                        onClick={() => goToPage(pagination.currentPage - 1)}
                                                        disabled={!pagination.hasPrev}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        onClick={() => goToPage(pagination.currentPage + 1)}
                                                        disabled={!pagination.hasNext}
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-700">
                                                            Showing{' '}
                                                            <span className="font-bold text-blue-900">{(pagination.currentPage - 1) * pagination.limit + 1}</span>
                                                            {' '}to{' '}
                                                            <span className="font-bold text-blue-900">
                                                                {Math.min(pagination.currentPage * pagination.limit, pagination.totalProjects)}
                                                            </span>
                                                            {' '}of{' '}
                                                            <span className="font-medium">{pagination.totalProjects}</span>
                                                            {' '}projects
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                            {/* First Page Button */}
                                                            {pagination.currentPage > 3 && (
                                                                <>
                                                                    <button
                                                                        onClick={goToFirstPage}
                                                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                                        title="First Page"
                                                                    >
                                                                        <ChevronDoubleLeftIcon className="h-5 w-5" />
                                                                    </button>
                                                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                                        ...
                                                                    </span>
                                                                </>
                                                            )}

                                                            {/* Previous Button */}
                                                            <button
                                                                onClick={() => goToPage(pagination.currentPage - 1)}
                                                                disabled={!pagination.hasPrev}
                                                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${pagination.currentPage <= 3 ? 'rounded-l-md' : ''
                                                                    }`}
                                                            >
                                                                <ChevronLeftIcon className="h-5 w-5" />
                                                            </button>

                                                            {/* Page numbers */}
                                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                                const pageNumber = Math.max(1, pagination.currentPage - 2) + i;
                                                                if (pageNumber > pagination.totalPages) return null;

                                                                return (
                                                                    <button
                                                                        key={pageNumber}
                                                                        onClick={() => goToPage(pageNumber)}
                                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNumber === pagination.currentPage
                                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                            }`}
                                                                    >
                                                                        {pageNumber}
                                                                    </button>
                                                                );
                                                            })}

                                                            {/* Next Button */}
                                                            <button
                                                                onClick={() => goToPage(pagination.currentPage + 1)}
                                                                disabled={!pagination.hasNext}
                                                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${pagination.currentPage >= pagination.totalPages - 2 ? 'rounded-r-md' : ''
                                                                    }`}
                                                            >
                                                                <ChevronRightIcon className="h-5 w-5" />
                                                            </button>

                                                            {/* Last Page Button */}
                                                            {pagination.currentPage < pagination.totalPages - 2 && (
                                                                <>
                                                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                                        ...
                                                                    </span>
                                                                    <button
                                                                        onClick={goToLastPage}
                                                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                                        title="Last Page"
                                                                    >
                                                                        <ChevronDoubleRightIcon className="h-5 w-5" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </nav>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Modal Create / Update */}
                            {showForm && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl !space-y-6 max-h-[90vh] overflow-y-auto animate-in">
                                        <h2 className="text-xl text-center font-semibold mb-4 text-gray-900">
                                            {editingProject ? 'Edit Project' : 'Add New Project'}
                                        </h2>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Title <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        // required
                                                        value={formData.title}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                        className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950`}
                                                        placeholder="Enter project title"
                                                    />
                                                    {formErrors.title && (
                                                        <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Company <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        // required
                                                        value={formData.company}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                                        className={`w-full px-3 py-2 border ${formErrors.company ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950`}
                                                        placeholder="Enter company name"
                                                    />
                                                    {formErrors.company && (
                                                        <p className="mt-1 text-sm text-red-600">{formErrors.company}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Description <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    // required
                                                    rows={3}
                                                    value={formData.description}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                    className={`w-full px-3 py-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950`}
                                                    placeholder="Enter project description"
                                                />
                                                {formErrors.description && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Image URL <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="url"
                                                        // required
                                                        value={formData.image}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                                        className={`w-full px-3 py-2 border ${formErrors.image ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950`}
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                    {formErrors.image && (
                                                        <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Project URL <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="url"
                                                        // required
                                                        value={formData.url}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                                        className={`w-full px-3 py-2 border ${formErrors.url ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950`}
                                                        placeholder="https://project-url.com"
                                                    />
                                                    {formErrors.url && (
                                                        <p className="mt-1 text-sm text-red-600">{formErrors.url}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Roles <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={roleInput}
                                                        onChange={(e) => setRoleInput(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950"
                                                        placeholder="Enter role (e.g., Frontend Developer)"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addRole}
                                                        className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 cursor-pointer"
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
                                                {formErrors.role && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tech Stack <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={techStackInput}
                                                        onChange={(e) => setTechStackInput(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950"
                                                        placeholder="Enter technology (e.g., React, Node.js)"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addTechStack}
                                                        className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 cursor-pointer"
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
                                                {formErrors.techStack && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.techStack}</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Gradient <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.gradient}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, gradient: e.target.value }))}
                                                        className={`w-full px-3 py-2 border ${formErrors.gradient ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950`}
                                                        placeholder="linear-gradient(145deg,#4F46E5,#000)"
                                                    />
                                                    <div
                                                        className="w-full h-8 rounded mt-1"
                                                        style={{ background: formData.gradient }}
                                                    ></div>
                                                    {formErrors.gradient && (
                                                        <p className="mt-1 text-sm text-red-600">{formErrors.gradient}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-gray-700">Show Projects</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.statusShow}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, statusShow: e.target.checked }))}
                                                        className="w-5 h-5 text-blue-950 rounded cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex space-x-3 pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={formLoading}
                                                    className="flex-4/6 bg-blue-950 text-white py-2 px-4 rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                >
                                                    {formLoading ? 'Saving...' : (editingProject ? 'Update' : 'Create')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    className="flex-2/6 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </>
    );
};