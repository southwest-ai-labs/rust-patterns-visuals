
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const LockFreeVisualizer: React.FC = () => {
  const [value, setValue] = useState(100);
  const [contention, setContention] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [activeThreads, setActiveThreads] = useState<number[]>([]);

  const triggerAtomicAdd = () => {
    setAttempts(0);
    setContention(true);
    // Simulate 3 threads hitting the same memory address
    setActiveThreads([1, 2, 3]);
    
    let currentAttempts = 0;
    const interval = setInterval(() => {
        currentAttempts++;
        setAttempts(currentAttempts);
        
        if (currentAttempts >= 3) { // Success after 3 retries
            setValue(v => v + 1);
            setActiveThreads([]);
            setContention(false);
            clearInterval(interval);
        }
    }, 400);
  };

  return (
    <div className="my-10 bg-black border border-emerald-900/40 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-emerald-950/20 px-8 py-4 border-b border-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">LOCK_FREE_ATOMIC_SIM</h3>
          </div>
          <button 
            onClick={triggerAtomicAdd} 
            disabled={contention}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black px-6 py-1.5 rounded-full uppercase transition-all shadow-lg disabled:opacity-30"
          >
            {contention ? 'CAS_RETRY_LOOP...' : 'ATOMIC_FETCH_ADD'}
          </button>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="relative w-full max-w-md h-48 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Memory Cell */}
              <div className="z-10 bg-black border-4 border-emerald-500 w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-pulse">
                  <span className="text-[8px] text-emerald-700 font-mono">ADDR: 0x42</span>
                  <span className="text-2xl font-black text-white font-mono">{value}</span>
              </div>

              {/* Thread Interferences */}
              {activeThreads.map(id => (
                  <div key={id} className={`absolute w-1 h-12 bg-red-500/50 blur-[2px] animate-ping`} 
                       style={{ transform: `rotate(${id * 120}deg) translateY(-80px)` }}></div>
              ))}

              <div className="absolute bottom-4 right-6 text-[10px] font-mono text-slate-600">
                  CAS_ATTEMPTS: {attempts}
              </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 w-full max-w-lg">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase mb-2">Wait-Free Strategy</h4>
                  <p className="text-[9px] text-slate-400 italic">No hilos bloqueados. Si la comparación falla (alguien cambió el valor antes), simplemente reintenta.</p>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase mb-2">Memory Ordering</h4>
                  <div className="text-[10px] font-mono text-emerald-400">Ordering::SeqCst</div>
                  <p className="text-[8px] text-slate-600 mt-1">Garantiza visibilidad global total entre núcleos.</p>
              </div>
          </div>
      </div>
    </div>
  );
};
