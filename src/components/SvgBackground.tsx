
import React from 'react';

interface SvgBackgroundProps {
  isDark: boolean;
}

export const SvgBackground: React.FC<SvgBackgroundProps> = ({ isDark }) => {
  // Configuración de colores según el tema
  const colors = isDark
    ? {
        bg: '#0f172a', // Slate 900
        grid: '#334155', // Slate 700
        orb1: '#ea580c', // Orange
        orb2: '#3b82f6', // Blue
        opacity: 0.12
      }
    : {
        bg: '#f8fafc', // Slate 50
        grid: '#cbd5e1', // Slate 300
        orb1: '#fb923c', // Light Orange
        orb2: '#60a5fa', // Light Blue
        opacity: 0.16
      };

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden transition-colors duration-700 ease-in-out" style={{ backgroundColor: colors.bg }}>

      {/* 1. Static Tech Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tech-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={colors.grid} strokeWidth="0.5" />
            <circle cx="0" cy="0" r="1" fill={colors.grid} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tech-grid)" />
      </svg>

      {/* 2. Subtle Static Orbs (no animation) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-12%] left-[-12%] w-[52vw] h-[52vw] rounded-full filter blur-[90px]"
          style={{ backgroundColor: colors.orb1, opacity: colors.opacity }}
        />
        <div
          className="absolute bottom-[-12%] right-[-12%] w-[52vw] h-[52vw] rounded-full filter blur-[90px]"
          style={{ backgroundColor: colors.orb2, opacity: colors.opacity }}
        />
        <div
          className="absolute top-[28%] left-[28%] w-[38vw] h-[38vw] rounded-full filter blur-[110px]"
          style={{ backgroundColor: colors.orb1, opacity: colors.opacity * 0.75 }}
        />
      </div>
    </div>
  );
};
