
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const SimdVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'scalar' | 'simd'>('scalar');
  const [activeIdx, setActiveIdx] = useState(-1);
  const data = [10, 20, 30, 40, 50, 60, 70, 80];

  useEffect(() => {
    let interval: any;
    if (mode === 'scalar') {
        interval = setInterval(() => {
            setActiveIdx(prev => (prev + 1) % data.length);
        }, 600);
    } else {
        setActiveIdx(-1);
    }
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="my-10 bg-slate-950 border border-cyan-900/30 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.05)]">
      <div className="bg-cyan-950/20 px-8 py-4 border-b border-cyan-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">SIMD_VECTOR_PROCESSOR</h3>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button onClick={() => setMode('scalar')} className={`px-4 py-1 rounded text-[9px] font-black uppercase transition-all ${mode === 'scalar' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}>Scalar (Loop)</button>
              <button onClick={() => setMode('simd')} className={`px-4 py-1 rounded text-[9px] font-black uppercase transition-all ${mode === 'simd' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>SIMD (AVX-512)</button>
          </div>
      </div>

      <div className="p-10 flex flex-col items-center">
          {/* CPU Registers */}
          <div className="flex gap-2 mb-12">
              {data.map((val, i) => (
                  <div key={i} className={`w-12 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-300 transform ${
                      mode === 'scalar' && activeIdx === i ? 'border-cyan-400 bg-cyan-400/20 scale-110 shadow-[0_0_15px_#22d3ee]' :
                      mode === 'simd' ? 'border-indigo-400 bg-indigo-400/10' : 'border-slate-800 bg-slate-900 opacity-40'
                  }`}>
                      <span className="text-[10px] font-mono text-slate-500">[{i}]</span>
                      <span className="text-sm font-bold text-white">{val}</span>
                  </div>
              ))}
          </div>

          {/* Operation Arrow */}
          <div className="relative w-full h-12 flex justify-center items-center mb-8">
              <div className="absolute inset-x-20 h-[1px] bg-slate-800"></div>
              <div className={`px-6 py-2 rounded-full border font-black text-[10px] uppercase tracking-tighter relative z-10 transition-all ${
                  mode === 'scalar' ? 'bg-cyan-600 border-cyan-400' : 'bg-indigo-600 border-indigo-400 scale-125 shadow-[0_0_30px_#6366f1]'
              }`}>
                  {mode === 'scalar' ? 'ADD_ONE (1 x CPU CYCLE)' : 'ADD_ONE (ALL x 1 CPU CYCLE)'}
              </div>
          </div>

          {/* Results */}
          <div className="flex gap-2">
              {data.map((val, i) => (
                  <div key={i} className={`w-12 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-500 ${
                      mode === 'scalar' && activeIdx >= i ? 'border-emerald-500 bg-emerald-500/20' :
                      mode === 'simd' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-800 bg-slate-900 opacity-20'
                  }`}>
                      <span className="text-sm font-bold text-white">{val + 1}</span>
                  </div>
              ))}
          </div>

          <div className="mt-12 max-w-lg text-center">
              <p className="text-xs text-slate-400 italic leading-relaxed font-mono">
                  <T>{mode === 'scalar' ? 
                    "Procesamiento secuencial: La CPU tarda 8 ciclos en sumar 1 a cada elemento." : 
                    "Procesamiento vectorial: La CPU utiliza una instrucción especializada para sumar 1 a todos los elementos en un solo ciclo de reloj."}
                  </T>
              </p>
          </div>
      </div>
      
      <div className="px-8 py-3 bg-slate-950/50 border-t border-cyan-900/10 flex justify-between items-center text-[8px] font-mono text-cyan-800">
          <span>THROUGHPUT: {mode === 'scalar' ? '1.2 GB/s' : '9.8 GB/s'}</span>
          <span className="animate-pulse">LATENCY: {mode === 'scalar' ? 'LOW' : 'ZERO_WAIT'}</span>
      </div>
    </div>
  );
};
