
import React, { useState, useEffect, useMemo } from 'react';
import { T } from '../hooks/useChromeTranslation';

type Primitive = 'Mutex' | 'RwLock' | 'Atomic' | 'Channel';

interface Metric {
  fps: number;
  contention: number;
  safety: string;
}

export const ArchitectureWorkbench: React.FC = () => {
  const [primitive, setPrimitive] = useState<Primitive>('Mutex');
  const [isSimulating, setIsSimulating] = useState(false);
  const [dataPoints, setDataPoints] = useState<number[]>(Array(12).fill(0));

  const stats = useMemo((): Metric => {
    switch (primitive) {
      case 'Mutex': return { fps: 45, contention: 65, safety: 'High (Blocking)' };
      case 'RwLock': return { fps: 55, contention: 30, safety: 'High (Shared Read)' };
      case 'Atomic': return { fps: 60, contention: 5, safety: 'Extreme (Wait-free)' };
      case 'Channel': return { fps: 58, contention: 0, safety: 'Highest (Decoupled)' };
      default: return { fps: 60, contention: 0, safety: 'N/A' };
    }
  }, [primitive]);

  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setDataPoints(prev => {
          const next = [...prev.slice(1), Math.random() * 100];
          return next;
        });
      }, stats.fps > 55 ? 100 : 250); // Simulating UI lag
    }
    return () => clearInterval(interval);
  }, [isSimulating, stats]);

  return (
    <div className="my-12 bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
      {/* Left: Logic Configuration */}
      <div className="lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Architecture_Workbench</h3>
        </div>

        <div className="space-y-6">
            <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Scenario: Real-time Financial Dashboard</label>
                <div className="grid grid-cols-2 gap-3">
                    {(['Mutex', 'RwLock', 'Atomic', 'Channel'] as Primitive[]).map(p => (
                        <button 
                            key={p}
                            onClick={() => setPrimitive(p)}
                            className={`p-4 rounded-xl border-2 transition-all text-left group ${primitive === p ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}
                        >
                            <div className={`text-xs font-black mb-1 ${primitive === p ? 'text-white' : 'text-slate-400'}`}>{p}</div>
                            <div className="text-[9px] text-slate-500 font-mono leading-tight">
                                {p === 'Mutex' && 'Exclusive locking for all threads.'}
                                {p === 'RwLock' && 'Optimized for heavy read traffic.'}
                                {p === 'Atomic' && 'CPU-level synchronization (CAS).'}
                                {p === 'Channel' && 'Message passing logic (MPSC).'}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-5 bg-black rounded-2xl border border-slate-800">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-3 tracking-widest font-mono">Logic_Snippet.rs</h4>
                <code className="text-[11px] text-emerald-400/80 font-mono leading-relaxed block">
                    {primitive === 'Mutex' && 'let lock = data.lock().unwrap();\nupdate_ui(&lock);'}
                    {primitive === 'RwLock' && 'let read = data.read().unwrap();\nrender_frame(&read);'}
                    {primitive === 'Atomic' && 'let val = data.load(Ordering::Relaxed);\ndisplay(val);'}
                    {primitive === 'Channel' && 'while let Some(msg) = rx.recv() {\n  process(msg);\n}'}
                </code>
            </div>
        </div>
      </div>

      {/* Right: Live Interface Preview */}
      <div className="lg:w-1/2 p-8 bg-slate-900 relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live_Production_UI</span>
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-6 py-2 rounded-full font-black text-[10px] uppercase transition-all shadow-xl ${isSimulating ? 'bg-red-600' : 'bg-blue-600'} text-white`}
              >
                {isSimulating ? 'STOP_ENGINE' : 'RUN_DEPLOYMENT'}
              </button>
          </div>

          <div className="flex-1 flex flex-col gap-6 relative z-10">
              {/* The Dashboard Mockup */}
              <div className="bg-black/60 rounded-3xl border border-slate-700 p-6 flex-1 shadow-inner flex flex-col">
                  <div className="flex justify-between items-baseline mb-4">
                      <div className="text-[10px] font-bold text-white uppercase">Ticker: $RUST</div>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
                        <span className="text-[9px] font-mono text-slate-500">UPLINK_LIVE</span>
                      </div>
                  </div>
                  
                  {/* Graph visualization based on primitive contention */}
                  <div className="flex-1 flex items-end gap-1 px-2">
                      {dataPoints.map((dp, i) => (
                          <div 
                            key={i} 
                            className={`flex-1 transition-all duration-300 rounded-t-sm ${stats.fps < 50 ? 'bg-amber-600/40' : 'bg-blue-500/40'}`} 
                            style={{ height: `${dp}%` }}
                          />
                      ))}
                  </div>
              </div>

              {/* Real-time Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
                      <div className="text-[8px] text-slate-500 uppercase font-black">Refreshes (FPS)</div>
                      <div className={`text-xl font-black font-mono ${stats.fps < 50 ? 'text-amber-500' : 'text-blue-400'}`}>{isSimulating ? stats.fps : '--'}</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
                      <div className="text-[8px] text-slate-500 uppercase font-black">Contention</div>
                      <div className={`text-xl font-black font-mono ${stats.contention > 50 ? 'text-red-500' : 'text-emerald-400'}`}>{isSimulating ? stats.contention : '--'}%</div>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
                      <div className="text-[8px] text-slate-500 uppercase font-black">Safety Index</div>
                      <div className="text-[9px] font-black text-white mt-1 uppercase truncate">{stats.safety}</div>
                  </div>
              </div>
          </div>
          
          <div className="mt-8 px-4 text-center">
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                  <T>{`Modificando la estructura de datos a un '${primitive}', observamos un impacto directo en la ${stats.contention > 40 ? 'fluidez de la interfaz debido a bloqueos de hilos' : 'latencia de respuesta de los datos en tiempo real'}.`}</T>
              </p>
          </div>
      </div>
    </div>
  );
};
