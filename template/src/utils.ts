// MagicUI utility functions
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Animation utilities for MagicUI components
export const animations = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    scaleIn: 'animate-scale-in',
    bounceIn: 'animate-bounce-in',
    navHighlight: 'animate-nav-highlight',
    contentAppear: 'animate-content-appear',
};

// Component variants for consistent styling
export const variants = {
    button: {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
        ghost: 'hover:bg-gray-100 text-gray-700',
    },
    card: {
        default: 'bg-white rounded-lg shadow-sm border border-gray-200',
        hover: 'transition-all duration-200 hover:shadow-md hover:-translate-y-1',
    },
    nav: {
        item: 'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
        active: 'bg-primary-100 text-primary-700',
        inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
    },
};

// Responsive breakpoints helper
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

// API status color helpers
export const statusColors = {
    GET: 'text-green-600 bg-green-50',
    POST: 'text-blue-600 bg-blue-50',
    PUT: 'text-orange-600 bg-orange-50',
    PATCH: 'text-purple-600 bg-purple-50',
    DELETE: 'text-red-600 bg-red-50',
};

// Theme configuration
export const theme = {
    colors: {
        primary: 'rgb(59 130 246)',
        success: 'rgb(16 185 129)',
        warning: 'rgb(245 158 11)',
        error: 'rgb(239 68 68)',
        info: 'rgb(6 182 212)',
    },
    spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
    },
};
