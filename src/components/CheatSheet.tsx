
import React from 'react';
import { T } from '../hooks/useChromeTranslation';

interface CheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheet: React.FC<CheatSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: 'Ownership & Borrowing',
      items: [
        { label: 'Move', code: 'let s2 = s1;', desc: 'Ownership transfer' },
        { label: 'Borrow', code: 'let r = &s;', desc: 'Immutable reference' },
        { label: 'Mut Borrow', code: 'let r = &mut s;', desc: 'Exclusive access' },
      ]
    },
    {
      title: 'Common Traits',
      items: [
        { label: 'Clone', code: 's.clone()', desc: 'Deep copy' },
        { label: 'Copy', code: 'let y = x;', desc: 'Implicit bitwise copy' },
        { label: 'Deref', code: '*x', desc: 'Smart pointer access' },
      ]
    },
    {
        title: 'Async Patterns',
        items: [
          { label: 'Join', code: 'tokio::join!(a, b)', desc: 'Run concurrent' },
          { label: 'Spawn', code: 'tokio::spawn(fut)', desc: 'Run background' },
          { label: 'Select', code: 'tokio::select! { ... }', desc: 'Race futures' },
        ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                <span className="text-orange-500">⚡</span> Rust.Hub Quick Reference
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map(section => (
                <div key={section.title}>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-1">{section.title}</h3>
                    <div className="space-y-4">
                        {section.items.map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs font-bold text-slate-300">{item.label}</span>
                                    <span className="text-[10px] text-slate-500 italic"><T>{item.desc}</T></span>
                                </div>
                                <code className="block bg-black/50 p-2 rounded text-[11px] text-orange-400 font-mono border border-slate-800">
                                    {item.code}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="px-6 py-3 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">Operator Toolset v1.0</span>
            <span className="text-[9px] text-slate-500 font-mono">ALT+C to toggle</span>
        </div>
      </div>
    </div>
  );
};
