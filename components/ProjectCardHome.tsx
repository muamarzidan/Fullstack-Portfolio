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

    const demo: IChromaItem[] = [
        {
            image: "/assets/images/projects/thumbnail_project_sunshine_MuzirO.png",
            title: "Alex Rivera",
            description: "Full Stack Developer",
            company: "@alexrivera",
            role: ["@alexrivera"],
            techStack: ["@alexrivera"],
            url: "https://github.com/",
            statusShow: true,
            gradient: "linear-gradient(145deg,#4F46E5,#000)",
        },
    ];

    const data = items?.length ? items : demo;

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

    if (!data.length) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-gray-500 text-lg">No projects found</div>
            </div>
        );
    };

    return (
        <>
            <div
                ref={rootRef}
                onPointerMove={handleMove}
                onPointerLeave={handleLeave}
                className={`relative w-full h-full flex flex-wrap justify-center items-start gap-3 ${className}`}
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
                        className="group relative flex flex-col w-[380px] rounded-[20px] overflow-hidden transition-colors duration-300 cursor-pointer gap-3 p-3"
                        style={
                            {
                                background: c.gradient || "linear-gradient(145deg,#4F46E5,#000)",
                                "--spotlight-color": "rgba(255,255,255, 0.3)",
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
                        <div className="relative z-10 flex-1 box-border">
                            <Image
                                src={c.image}
                                alt={c.title}
                                width={500}
                                height={500}
                                loading="lazy"
                                className="w-full h-[200px] object-cover rounded-[10px]"
                            />
                        </div>
                        <footer className="relative z-10 text-white font-sans">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold leading-tight">{c.title}</h3>
                                <p className="text-sm opacity-90 line-clamp-3">{c.description}</p>
                            </div>
                        </footer>
                        <button 
                                onClick={(e) => handleDetailClick(c, e)}
                                className="relative z-10 w-full px-4 py-2 mt-2 bg-white/90 hover:bg-white text-black rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                            >
                                View Details
                            </button>
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