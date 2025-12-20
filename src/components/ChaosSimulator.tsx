
import React, { useState, useEffect } from 'react';

interface ThreadStatus {
  id: number;
  load: number;
  blocked: boolean;
  task: string;
  waitingFor?: number;
}

interface Peer {
  id: string;
  name: string;
  mmr: number;
  action: string;
  latency: number;
  avatar: string;
}

export const ChaosSimulator: React.FC = () => {
  const [scenario, setScenario] = useState<'starvation' | 'deadlock'>('starvation');
  const [threads, setThreads] = useState<ThreadStatus[]>([]);
  const [active, setActive] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([
      { id: '1', name: 'Ferris_Prime', mmr: 3240, action: 'MITIGATING', latency: 42, avatar: '🦀' },
      { id: '2', name: 'Ghost_Shell', mmr: 2890, action: 'OBSERVING', latency: 115, avatar: '👻' },
      { id: '3', name: 'Node_Runner', mmr: 1560, action: 'REFINING', latency: 88, avatar: '🤖' }
  ]);

  useEffect(() => {
    if (scenario === 'starvation') {
        setThreads([
            { id: 1, load: 10, blocked: false, task: "HTTP_LISTENER" },
            { id: 2, load: 10, blocked: false, task: "DB_POOL" },
            { id: 3, load: 10, blocked: false, task: "WORKER" },
            { id: 4, load: 10, blocked: false, task: "IDLE" },
        ]);
    } else {
        setThreads([
            { id: 1, load: 50, blocked: true, task: "MUTEX_A_LOCK", waitingFor: 2 },
            { id: 2, load: 50, blocked: true, task: "MUTEX_B_LOCK", waitingFor: 1 },
            { id: 3, load: 10, blocked: false, task: "LOGGER" },
            { id: 4, load: 10, blocked: false, task: "IDLE" },
        ]);
    }
  }, [scenario]);

  useEffect(() => {
    let interval: any;
    if (active) {
      interval = setInterval(() => {
        // Simulate activity of other users in the enjambre
        if (Math.random() > 0.6) {
            setPeers(prev => prev.map(p => ({
                ...p,
                latency: Math.max(20, p.latency + (Math.random() > 0.5 ? 5 : -5)),
                action: Math.random() > 0.8 ? (['PATCHING', 'AUDITING', 'ROUTING'][Math.floor(Math.random() * 3)]) : p.action
            })));
        }
        
        if (scenario === 'starvation') {
            setThreads(prev => prev.map(t => t.id === 3 ? { ...t, load: 100, blocked: true } : { ...t, load: Math.random() * 20 }));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [active, scenario]);

  return (
    <div className="my-12 p-8 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden group">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10 relative z-10">
          <div className="flex-1">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <span className="text-red-500 animate-pulse">●</span> Chaos_Engine // System_Stress_Viz
              </h3>
              <div className="flex gap-4 mt-2">
                  <button onClick={() => setScenario('starvation')} className={`text-[9px] font-bold uppercase transition-colors ${scenario === 'starvation' ? 'text-orange-500 underline' : 'text-slate-500 hover:text-slate-300'}`}># Task_Starvation</button>
                  <button onClick={() => setScenario('deadlock')} className={`text-[9px] font-bold uppercase transition-colors ${scenario === 'deadlock' ? 'text-red-500 underline' : 'text-slate-500 hover:text-slate-300'}`}># Circular_Deadlock</button>
              </div>
          </div>
          
          {/* Neural Presence HUD Section */}
          <div className="w-full lg:w-auto flex flex-col items-end gap-3">
              <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">Neural_Presence_Uplink</div>
              <div className="flex flex-wrap justify-end gap-3">
                  {peers.map(peer => (
                      <div key={peer.id} className="flex items-center gap-3 bg-black/60 border border-slate-800/80 px-3 py-1.5 rounded-2xl group/peer cursor-help hover:border-orange-500/40 transition-all shadow-lg" title={`Uplink Status: ${peer.action}`}>
                          {/* Avatar with status ring */}
                          <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm shadow-inner border border-slate-700">
                                  {peer.avatar}
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${peer.action === 'PATCHING' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`}></div>
                          </div>
                          
                          <div className="flex flex-col">
                              <div className="flex items-baseline gap-2">
                                  <span className="text-[9px] font-black text-white uppercase">{peer.name}</span>
                                  <span className="text-[7px] font-mono text-orange-500 font-bold">{peer.mmr} MMR</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                  <div className="flex gap-0.5 h-1">
                                      <div className={`w-1 rounded-full ${peer.latency < 50 ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                      <div className={`w-1 rounded-full ${peer.latency < 100 ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                      <div className={`w-1 rounded-full ${peer.latency < 150 ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                                  </div>
                                  <span className="text-[7px] text-slate-500 font-mono tracking-tighter uppercase">{peer.latency}ms_lat</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
              <button 
                onClick={() => setActive(!active)}
                className={`mt-2 px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${active ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'} text-white shadow-[0_0_25px_rgba(220,38,38,0.2)] active:scale-95`}
              >
                {active ? "Neural_Fix_Stabilized" : "Initiate_Chaos_Injection"}
              </button>
          </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {threads.map(t => (
              <div key={t.id} className={`p-5 rounded-2xl border-2 transition-all duration-500 relative ${t.blocked ? 'border-red-600 bg-red-950/20' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 shadow-inner'}`}>
                  <div className="flex justify-between items-baseline mb-4">
                      <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Thread_0{t.id}</span>
                      {t.blocked && <span className="text-[8px] text-red-500 animate-pulse font-black italic tracking-tighter">!_PROCESS_HALTED</span>}
                  </div>
                  <div className="h-28 bg-black rounded-lg flex flex-col justify-end p-1 border border-slate-900 overflow-hidden shadow-inner">
                      <div className={`w-full transition-all duration-1000 rounded-sm ${t.blocked ? 'bg-gradient-to-t from-red-800 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-t from-blue-800 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'}`} style={{ height: `${t.load}%` }}></div>
                  </div>
                  <div className="mt-4">
                      <div className="text-[10px] font-black text-slate-200 truncate font-mono uppercase tracking-tight">{t.task}</div>
                      {t.waitingFor && (
                          <div className="text-[8px] text-red-400 font-mono mt-2 flex items-center gap-2 bg-red-900/10 px-2 py-1 rounded border border-red-900/20">
                              <span className="animate-bounce">↓</span> Waiting_on: T_0{t.waitingFor}
                          </div>
                      )}
                  </div>
              </div>
          ))}
      </div>

      {active && (
          <div className="mt-8 flex flex-col md:flex-row gap-6 animate-fade-in-up">
              <div className="flex-1 p-5 bg-blue-950/20 border border-blue-900/30 rounded-2xl shadow-inner">
                  <h4 className="text-[9px] font-black text-blue-400 uppercase mb-3 tracking-[0.2em] font-mono border-b border-blue-900/30 pb-1">Real-time Telemetry Uplink</h4>
                  <div className="h-16 overflow-hidden text-[8px] text-blue-300/50 font-mono space-y-1.5">
                      <div>[OK] Handshake_Verified: Peer_Uplink_STABLE</div>
                      <div className="text-red-400/80">[CRIT] Thread_03 reaching critical 100% load saturation</div>
                      <div className="text-emerald-400/80">[AUTO] Ferris_Prime applying Hotpatch at 0x7FFF...</div>
                      <div className="animate-pulse text-blue-400">[SYNC] Broadcasting neural state to global_swarm</div>
                  </div>
              </div>
              <div className="w-full md:w-1/3 p-5 bg-orange-950/10 border border-orange-900/20 rounded-2xl flex flex-col justify-center items-center text-center relative overflow-hidden group/sync">
                  <div className="absolute inset-0 bg-orange-500/5 translate-y-full group-hover/sync:translate-y-0 transition-transform duration-[3s] ease-linear"></div>
                  <div className="text-3xl font-black text-orange-500 font-mono relative z-10">{active ? '98.4' : '0.0'}%</div>
                  <div className="text-[8px] text-orange-400 font-black uppercase tracking-[0.3em] relative z-10 mt-1">Buffer_Consistency</div>
              </div>
          </div>
      )}
    </div>
  );
};
