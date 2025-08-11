"use client";
import React, { createContext, useContext, useEffect, useState } from "react";


type Theme = "light" | "dark";
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem("theme") as Theme;
            const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";
            const initialTheme = savedTheme || systemPreference;

            setTheme(initialTheme);
            document.documentElement.classList.toggle(
                "dark",
                initialTheme === "dark"
            );
            setMounted(true);
        } catch (error) {
            setTheme("light");
            setMounted(true);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            try {
                localStorage.setItem("THEME", theme);
                document.documentElement.classList.toggle("dark", theme === "dark");
            } catch (error) {
                console.warn("Could not save theme preference");
            }
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider
            value={{ theme: mounted ? theme : "light", toggleTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
