
import React, { useState, useMemo } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const OptimizationLab: React.FC = () => {
  const [config, setConfig] = useState({
    lto: false,
    panicAbort: false,
    codegenUnits: 16,
    optLevel: "3"
  });

  const stats = useMemo(() => {
    let size = 5.2; // MB base
    let speed = 100; // base speed %
    
    if (config.lto) { size -= 1.2; speed += 15; }
    if (config.panicAbort) { size -= 0.8; }
    if (config.codegenUnits === 1) { size -= 0.2; speed += 5; }
    if (config.optLevel === "z") { size -= 2.1; speed -= 10; }

    return { size: size.toFixed(2), speed };
  }, [config]);

  return (
    <div className="my-10 bg-black border border-emerald-900/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.05)]">
      <div className="bg-emerald-950/20 px-8 py-6 border-b border-emerald-900/20">
          <h3 className="text-xl font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-3">
              <span className="text-2xl">🧪</span> Cargo Optimization Lab
          </h3>
          <p className="text-[10px] text-emerald-700 font-mono uppercase tracking-widest mt-1">Profile: Release // Target: x86_64-unknown-linux-gnu</p>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 group hover:border-emerald-500/30 transition-all">
                  <div>
                      <div className="text-xs font-bold text-slate-200">Link-Time Optimization (LTO)</div>
                      <div className="text-[9px] text-slate-500 font-mono italic">Across all crates in the dependency graph.</div>
                  </div>
                  <button 
                    onClick={() => setConfig(c => ({...c, lto: !c.lto}))}
                    className={`w-12 h-6 rounded-full transition-all relative ${config.lto ? 'bg-emerald-600' : 'bg-slate-800'}`}
                  >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.lto ? 'left-7' : 'left-1'}`}></div>
                  </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 group hover:border-emerald-500/30 transition-all">
                  <div>
                      <div className="text-xs font-bold text-slate-200">Panic = "Abort"</div>
                      <div className="text-[9px] text-slate-500 font-mono italic">Remove stack unwinding metadata.</div>
                  </div>
                  <button 
                    onClick={() => setConfig(c => ({...c, panicAbort: !c.panicAbort}))}
                    className={`w-12 h-6 rounded-full transition-all relative ${config.panicAbort ? 'bg-emerald-600' : 'bg-slate-800'}`}
                  >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.panicAbort ? 'left-7' : 'left-1'}`}></div>
                  </button>
              </div>

              <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                      <span>Codegen Units</span>
                      <span className="text-emerald-500">{config.codegenUnits}</span>
                  </div>
                  <input 
                    type="range" min="1" max="16" step="1"
                    value={config.codegenUnits}
                    onChange={(e) => setConfig(c => ({...c, codegenUnits: parseInt(e.target.value)}))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="text-[8px] text-slate-600 font-mono italic text-right">Fewer units = Better optimization, Slower compilation.</div>
              </div>
          </div>

          {/* Results Display */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="grid grid-cols-2 gap-8 w-full mb-8">
                  <div>
                      <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Binary Size</div>
                      <div className="text-4xl font-black text-white font-mono">{stats.size} <span className="text-lg text-slate-600">MB</span></div>
                  </div>
                  <div>
                      <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Execution Speed</div>
                      <div className="text-4xl font-black text-emerald-400 font-mono">{stats.speed}%</div>
                  </div>
              </div>

              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-1000" style={{ width: `${(stats.speed / 130) * 100}%` }}></div>
              </div>
              <p className="mt-4 text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">Efficiency Rating: {stats.speed > 110 ? 'Staff_Architect_Level' : 'Junior_Dev_Defaults'}</p>
          </div>
      </div>
    </div>
  );
};
