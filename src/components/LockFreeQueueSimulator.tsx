
import React, { useState, useEffect, useRef } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface Cell {
  id: number;
  value: number | null;
  state: 'empty' | 'writing' | 'reading' | 'full';
}

export const LockFreeQueueSimulator: React.FC = () => {
  const [bufferSize] = useState(8);
  const [cells, setCells] = useState<Cell[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: i, value: null, state: 'empty' }))
  );
  const [head, setHead] = useState(0);
  const [tail, setTail] = useState(0);
  const [activeProducers, setActiveProducers] = useState<number[]>([]);
  const [activeConsumers, setActiveConsumers] = useState<number[]>([]);
  const [mode, setMode] = useState<'mutex' | 'atomic'>('atomic');
  const [throughput, setThroughput] = useState(0);
  const totalProcessed = useRef(0);

  const produce = () => {
    const pId = Math.random();
    setActiveProducers(prev => [...prev, pId]);
    
    setTimeout(() => {
      setTail(t => {
        const nextTail = (t + 1) % bufferSize;
        setCells(prevCells => {
            const newCells = [...prevCells];
            if (newCells[t].state === 'empty') {
                newCells[t] = { ...newCells[t], value: Math.floor(Math.random() * 100), state: 'full' };
            }
            return newCells;
        });
        return nextTail;
      });
      setActiveProducers(prev => prev.filter(id => id !== pId));
    }, mode === 'mutex' ? 800 : 300);
  };

  const consume = () => {
    const cId = Math.random();
    setActiveConsumers(prev => [...prev, cId]);
    
    setTimeout(() => {
      setHead(h => {
        const nextHead = (h + 1) % bufferSize;
        setCells(prevCells => {
            const newCells = [...prevCells];
            if (newCells[h].state === 'full') {
                newCells[h] = { ...newCells[h], value: null, state: 'empty' };
                totalProcessed.current++;
            }
            return newCells;
        });
        return nextHead;
      });
      setActiveConsumers(prev => prev.filter(id => id !== cId));
    }, mode === 'mutex' ? 1000 : 400);
  };

  useEffect(() => {
    const interval = setInterval(() => {
        setThroughput(totalProcessed.current * 2);
        totalProcessed.current = 0;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-12 bg-slate-950 border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-emerald-950/20 px-8 py-5 border-b border-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">MPMC_LOCK_FREE_SIMULATOR</h3>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button onClick={() => setMode('mutex')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${mode === 'mutex' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>Mutex_Lock</button>
              <button onClick={() => setMode('atomic')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${mode === 'atomic' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>Wait_Free_Atomic</button>
          </div>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full flex justify-between items-center max-w-4xl mb-12">
              {/* Producers */}
              <div className="flex flex-col gap-3 items-center">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Producers</div>
                  <div className="flex gap-2">
                      {[1, 2, 3].map(i => (
                          <div key={i} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${activeProducers.length >= i ? 'border-orange-500 bg-orange-500/20 scale-110 shadow-lg' : 'border-slate-800 bg-slate-900'}`}>
                              <span className="text-xs">P</span>
                          </div>
                      ))}
                  </div>
                  <button onClick={produce} className="mt-4 px-4 py-1.5 bg-orange-600/20 text-orange-500 border border-orange-500/30 rounded text-[9px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all">Manual_Push</button>
              </div>

              {/* The Queue (Circular Buffer) */}
              <div className="relative">
                  <div className="flex gap-2 p-4 bg-black/40 rounded-2xl border border-slate-800">
                      {cells.map((cell, i) => (
                          <div key={i} className={`w-12 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500 relative ${
                              cell.state === 'full' ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-800 bg-slate-900/50'
                          }`}>
                              {head === i && <div className="absolute -top-6 text-[8px] font-bold text-blue-400 font-mono animate-bounce">HEAD_▼</div>}
                              {tail === i && <div className="absolute -bottom-6 text-[8px] font-bold text-orange-400 font-mono animate-bounce">TAIL_▲</div>}
                              <span className="text-[8px] font-mono text-slate-600">[{i}]</span>
                              <span className="text-xs font-black text-white">{cell.value !== null ? cell.value : ''}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Consumers */}
              <div className="flex flex-col gap-3 items-center">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Consumers</div>
                  <div className="flex gap-2">
                      {[1, 2, 3].map(i => (
                          <div key={i} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${activeConsumers.length >= i ? 'border-blue-500 bg-blue-500/20 scale-110 shadow-lg' : 'border-slate-800 bg-slate-900'}`}>
                              <span className="text-xs">C</span>
                          </div>
                      ))}
                  </div>
                  <button onClick={consume} className="mt-4 px-4 py-1.5 bg-blue-600/20 text-blue-500 border border-blue-500/30 rounded text-[9px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">Manual_Pop</button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
                  <div className="text-[9px] text-slate-500 font-black uppercase mb-1">Throughput</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">{throughput} <span className="text-xs text-slate-600 uppercase">Ops/sec</span></div>
              </div>
              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
                  <div className="text-[9px] text-slate-500 font-black uppercase mb-1">Wait_Penalty</div>
                  <div className={`text-2xl font-black font-mono ${mode === 'mutex' ? 'text-red-500' : 'text-blue-400'}`}>
                      {mode === 'mutex' ? 'HIGH' : 'ZERO'}
                  </div>
              </div>
              <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
                  <div className="text-[9px] text-slate-500 font-black uppercase mb-1">Contention_Handling</div>
                  <div className="text-[10px] font-black text-white uppercase mt-2">
                      {mode === 'mutex' ? 'Thread_Parking' : 'Atomic_Spin_CAS'}
                  </div>
              </div>
          </div>
          
          <div className="mt-10 p-6 bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl">
              <p className="text-xs text-slate-400 italic leading-relaxed text-center">
                  <T>{mode === 'mutex' ? 
                    "La implementación basada en Mutex detiene hilos (context switch) si hay colisión, desperdiciando ciclos de CPU en alta carga." : 
                    "La implementación Lock-Free usa operaciones atómicas CAS (Compare-and-Swap). Si un hilo falla al actualizar el índice, reintenta inmediatamente sin suspenderse."}
                  </T>
              </p>
          </div>
      </div>
    </div>
  );
};
