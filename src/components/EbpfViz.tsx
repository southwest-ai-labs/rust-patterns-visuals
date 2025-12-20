
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const EbpfViz: React.FC = () => {
  const [probeActive, setProbeActive] = useState(false);
  const [packets, setPackets] = useState<number[]>([]);

  const injectProbe = () => {
    setProbeActive(true);
    // Simular flujo de paquetes
    const interval = setInterval(() => {
        setPackets(prev => [...prev, Math.random()].slice(-10));
    }, 400);
    setTimeout(() => {
        clearInterval(interval);
        setProbeActive(false);
        setPackets([]);
    }, 5000);
  };

  return (
    <div className="my-10 bg-black border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">EBPF_KERNEL_PROBE_MANAGER</h3>
          </div>
          <button 
            onClick={injectProbe}
            disabled={probeActive}
            className={`px-6 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${probeActive ? 'bg-emerald-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
          >
            {probeActive ? 'PROBE_LIVE_IN_KERNEL' : 'INJECT_RUST_XDP_PROBE'}
          </button>
      </div>

      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 h-80">
          {/* Architecture View */}
          <div className="relative border-2 border-slate-800 rounded-2xl p-4 bg-slate-950/50 flex flex-col justify-between">
              <div className="text-[8px] text-slate-500 font-black uppercase absolute -top-2 left-4 bg-black px-2">System_Hierarchy</div>
              
              <div className="flex-1 flex flex-col justify-around">
                  <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-center">
                      <span className="text-[10px] text-blue-400 font-bold uppercase">User_Space (App)</span>
                  </div>
                  <div className="h-0.5 w-full bg-slate-800 relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[6px] text-slate-600 uppercase font-black">Context_Switch_Boundary</div>
                  </div>
                  <div className={`p-3 border transition-all duration-700 rounded-xl text-center relative ${probeActive ? 'bg-emerald-900/30 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-slate-700 opacity-50'}`}>
                      <span className="text-[10px] text-white font-bold uppercase">Kernel_Networking_Stack</span>
                      {probeActive && (
                          <div className="absolute -right-2 -top-2 bg-emerald-500 text-black font-black text-[6px] px-1.5 py-0.5 rounded rotate-12">RUST_AYA_PROBE</div>
                      )}
                  </div>
              </div>
          </div>

          {/* Packet Flow Monitor */}
          <div className="bg-black rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[8px] font-mono text-slate-700 uppercase">Real-time_Telemetry</div>
              <div className="flex gap-1 items-end h-32 w-full px-4">
                  {packets.map((p, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 transition-all duration-300 rounded-t-sm ${p > 0.7 && probeActive ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-blue-500/40'}`}
                        style={{ height: `${p * 100}%` }}
                      ></div>
                  ))}
                  {packets.length === 0 && <div className="w-full text-center text-[10px] text-slate-800 font-mono italic">Awaiting packet stream...</div>}
              </div>
              <div className="mt-6 flex justify-between w-full text-[8px] font-mono uppercase">
                  <span className="text-blue-500">Processed: {packets.length}</span>
                  <span className="text-red-500">Dropped: {packets.filter(p => p > 0.7 && probeActive).length}</span>
              </div>
          </div>
      </div>

      <div className="px-8 py-4 bg-slate-950 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic text-center max-w-lg mx-auto">
              <T>eBPF permite ejecutar código Rust seguro dentro del Kernel de Linux. En lugar de procesar firewalls en User Space (lento), Rust filtra ataques DDoS directamente en el driver de red (XDP).</T>
          </p>
      </div>
    </div>
  );
};
