
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
        opacity: 0.15
      }
    : {
        bg: '#f8fafc', // Slate 50
        grid: '#cbd5e1', // Slate 300
        orb1: '#fb923c', // Light Orange
        orb2: '#60a5fa', // Light Blue
        opacity: 0.2
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

      {/* 2. Ambient Moving Orbs (CSS Animation - GPU Accelerated) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orb 1: Primary Warmth */}
        <div 
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob"
            style={{ backgroundColor: colors.orb1, animationDelay: '0s' }}
        ></div>
        
        {/* Orb 2: Secondary Cool */}
        <div 
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob"
            style={{ backgroundColor: colors.orb2, animationDelay: '2s' }}
        ></div>

        {/* Orb 3: Accent */}
        <div 
            className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[80px] opacity-15 animate-blob"
            style={{ backgroundColor: colors.orb1, animationDelay: '4s' }}
        ></div>
      </div>

      {/* 3. Subtle Noise Overlay (Optional for texture) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate ease-in-out;
          will-change: transform; /* Hint to browser for GPU layer */
        }
      `}</style>
    </div>
  );
};
