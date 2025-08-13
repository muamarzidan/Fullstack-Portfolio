"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";

import { IChromaGridProps, IChromaItem } from "../types/projects";
import ProjectModal from "./ModalProjects";


type SetterFn = (v: number | string) => void;
const ChromaGrid: React.FC<IChromaGridProps> = ({
    items,
    className = "",
    radius = 300,
    damping = 0.45,
    fadeOut = 0.6,
    ease = "power3.out",
}) => {
    const [selectedProject, setSelectedProject] = useState<IChromaItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const setX = useRef<SetterFn | null>(null);
    const setY = useRef<SetterFn | null>(null);
    const pos = useRef({ x: 0, y: 0 });
    const data = items;

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
        setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
        const { width, height } = el.getBoundingClientRect();
        pos.current = { x: width / 2, y: height / 2 };
        setX.current(pos.current.x);
        setY.current(pos.current.y);
    }, []);

    const moveTo = (x: number, y: number) => {
        gsap.to(pos.current, {
            x,
            y,
            duration: damping,
            ease,
            onUpdate: () => {
                setX.current?.(pos.current.x);
                setY.current?.(pos.current.y);
            },
            overwrite: true,
        });
    };

    const handleMove = (e: React.PointerEvent) => {
        const r = rootRef.current!.getBoundingClientRect();
        moveTo(e.clientX - r.left, e.clientY - r.top);
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    };

    const handleLeave = () => {
        gsap.to(fadeRef.current, {
            opacity: 0.1,
            duration: fadeOut,
            overwrite: true,
        });
    };

    const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
        const c = e.currentTarget as HTMLElement;
        const rect = c.getBoundingClientRect();
        c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    const handleCardClick = (project: IChromaItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleDetailClick = (project: IChromaItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex justify-center items-center py-32 min-h-[200px]">
                <div className="text-gray-500 text-lg">
                    Projects will be displayed soon.
                </div>
            </div>
        );
    };

    return (
        <>
            <div
                ref={rootRef}
                onPointerMove={handleMove}
                onPointerLeave={handleLeave}
                className={`relative w-full h-full flex flex-wrap 
                ${data.length === 1 ? "justify-center" : "justify-center sm:justify-between"} 
                gap-y-8 sm:gap-y-8 xl:gap-y-6 ${className}`}
                style={
                    {
                        "--r": `${radius}px`,
                        "--x": "50%",
                        "--y": "50%",
                    } as React.CSSProperties
                }
            >
                {data.map((c, i) => (
                    <article
                        key={c.id || i}
                        onMouseMove={handleCardMove}
                        onClick={(e) => handleCardClick(c, e)}
                        className="group relative flex flex-col w-10/12 sm:w-[300px] rounded-2xl overflow-hidden transition-colors duration-300 cursor-pointer gap-5 p-3"
                        style={
                            {
                                background: c.gradient,
                                "--spotlight-color": "rgba(255,255,255, 0.2)",
                            } as React.CSSProperties
                        }
                    >
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
                            style={{
                                background:
                                    "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
                            }}
                        />
                        <div className="relative z-10 box-border">
                            <Image
                                src={c.image}
                                alt={c.title}
                                width={500}
                                height={500}
                                loading="lazy"
                                className="w-full h-[180px] object-cover rounded-xl"
                            />
                        </div>
                        <div className="h-full flex flex-col justify-between gap-2">
                            <footer className="relative z-10 text-white space-y-1">
                                <h3 className="text-lg font-bold leading-tight line-clamp-2">{c.title}</h3>
                                <p className="text-sm opacity-90 line-clamp-3">{c.description}</p>
                            </footer>
                            <button 
                                    onClick={(e) => handleDetailClick(c, e)}
                                    className="relative z-10 w-full px-4 py-2 mt-2 backdrop-blur-2xl shadow-2xl bg-white/10 hover:bg-white/30 text-white rounded-xl font-medium transition-colors cursor-pointer"
                                >
                                    View Details
                            </button>
                        </div>
                    </article>
                ))}
                <div
                    className="absolute inset-0 pointer-events-none z-30"
                    style={{
                        // backdropFilter: "grayscale(1) brightness(0.78)",
                        WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
                        background: "rgba(0,0,0, 0.001)",
                        maskImage:
                            "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
                        WebkitMaskImage:
                            "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
                    }}
                />
                <div
                    ref={fadeRef}
                    className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
                    style={{
                        backdropFilter: "grayscale(1) brightness(0.78)",
                        WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
                        background: "rgba(0,0,0,0.001)",
                        maskImage:
                            "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
                        WebkitMaskImage:
                            "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
                        opacity: 1,
                    }}
                />
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </>
    );
};

export default ChromaGrid;