"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { FiX, FiExternalLink, FiUsers, FiLayers } from 'react-icons/fi';

import { IProject } from '../types/projects';


interface ProjectModalProps {
    project: IProject | null;
    isOpen: boolean;
    onClose: () => void;
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !project) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleVisitProject = () => {
        if (project.url) {
            window.open(project.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleOverlayClick}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                    aria-label="Close modal"
                >
                    <FiX className="w-5 h-5 text-white" />
                </button>

                {/* Project Image */}
                <div className="relative w-full h-64 sm:h-80">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div 
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to bottom, ${project.gradient?.split(',')[0] || 'rgba(0,0,0,0.2)'} 0%, transparent 50%, rgba(0,0,0,0.4) 100%)`
                        }}
                    />
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title & Company */}
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {project.title}
                        </h2>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                            <FiLayers className="w-4 h-4 mr-2" />
                            {project.company}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            About This Project
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    {/* Roles */}
                    {project.role && project.role.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <FiUsers className="w-5 h-5 mr-2" />
                                My Role{project.role.length > 1 ? 's' : ''}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.role.map((roleItem, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800"
                                    >
                                        {roleItem}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <FiLayers className="w-5 h-5 mr-2" />
                                Technologies Used
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Visit Project Button */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleVisitProject}
                            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <FiExternalLink className="w-5 h-5" />
                            Visit Project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;