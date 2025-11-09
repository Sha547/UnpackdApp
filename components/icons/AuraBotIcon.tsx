import React from 'react';

const MiaBotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <radialGradient id="mia-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'currentColor', stopOpacity: 0.4}} />
                <stop offset="100%" style={{stopColor: 'currentColor', stopOpacity: 0}} />
            </radialGradient>
            <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#22d3ee'}} />
                <stop offset="100%" style={{stopColor: '#0891b2'}} />
            </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#mia-grad)" />
        <path d="M25,55 C25,35 75,35 75,55 C75,75 60,85 50,85 C40,85 25,75 25,55 Z" fill="url(#body-grad)" stroke="#cffafe" strokeWidth="2"/>
        <circle cx="40" cy="55" r="5" fill="white" />
        <circle cx="60" cy="55" r="5" fill="white" />
        <circle cx="41" cy="56" r="2" fill="black" />
        <circle cx="61" cy="56" r="2" fill="black" />
        <path d="M45,68 Q50,75 55,68" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="50" y1="35" x2="50" y2="25" stroke="#cffafe" strokeWidth="2" />
        <circle cx="50" cy="22" r="3" fill="#22d3ee" stroke="white" strokeWidth="1" />
    </svg>
);

export default MiaBotIcon;