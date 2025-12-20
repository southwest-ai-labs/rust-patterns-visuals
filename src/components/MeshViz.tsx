
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const MeshViz: React.FC = () => {
  const [traffic, setTraffic] = useState(true);
  const [encryption, setEncryption] = useState(true);

  return (
    <div className="my-10 bg-slate-950 border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">SERVICE_MESH_TRAFFIC_PLANE</h3>
          </div>
          <div className="flex bg-black p-1 rounded-lg border border-slate-800">
              <button onClick={() => setEncryption(!encryption)} className={`px-4 py-1 rounded text-[9px] font-black transition-all ${encryption ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>mTLS_Secure</button>
              <button onClick={() => setTraffic(!traffic)} className={`px-4 py-1 rounded text-[9px] font-black transition-all ${traffic ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>Live_Flow</button>
          </div>
      </div>

      <div className="p-10 h-80 relative flex justify-around items-center bg-black/40 overflow-hidden">
          <div className="absolute inset-0 bg-grid-blue-500/[0.02] bg-[size:30px_30px]"></div>
          
          {/* Node A */}
          <div className="flex flex-col items-center gap-4 z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-blue-500/50 flex items-center justify-center font-black text-white shadow-2xl">SRV_A</div>
              <div className="text-[8px] font-mono text-slate-500 uppercase">Rust_Microvm_01</div>
          </div>

          {/* Traffic Path */}
          <div className="flex-1 h-0.5 bg-slate-800 relative mx-4">
              {traffic && (
                  <div className={`absolute inset-0 overflow-hidden`}>
                      <div className={`h-full w-20 ${encryption ? 'bg-blue-400 shadow-[0_0_15px_#60a5fa]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'} animate-mesh-slide`}></div>
                  </div>
              )}
              {encryption && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      <span className="text-xl">🔒</span>
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">TLS_1.3_ENCRYPTED</span>
                  </div>
              )}
          </div>

          {/* Node B */}
          <div className="flex flex-col items-center gap-4 z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-blue-500/50 flex items-center justify-center font-black text-white shadow-2xl">SRV_B</div>
              <div className="text-[8px] font-mono text-slate-500 uppercase">Rust_Microvm_02</div>
          </div>

          <style>{`
            @keyframes mesh-slide {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
            .animate-mesh-slide {
              animation: mesh-slide 2s infinite linear;
            }
          `}</style>
      </div>

      <div className="px-8 py-6 bg-slate-900 border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="text-[9px] font-black text-blue-400 uppercase mb-2">Observability Layer</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                      <T>En una Service Mesh (como Linkerd), Rust gestiona el proxy de red ("Sidecar"). Esto permite inyectar seguridad y observabilidad sin tocar el código de la aplicación.</T>
                  </p>
              </div>
              <div className="flex items-center justify-center text-center">
                  <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-500 uppercase">Handshake Latency</div>
                      <div className="text-2xl font-black text-white font-mono">0.12ms</div>
                      <div className="text-[8px] text-emerald-500 font-mono">OPTIMAL_REACHABILITY</div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
