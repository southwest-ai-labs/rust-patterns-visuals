
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const MacroSandbox: React.FC = () => {
  const [phase, setPhase] = useState<'build' | 'runtime'>('build');

  return (
    <div className="my-10 bg-black border border-orange-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">MACRO_SECURITY_SANDBOX</h3>
          </div>
          <div className="flex bg-black p-1 rounded-lg border border-slate-800">
              <button onClick={() => setPhase('build')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${phase === 'build' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>Build_Time</button>
              <button onClick={() => setPhase('runtime')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${phase === 'runtime' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Runtime</button>
          </div>
      </div>

      <div className="p-10 flex flex-col items-center h-[350px] justify-center relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 w-full max-w-lg flex items-center justify-between">
              {/* Compiler Section */}
              <div className={`p-6 rounded-3xl border-2 transition-all duration-700 ${phase === 'build' ? 'border-orange-500 bg-orange-500/10 scale-110 shadow-2xl' : 'border-slate-800 opacity-30 grayscale'}`}>
                  <div className="text-[10px] font-black text-white mb-2 uppercase text-center">Compiler (rustc)</div>
                  <div className="w-24 h-24 bg-black/50 rounded-2xl flex flex-col items-center justify-center font-mono">
                      <span className="text-xs text-orange-400">Expand()</span>
                      <span className="text-[8px] text-slate-500 mt-2 tracking-tighter animate-pulse"># INSPECTING_TOKEN_STREAM</span>
                  </div>
              </div>

              {/* Data Flow */}
              <div className="flex-1 flex flex-col items-center gap-2">
                  <div className={`h-1 w-full max-w-[100px] rounded-full transition-all duration-700 ${phase === 'build' ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-blue-500'}`}></div>
                  <span className={`text-[8px] font-black uppercase ${phase === 'build' ? 'text-orange-500' : 'text-blue-500'}`}>
                      {phase === 'build' ? 'Arbitrary_Code_Gen' : 'Isolated_Execution'}
                  </span>
              </div>

              {/* OS / Machine Section */}
              <div className={`p-6 rounded-3xl border-2 transition-all duration-700 ${phase === 'runtime' ? 'border-blue-500 bg-blue-500/10 scale-110 shadow-2xl' : 'border-slate-800 opacity-30 grayscale'}`}>
                  <div className="text-[10px] font-black text-white mb-2 uppercase text-center">Host Machine</div>
                  <div className="w-24 h-24 bg-black/50 rounded-2xl flex flex-col items-center justify-center font-mono">
                      <span className="text-xs text-blue-400">Secure_Jail</span>
                      <span className="text-[8px] text-slate-500 mt-2 tracking-tighter"># RESTRICTED_IO</span>
                  </div>
              </div>
          </div>

          <div className="mt-12 p-6 bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl">
              <p className="text-xs text-slate-400 italic text-center leading-relaxed font-mono">
                  <T>{phase === 'build' ? 
                    "DANGER: Las macros procedurales pueden ejecutar cualquier comando de shell durante la compilación. Un crate malicioso podría robar tus SSH keys mientras haces 'cargo build'." : 
                    "SECURE: El binario compilado está sujeto a los permisos del SO. Pero la soberanía real requiere auditoría de los build scripts (build.rs) y macros."}
                  </T>
              </p>
          </div>
      </div>
    </div>
  );
};
