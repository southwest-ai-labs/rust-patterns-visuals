
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const MicroVMLab: React.FC = () => {
  const [lang, setLang] = useState<'rust' | 'python'>('rust');
  const [isBooting, setIsBooting] = useState(false);
  const [metrics, setMetrics] = useState({ bootTime: 0, memory: 0 });

  const startVM = () => {
    setIsBooting(true);
    const delay = lang === 'rust' ? 120 : 850;
    const mem = lang === 'rust' ? 2.4 : 35.8;
    
    setTimeout(() => {
      setMetrics({ bootTime: delay, memory: mem });
      setIsBooting(false);
    }, 1000);
  };

  return (
    <div className="my-10 bg-slate-950 border border-orange-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316] animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">FIRECRACKER_MICROVM_CONTROLLER</h3>
          </div>
          <div className="flex bg-black p-1 rounded-lg border border-slate-800">
              <button onClick={() => setLang('rust')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${lang === 'rust' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Rust_Binary</button>
              <button onClick={() => setLang('python')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${lang === 'python' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Python_Runtime</button>
          </div>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full max-w-2xl h-48 bg-black/40 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center relative overflow-hidden">
              {isBooting ? (
                  <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-mono text-orange-500 uppercase animate-pulse">Initializing_VMM_Context...</span>
                  </div>
              ) : metrics.bootTime > 0 ? (
                  <div className="grid grid-cols-2 gap-12 animate-fade-in">
                      <div className="text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-black mb-1">Cold_Start</div>
                          <div className="text-4xl font-black text-white font-mono">{metrics.bootTime}ms</div>
                      </div>
                      <div className="text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-black mb-1">RSS_Memory</div>
                          <div className="text-4xl font-black text-emerald-400 font-mono">{metrics.memory}MB</div>
                      </div>
                  </div>
              ) : (
                  <button onClick={startVM} className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-2xl hover:bg-orange-500 hover:text-white transition-all">Provision_Instance</button>
              )}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="text-[10px] font-black text-orange-500 uppercase mb-3">Isolation Layer</h4>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed italic">
                      <T>Rust permite binarios estáticos sin dependencias. Esto reduce el tamaño de la imagen del MicroVM de cientos de MBs a apenas unos pocos, eliminando el overhead del sistema operativo.</T>
                  </p>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase mb-3">Resource Sovereignty</h4>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed italic">
                      <T>Al no tener recolector de basura, la memoria es predecible desde el primer ms, permitiendo densidades de empaquetado 10x superiores a Java o Node.js.</T>
                  </p>
              </div>
          </div>
      </div>

      <div className="px-8 py-3 bg-slate-950 border-t border-slate-900 flex justify-between text-[8px] font-mono text-slate-700 uppercase">
          <span>Target: aarch64-unknown-linux-musl</span>
          <span className="animate-pulse">Hypervisor: KVM / Firecracker</span>
      </div>
    </div>
  );
};
