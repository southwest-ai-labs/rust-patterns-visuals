
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface BenchmarkPoint {
  lang: string;
  cost: number; // in ns
  color: string;
  description: string;
}

export const CrossLanguageFFIBenchmark: React.FC = () => {
  const [activeLang, setActiveLang] = useState('Rust');
  const [animating, setAnimating] = useState(false);

  const data: BenchmarkPoint[] = [
    { lang: 'Rust', cost: 0.8, color: 'bg-orange-500', description: 'Zero-cost. Direct machine call. No overhead over standard function.' },
    { lang: 'C', cost: 0.8, color: 'bg-blue-500', description: 'Native performance. The reference standard for ABI boundaries.' },
    { lang: 'Go (cgo)', cost: 55.0, color: 'bg-cyan-500', description: 'Significant overhead due to stack switching and GC coordination.' },
    { lang: 'Python (ctypes)', cost: 120.0, color: 'bg-yellow-500', description: 'Heavy overhead. Type conversion + GIL management + interpretative steps.' }
  ];

  const triggerAnim = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 1500);
  };

  const current = data.find(d => d.lang === activeLang)!;
  const maxCost = 120;

  return (
    <div className="my-12 bg-slate-950 border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-blue-950/20 px-8 py-5 border-b border-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">CROSS_LANGUAGE_ABI_BENCHMARK</h3>
          </div>
          <button onClick={triggerAnim} className="px-6 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase rounded-full shadow-lg transition-all active:scale-95">Run_Trace</button>
      </div>

      <div className="p-10 flex flex-col md:flex-row gap-12 items-center">
          {/* Visual Boundary Crossing */}
          <div className="flex-1 w-full h-64 bg-slate-900/50 rounded-3xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-slate-800/[0.1] bg-[size:20px_20px]"></div>
              
              {/* Boundary Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 flex flex-col justify-between py-4">
                  <div className="text-[8px] text-slate-700 font-mono -translate-x-1/2 uppercase tracking-widest">Boundary</div>
                  <div className="text-[8px] text-slate-700 font-mono -translate-x-1/2 uppercase tracking-widest">Boundary</div>
              </div>

              {/* Sides */}
              <div className="absolute left-4 top-4 text-[8px] font-mono text-slate-500 uppercase tracking-widest">User_Space</div>
              <div className="absolute right-4 top-4 text-[8px] font-mono text-slate-500 uppercase tracking-widest">System_ABI</div>

              {/* The Packet */}
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-[1.5s] ease-in-out absolute
                    ${animating ? 'translate-x-[200px] opacity-0' : '-translate-x-[200px] opacity-100'}
                    ${current.color} shadow-2xl
                `}
              >
                  <span className="text-[10px] font-black text-white">{current.lang}</span>
              </div>
              
              {/* Contention Visual for Go/Python */}
              {animating && current.cost > 10 && (
                  <div className="absolute left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 rounded-full animate-ping border border-red-500/20"></div>
              )}
          </div>

          {/* Results Selector */}
          <div className="flex-1 space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Language Overhead Analysis</h4>
              <div className="grid grid-cols-2 gap-3">
                  {data.map(item => (
                      <button 
                        key={item.lang}
                        onClick={() => setActiveLang(item.lang)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${activeLang === item.lang ? `border-blue-500 bg-blue-500/10 shadow-lg` : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}
                      >
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-black text-white uppercase">{item.lang}</span>
                              <span className="text-[9px] font-mono text-blue-400">{item.cost}ns</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full ${item.color}`} style={{ width: `${(item.cost / maxCost) * 100}%` }}></div>
                          </div>
                      </button>
                  ))}
              </div>

              <div className="mt-6 p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                  <h5 className="text-[9px] font-black text-blue-400 uppercase mb-2">Architectural Verdict</h5>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed italic">
                      <T>{current.description}</T>
                  </p>
              </div>
          </div>
      </div>
      
      <div className="px-8 py-3 bg-slate-950 border-t border-slate-900 flex justify-between text-[8px] font-mono text-slate-700">
          <span>LATENCY_PENALTY: {current.cost > 10 ? 'DETECTED' : 'NOMINAL'}</span>
          <span className="animate-pulse">ENV_PROBED: Intel_i9_64bit</span>
      </div>
    </div>
  );
};
