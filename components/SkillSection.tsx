"use client";
import React, { useEffect, useRef, useState } from "react";

import { Category, Ball } from "../types/skills";


const categories: Category[] = [
    { title: "Novice", count: 3 },
    { title: "Advance Beginner", count: 6 },
    { title: "Competent", count: 11 },
    { title: "Proficient", count: 4 },
];

const imagesList = [
    // Novice
    "/assets/icons/gooo.png",
    "/assets/icons/laravel.jpg",
    "/assets/icons/gitlab.jpg",
    // Advance Beginner
    "/assets/icons/redux.webp",
    "/assets/icons/jest.png",
    "/assets/icons/expo.png",
    "/assets/icons/mysql.png",
    "/assets/icons/psgree.png",
    "/assets/icons/prisma.png",
    // Competent
    "/assets/icons/nodejs.png",
    "/assets/icons/figma.png",
    "/assets/icons/js_s6.png",
    "/assets/icons/typescript.webp",
    "/assets/icons/nextjs-plain-8x.png",
    "/assets/icons/boostap.png",
    "/assets/icons/vite.png",
    "/assets/icons/express.png",
    "/assets/icons/nbpm.png",
    "/assets/icons/github.png",
    "/assets/icons/git.png",
    // Proficient
    "/assets/icons/taiwlind.png",
    "/assets/icons/html_5.png",
    "/assets/icons/css_3.webp",
    "/assets/icons/react.png",
];

const imageNames: { [key: string]: string } = {
    "gooo.png": "Go",
    "laravel.jpg": "Laravel",
    "gitlab.jpg": "GitLab",
    "redux.webp": "Redux",
    "jest.png": "Jest",
    "expo.png": "Expo",
    "mysql.png": "MySQL",
    "psgree.png": "PostgreSQL",
    "prisma.png": "Prisma",
    "nodejs.png": "Node.js",
    "figma.png": "Figma",
    "js_s6.png": "JavaScript",
    "typescript.webp": "TypeScript",
    "nextjs-plain-8x.png": "Next.js",
    "boostap.png": "Bootstrap",
    "vite.png": "Vite",
    "express.png": "Express",
    "nbpm.png": "NPM",
    "github.png": "GitHub",
    "git.png": "Git",
    "taiwlind.png": "Tailwind CSS",
    "html_5.png": "HTML5",
    "css_3.webp": "CSS3",
    "react.png": "React",
};

export default function SkillsGrid() {
    let imageIndex = 0;

    return (
        <div className="max-w-7xl mx-auto px-4 xl:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {categories.map((cat, idx) => {
                const imgs = imagesList.slice(imageIndex, imageIndex + cat.count);
                imageIndex += cat.count;

                return (
                    <BouncingIconsBox
                        key={idx}
                        title={cat.title}
                        images={imgs}
                        categoryIndex={idx}
                    />
                );
            })}
        </div>
    );
};

function BouncingIconsBox({ 
    title, 
    images,
}: { 
    title: string; 
    images: string[];
    categoryIndex: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const loadedImagesRef = useRef<HTMLImageElement[]>([]);
    const ballsRef = useRef<Ball[]>([]);
    const animationIdRef = useRef<number>(0);
    const isAnimatingRef = useRef(false);
    const [tooltip, setTooltip] = useState<{ show: boolean; text: string; x: number; y: number }>({
        show: false,
        text: "",
        x: 0,
        y: 0
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;
        const MAX_SPEED = 0.8;

        const loadedImgs: HTMLImageElement[] = [];
        let loadedCount = 0;
        let allImagesProcessed = false;

        // Preload images dengan delay untuk area Competent
        const loadImagesWithDelay = async () => {
            for (let i = 0; i < images.length; i++) {
                const src = images[i];
                const img = new Image();
                
                await new Promise<void>((resolve) => {
                    img.onload = () => {
                        loadedCount++;
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${src}`);
                        loadedCount++;
                        resolve();
                    };
                    img.src = src;
                });

                loadedImgs.push(img);
                
                // Tambah delay kecil untuk area Competent yang memiliki banyak gambar
                if (title === "Competent" && i < images.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
            
            allImagesProcessed = true;
            loadedImagesRef.current = loadedImgs;
            initializeBalls();
            startAnimation();
        };

        loadImagesWithDelay();

        function initializeBalls() {
            const balls: Ball[] = images.map((_, idx) => ({
                x: Math.random() * (W - 40),
                y: Math.random() * (H - 40),
                dx: (Math.random() - 0.5) * MAX_SPEED * 2,
                dy: (Math.random() - 0.5) * MAX_SPEED * 2,
                size: 40,
                imgIndex: idx,
                isHovered: false,
            }));

            ballsRef.current = balls;
        }

        function startAnimation() {
            if (isAnimatingRef.current) return;
            isAnimatingRef.current = true;

            function animate() {
                if (!ctx || !canvas || !allImagesProcessed) return;
                
                ctx.clearRect(0, 0, W, H);

                ballsRef.current.forEach((ball) => {
                    // Hanya update posisi jika ball tidak sedang di-hover
                    if (!ball.isHovered) {
                        ball.x += ball.dx;
                        ball.y += ball.dy;

                        // Pantulan horizontal
                        if (ball.x <= 0) {
                            ball.x = 0;
                            ball.dx = Math.abs(ball.dx);
                        } else if (ball.x + ball.size >= W) {
                            ball.x = W - ball.size;
                            ball.dx = -Math.abs(ball.dx);
                        }

                        // Pantulan vertikal
                        if (ball.y <= 0) {
                            ball.y = 0;
                            ball.dy = Math.abs(ball.dy);
                        } else if (ball.y + ball.size >= H) {
                            ball.y = H - ball.size;
                            ball.dy = -Math.abs(ball.dy);
                        }
                    }

                    // Gambar ball jika image sudah loaded
                    const img = loadedImagesRef.current[ball.imgIndex];
                    if (img && img.complete && img.naturalWidth > 0) {
                        ctx.drawImage(
                            img,
                            ball.x,
                            ball.y,
                            ball.size,
                            ball.size
                        );
                    }
                });

                animationIdRef.current = requestAnimationFrame(animate);
            }

            animate();
        }

        // Event listeners untuk mouse
        function handleMouseMove(e: MouseEvent) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let hoveredBallFound = false;

            ballsRef.current.forEach((ball) => {
                const wasHovered = ball.isHovered;
                const isCurrentlyHovered = 
                    mouseX >= ball.x &&
                    mouseX <= ball.x + ball.size &&
                    mouseY >= ball.y &&
                    mouseY <= ball.y + ball.size;

                ball.isHovered = isCurrentlyHovered;

                if (isCurrentlyHovered && !wasHovered) {
                    // Baru mulai hover
                    hoveredBallFound = true;
                    const imageName = images[ball.imgIndex];
                    const fileName = imageName.split('/').pop() || '';
                    const displayName = imageNames[fileName] || fileName.replace(/\.(png|jpg|webp|jpeg)$/i, '');
                    
                    setTooltip({
                        show: true,
                        text: displayName,
                        x: e.clientX,
                        y: e.clientY - 40
                    });
                } else if (isCurrentlyHovered) {
                    // Masih hover
                    hoveredBallFound = true;
                    setTooltip(prev => ({
                        ...prev,
                        x: e.clientX,
                        y: e.clientY - 40
                    }));
                }
            });

            if (!hoveredBallFound) {
                setTooltip({ show: false, text: "", x: 0, y: 0 });
            }
        }

        function handleMouseLeave() {
            ballsRef.current.forEach((ball) => {
                ball.isHovered = false;
            });
            setTooltip({ show: false, text: "", x: 0, y: 0 });
        }

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            isAnimatingRef.current = false;
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [images, title]);

    return (
        <>
            <div className="relative w-64 h-64 bg-white rounded-xl shadow-xl shadow-neutral-200 border-1 border-gray-200 xl:min-w-[280px]">
                <div className="absolute -top-5 z-30 left-1/2 transform -translate-x-1/2 text-center bg-white py-2 rounded-t-lg min-w-[160px] shadow-lg rounded-lg border-1 border-gray-100 shadow-neutral-200">
                    <span className="text-black text-sm font-medium whitespace-nowrap">
                        {title}
                    </span>
                </div>
                
                <canvas
                    ref={canvasRef}
                    width={256}
                    height={256}
                    className="block cursor-pointer w-full h-full"
                />
            </div>
            
            {/* Tooltip */}
            {tooltip.show && (
                <div
                    className="fixed z-50 bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none shadow-lg"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translateX(-50%)'
                    }}
                >
                    {tooltip.text}
                </div>
            )}
        </>
    );
};