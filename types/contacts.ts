// FE
export interface IContactCardProps {
    contact: IContact
    showActions?: boolean
    onEdit?: (contact: IContact) => void
    onDelete?: (id: string) => void
};



// BE
export interface IContact {
    id: string
    name: string
    email: string
    message: string
    createdAt: string
    updatedAt: string
};

export interface IContactForm {
    name: string
    email: string
    message: string
};

export interface IPaginationData {
    currentPage: number
    totalPages: number
    totalContacts: number
    hasNext: boolean
    hasPrev: boolean
};