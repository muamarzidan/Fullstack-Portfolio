interface Contact {
    id: string
    name: string
    email: string
    message: string
    createdAt: string
    updatedAt: string
};

interface ContactCardProps {
    contact: Contact
    showActions?: boolean
    onEdit?: (contact: Contact) => void
    onDelete?: (id: string) => void
};

export default function ContactCard({
    contact,
    showActions = false,
    onEdit,
    onDelete
}: ContactCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border">

            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {contact.name}
                </h3>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {contact.email}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {contact.message}
                </p>

                {showActions && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit?.(contact)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete?.(contact.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
};