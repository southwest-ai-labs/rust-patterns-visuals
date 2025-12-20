
import React, { useState } from 'react';
import { REFERENCE_VAULT, ReferenceItem } from '../data/referenceData';
import { T } from '../hooks/useChromeTranslation';

interface ReferenceVaultProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceVault: React.FC<ReferenceVaultProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  if (!isOpen) return null;

  const filtered = REFERENCE_VAULT.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-fade-in">
        {/* Header HUD */}
        <div className="px-8 py-6 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-orange-900/40">📚</div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">The Reference Vault</h2>
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase italic">Secure Knowledge Access // Operator Level 5</p>
                </div>
            </div>

            <div className="flex-1 max-w-md w-full relative">
                <input 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-orange-500 outline-none transition-all pl-10 font-mono"
                    placeholder="Search patterns, crates, or concepts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 opacity-30">🔍</span>
            </div>

            <div className="flex gap-2">
                {['All', 'Pattern', 'Crate', 'Concept'].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        {cat}
                    </button>
                ))}
                <button onClick={onClose} className="ml-4 p-2 bg-slate-800 rounded-full hover:bg-red-600 text-white transition-colors">✕</button>
            </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
            {filtered.map(item => (
                <div key={item.id} className="group bg-slate-950 border border-slate-800 p-6 rounded-2xl hover:border-orange-500/50 transition-all flex flex-col shadow-inner">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                            item.category === 'Pattern' ? 'text-blue-400 border-blue-900/50 bg-blue-950/20' :
                            item.category === 'Crate' ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20' :
                            'text-purple-400 border-purple-900/50 bg-purple-950/20'
                        }`}>
                            {item.category}
                        </span>
                        <button className="text-slate-700 hover:text-white transition-colors">🔗</button>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed flex-1 italic"><T>{item.description}</T></p>
                    
                    <div className="bg-black/50 p-4 rounded-xl border border-slate-800 mb-6 font-mono text-[10px] text-orange-300 relative overflow-hidden group-hover:border-orange-500/30">
                        <div className="absolute top-0 right-0 p-1 opacity-20 text-[8px]">CODE</div>
                        {item.snippet}
                    </div>

                    <div className="p-4 bg-emerald-950/10 border border-emerald-900/30 rounded-xl">
                        <h4 className="text-[9px] font-black text-emerald-500 uppercase mb-1 tracking-widest flex items-center gap-1">
                            <span className="text-emerald-400">💎</span> Best Practice
                        </h4>
                        <p className="text-[10px] text-slate-300 leading-tight"><T>{item.bestPractice}</T></p>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer HUD */}
        <div className="px-8 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-600">
            <div className="flex gap-4">
                <span>RECORDS_FOUND: {filtered.length}</span>
                <span>UPLINK_STATUS: SECURE</span>
            </div>
            <div className="flex gap-4">
                <span className="animate-pulse">● BROADCASTING_KNOWLEDGE</span>
                <span>ALT+R TO TOGGLE</span>
            </div>
        </div>
      </div>
    </div>
  );
};
