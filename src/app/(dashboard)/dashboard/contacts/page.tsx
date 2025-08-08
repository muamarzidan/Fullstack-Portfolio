'use client'
import { useEffect, useState } from 'react';
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


interface Contact {
    id: string
    name: string
    email: string
    message: string
    createdAt: string
    updatedAt: string
};

interface ContactForm {
    name: string
    email: string
    message: string
};

interface PaginationData {
    currentPage: number
    totalPages: number
    totalContacts: number
    hasNext: boolean
    hasPrev: boolean
};

export default function DashboardContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        message: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalContacts: 0,
        hasNext: false,
        hasPrev: false
    });


    useEffect(() => {
        fetchContacts();
    }, [currentPage, appliedSearch]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(appliedSearch && { search: appliedSearch })
            });

            const response = await fetch(`/api/contact?${params}`);

            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            };

            const data = await response.json();
            setContacts(data.contacts);
            setPagination(data.pagination);
        } catch (err) {
            setError('Failed to load contacts');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setAppliedSearch(searchInput);
        setCurrentPage(1);
    };

    const handleCreate = () => {
        setEditingContact(null);
        setFormData({ name: '', email: '', message: '' });
        setShowForm(true);
    };

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            email: contact.email,
            message: contact.message
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) {
            return;
        };

        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete contact');
            };

            await fetchContacts();
        } catch (err: any) {
            alert(err.message || 'Failed to delete contact');
            console.error('Delete error:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const url = editingContact
                ? `/api/contact/${editingContact.id}`
                : '/api/contact';

            const method = editingContact ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${editingContact ? 'update' : 'create'} contact`);
            };

            setShowForm(false);
            setEditingContact(null);
            setFormData({ name: '', email: '', message: '' });
            await fetchContacts();
        } catch (err: any) {
            alert(err.message || `Failed to ${editingContact ? 'update' : 'create'} contact`);
            console.error('Submit error:', err);
        } finally {
            setFormLoading(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingContact(null);
        setFormData({ name: '', email: '', message: '' });
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(pagination.totalPages);
    };

    if (loading && contacts.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Loading contacts...</div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">{error}</div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="">
                <div className="flex justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">Contact Management</h2>
                </div>
            </div>

            {/* Search Bar */}
            <div className="">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative min-w-[400px]">
                            <input
                                type="text"
                                placeholder="Search by name, email, or message..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent"
                            />
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 text-base bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                            Search
                        </button>
                        {appliedSearch && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput('');
                                    setAppliedSearch('');
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleCreate}
                        className="inline-flex gap-2 items-center px-4 py-2 bg-green-700 text-base text-white rounded-lg hover:bg-green-900 transition-colors cursor-pointer"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Add Contact
                    </button>
                </form>
                {appliedSearch && (
                    <div className="mt-2 text-sm text-gray-600">
                        Searching for: <span className="font-medium">&quot;{appliedSearch}&quot;</span>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                                    Message
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-800 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-gray-500 text-lg">No contacts found</div>
                                        <p className="text-gray-400 mt-1">
                                            {appliedSearch ? 'Try adjusting your search terms' : 'Create your first contact to get started'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((contact, index) => (
                                    <tr key={contact.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-800">{contact.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-800">{contact.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-800 max-w-xs truncate" title={contact.message}>
                                                {contact.message}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(contact)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit contact"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contact.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete contact"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={!pagination.hasPrev}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
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
                                        <span className="font-bold text-blue-900">{(currentPage - 1) * 10 + 1}</span>
                                        {' '}to{' '}
                                        <span className="font-bold text-blue-900">
                                            {Math.min(currentPage * 10, pagination.totalContacts)}
                                        </span>
                                        {' '}of{' '}
                                        <span className="font-medium">{pagination.totalContacts}</span>
                                        {' '}datas
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {/* First Page Button */}
                                        {currentPage > 3 && (
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
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={!pagination.hasPrev}
                                            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                currentPage <= 3 ? 'rounded-l-md' : ''
                                            }`}
                                        >
                                            <ChevronLeftIcon className="h-5 w-5" />
                                        </button>
                                        
                                        {/* Page numbers */}
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            const pageNumber = Math.max(1, currentPage - 2) + i;
                                            if (pageNumber > pagination.totalPages) return null;
                                            
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => goToPage(pageNumber)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        pageNumber === currentPage
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
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={!pagination.hasNext}
                                            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                currentPage >= pagination.totalPages - 2 ? 'rounded-r-md' : ''
                                            }`}
                                        >
                                            <ChevronRightIcon className="h-5 w-5" />
                                        </button>

                                        {/* Last Page Button */}
                                        {currentPage < pagination.totalPages - 2 && (
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

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl text-center font-semibold mb-4 text-gray-900">
                            {editingContact ? 'Edit Contact' : 'Add New Contact'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter contact name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter message"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-4/6 bg-blue-950 text-white py-2 px-4 rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                >
                                    {formLoading ? 'Saving...' : (editingContact ? 'Update' : 'Create')}
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
    );
};