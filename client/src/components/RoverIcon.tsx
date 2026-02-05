import React from 'react';

export const RoverIcon = ({ className = "w-6 h-6", fill = "currentColor" }: { className?: string, fill?: string }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="roverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: fill, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: fill, stopOpacity: 0.6 }} />
            </linearGradient>
        </defs>

        {/* Futuristic Hexagon Enclosure */}
        <path
            d="M50 8 L88 28 V72 L50 92 L12 72 V28 Z"
            fill="none"
            stroke={fill}
            strokeWidth="6"
            strokeLinejoin="round"
            className="animate-pulse-slow"
        />

        {/* Tech Nodes */}
        <circle cx="12" cy="28" r="4" fill={fill} />
        <circle cx="88" cy="28" r="4" fill={fill} />
        <circle cx="88" cy="72" r="4" fill={fill} />
        <circle cx="12" cy="72" r="4" fill={fill} />

        {/* Central Core / Eye */}
        <g className="origin-center animate-[spin_10s_linear_infinite]">
            <path d="M50 35 L50 25" stroke={fill} strokeWidth="4" />
            <path d="M50 75 L50 65" stroke={fill} strokeWidth="4" />
            <path d="M30 50 L20 50" stroke={fill} strokeWidth="4" />
            <path d="M80 50 L70 50" stroke={fill} strokeWidth="4" />
            <circle cx="50" cy="50" r="18" fill="none" stroke={fill} strokeWidth="3" />
        </g>

        <circle cx="50" cy="50" r="8" fill={fill} className="animate-pulse" />
    </svg>
);
