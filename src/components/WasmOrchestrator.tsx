
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const WasmOrchestrator: React.FC = () => {
  const [migration, setMigration] = useState(false);
  const [actors, setActors] = useState([
    { id: 1, host: 'AWS_US_EAST', status: 'live' },
    { id: 2, host: 'AZURE_EU_WEST', status: 'live' },
    { id: 3, host: 'LOCAL_EDGE', status: 'live' }
  ]);

  const triggerMigration = () => {
    setMigration(true);
    setTimeout(() => {
        setActors(prev => prev.map(a => a.id === 2 ? { ...a, host: 'GCP_ASIA_SOUTH' } : a));
        setMigration(false);
    }, 3000);
  };

  return (
    <div className="my-10 bg-black border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">WASMCLOUD_LATTICE_ORCHESTRATOR</h3>
          </div>
          <button 
            onClick={triggerMigration}
            disabled={migration}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white text-[9px] font-black uppercase rounded-full transition-all shadow-lg"
          >
            {migration ? 'MIGRATING_ACTOR_STATE...' : 'HOT_SWAP_ACTOR'}
          </button>
      </div>

      <div className="p-10 h-72 relative flex justify-center items-center">
          {/* Lattice Grid */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>

          <div className="flex gap-12 relative z-10">
              {actors.map((actor, i) => (
                  <div key={actor.id} className="flex flex-col items-center gap-4">
                      <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{actor.host}</div>
                      <div className={`w-24 h-24 rounded-3xl border-2 bg-slate-900/80 flex flex-col items-center justify-center transition-all duration-[2000ms] relative ${
                          migration && actor.id === 2 ? 'border-orange-500 scale-110 opacity-50 blur-sm' : 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                      }`}>
                          <div className="text-2xl mb-1">📦</div>
                          <span className="text-[10px] font-black text-white font-mono uppercase">ACTOR_0{actor.id}</span>
                          {actor.id === 2 && migration && (
                              <div className="absolute -top-2 -right-2 text-xs animate-bounce">🚀</div>
                          )}
                      </div>
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Central Control Hub */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full shadow-2xl">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Global_Lattice_Mesh // Protocol: NATS</span>
          </div>
      </div>

      <div className="px-8 py-6 bg-slate-900/50 border-t border-slate-800">
          <p className="text-xs text-slate-400 italic text-center max-w-xl mx-auto leading-relaxed">
              <T>WasmCloud permite que los actores (lógica de negocio) sean agnósticos a la nube. En Rust, estos actores son "Sandboxed", lo que permite moverlos entre proveedores en milisegundos sin reiniciar procesos.</T>
          </p>
      </div>
    </div>
  );
};
