/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neo: {
                    bg: '#0a0a0a', // Pure Industrial Black
                    panel: 'rgba(20, 20, 20, 0.8)', // Dark Matte Panel
                    primary: '#FFD700', // Gold/Yellow (Industrial High-Vis)
                    secondary: '#00e5ff', // Cyan (Electric contrast)
                    alert: '#ff3333', // Bright Red
                    text: '#e5e5e5', // Off-white
                    muted: '#a3a3a3' // Neutral Gray
                }
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'neo': '0 0 15px rgba(0, 204, 255, 0.1)', // Blue glow
                'neo-hover': '0 0 25px rgba(0, 204, 255, 0.3)', // Stronger blue glow
                'neo-inner': 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
            }
        },
    },
    plugins: [],
}
