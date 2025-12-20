
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface RingItem {
  id: number;
  op: string;
  status: 'pending' | 'submitted' | 'completed';
}

export const UringViz: React.FC = () => {
  const [sq, setSq] = useState<RingItem[]>([]);
  const [cq, setCq] = useState<RingItem[]>([]);
  const [nextId, setNextId] = useState(1);

  const addRequest = () => {
    if (sq.length >= 8) return;
    setSq(prev => [...prev, { id: nextId, op: 'READ_FILE', status: 'pending' }]);
    setNextId(id => id + 1);
  };

  const submitBatch = () => {
    const batch = sq.map(item => ({ ...item, status: 'submitted' as const }));
    setSq([]);
    // Simulate kernel processing
    setTimeout(() => {
        setCq(prev => [...prev, ...batch.map(item => ({ ...item, status: 'completed' as const }))].slice(-8));
    }, 1500);
  };

  return (
    <div className="my-10 bg-black border border-indigo-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">IO_URING_ASYNC_ENGINE</h3>
          </div>
          <div className="flex gap-2">
              <button onClick={addRequest} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase rounded-lg">Push_Op</button>
              <button onClick={submitBatch} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-indigo-900/20">Submit_Batch</button>
          </div>
      </div>

      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col items-center">
              <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Submission_Queue (SQ)</div>
              <div className="w-full h-40 border-2 border-dashed border-indigo-500/30 rounded-2xl flex flex-wrap gap-2 p-4 content-start relative overflow-hidden">
                  {sq.map(item => (
                      <div key={item.id} className="w-16 h-8 bg-indigo-600/20 border border-indigo-500/50 rounded flex items-center justify-center text-[8px] font-mono text-indigo-300 animate-fade-in-up">
                          ID_{item.id}
                      </div>
                  ))}
                  {sq.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-700 font-mono italic">Ring empty...</div>}
              </div>
          </div>

          <div className="flex flex-col items-center">
              <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Completion_Queue (CQ)</div>
              <div className="w-full h-40 border-2 border-indigo-500/30 bg-indigo-950/10 rounded-2xl flex flex-wrap gap-2 p-4 content-start relative overflow-hidden">
                  {cq.map(item => (
                      <div key={item.id} className="w-16 h-8 bg-emerald-600/20 border border-emerald-500/50 rounded flex items-center justify-center text-[8px] font-mono text-emerald-300 animate-pulse">
                          DONE_{item.id}
                      </div>
                  ))}
                  {cq.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-800 font-mono">Kernel idle...</div>}
              </div>
          </div>
      </div>

      <div className="px-8 py-5 bg-slate-950 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic text-center max-w-lg mx-auto">
              <T>io_uring elimina las 'context switches' masivas. Rust escribe peticiones directamente en el SQ de la RAM compartida con el Kernel, permitiendo millones de IOPS con un solo hilo de CPU.</T>
          </p>
      </div>
    </div>
  );
};
