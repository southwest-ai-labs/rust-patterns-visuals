
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const PeerForkingSimulator: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [done, setDone] = useState(false);

  const startSync = () => {
    setSyncing(true);
    setTimeout(() => {
        setSyncing(false);
        setDone(true);
    }, 2500);
  };

  return (
    <div className="my-10 bg-slate-900 border border-orange-900/20 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">📡</div>
      
      <div className="flex items-center gap-6 mb-8 w-full max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl shadow-xl">👤</div>
          <div className="flex-1">
              <h4 className="text-white font-black uppercase text-sm">Operator: Ghost_Shell</h4>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest">STATUS: SOLVING_UNSAFE_CONTRACT</p>
          </div>
          <div className="text-right">
              <div className="text-orange-500 font-black text-lg">3,450</div>
              <div className="text-[8px] text-slate-600 font-mono">GLOBAL_MMR</div>
          </div>
      </div>

      <div className="w-full max-w-md bg-black/50 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] text-slate-500 uppercase font-black">Active Fragment Detected</span>
              <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-400 text-[8px] rounded-full border border-emerald-500/20">98% SOUNDNESS</span>
          </div>
          <code className="text-[10px] text-orange-300 font-mono block mb-4 opacity-60">
              unsafe {'{'} <br/>
              &nbsp;&nbsp;let ptr = data.as_ptr() as *mut u8;<br/>
              &nbsp;&nbsp;std::ptr::write_volatile(ptr, 0xAA);<br/>
              {'}'}
          </code>
          
          {!done ? (
              <button 
                onClick={startSync}
                disabled={syncing}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-lg uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3"
              >
                {syncing ? <><span className="animate-spin text-lg">⚙️</span> INITIATING_NEURAL_SYNC...</> : <><span className="text-lg">⚡</span> Fork Neural Fragment</>}
              </button>
          ) : (
              <div className="w-full py-3 bg-emerald-600 text-white font-black rounded-lg uppercase tracking-widest text-[10px] text-center animate-fade-in flex items-center justify-center gap-2">
                  <span>✓</span> FRAGMENT_LINKED_TO_YOUR_FORK
              </div>
          )}
      </div>

      <p className="text-[9px] text-slate-600 font-mono italic"><T>El "Neural Forking" permite clonar la lógica de otro operador directamente a tu repositorio de progreso vinculado.</T></p>
    </div>
  );
};
