/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./template/**/*.{html,js,mjs,ts}', './template/src/**/*.{js,mjs,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            animation: {
                // MagicUI animations
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-in': 'bounceIn 0.6s ease-out',
                // API Doc specific animations
                'nav-highlight': 'navHighlight 0.3s ease-out',
                'content-appear': 'contentAppear 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                navHighlight: {
                    '0%': { backgroundColor: 'transparent' },
                    '100%': { backgroundColor: 'rgb(59 130 246 / 0.1)' },
                },
                contentAppear: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            colors: {
                // Modern color palette for API documentation
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    900: '#1e3a8a',
                },
                // API status colors
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#06b6d4',
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
            },
        },
    },
    plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
