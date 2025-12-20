import React from 'react';

interface HighlightTextProps {
  text: string;
  query: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text, query }) => {
  if (!query.trim()) {
    return <>{text}</>;
  }

  // Escape special regex characters in query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span 
            key={index} 
            className="bg-orange-500/30 dark:bg-orange-500/40 text-orange-700 dark:text-orange-200 rounded-[2px] px-[1px] font-bold shadow-[0_0_5px_rgba(249,115,22,0.2)]"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};