
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const AsmLab: React.FC = () => {
  const [registers, setRegisters] = useState({ rax: '0x00', rbx: '0x00', rcx: '0x00' });
  const [activeLine, setActiveLine] = useState(-1);

  const runSim = () => {
    setActiveLine(0);
    setTimeout(() => {
        setRegisters(r => ({ ...r, rax: '0x42' }));
        setActiveLine(1);
        setTimeout(() => {
            setRegisters(r => ({ ...r, rbx: r.rax }));
            setActiveLine(2);
            setTimeout(() => setActiveLine(-1), 1000);
        }, 1000);
    }, 1000);
  };

  return (
    <div className="my-10 bg-black border border-orange-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">INLINE_ASM_STEPPER</h3>
          </div>
          <button 
            onClick={runSim}
            disabled={activeLine !== -1}
            className="px-6 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 text-white text-[9px] font-black uppercase rounded-lg transition-all"
          >
            Execute_Assembly
          </button>
      </div>

      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Code Section */}
          <div className="space-y-4">
              <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Rust_asm!_Block</div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs leading-relaxed">
                  <div className={`${activeLine === 0 ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500'}`}>mov rax, 0x42</div>
                  <div className={`${activeLine === 1 ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500'}`}>mov rbx, rax</div>
                  <div className={`${activeLine === 2 ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500'}`}>add rbx, 1</div>
              </div>
          </div>

          {/* Registers Section */}
          <div className="grid grid-cols-1 gap-3">
              <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Physical_Registers</div>
              {Object.entries(registers).map(([name, val]) => (
                  <div key={name} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-black text-blue-400 uppercase">{name}</span>
                      <span className="text-xl font-black text-white font-mono">{val}</span>
                  </div>
              ))}
          </div>
      </div>

      <div className="px-8 py-4 bg-slate-950 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic text-center max-w-lg mx-auto">
              <T>Rust permite bajar al nivel del procesador de forma segura. El compilador se encarga de asignar qué registros físicos corresponden a tus variables de Rust.</T>
          </p>
      </div>
    </div>
  );
};
