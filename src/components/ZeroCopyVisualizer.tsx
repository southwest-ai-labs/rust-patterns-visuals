
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const ZeroCopyVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'standard' | 'zerocopy'>('standard');

  return (
    <div className="my-10 bg-black border border-indigo-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-indigo-950/20 px-8 py-4 border-b border-indigo-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">SERIALIZATION_LAYER</h3>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button onClick={() => setMode('standard')} className={`px-4 py-1 rounded text-[9px] font-black uppercase transition-all ${mode === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Serde (Json)</button>
              <button onClick={() => setMode('zerocopy')} className={`px-4 py-1 rounded text-[9px] font-black uppercase transition-all ${mode === 'zerocopy' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>Zero-Copy (rkyv)</button>
          </div>
      </div>

      <div className="p-10 flex flex-col md:flex-row gap-12 items-center">
          {/* Buffer Side */}
          <div className="flex-1 space-y-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">In-Memory Buffer (Bytes)</div>
              <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
                  {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="h-8 bg-slate-950 border border-slate-800 rounded flex items-center justify-center font-mono text-[10px] text-indigo-400">
                          {Math.floor(Math.random() * 255).toString(16).padStart(2, '0')}
                      </div>
                  ))}
              </div>
          </div>

          {/* Action Arrow */}
          <div className="flex flex-col items-center">
              <div className={`text-[9px] font-black mb-2 uppercase ${mode === 'standard' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                  {mode === 'standard' ? 'PARSING & ALLOCATING' : 'DIRECT ACCESS'}
              </div>
              <div className={`w-12 h-0.5 ${mode === 'standard' ? 'bg-indigo-500' : 'bg-emerald-500'} relative`}>
                  <div className={`absolute -right-1 -top-1 w-2 h-2 rounded-full ${mode === 'standard' ? 'bg-indigo-500' : 'bg-emerald-500 animate-ping'}`}></div>
              </div>
          </div>

          {/* Rust Struct Side */}
          <div className="flex-1 space-y-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rust Representation</div>
              <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${mode === 'standard' ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-emerald-900/10 border-emerald-500/30'}`}>
                  <div className="font-mono text-xs text-slate-300">
                      <span className="text-orange-400">struct</span> UserData {'{'}<br/>
                      &nbsp;&nbsp;id: u32,<br/>
                      &nbsp;&nbsp;name: &str,<br/>
                      {'}'}
                  </div>
              </div>
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                  <T>{mode === 'standard' ? 
                    "Serde copia los datos del buffer y crea nuevos objetos en el Heap. Coste: O(N) CPU + Memoria." : 
                    "Zero-copy mapea los campos de la struct directamente a las posiciones del buffer. Coste: O(1)."}
                  </T>
              </p>
          </div>
      </div>

      <div className="px-8 py-3 bg-slate-950/50 border-t border-slate-900 flex justify-between text-[8px] font-mono text-slate-600">
          <span>HEAP_USAGE: {mode === 'standard' ? 'HIGH' : 'ZERO'}</span>
          <span>CPU_PENALTY: {mode === 'standard' ? 'DESERIALIZATION_WAIT' : 'NONE'}</span>
      </div>
    </div>
  );
};
