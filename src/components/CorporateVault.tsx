
import React from 'react';
import { T } from '../hooks/useChromeTranslation';

const PATTERNS = [
    { id: 'v1', title: 'HFT Matching Engine', desc: 'Lock-free LOB with sub-microsecond latency.', mmr: 2500, locked: true },
    { id: 'v2', title: 'Distributed Raft Core', desc: 'Linearizable consensus implementation.', mmr: 3000, locked: true },
    { id: 'v3', title: 'Zero-Copy Protobuf', desc: 'Direct memory mapping for high throughput.', mmr: 1500, locked: false }
];

export const CorporateVault: React.FC<{ userMMR: number }> = ({ userMMR }) => {
  return (
    <div className="my-10 space-y-6">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-xl shadow-indigo-900/20">🏛️</div>
            <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Corporate Architectural Vault</h3>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Proprietary Engineering Access</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PATTERNS.map(p => {
                const isLocked = userMMR < p.mmr;
                return (
                    <div key={p.id} className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${isLocked ? 'bg-slate-950 border-slate-800 opacity-60 grayscale' : 'bg-slate-900 border-indigo-500/30 hover:border-indigo-500 shadow-2xl'}`}>
                        {isLocked && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                                <span className="text-2xl mb-2">🔒</span>
                                <span className="text-[9px] font-black text-orange-500 uppercase font-mono">{p.mmr} MMR REQUIRED</span>
                            </div>
                        )}
                        <h4 className="text-sm font-bold text-white mb-2">{p.title}</h4>
                        <p className="text-[10px] text-slate-400 mb-4 leading-tight italic"><T>{p.desc}</T></p>
                        <button className={`w-full py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isLocked ? 'bg-slate-800 text-slate-600' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
                            {isLocked ? 'Access Denied' : 'Decrypt Source'}
                        </button>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
