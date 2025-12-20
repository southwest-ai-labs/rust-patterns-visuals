
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const WasmNeuralEngine: React.FC = () => {
  const [state, setState] = useState<'idle' | 'loading' | 'running'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state === 'loading') {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) { setState('running'); return 100; }
                return p + 2;
            });
        }, 30)
        return () => clearInterval(interval);
    }
  }, [state]);

  return (
    <div className="my-10 bg-black border border-purple-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-purple-950/20 px-8 py-4 border-b border-purple-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">WASM_NEURAL_RUNTIME</h3>
          </div>
          <span className="text-[8px] font-mono text-purple-700">Target: wasm32-wasi</span>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full max-w-md space-y-6">
              {/* Sandbox View */}
              <div className="h-48 bg-slate-900/50 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  
                  {state === 'idle' && (
                      <button onClick={() => setState('loading')} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] uppercase rounded-full shadow-lg transition-all active:scale-95">Load Quantized Model (4bit)</button>
                  )}

                  {state === 'loading' && (
                      <div className="flex flex-col items-center gap-4 w-full px-12">
                          <div className="text-[10px] font-mono text-purple-400 animate-pulse">LOADING_TENSORS_INTO_WASM_MEM...</div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500" style={{ width: `${progress}%` }}></div>
                          </div>
                      </div>
                  )}

                  {state === 'running' && (
                      <div className="grid grid-cols-4 gap-4 animate-fade-in">
                          {Array.from({ length: 12 }).map((_, i) => (
                              <div key={i} className={`w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7] animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                          ))}
                      </div>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                      <div className="text-[8px] text-slate-500 uppercase font-black mb-1">Inference Latency</div>
                      <div className="text-xl font-black text-white font-mono">{state === 'running' ? '42ms' : '--'}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                      <div className="text-[8px] text-slate-500 uppercase font-black mb-1">Heap Isolation</div>
                      <div className="text-xl font-black text-emerald-400 font-mono">STRICT</div>
                  </div>
              </div>
          </div>

          <p className="mt-8 text-xs text-slate-500 italic text-center max-w-sm font-mono">
              <T>Rust + Wasm permite ejecutar modelos de IA con aislamiento total del host. Cero riesgo de escape de memoria y rendimiento cercano a nativo.</T>
          </p>
      </div>
    </div>
  );
};
