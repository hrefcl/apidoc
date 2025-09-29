/**
 * @file MagicUI utility functions for APIDoc template
 *
 * Provides centralized utility functions for component styling, animations,
 * and responsive design patterns used throughout the APIDoc template.
 * Includes type-safe styling helpers, animation utilities, and theme configuration.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge for conflict resolution
 *
 * Merges multiple class name inputs and automatically resolves TailwindCSS conflicts.
 * The last conflicting class wins (e.g., `bg-red-500` + `bg-blue-500` = `bg-blue-500`).
 * Perfect for conditional styling and component composition.
 *
 * @param inputs - Variable number of class name inputs (strings, objects, arrays, conditionals)
 * @returns Merged and deduplicated class string with conflicts resolved
 *
 * @example Basic usage
 * ```typescript
 * cn('bg-red-500', 'bg-blue-500', 'text-white')
 * // Returns: 'bg-blue-500 text-white' (last bg- class wins)
 * ```
 *
 * @example Conditional classes
 * ```typescript
 * cn(
 *   'px-4 py-2',
 *   isActive && 'bg-blue-500',
 *   isDisabled ? 'opacity-50' : 'hover:bg-blue-600'
 * )
 * ```
 *
 * @example Object syntax
 * ```typescript
 * cn({
 *   'bg-red-500': hasError,
 *   'bg-green-500': isSuccess,
 *   'text-white': true
 * })
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function cn(...inputs: any[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Animation class mappings for consistent UI transitions
 *
 * Provides standardized animation classes for common UI patterns.
 * All animations are defined in the global CSS and optimized for performance.
 * Use these constants instead of hardcoding animation classes.
 *
 * @example Basic usage
 * ```typescript
 * const element = `<div class="${animations.fadeIn}">Content</div>`
 * ```
 *
 * @example Dynamic animations
 * ```typescript
 * const getAnimation = (type: 'enter' | 'exit') =>
 *   type === 'enter' ? animations.fadeIn : animations.slideUp
 * ```
 *
 * @since 5.0.0
 * @public
 */
export const animations = {
    /** Smooth fade in transition - duration: 300ms */
    fadeIn: 'animate-fade-in',
    /** Slide up from bottom - duration: 400ms */
    slideUp: 'animate-slide-up',
    /** Slide down from top - duration: 400ms */
    slideDown: 'animate-slide-down',
    /** Scale in from center - duration: 200ms */
    scaleIn: 'animate-scale-in',
    /** Bounce in effect - duration: 600ms */
    bounceIn: 'animate-bounce-in',
    /** Navigation highlight animation - duration: 250ms */
    navHighlight: 'animate-nav-highlight',
    /** Content appearance with stagger - duration: 500ms */
    contentAppear: 'animate-content-appear',
} as const;

/**
 * Component style variants for consistent UI patterns
 *
 * Predefined style combinations for common UI components.
 * Ensures design system consistency across the APIDoc template.
 * Each variant includes all necessary styling including hover states.
 *
 * @example Button variants
 * ```typescript
 * <button className={variants.button.primary}>Primary Action</button>
 * <button className={variants.button.secondary}>Secondary Action</button>
 * ```
 *
 * @example Card variants
 * ```typescript
 * <div className={cn(variants.card.default, variants.card.hover)}>
 *   Interactive card content
 * </div>
 * ```
 *
 * @example Navigation variants
 * ```typescript
 * <nav className={variants.nav.item}>
 *   <a className={isActive ? variants.nav.active : variants.nav.inactive}>
 *     Navigation Item
 *   </a>
 * </nav>
 * ```
 *
 * @since 5.0.0
 * @public
 */
export const variants = {
    /** Button component style variants */
    button: {
        /** Primary button - main call-to-action styling */
        primary: 'bg-primary-500 hover:bg-primary-600 text-white',
        /** Secondary button - alternative action styling */
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
        /** Ghost button - minimal styling with hover effect */
        ghost: 'hover:bg-gray-100 text-gray-700',
    },
    /** Card component style variants */
    card: {
        /** Default card styling with border and shadow */
        default: 'bg-white rounded-lg shadow-sm border border-gray-200',
        /** Interactive card with hover animations */
        hover: 'transition-all duration-200 hover:shadow-md hover:-translate-y-1',
    },
    /** Navigation component style variants */
    nav: {
        /** Base navigation item styling */
        item: 'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
        /** Active navigation item highlighting */
        active: 'bg-primary-100 text-primary-700',
        /** Inactive navigation item with hover states */
        inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
    },
} as const;

/**
 * Responsive breakpoint definitions following TailwindCSS standards
 *
 * Standard breakpoint values for responsive design patterns.
 * Use these constants for consistent media queries and responsive behavior.
 * Matches TailwindCSS default breakpoint system.
 *
 * @example CSS-in-JS usage
 * ```typescript
 * const styles = {
 *   [`@media (min-width: ${breakpoints.md})`]: {
 *     fontSize: '1.5rem'
 *   }
 * }
 * ```
 *
 * @example Conditional rendering
 * ```typescript
 * const isMobile = window.innerWidth < parseInt(breakpoints.md)
 * ```
 *
 * @since 5.0.0
 * @public
 */
export const breakpoints = {
    /** Small devices (640px and up) - Mobile landscape */
    sm: '640px',
    /** Medium devices (768px and up) - Tablets */
    md: '768px',
    /** Large devices (1024px and up) - Small laptops */
    lg: '1024px',
    /** Extra large devices (1280px and up) - Desktops */
    xl: '1280px',
    /** 2X large devices (1536px and up) - Large desktops */
    '2xl': '1536px',
} as const;

/**
 * HTTP method status color mappings for API documentation
 *
 * Provides consistent color schemes for different HTTP methods.
 * Colors follow web standards and accessibility guidelines.
 * Includes both text and background colors for badges and indicators.
 *
 * @example HTTP method badge
 * ```typescript
 * <span className={statusColors.GET}>GET</span>
 * <span className={statusColors.POST}>POST</span>
 * ```
 *
 * @example Dynamic method styling
 * ```typescript
 * const getMethodColor = (method: string) =>
 *   statusColors[method as keyof typeof statusColors] || 'text-gray-600 bg-gray-50'
 * ```
 *
 * @since 5.0.0
 * @public
 */
export const statusColors = {
    /** GET method - green color scheme for safe operations */
    GET: 'text-green-600 bg-green-50',
    /** POST method - blue color scheme for creation operations */
    POST: 'text-blue-600 bg-blue-50',
    /** PUT method - orange color scheme for update operations */
    PUT: 'text-orange-600 bg-orange-50',
    /** PATCH method - purple color scheme for partial updates */
    PATCH: 'text-purple-600 bg-purple-50',
    /** DELETE method - red color scheme for destructive operations */
    DELETE: 'text-red-600 bg-red-50',
} as const;

/**
 * Design system theme configuration
 *
 * Central theme configuration object containing design tokens for colors,
 * spacing, and border radius. Provides consistent design language across
 * the entire APIDoc template. Values are optimized for accessibility and
 * visual hierarchy.
 *
 * @example Color usage
 * ```typescript
 * const alertStyles = {
 *   backgroundColor: theme.colors.error,
 *   color: 'white'
 * }
 * ```
 *
 * @example Spacing usage
 * ```typescript
 * const containerStyles = {
 *   padding: theme.spacing.md,
 *   margin: theme.spacing.lg
 * }
 * ```
 *
 * @example Border radius usage
 * ```typescript
 * const cardStyles = {
 *   borderRadius: theme.borderRadius.lg
 * }
 * ```
 *
 * @since 5.0.0
 * @public
 */
export const theme = {
    /** Color palette with semantic meaning */
    colors: {
        /** Primary brand color - blue-500 */
        primary: 'rgb(59 130 246)',
        /** Success state color - green-500 */
        success: 'rgb(16 185 129)',
        /** Warning state color - amber-500 */
        warning: 'rgb(245 158 11)',
        /** Error state color - red-500 */
        error: 'rgb(239 68 68)',
        /** Informational color - cyan-500 */
        info: 'rgb(6 182 212)',
    },
    /** Consistent spacing scale based on 0.5rem increments */
    spacing: {
        /** Extra small spacing - 8px */
        xs: '0.5rem',
        /** Small spacing - 16px */
        sm: '1rem',
        /** Medium spacing - 24px */
        md: '1.5rem',
        /** Large spacing - 32px */
        lg: '2rem',
        /** Extra large spacing - 48px */
        xl: '3rem',
    },
    /** Border radius scale for consistent roundedness */
    borderRadius: {
        /** Small radius - 4px */
        sm: '0.25rem',
        /** Medium radius - 6px */
        md: '0.375rem',
        /** Large radius - 8px */
        lg: '0.5rem',
        /** Extra large radius - 12px */
        xl: '0.75rem',
    },
} as const;
