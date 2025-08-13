// FE
export interface IProject {
    id?: string;
    title: string;
    description: string;
    image: string;
    company: string;
    role: string[];
    techStack: string[];
    url: string;
    statusShow: boolean;
    gradient: string;
    createdAt?: string;
    updatedAt?: string;
};
export interface IProjectCardProps {
    project: IProject
    showActions?: boolean
    onEdit?: (project: IProject) => void
    onDelete?: (id: string) => void
};
export interface IChromaItem {
    id?: string;
    title: string;
    description: string;
    image: string;
    company: string;
    role: string[];
    techStack: string[];
    url: string;
    statusShow: boolean;
    gradient: string;
    createdAt?: string;
    updatedAt?: string;
};
export interface IChromaGridProps {
    items?: IChromaItem[];
    className?: string;
    radius?: number;
    damping?: number;
    fadeOut?: number;
    ease?: string;
};



// BE
export interface IProjectForm {
    title: string;
    description: string;
    image: string;
    company: string;
    role: string[];
    techStack: string[];
    url: string;
    statusShow: boolean;
    gradient: string;
}