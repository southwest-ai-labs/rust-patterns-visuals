
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const MevMitigationVisualizer: React.FC = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [txs, setTxs] = useState<{ id: string, type: 'user' | 'mev', status: 'pending' | 'included' }[]>([]);

  const runSimulation = () => {
    setTxs([]);
    const sequence: any[] = [];
    
    if (!isPrivate) {
        // Public Mempool: MEV sees the user and sandwiches
        sequence.push({ id: 'MEV_FRONT', type: 'mev', status: 'included' });
        sequence.push({ id: 'USER_SWAP', type: 'user', status: 'included' });
        sequence.push({ id: 'MEV_BACK', type: 'mev', status: 'included' });
    } else {
        // Private RPC: Only the miner/builder sees it
        sequence.push({ id: 'USER_SWAP', type: 'user', status: 'included' });
    }
    
    setTxs(sequence);
  };

  return (
    <div className="my-10 bg-slate-950 border border-amber-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-amber-950/20 px-8 py-4 border-b border-amber-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">MEV_PROTECTION_PROTOCOL</h3>
          </div>
          <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                  <span className={`text-[9px] font-black uppercase ${isPrivate ? 'text-emerald-500' : 'text-slate-500'}`}>Private_RPC</span>
                  <div onClick={() => setIsPrivate(!isPrivate)} className={`w-10 h-5 rounded-full relative transition-all ${isPrivate ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isPrivate ? 'left-6' : 'left-1'}`}></div>
                  </div>
              </label>
              <button onClick={runSimulation} className="bg-amber-600 hover:bg-amber-500 text-white text-[9px] font-black px-4 py-1.5 rounded uppercase transition-all shadow-lg">Simulate Block</button>
          </div>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full max-w-md h-32 bg-black/40 border border-slate-800 rounded-2xl p-4 flex gap-3 items-center justify-center relative overflow-hidden">
              <div className="absolute top-2 left-4 text-[8px] font-mono text-slate-700 uppercase">Block_Builder_View</div>
              
              {txs.length === 0 && <div className="text-slate-700 font-mono text-[10px] animate-pulse">Waiting for network broadcast...</div>}
              
              {txs.map((tx, i) => (
                  <div key={i} className={`w-24 h-16 rounded-xl border-2 flex flex-col items-center justify-center animate-fade-in-up transition-all ${
                      tx.type === 'user' ? 'border-blue-500 bg-blue-500/10' : 'border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  }`} style={{ animationDelay: `${i * 0.2}s` }}>
                      <span className="text-[8px] font-black text-white uppercase">{tx.id}</span>
                      <span className="text-[7px] text-slate-400 mt-1 font-mono">{tx.type === 'mev' ? 'EXTRACTING' : 'SWAPPING'}</span>
                  </div>
              ))}
          </div>

          <div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg text-center">
              <h4 className="text-[10px] font-black text-amber-500 mb-2 uppercase tracking-widest">Architectural Impact</h4>
              <p className="text-xs text-slate-400 italic">
                  <T>{isPrivate ? 
                    "Protección Activa: Al usar un canal privado, el bot de MEV no puede ver tu transacción en el mempool público para sandwicharla." : 
                    "Vulnerabilidad Detectada: El bot de MEV inserta transacciones antes y después de la tuya para manipular el precio y quedarse con el 'slippage'."}
                  </T>
              </p>
          </div>
      </div>
    </div>
  );
};
