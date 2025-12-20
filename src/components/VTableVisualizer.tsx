
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const VTableVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'static' | 'dynamic'>('static');

  return (
    <div className="my-10 bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Dispatch & VTable HUD</h3>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setMode('static')}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${mode === 'static' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Static (impl T)
              </button>
              <button 
                onClick={() => setMode('dynamic')}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${mode === 'dynamic' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Dynamic (dyn T)
              </button>
          </div>
      </div>

      <div className="p-8 h-[350px] flex flex-col items-center justify-center relative overflow-hidden">
          {mode === 'static' ? (
              <div className="flex flex-col items-center gap-8 animate-fade-in">
                  <div className="flex gap-12">
                      <div className="flex flex-col items-center gap-2">
                          <div className="p-4 bg-orange-600/20 border-2 border-orange-500 rounded-xl font-mono text-xs text-orange-400">Struct A</div>
                          <div className="h-8 w-0.5 bg-slate-700"></div>
                          <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg font-mono text-[10px] text-slate-400 text-center">
                              fn process_A()<br/>(Specialized)
                          </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                          <div className="p-4 bg-blue-600/20 border-2 border-blue-500 rounded-xl font-mono text-xs text-blue-400">Struct B</div>
                          <div className="h-8 w-0.5 bg-slate-700"></div>
                          <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg font-mono text-[10px] text-slate-400 text-center">
                              fn process_B()<br/>(Specialized)
                          </div>
                      </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono text-center max-w-sm mt-4 italic">
                      <T>Monomorfización: El compilador genera una copia de la función para cada tipo. Cero overhead en ejecución, pero mayor tamaño de binario.</T>
                  </p>
              </div>
          ) : (
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                  <div className="flex items-center gap-10">
                      {/* Stack Side */}
                      <div className="space-y-4">
                        <div className="text-[10px] font-bold text-slate-500 uppercase text-center">Stack (Wide Pointer)</div>
                        <div className="w-32 border-2 border-purple-500 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <div className="bg-purple-900/30 p-2 border-b border-purple-500/50 text-[10px] text-center font-mono">Data Ptr</div>
                            <div className="bg-purple-900/50 p-2 text-[10px] text-center font-mono text-white">vTable Ptr</div>
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <div className="relative">
                          <div className="h-0.5 w-16 bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
                          <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-purple-500"></div>
                      </div>

                      {/* VTable Side */}
                      <div className="space-y-4">
                        <div className="text-[10px] font-bold text-slate-500 uppercase text-center">Heap (vTable)</div>
                        <div className="w-40 bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-[9px] space-y-2">
                            <div className="text-emerald-400 flex justify-between"><span>[0] destructor</span> <span className="text-slate-600">0x0A</span></div>
                            <div className="text-emerald-400 flex justify-between"><span>[1] size</span> <span className="text-slate-600">32b</span></div>
                            <div className="text-emerald-400 flex justify-between"><span>[2] fn_ptr</span> <span className="text-slate-600">0xFF</span></div>
                        </div>
                      </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono text-center max-w-sm mt-8 italic">
                      <T>Dynamic Dispatch: Un puntero 'ancho' (16 bytes) apunta a los datos y a una tabla de métodos. Un solo binario pequeño, pero un salto extra de CPU por llamada.</T>
                  </p>
              </div>
          )}
      </div>

      <div className="px-6 py-3 bg-slate-950/50 border-t border-slate-800 text-center">
          <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">Instruction Pointer Trace: {mode === 'static' ? 'Direct Jump' : 'Double Indirection'}</span>
      </div>
    </div>
  );
};
