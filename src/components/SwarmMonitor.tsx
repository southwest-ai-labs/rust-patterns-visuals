
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const SwarmMonitor: React.FC = () => {
  const [pulse, setPulse] = useState(0);
  const [nodes] = useState([
    { id: 'gateway', label: 'API_GW', pos: 'left-1/2 top-10' },
    { id: 'auth', label: 'AUTH_SRV', pos: 'left-1/4 top-40' },
    { id: 'engine', label: 'CORE_ENGINE', pos: 'left-1/2 top-40' },
    { id: 'db', label: 'POSTGRES_L5', pos: 'left-1/2 top-72' },
    { id: 'cache', label: 'REDIS_CLUSTER', pos: 'left-3/4 top-40' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
        setPulse(p => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-10 bg-slate-950 border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl relative h-[500px]">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
      
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">DISTRIBUTED_SWARM_MONITOR</h3>
          </div>
          <span className="text-[9px] font-mono text-blue-500 uppercase font-black">Sampling_Rate: 100% // OTEL_PROBE_ACTIVE</span>
      </div>

      <div className="p-8 h-full relative">
          {/* SVG Lines - Simplified Dynamic Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <line x1="50%" y1="60" x2="25%" y2="180" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="60" x2="50%" y2="180" stroke="white" strokeWidth="1" />
              <line x1="50%" y1="60" x2="75%" y2="180" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="180" x2="50%" y2="300" stroke="white" strokeWidth="1" />
          </svg>

          {nodes.map(node => (
              <div key={node.id} className={`absolute -translate-x-1/2 p-3 rounded-xl border-2 border-slate-800 bg-slate-900/90 shadow-2xl transition-all duration-500 hover:border-blue-500 group ${node.pos}`}>
                  <div className="flex flex-col items-center gap-1">
                      <div className="text-[8px] font-black text-slate-500 uppercase font-mono">{node.label}</div>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${30 + Math.random() * 40}%` }}></div>
                      </div>
                  </div>
                  {/* Context Propagation Animation */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-ping opacity-0 group-hover:opacity-100"></div>
              </div>
          ))}

          {/* Floating Request Particle */}
          <div 
            className="absolute w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_15px_#f97316] z-20 pointer-events-none transition-all duration-[3s] ease-in-out"
            style={{ 
                left: `${50 + Math.sin(pulse / 10) * 20}%`, 
                top: `${20 + (pulse % 100) * 0.5}%`,
                opacity: pulse > 0 ? 1 : 0
            }}
          ></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent">
          <div className="bg-black/60 border border-slate-800 p-4 rounded-2xl flex justify-between items-center backdrop-blur-sm">
              <div className="text-[9px] font-mono text-slate-400">
                  <span className="text-blue-400 font-black">TRACE_ID:</span> 0x8F2A... <br/>
                  <span className="text-orange-400 font-black">SPAN_LATENCY:</span> 12.4ms
              </div>
              <p className="text-[10px] text-slate-500 italic max-w-xs text-right leading-tight">
                  <T>Visualizando la propagación del Contexto OTEL. Rust permite rastrear una petición a través de toda la infraestructura con overhead despreciable.</T>
              </p>
          </div>
      </div>
    </div>
  );
};
