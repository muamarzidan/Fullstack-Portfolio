export interface Category {
    title: string;
    count: number;
};

export interface Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
    imgIndex: number;
    isHovered: boolean;
};
