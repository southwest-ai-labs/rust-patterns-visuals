
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const LatticeViz: React.FC = () => {
  const [complexity, setComplexity] = useState(1);

  return (
    <div className="my-10 bg-black border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl relative group">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">POST_QUANTUM_CRYPTO_LAB</h3>
          </div>
          <div className="flex gap-4 items-center">
              <span className="text-[9px] text-slate-500 font-black uppercase">Lattice_Dimensions</span>
              <input 
                type="range" min="1" max="5" value={complexity} 
                onChange={e => setComplexity(parseInt(e.target.value))} 
                className="w-24 h-1 bg-slate-800 appearance-none rounded-full accent-emerald-500" 
              />
          </div>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full max-w-lg aspect-video bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-emerald-500/[0.05] bg-[size:30px_30px]" style={{ transform: `rotate(${complexity * 5}deg) scale(${1 + complexity * 0.1})` }}></div>
              
              {/* Lattice Points */}
              <div className="grid grid-cols-6 grid-rows-4 gap-8 relative z-10">
                  {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.3)]"></div>
                  ))}
              </div>

              {/* The "Hard Problem" Vector */}
              <div className="absolute w-40 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)] rotate-[35deg] animate-pulse">
                  <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-white"></div>
                  <div className="absolute -top-6 left-0 text-[8px] font-black text-emerald-400 uppercase tracking-widest">Target_Vector (Shortest_Path)</div>
              </div>

              <div className="absolute top-4 right-6 text-[8px] font-mono text-slate-700 uppercase animate-pulse">Quantum_Resistance: OPTIMAL</div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
              <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-2">Shortest Vector Problem (SVP)</h4>
                  <p className="text-[11px] text-slate-400 italic">Incluso un ordenador cuántico no puede resolver de forma eficiente la búsqueda del punto más cercano en una rejilla de cientos de dimensiones.</p>
              </div>
              <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase mb-2">Rust implementation</h4>
                  <p className="text-[11px] text-slate-400 italic">La ausencia de Side-Channel attacks gracias al control total de memoria hace que Rust sea la base de la nueva web segura post-RSA.</p>
              </div>
          </div>
      </div>

      <div className="px-8 py-3 bg-slate-950 border-t border-slate-900 text-center">
          <span className="text-[8px] text-slate-700 font-mono uppercase tracking-[0.4em]">Protocol: Crystals-Kyber // Standard: NIST_FIPS_203</span>
      </div>
    </div>
  );
};
