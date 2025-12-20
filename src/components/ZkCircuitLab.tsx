
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const ZkCircuitLab: React.FC = () => {
  const [inputs, setInputs] = useState({ a: 3, b: 4 });
  const [revealed, setRevealed] = useState(false);
  const result = inputs.a * inputs.b;

  return (
    <div className="my-10 bg-slate-950 border border-purple-900/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]">
      <div className="bg-purple-950/20 px-8 py-6 border-b border-purple-900/20">
          <h3 className="text-xl font-black text-purple-400 uppercase tracking-tighter flex items-center gap-3">
              <span className="text-2xl">🔐</span> Zero-Knowledge Lab
          </h3>
          <p className="text-[10px] text-purple-700 font-mono uppercase tracking-widest mt-1">Constraint System: R1CS // Proof System: Groth16</p>
      </div>

      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Secret Inputs */}
          <div className="space-y-8">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Witness (Secret Inputs)</h4>
              <div className="space-y-4">
                  <div>
                      <div className="flex justify-between text-[10px] font-mono text-purple-400 mb-2"><span>Input A (Secret)</span> <span>{revealed ? inputs.a : '***'}</span></div>
                      <input type="range" min="1" max="10" value={inputs.a} onChange={e => setInputs(i => ({...i, a: parseInt(e.target.value)}))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>
                  <div>
                      <div className="flex justify-between text-[10px] font-mono text-purple-400 mb-2"><span>Input B (Secret)</span> <span>{revealed ? inputs.b : '***'}</span></div>
                      <input type="range" min="1" max="10" value={inputs.b} onChange={e => setInputs(i => ({...i, b: parseInt(e.target.value)}))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>
              </div>
              <button onClick={() => setRevealed(!revealed)} className="text-[9px] text-slate-500 hover:text-white uppercase font-black tracking-widest underline">{revealed ? 'Hide Witness' : 'Reveal Witness (Admin Only)'}</button>
          </div>

          {/* Circuit Visualizer */}
          <div className="bg-black/50 rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-6 text-[8px] font-mono text-slate-700 uppercase">ZK_PROOFER_CIRCUIT</div>
              
              <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-4">
                      <div className={`w-8 h-8 rounded border-2 border-dashed flex items-center justify-center font-mono text-xs ${revealed ? 'border-purple-500 text-purple-400' : 'border-slate-800 text-slate-800'}`}>?</div>
                      <div className={`w-8 h-8 rounded border-2 border-dashed flex items-center justify-center font-mono text-xs ${revealed ? 'border-purple-500 text-purple-400' : 'border-slate-800 text-slate-800'}`}>?</div>
                  </div>
                  <div className="w-12 h-[2px] bg-slate-800 relative">
                      <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-purple-500 animate-ping"></div>
                  </div>
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <span className="text-xl font-black text-emerald-400">{result}</span>
                  </div>
              </div>
              
              <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-xl w-full text-center">
                  <div className="text-[10px] font-black text-emerald-500 mb-1 uppercase tracking-widest">Proof Status: VALID</div>
                  {/* Fix: Wrap the template literal in braces to provide a single string to the T component's children prop */}
                  <p className="text-[9px] text-slate-500 italic"><T>{`El verificador sabe que conoces dos números cuyo producto es ${result}, sin saber qué números son.`}</T></p>
              </div>
          </div>
      </div>
    </div>
  );
};
