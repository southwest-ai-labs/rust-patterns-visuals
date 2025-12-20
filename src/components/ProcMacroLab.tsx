
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const ProcMacroLab: React.FC = () => {
  const [stage, setStage] = useState<'input' | 'tokens' | 'expansion'>('input');
  
  const inputCode = "#[derive(CustomDebug)]\nstruct User {\n    id: u32,\n}";
  
  const tokens = [
    { t: "Punct", v: "#", c: "text-orange-500" },
    { t: "Group", v: "[...]", c: "text-blue-400" },
    { t: "Keyword", v: "struct", c: "text-purple-400" },
    { t: "Ident", v: "User", c: "text-white" },
    { t: "Group", v: "{...}", c: "text-emerald-400" }
  ];

  const expandedCode = "impl CustomDebug for User {\n    fn fmt(&self) -> String {\n        format!(\"User { id: {} }\", self.id)\n    }\n}";

  return (
    <div className="my-10 bg-slate-950 border border-orange-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/50 px-8 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Proc_Macro_Compiler_Lab</h3>
          </div>
          <div className="flex gap-2">
              {(['input', 'tokens', 'expansion'] as const).map(s => (
                  <button 
                    key={s}
                    onClick={() => setStage(s)}
                    className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${stage === s ? 'bg-orange-600 text-white' : 'text-slate-500'}`}
                  >
                      {s}
                  </button>
              ))}
          </div>
      </div>

      <div className="p-8 min-h-[300px] flex items-center justify-center">
          {stage === 'input' && (
              <div className="w-full max-w-md bg-black/40 p-6 rounded-2xl border border-slate-800 animate-fade-in">
                  <div className="text-[10px] text-slate-600 mb-4 font-mono">// RAW_SOURCE_INPUT</div>
                  <pre className="text-sm text-orange-300 font-mono">{inputCode}</pre>
              </div>
          )}

          {stage === 'tokens' && (
              <div className="flex flex-wrap gap-3 justify-center max-w-2xl animate-fade-in">
                  {tokens.map((token, i) => (
                      <div key={i} className="flex flex-col items-center group">
                          <div className={`px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 font-mono text-xs ${token.c} shadow-lg transition-transform group-hover:scale-110`}>
                              {token.v}
                          </div>
                          <span className="text-[8px] text-slate-600 mt-2 font-black uppercase tracking-tighter">{token.t}</span>
                      </div>
                  ))}
              </div>
          )}

          {stage === 'expansion' && (
              <div className="w-full max-w-lg bg-black/60 p-6 rounded-2xl border-2 border-emerald-900/30 animate-fade-in-up relative">
                  <div className="absolute top-4 right-6 text-[8px] font-black text-emerald-500 animate-pulse"># CODE_INJECTED_SUCCESSFULLY</div>
                  <div className="text-[10px] text-slate-600 mb-4 font-mono">// POST_MACRO_EXPANSION</div>
                  <pre className="text-sm text-emerald-400 font-mono">{expandedCode}</pre>
              </div>
          )}
      </div>

      <div className="px-8 py-4 bg-black/40 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic text-center leading-relaxed">
              <T>{stage === 'tokens' ? 
                "El compilador convierte el código en un TokenStream. Tu macro procedural recibe este stream, lo manipula usando 'syn' y devuelve un nuevo TokenStream." : 
                "Las macros no son simples strings; son transformaciones estructurales del Árbol de Sintaxis Abstracta (AST) en tiempo de compilación."}
              </T>
          </p>
      </div>
    </div>
  );
};
