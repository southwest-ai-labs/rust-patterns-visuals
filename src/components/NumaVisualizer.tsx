
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const NumaVisualizer: React.FC = () => {
  const [access, setAccess] = useState<'local' | 'remote'>('local');

  return (
    <div className="my-10 bg-slate-950 border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">NUMA_TOPOLOGY_MONITOR</h3>
          </div>
          <div className="flex bg-black p-1 rounded-lg border border-slate-800">
              <button onClick={() => setAccess('local')} className={`px-4 py-1 rounded text-[9px] font-black transition-all ${access === 'local' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Local_Access</button>
              <button onClick={() => setAccess('remote')} className={`px-4 py-1 rounded text-[9px] font-black transition-all ${access === 'remote' ? 'bg-red-600 text-white' : 'text-slate-500'}`}>Remote_Access</button>
          </div>
      </div>

      <div className="p-10 flex justify-center items-center gap-16 relative">
          {/* Socket 0 */}
          <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-blue-900/20 border-2 border-blue-500 rounded-2xl flex items-center justify-center font-black text-white uppercase text-xs shadow-[0_0_20px_rgba(59,130,246,0.3)]">CPU_0</div>
              <div className="w-32 h-12 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center font-mono text-[10px] text-blue-300">RAM_BANK_0</div>
          </div>

          {/* Interconnect */}
          <div className="flex-1 h-0.5 bg-slate-800 relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${access === 'local' ? 'from-blue-500 to-transparent' : 'from-blue-500 to-red-500 animate-pulse'} transition-all`}></div>
              {access === 'remote' && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-red-500 uppercase animate-bounce"># QPI_UPI_LATENCY_PENALTY</div>
              )}
          </div>

          {/* Socket 1 */}
          <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-slate-900 border-2 border-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-600 uppercase text-xs">CPU_1</div>
              <div className="w-32 h-12 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center font-mono text-[10px] text-slate-600">RAM_BANK_1</div>
          </div>
          
          {/* Signal Particle */}
          <div 
            className={`absolute w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa] z-20 transition-all duration-1000`}
            style={{ 
                left: access === 'local' ? '20%' : '75%',
                top: '50%',
                opacity: 1
            }}
          ></div>
      </div>

      <div className="px-8 py-6 bg-slate-900/50 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                  <div className="text-[8px] text-slate-500 uppercase font-black mb-1">Access Latency</div>
                  <div className={`text-2xl font-black font-mono ${access === 'local' ? 'text-emerald-400' : 'text-red-500'}`}>{access === 'local' ? '45ns' : '110ns'}</div>
              </div>
              <p className="text-[10px] text-slate-400 italic flex items-center">
                  <T>{access === 'local' ? "Acceso local: CPU y Memoria en el mismo bus. Máximo rendimiento." : "Acceso remoto: La CPU debe pedir datos al bus de otro procesador. Penalización de latencia masiva."}</T>
              </p>
          </div>
      </div>
    </div>
  );
};
