
import React, { useState } from 'react';

export const ShareButton: React.FC = () => {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = () => {
    // In a real app with routing, this would copy the specific URL.
    // Since we are SPA without Router, we copy the base URL + title for context
    const text = `Check out this Rust Pattern on Rust.Hub! ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
        <button 
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-slate-800/20 dark:hover:bg-slate-200/10 transition-all duration-200 hover:scale-110 group relative"
            title="Share Lesson"
        >
            <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
        </button>
        {showCopied && (
            <div className="absolute top-10 right-0 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg animate-fade-in whitespace-nowrap">
                COPIED LINK
            </div>
        )}
    </div>
  );
};
