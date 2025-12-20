
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const RustVsWorldVisualizer: React.FC = () => {
  const [lang, setLang] = useState<'rust' | 'cpp' | 'gc'>('rust');

  return (
    <div className="my-10 bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-950 px-8 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">MEMORY_MODEL_COMPARISON</h3>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button onClick={() => setLang('rust')} className={`px-4 py-1 rounded text-[9px] font-black uppercase transition-all ${lang === 'rust' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>Rust</button>
              <button onClick={() => setLang('cpp')} className={`px-4 py-1 rounded text-[9px] font-black uppercase transition-all ${lang === 'cpp' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>C++</button>
              <button onClick={() => setLang('gc')} className={`px-4 py-1 rounded text-[9px] font-black uppercase transition-all ${lang === 'gc' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>GC (Go/Java)</button>
          </div>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full max-w-2xl h-48 bg-slate-900/50 rounded-2xl border border-slate-800 relative flex items-center justify-center">
              
              {lang === 'rust' && (
                  <div className="flex flex-col items-center gap-4 animate-fade-in">
                      <div className="flex gap-4">
                          <div className="w-24 h-12 bg-orange-500 border-2 border-orange-400 rounded-lg flex items-center justify-center font-black text-xs text-white uppercase">Owner A</div>
                          <div className="w-12 h-[2px] bg-orange-500 animate-pulse"></div>
                          <div className="w-24 h-12 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center font-black text-xs text-slate-500 uppercase">DATA</div>
                      </div>
                      <p className="text-[10px] text-orange-400 font-mono uppercase tracking-widest">Ownership Transfer: Zero Overhead</p>
                  </div>
              )}

              {lang === 'cpp' && (
                  <div className="flex flex-col items-center gap-4 animate-fade-in">
                      <div className="flex gap-4">
                          <div className="w-24 h-12 bg-blue-500 border-2 border-blue-400 rounded-lg flex items-center justify-center font-black text-xs text-white uppercase">Ptr 1</div>
                          <div className="w-24 h-12 bg-blue-500 border-2 border-blue-400 rounded-lg flex items-center justify-center font-black text-xs text-white uppercase">Ptr 2</div>
                          <div className="w-24 h-12 bg-red-500/40 border-2 border-red-500 rounded-lg flex items-center justify-center font-black text-xs text-white uppercase animate-pulse">FREED!</div>
                      </div>
                      <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest">Danger: Double-free or Use-after-free</p>
                  </div>
              )}

              {lang === 'gc' && (
                  <div className="flex flex-col items-center gap-4 animate-fade-in">
                      <div className="w-full h-8 bg-purple-600/20 absolute top-0 animate-bounce flex items-center justify-center text-[8px] text-purple-400 font-black uppercase">GC PAUSE IN PROGRESS...</div>
                      <div className="grid grid-cols-4 gap-2">
                          {Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} className="w-12 h-12 bg-purple-500/20 border border-purple-500/40 rounded flex items-center justify-center text-[8px] text-purple-400">REF</div>
                          ))}
                      </div>
                      <p className="text-[10px] text-purple-400 font-mono uppercase tracking-widest">Cost: Runtime Latency Spikes</p>
                  </div>
              )}
          </div>

          <div className="mt-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 w-full max-w-lg text-center">
              <p className="text-xs text-slate-400 italic">
                  <T>{lang === 'rust' ? 
                    "Rust resuelve la seguridad en tiempo de compilación. No hay basura que recolectar y el compilador evita punteros inválidos." : 
                    lang === 'cpp' ? 
                    "C++ requiere disciplina manual o Smart Pointers que pueden causar ciclos de referencia. Un error es un segfault o brecha de seguridad." :
                    "El GC simplifica el desarrollo pero añade un recolector que escanea la memoria periódicamente, causando latencia impredecible."}
                  </T>
              </p>
          </div>
      </div>
    </div>
  );
};
