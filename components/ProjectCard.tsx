interface Project {
    id: string
    title: string
    description: string
    image: string
    createdAt: string
    updatedAt: string
}

interface ProjectCardProps {
    project: Project
    showActions?: boolean
    onEdit?: (project: Project) => void
    onDelete?: (id: string) => void
}

export default function ProjectCard({
    project,
    showActions = false,
    onEdit,
    onDelete
}: ProjectCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="aspect-video relative">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                </p>

                {showActions && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit?.(project)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete?.(project.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}