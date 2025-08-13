import { IProjectCardProps } from "../types/projects"

export default function ProjectCard({
    project,
    showActions = false,
    onEdit,
    onDelete
}: IProjectCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                {project.statusShow && (
                    <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {project.title}
                    </h3>
                    <span className="text-sm text-gray-500 ml-2 truncate">{project.company}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {project.description}
                </p>

                {/* URL */}
                <div className="mb-3">
                    <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs truncate block"
                    >
                        {project.url}
                    </a>
                </div>

                {/* Role */}
                {project.role && project.role.length > 0 && (
                    <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Roles:</div>
                        <div className="flex flex-wrap gap-1">
                            {project.role.map((roleItem, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                >
                                    {roleItem}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                    <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Tech Stack:</div>
                        <div className="flex flex-wrap gap-1">
                            {project.techStack.map((tech, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gradient Preview */}
                <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Gradient:</div>
                    <div 
                        className="w-full h-4 rounded"
                        style={{ background: project.gradient }}
                    ></div>
                </div>

                {/* Timestamps */}
                {(project.createdAt || project.updatedAt) && (
                    <div className="text-xs text-gray-400 mb-3 space-y-1">
                        {project.createdAt && (
                            <div>Created: {new Date(project.createdAt).toLocaleDateString()}</div>
                        )}
                        {project.updatedAt && (
                            <div>Updated: {new Date(project.updatedAt).toLocaleDateString()}</div>
                        )}
                    </div>
                )}

                {showActions && (
                    <div className="flex space-x-2 pt-3 border-t border-gray-100">
                        <button
                            onClick={() => onEdit?.(project)}
                            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => project.id && onDelete?.(project.id)}
                            className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
};