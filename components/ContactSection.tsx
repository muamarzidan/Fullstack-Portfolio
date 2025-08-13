"use client";
import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaSquareInstagram, FaGithub, FaLinkedin } from 'react-icons/fa6';

import { IFormData, IFormErrors } from '../types/contacts';


export default function ContactSection() {
    const [formData, setFormData] = useState<IFormData>({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState<IFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const sanitizeInput = (input: string): string => {
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .replace(/[<>]/g, ''); // Remove < and > characters
    };

    const sanitizeEmail = (input: string): string => {
        return input
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/\s/g, '')
            .toLowerCase();
    };

    const validateForm = (): boolean => {
        const newErrors: IFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.trim().length > 70) {
            newErrors.name = 'Name must be less than 70 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 2) {
            newErrors.message = 'Message must be at least 2 characters';
        } else if (formData.message.trim().length > 1000) {
            newErrors.message = 'Message must be less than 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let sanitizedValue: string;
        if (name === 'email') {
            sanitizedValue = sanitizeEmail(value);
        } else {
            sanitizedValue = sanitizeInput(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        if (errors[name as keyof IFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    message: formData.message.trim()
                }),
            });

            if (response.ok) {
                toast.success('Message sent successfully! Thank you for contacting us.');
                setFormData({ name: '', email: '', message: '' });
                setErrors({});
            } else {
                // const errorData = await response.json();
                // toast.error(errorData.message || 'Failed to send message. Please try again.');
                toast.error('Failed to send message. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred while sending your message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        Contact Information
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <HiOutlineMail className="w-6 h-6 text-blue-950 dark:text-blue-800" />
                            <span className="text-gray-700 dark:text-gray-300">
                                your.email@example.com
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <HiOutlineLocationMarker className="w-6 h-6 text-blue-950 dark:text-blue-800" />
                            <span className="text-gray-700 dark:text-gray-300">
                                Bandung, Indonesia
                            </span>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        Social Media
                    </h3>
                    <div className="flex flex-wrap">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1/4"
                        >
                            <FaSquareInstagram className="w-20 h-20" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-blue-600 transition-colors flex-1/4"
                        >
                            <FaGithub className="w-20 h-20" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-blue-600 transition-colors flex-1/4"
                        >
                            <FaLinkedin className="w-20 h-20" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-blue-600 transition-colors flex-1/4"
                        >
                            <Image
                                src="/assets/icons/dribbble.png"
                                alt="Profile Picture"
                                width={80}
                                height={80}
                                className="rounded-full"
                            />
                        </a>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Send a Message
                </h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors ${errors.name
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-900 focus:border-blue-900 dark:focus:border-blue-500'
                                }`}
                            placeholder="Input name here"
                            maxLength={70}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors ${errors.email
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-900 focus:border-blue-900 dark:focus:border-blue-500'
                                }`}
                            placeholder="Input email here"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none resize-vertical transition-colors ${errors.message
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-900 focus:border-blue-900 dark:focus:border-blue-500'
                                }`}
                            placeholder="Input message here"
                            maxLength={1000}
                        />
                        {errors.message && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.message}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {formData.message.length}/1000 characters
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-950 dark:bg-blue-900 text-white py-3 px-4 rounded-xl hover:bg-blue-900 dark:hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};