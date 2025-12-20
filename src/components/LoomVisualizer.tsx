
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const LoomVisualizer: React.FC = () => {
  const [interleaving, setInterleaving] = useState(0);
  const totalPermutations = 6;
  
  const scenarios = [
    { t1: "Read X (0)", t2: "Idle", x: 0, res: "OK" },
    { t1: "Idle", t2: "Write X (1)", x: 1, res: "OK" },
    { t1: "Read X (1)", t2: "Idle", x: 1, res: "OK" },
    { t1: "Write X (2)", t2: "Read X (2)", x: 2, res: "RACE!" },
    { t1: "Idle", t2: "Panic!", x: 0, res: "FAIL" },
    { t1: "Cleanup", t2: "Exit", x: 0, res: "SUCCESS" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setInterleaving(p => (p + 1) % totalPermutations);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = scenarios[interleaving];

  return (
    <div className="my-10 bg-slate-950 border border-red-900/30 rounded-3xl overflow-hidden shadow-2xl font-mono">
      <div className="bg-slate-900/80 px-8 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest">LOOM_INTERLEAVING_ENGINE</h3>
          </div>
          <span className="text-[10px] text-red-500 font-black animate-pulse"># CHECKING_PERMUTATION_{interleaving + 1}/{totalPermutations}</span>
      </div>

      <div className="p-8 grid grid-cols-2 gap-8 h-48 relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
          
          {/* Thread 1 */}
          <div className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-center items-center ${current.t1 !== 'Idle' ? 'border-orange-500 bg-orange-500/10 scale-105' : 'border-slate-800 opacity-40'}`}>
              <div className="text-[8px] text-slate-500 mb-2">THREAD_A</div>
              <div className="text-xs font-black text-white">{current.t1}</div>
          </div>

          {/* Thread 2 */}
          <div className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-center items-center ${current.t2 !== 'Idle' ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-slate-800 opacity-40'}`}>
              <div className="text-[8px] text-slate-500 mb-2">THREAD_B</div>
              <div className="text-xs font-black text-white">{current.t2}</div>
          </div>

          {/* Central State */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-black border border-slate-800 flex flex-col items-center justify-center shadow-2xl z-10">
              <div className="text-[8px] text-slate-600 mb-1">VAR_X</div>
              <div className="text-xl font-black text-emerald-400">{current.x}</div>
          </div>
      </div>

      <div className="px-8 py-4 bg-black/60 border-t border-slate-900 flex justify-between items-center">
          <div className="flex gap-4">
              <div className="text-[10px]"><span className="text-slate-500">Result:</span> <span className={current.res === 'RACE!' ? 'text-red-500 font-black' : 'text-emerald-500'}>{current.res}</span></div>
          </div>
          <p className="text-[9px] text-slate-500 italic max-w-sm text-right">
              <T>Loom simula cada orden de ejecución de la CPU para encontrar bugs de concurrencia imposibles de ver en tests normales.</T>
          </p>
      </div>
    </div>
  );
};
