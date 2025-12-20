
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const KernelVisualizer: React.FC = () => {
  const [isolation, setIsolation] = useState(true);

  return (
    <div className="my-10 bg-slate-950 border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">KERNEL_MEMORY_PAGER</h3>
          </div>
          <button 
            onClick={() => setIsolation(!isolation)}
            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${isolation ? 'bg-blue-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}
          >
            {isolation ? 'VIRTUAL_ISOLATION_ON' : 'KERNEL_PANIC_RISK'}
          </button>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full max-w-2xl flex flex-col gap-1">
              {/* User Space */}
              <div className="h-20 bg-emerald-900/20 border-2 border-emerald-500/30 rounded-t-2xl p-4 flex items-center justify-center relative overflow-hidden group">
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">User_Space (Ring_3)</div>
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Guard Page */}
              <div className={`h-4 transition-all duration-500 ${isolation ? 'bg-slate-900' : 'bg-red-500/40 animate-ping'} flex items-center justify-center`}>
                  <span className="text-[6px] font-black text-slate-700 uppercase">##_GUARD_PAGE_##</span>
              </div>

              {/* Kernel Space */}
              <div className={`h-32 rounded-b-2xl p-4 flex flex-col items-center justify-center relative transition-all duration-500 ${isolation ? 'bg-blue-900/20 border-2 border-blue-500/30' : 'bg-red-950 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'}`}>
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Kernel_Space (Ring_0)</div>
                  <div className="flex gap-4">
                      <div className="w-16 h-8 bg-black/40 border border-blue-500/20 rounded flex items-center justify-center text-[8px] text-blue-300 font-mono">IDT</div>
                      <div className="w-16 h-8 bg-black/40 border border-blue-500/20 rounded flex items-center justify-center text-[8px] text-blue-300 font-mono">GDT</div>
                      <div className="w-16 h-8 bg-black/40 border border-blue-500/20 rounded flex items-center justify-center text-[8px] text-blue-300 font-mono">PAGING</div>
                  </div>
                  {!isolation && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-600/10 backdrop-blur-[2px]">
                          <span className="text-red-500 font-black text-[10px] animate-bounce">SECURITY_EXPLOIT: SPECULATIVE_LEAK</span>
                      </div>
                  )}
              </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 w-full max-w-xl">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase mb-2">no_std Environment</h4>
                  <p className="text-[10px] text-slate-400 italic">Rust sin la librería estándar es capaz de ejecutarse directamente en el procesador, gestionando interrupciones de hardware con tipos seguros.</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase mb-2">Memory Safety</h4>
                  <p className="text-[10px] text-slate-400 italic">A diferencia de C, el sistema de ownership de Rust evita que un puntero del User Space acceda accidentalmente a secretos del Kernel.</p>
              </div>
          </div>
      </div>
    </div>
  );
};
