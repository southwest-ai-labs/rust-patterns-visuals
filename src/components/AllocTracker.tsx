
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const AllocTracker: React.FC = () => {
  const [mode, setMode] = useState<'heap' | 'stack'>('heap');
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
        setHistory(prev => {
            const nextVal = mode === 'heap' ? Math.random() * 80 + 20 : Math.random() * 10;
            const updated = [...prev, nextVal];
            return updated.slice(-40);
        });
    }, 150);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="my-10 bg-slate-950 border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-emerald-950/20 px-8 py-5 border-b border-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">ALLOCATION_PRESSURE_MONITOR</h3>
          </div>
          <div className="flex bg-black p-1 rounded-lg border border-slate-800">
              <button onClick={() => setMode('heap')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${mode === 'heap' ? 'bg-red-600 text-white' : 'text-slate-500'}`}>Standard_Vec</button>
              <button onClick={() => setMode('stack')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${mode === 'stack' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>SmallVec_Opt</button>
          </div>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full max-w-2xl h-48 bg-black/60 rounded-3xl border border-slate-800 p-8 flex items-end gap-1 relative overflow-hidden">
              <div className="absolute top-4 left-6 text-[8px] font-mono text-slate-700 uppercase tracking-widest">Memory_Churn_Timeline</div>
              {history.map((val, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 transition-all duration-300 rounded-t-sm ${mode === 'heap' ? 'bg-red-500/40 border-t border-red-400' : 'bg-emerald-500/40 border-t border-emerald-400'}`}
                    style={{ height: `${val}%` }}
                  ></div>
              ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">System Impact</h4>
                  <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-slate-400">Heap Fragments:</span>
                          <span className={mode === 'heap' ? 'text-red-500' : 'text-emerald-400'}>{mode === 'heap' ? 'HIGH' : 'ZERO'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-slate-400">Context Switches:</span>
                          <span className={mode === 'heap' ? 'text-red-500' : 'text-emerald-400'}>{mode === 'heap' ? 'Frequent' : 'Minimal'}</span>
                      </div>
                  </div>
              </div>
              <div className="flex items-center">
                  <p className="text-[11px] text-slate-500 font-mono italic leading-relaxed">
                      <T>{mode === 'heap' ? 
                        "Cada 'Vec' solicita memoria al Sistema Operativo, lo cual es costoso. 'SmallVec' guarda datos en el stack para tamaños comunes." : 
                        "Optimización L7: Evitamos el asignador de memoria (malloc) para el 99% de las peticiones, eliminando picos de latencia."}
                      </T>
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};
