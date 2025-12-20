
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const MirViz: React.FC = () => {
  const [stage, setStage] = useState<'source' | 'hir' | 'mir' | 'asm'>('source');

  const content = {
      source: `fn main() {
    let mut x = 1;
    for i in 0..2 {
        x += i;
    }
}`,
      hir: `// High-Level IR
fn main() {
    let mut x = 1;
    let iter = (0..2).into_iter();
    loop {
        match iter.next() {
            Some(i) => x = x + i,
            None => break,
        }
    }
}`,
      mir: `// Mid-Level IR (Control Flow Graph)
bb0: {
    _1 = const 1_i32;
    goto -> bb1;
}
bb1: { // Loop Header
    _3 = &mut _2;
    _4 = <Range as Iterator>::next(_3);
    switchInt(_4) -> [0: bb3, 1: bb2];
}
bb2: { // Some(i)
    _1 = Add(_1, _5);
    goto -> bb1;
}
bb3: { // None
    return;
}`,
      asm: `// x86_64 Assembly
push    rbp
mov     rbp, rsp
mov     dword ptr [rsp + 4], 1
xor     eax, eax
...
add     dword ptr [rsp + 4], eax
pop     rbp
ret`
  };

  return (
    <div className="my-10 bg-black border border-pink-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">RUSTC_COMPILER_PIPELINE</h3>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['source', 'hir', 'mir', 'asm'] as const).map(s => (
                  <button 
                    key={s}
                    onClick={() => setStage(s)}
                    className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${stage === s ? 'bg-pink-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      {s}
                  </button>
              ))}
          </div>
      </div>

      <div className="p-8 flex items-center justify-center min-h-[300px] relative">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:20px_20px]"></div>

          <div className="relative z-10 w-full max-w-2xl bg-slate-900/80 border border-slate-700 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="absolute -top-3 left-6 px-2 bg-slate-900 text-[9px] font-black text-pink-400 uppercase tracking-widest border border-slate-700 rounded">
                  {stage === 'mir' ? 'BORROW_CHECKER_ACTIVE' : 'TRANSFORMATION_LAYER'}
              </div>
              
              <pre className={`font-mono text-xs leading-relaxed ${
                  stage === 'source' ? 'text-blue-300' :
                  stage === 'hir' ? 'text-orange-300' :
                  stage === 'mir' ? 'text-pink-300' :
                  'text-emerald-300'
              }`}>
                  {content[stage]}
              </pre>
          </div>
      </div>

      <div className="px-8 py-5 bg-slate-950 border-t border-slate-900">
          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span>Current Layer: {stage.toUpperCase()}</span>
              <span>
                  <T>{stage === 'mir' ? "El Borrow Checker analiza este grafo (MIR) para validar vidas y préstamos." : 
                     stage === 'hir' ? "Desugarización: Los bucles y syntactic sugar se convierten en primitivas simples." :
                     stage === 'asm' ? "Código máquina final generado por LLVM." : "Código fuente original."}
                  </T>
              </span>
          </div>
      </div>
    </div>
  );
};
