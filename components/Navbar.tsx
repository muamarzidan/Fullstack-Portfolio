"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";


import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');


    const navItems = [
        { href: "#skills", label: "Skills" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" },
    ];

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const scrollToSection = (href: string) => {
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsOpen(false);
    };

    useEffect(() => {
        const sectionIds = navItems.map(item => item.href);
        
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;

            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const section = document.querySelector(sectionIds[i]);
                if (section) {
                    const offsetTop = section.getBoundingClientRect().top + window.scrollY;

                    if (scrollPosition >= offsetTop) {
                        setActiveSection(sectionIds[i]);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <nav className="sticky top-0 z-40 backdrop-blur-3xl bg-white/30 dark:bg-blue-950/30">
                <div className="max-w-7xl mx-auto px-4 xl:px-0">
                    <div className="flex justify-between h-16">
                        {/* Logo/Home */}
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-blue-950 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                                MuzirO
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navItems.map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => scrollToSection(item.href)}
                                    className={`
                                        relative px-4 py-2 text-sm transition-colors cursor-pointer
                                        ${activeSection === item.href 
                                            ? 'text-blue-950 dark:text-blue-300 font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-blue-950 dark:after:bg-blue-300 after:transition-all after:duration-300' 
                                            : 'text-gray-900 dark:text-gray-200 hover:text-blue-900 dark:hover:text-blue-300'}
                                    `}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <DarkModeToggle />
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center space-x-2">
                            <DarkModeToggle />
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md cursor-pointer text-gray-800 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Background overlay */}
                    <div className="fixed inset-0 bg-black opacity-50 dark:bg-opacity-70"></div>
                    
                    {/* Sidebar */}
                    <div className="mobile-menu fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out">
                        <div className="flex items-center justify-end h-16 px-4 border-b dark:border-gray-700">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="cursor-pointer p-2 rounded-md text-gray-800 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="py-6">
                            {navItems.map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => scrollToSection(item.href)}
                                    className="block w-full text-left px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};