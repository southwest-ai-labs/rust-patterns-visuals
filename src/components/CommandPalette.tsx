
import React, { useState, useEffect, useRef } from 'react';
import { LESSON_LOOKUP } from '../constants';
import { REFERENCE_VAULT, ReferenceItem } from '../data/referenceData';
import { DifficultyLevel } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter results based on query from both Lessons and Reference Vault
  const results = React.useMemo(() => {
    if (!query) return LESSON_LOOKUP.slice(0, 5).map(l => ({ ...l, type: 'lesson' }));
    
    const lowerQuery = query.toLowerCase();
    
    const lessons = LESSON_LOOKUP.filter(l => 
      l.title.toLowerCase().includes(lowerQuery) ||
      (l.description && l.description.toLowerCase().includes(lowerQuery))
    ).map(l => ({ ...l, type: 'lesson' }));

    const references = REFERENCE_VAULT.filter(r => 
        r.title.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery)
    ).map(r => ({ ...r, type: 'reference' }));

    return [...lessons, ...references].slice(0, 10);
  }, [query]);

  useEffect(() => setSelectedIndex(0), [results]);

  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 50);
    } else {
        setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => (i + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => (i - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selected = results[selectedIndex];
            if (selected) {
                const item = selected as any;
                if (item.type === 'lesson') {
                    onSelect(item.id);
                } else {
                    alert(`Reference: ${item.title}\nBest Practice: ${item.bestPractice}`);
                }
                onClose();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, results, selectedIndex, onSelect, onClose]);

  if (!isOpen) return null;

  const getBadgeColor = (item: any) => {
      if (item.type === 'reference') return 'bg-indigo-500 shadow-[0_0_5px_#6366f1]';
      switch(item.difficulty as DifficultyLevel) {
          case 'Beginner': return 'bg-emerald-500';
          case 'Intermediate': return 'bg-amber-500';
          case 'Rustacean': return 'bg-red-500 shadow-[0_0_5px_#ef4444] animate-pulse';
          default: return 'bg-slate-500';
      }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col">
        
        {/* Input Field */}
        <div className="flex items-center border-b border-slate-700/50 px-4 py-4 bg-slate-900/50">
            <svg className="w-5 h-5 text-orange-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
                ref={inputRef}
                className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 focus:outline-none font-sans"
                placeholder="Search lessons (e.g. 'Async') or Patterns..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <div className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 px-2 py-1 rounded">ESC</div>
        </div>
        
        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-900/90">
            {results.length === 0 ? (
                <div className="px-4 py-12 text-center">
                    <div className="text-slate-600 mb-2">No results found for "{query}"</div>
                </div>
            ) : (
                <div className="py-2">
                    {results.map((item: any, idx) => (
                        <button
                            key={item.id}
                            onClick={() => { 
                                if (item.type === 'lesson') onSelect(item.id);
                                else alert(item.title);
                                onClose(); 
                            }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-all duration-75 ${
                                idx === selectedIndex 
                                    ? 'bg-orange-600/10 border-l-4 border-orange-500 pl-3' 
                                    : 'hover:bg-slate-800/50 border-l-4 border-transparent pl-3'
                            }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getBadgeColor(item)}`}></div>
                                
                                <div className="truncate">
                                    <div className={`font-medium ${idx === selectedIndex ? 'text-orange-400' : 'text-slate-200'}`}>
                                        <span className="text-[9px] opacity-40 mr-2 uppercase font-mono tracking-widest">{item.type}</span>
                                        {item.title}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate pr-4">{item.description}</div>
                                </div>
                            </div>
                            
                            {idx === selectedIndex && (
                                <span className="text-xs text-slate-400 font-mono flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                                    <span>{item.type === 'reference' ? 'View' : 'Jump'}</span> 
                                    <span className="text-[10px]">↵</span>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between font-mono">
             <div className="flex gap-4">
                 <span>↑↓ navigate</span>
                 <span>↵ select</span>
             </div>
             <div className="flex gap-2 items-center">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Beginner
                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Intermediate
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Rustacean
             </div>
        </div>
      </div>
    </div>
  );
};
