
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface Dependency {
  name: string;
  version: string;
  status: 'safe' | 'warning' | 'critical';
  dependencies?: Dependency[];
}

export const DepGraphViz: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const graph: Dependency = {
    name: 'my_app', version: '1.0.0', status: 'safe',
    dependencies: [
      { name: 'tokio', version: '1.35.0', status: 'safe', dependencies: [
        { name: 'mio', version: '0.8.0', status: 'safe' },
        { name: 'bytes', version: '1.5.0', status: 'safe' }
      ]},
      { name: 'openssl-sys', version: '0.9.90', status: 'warning', dependencies: [
        { name: 'libc', version: '0.2.150', status: 'safe' }
      ]},
      { name: 'legacy_crypto', version: '0.1.2', status: 'critical' }
    ]
  };

  const renderDep = (dep: Dependency, level: number = 0) => (
    <div key={dep.name} className="flex flex-col items-center">
      <div 
        onClick={() => setSelected(`${dep.name} v${dep.version}`)}
        className={`px-4 py-2 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 flex flex-col items-center min-w-[120px] ${
          dep.status === 'safe' ? 'border-emerald-500/30 bg-emerald-500/10' :
          dep.status === 'warning' ? 'border-amber-500/30 bg-amber-500/10' :
          'border-red-500 bg-red-500/20 shadow-[0_0_20px_#ef4444]'
        }`}
      >
        <span className="text-[10px] font-black text-white uppercase">{dep.name}</span>
        <span className="text-[8px] font-mono text-slate-500">{dep.version}</span>
      </div>
      {dep.dependencies && (
        <div className="flex gap-4 mt-8 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-slate-800"></div>
          {dep.dependencies.map(child => renderDep(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="my-10 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-mono">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest">SUPPLY_CHAIN_AUDITOR</h3>
          </div>
          <span className="text-[9px] text-emerald-500 font-black">SCAN_LEVEL: L7_DEEP_INSPECTION</span>
      </div>

      <div className="p-10 flex flex-col items-center overflow-x-auto">
          <div className="min-w-[600px] flex justify-center pb-8">
              {renderDep(graph)}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl border-t border-slate-900 pt-8">
              <div className="space-y-4">
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Vulnerability_Report</div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 h-24 flex items-center justify-center text-center">
                      <p className="text-[11px] text-slate-400 italic">
                          {selected ? <T>{`Inspeccionando ${selected}... El análisis estático de Southwest detectó ${selected.includes('legacy') ? 'una vulnerabilidad crítica RUSTSEC-2024-001' : 'cero problemas conocidos'}.`}</T> : <T>Selecciona un crate para auditar sus invariantes de seguridad.</T>}
                      </p>
                  </div>
              </div>
              <div className="bg-black/40 rounded-xl border border-slate-800 p-4 flex flex-col justify-center">
                  <div className="text-[9px] font-black text-slate-600 uppercase mb-2">Security KPIs</div>
                  <div className="space-y-2">
                      <div className="flex justify-between text-[8px]"><span>DIRECT_DEPS:</span> <span className="text-white">3</span></div>
                      <div className="flex justify-between text-[8px]"><span>TRANSITIVE_DEPS:</span> <span className="text-white">4</span></div>
                      <div className="flex justify-between text-[8px]"><span>UNTRUSTED_CODE:</span> <span className="text-red-500">14.2%</span></div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
