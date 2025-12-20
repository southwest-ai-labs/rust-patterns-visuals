
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface Core {
  id: number;
  queue: string[];
}

export const WorkStealingVisualizer: React.FC = () => {
  const [cores, setCores] = useState<Core[]>([
    { id: 1, queue: ['Task_A', 'Task_B', 'Task_C', 'Task_D'] },
    { id: 2, queue: [] },
  ]);
  const [active, setActive] = useState(false);

  const stealTask = () => {
    setCores(prev => {
        const source = prev[0];
        const target = prev[1];
        if (source.queue.length <= 1) return prev;

        const newTask = source.queue[source.queue.length - 1];
        const newSource = { ...source, queue: source.queue.slice(0, -1) };
        const newTarget = { ...target, queue: [...target.queue, newTask] };
        
        return [newSource, newTarget];
    });
  };

  useEffect(() => {
    let interval: any;
    if (active) {
        interval = setInterval(() => {
            if (cores[0].queue.length > 1 && cores[1].queue.length < 3) {
                stealTask();
            }
        }, 1500);
    }
    return () => clearInterval(interval);
  }, [active, cores]);

  return (
    <div className="my-10 bg-slate-950 border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-blue-950/20 px-8 py-4 border-b border-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">TOKIO_WORK_STEALING_SIM</h3>
          </div>
          <button 
            onClick={() => setActive(!active)}
            className={`px-4 py-1 rounded text-[9px] font-black uppercase transition-all ${active ? 'bg-emerald-600' : 'bg-slate-800'} text-white shadow-lg`}
          >
            {active ? 'SCHEDULER_ACTIVE' : 'INIT_POOL'}
          </button>
      </div>

      <div className="p-10 flex flex-col md:flex-row gap-8 justify-center items-start">
          {cores.map(core => (
              <div key={core.id} className="w-48 space-y-4">
                  <div className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Core_0{core.id} {core.queue.length === 0 ? '(IDLE)' : '(BUSY)'}
                  </div>
                  <div className={`min-h-[160px] border-2 rounded-2xl p-4 flex flex-col gap-2 transition-all ${core.queue.length > 3 ? 'border-red-500/30 bg-red-900/5' : 'border-slate-800 bg-black/40'}`}>
                      {core.queue.map((task, i) => (
                          <div key={i} className="bg-blue-600/20 border border-blue-500/40 p-2 rounded text-[10px] font-mono text-blue-300 animate-fade-in-up">
                              {task}
                          </div>
                      ))}
                      {core.queue.length === 0 && (
                          <div className="flex-1 flex items-center justify-center text-[8px] text-slate-700 font-mono italic">Waiting for steal...</div>
                      )}
                  </div>
              </div>
          ))}
      </div>

      <div className="px-8 py-4 bg-black/40 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic text-center max-w-lg mx-auto">
              <T>En el runtime de Tokio, si un procesador se queda sin tareas, escanea las colas de otros procesadores y "roba" la mitad de sus tareas para maximizar el paralelismo.</T>
          </p>
      </div>
    </div>
  );
};
