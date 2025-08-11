"use client";
import { useEffect, useState } from "react";
import { GrHostMaintenance } from "react-icons/gr";
import { CgClose } from "react-icons/cg";


export default function MaintenanceModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem("MODAL_MAINTENANCE");
        if (!hasSeen) {
            setIsOpen(true);
        }
    }, []);

    const closeModal = () => {
        localStorage.setItem("MODAL_MAINTENANCE", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeModal}
            ></div>

            {/* Modal */}
            <div className="relative bg-gray-100 dark:bg-blue-100 rounded-lg shadow-lg p-6 max-w-xs sm:max-w-md w-full z-10">
                <CgClose onClick={closeModal} className="absolute text-2xl top-3 right-3 text-black dark:hover:text-gray-300 cursor-pointer" title="Close popup"/>
                <div className="flex flex-col justify-center items-center gap-6 py-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        INFORMATION
                    </h2>
                    <GrHostMaintenance className="w-30 h-30 text-blue-950 mb-2" />
                    <p className="text-gray-800 dark:text-gray-300 text-center">
                        This website is currently under development. I apologize if this inconveniences you.
                    </p>
                </div>
            </div>
        </div>
    );
};