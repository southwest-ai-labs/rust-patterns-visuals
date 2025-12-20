
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const SignalVisualizer: React.FC = () => {
  const [count, setCount] = useState(0);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (trigger) {
      const t = setTimeout(() => setTrigger(false), 800);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  const handleUpdate = () => {
    setCount(c => c + 1);
    setTrigger(true);
  };

  return (
    <div className="my-10 bg-slate-950 border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-emerald-950/20 px-8 py-4 border-b border-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">WASM_SIGNAL_RUNTIME</h3>
          </div>
          <button 
            onClick={handleUpdate}
            className="px-6 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase rounded-full shadow-lg transition-all"
          >
            Update_Signal(count++)
          </button>
      </div>

      <div className="p-10 flex flex-col items-center gap-8 relative overflow-hidden">
          {/* Reactive Graph */}
          <div className="flex items-center gap-12 relative z-10">
              {/* Source Signal */}
              <div className={`w-24 h-24 rounded-2xl bg-slate-900 border-2 flex flex-col items-center justify-center transition-all duration-300 ${trigger ? 'border-emerald-500 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'border-slate-800'}`}>
                  <span className="text-[8px] text-slate-500 font-black uppercase mb-1 tracking-tighter">Signal_Source</span>
                  <span className="text-2xl font-black text-white font-mono">{count}</span>
              </div>

              {/* Dependency Lines */}
              <div className="flex flex-col gap-8">
                  <div className="w-16 h-[2px] bg-slate-800 relative">
                      <div className={`absolute inset-0 bg-emerald-500 transition-all duration-500 ${trigger ? 'opacity-100' : 'opacity-0'}`}></div>
                  </div>
                  <div className="w-16 h-[2px] bg-slate-800 relative">
                      <div className={`absolute inset-0 bg-emerald-500 transition-all duration-500 ${trigger ? 'opacity-100' : 'opacity-0'}`}></div>
                  </div>
              </div>

              {/* Effects / Computed */}
              <div className="flex flex-col gap-6">
                  <div className={`p-4 rounded-xl border-2 bg-slate-900 transition-all duration-500 ${trigger ? 'border-blue-500 bg-blue-900/10' : 'border-slate-800 opacity-60'}`}>
                      <div className="text-[7px] text-slate-500 font-black uppercase">Memo: double</div>
                      <div className="text-sm font-bold text-blue-400 font-mono">{count * 2}</div>
                  </div>
                  <div className={`p-4 rounded-xl border-2 bg-slate-900 transition-all duration-500 ${trigger ? 'border-purple-500 bg-purple-900/10' : 'border-slate-800 opacity-60'}`}>
                      <div className="text-[7px] text-slate-500 font-black uppercase">Effect: side_log</div>
                      <div className="text-[9px] font-mono text-purple-300">"count is {count}"</div>
                  </div>
              </div>
          </div>

          <div className="max-w-md text-center">
              <p className="text-xs text-slate-500 italic leading-relaxed">
                  <T>A diferencia de React, los Signals en Rust (Leptos) no re-renderizan componentes enteros. Solo actualizan los nodos específicos del DOM suscritos al valor, logrando rendimiento nativo en Wasm.</T>
              </p>
          </div>
      </div>
    </div>
  );
};
