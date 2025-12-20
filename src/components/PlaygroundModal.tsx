
import React from 'react';

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export const PlaygroundModal: React.FC<PlaygroundModalProps> = ({ isOpen, onClose, code }) => {
  if (!isOpen) return null;

  // Encode the code for the URL
  const encodedCode = encodeURIComponent(code);
  const playgroundUrl = `https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&code=${encodedCode}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content - Cyberpunk HUD Style */}
      <div className="relative w-full h-full max-w-6xl bg-slate-900 border border-slate-700 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316] animate-pulse"></div>
             <span className="font-mono text-sm text-slate-300 font-bold tracking-widest uppercase">
                Remote Execution Environment
             </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 bg-slate-900 relative">
            <iframe
                src={playgroundUrl}
                className="absolute inset-0 w-full h-full border-0"
                title="Rust Playground"
                allow="clipboard-write"
            />
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex justify-between">
            <span>POWERED BY play.rust-lang.org</span>
            <span>SECURE CONNECTION ESTABLISHED</span>
        </div>
      </div>
    </div>
  );
};
