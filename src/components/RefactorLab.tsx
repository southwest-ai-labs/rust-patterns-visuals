
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

const PATTERNS = [
    { 
        id: 'entry', 
        name: 'Entry API', 
        bad: 'if !map.contains(&k) {\n    map.insert(k, v);\n}', 
        good: 'map.entry(k).or_insert(v);',
        impact: '+15% Speed (Single Lookup)'
    },
    { 
        id: 'cow', 
        name: 'Cow<str>', 
        bad: 'fn log(msg: String) {\n    println!("{}", msg);\n}', 
        good: 'fn log(msg: Cow<str>) {\n    println!("{}", msg);\n}',
        impact: '-40% Allocations'
    },
    { 
        id: 'iter', 
        name: 'Iterator Fold', 
        bad: 'let mut sum = 0;\nfor x in v { sum += x; }', 
        good: 'let sum: i32 = v.iter().sum();',
        impact: 'Cleaner / No mut debt'
    }
];

export const RefactorLab: React.FC = () => {
  const [selected, setSelected] = useState(PATTERNS[0]);
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 2000);
  };

  return (
    <div className="my-10 bg-slate-950 border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/50 px-8 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Idiomatic_Refactor_Engine</h3>
          </div>
          <div className="flex gap-2">
              {PATTERNS.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => { setSelected(p); setIsApplied(false); }}
                    className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${selected.id === p.id ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
                  >
                      {p.name}
                  </button>
              ))}
          </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[250px]">
          {/* Legacy View */}
          <div className="space-y-4">
              <div className="text-[8px] text-red-500 font-black uppercase tracking-widest">Legacy_C_Style_Code</div>
              <div className="p-6 bg-red-950/10 border border-red-900/30 rounded-2xl">
                  <pre className="text-xs text-red-300 font-mono leading-relaxed opacity-60 line-through">{selected.bad}</pre>
              </div>
          </div>

          {/* Result View */}
          <div className="space-y-4 relative">
              <div className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Idiomatic_Rust_Resolution</div>
              <div className={`p-6 bg-emerald-950/10 border border-emerald-900/30 rounded-2xl transition-all duration-700 ${isApplied ? 'scale-105 border-emerald-400' : ''}`}>
                  <pre className="text-xs text-emerald-400 font-mono leading-relaxed">{selected.good}</pre>
              </div>
              {isApplied && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded-bl-lg animate-fade-in">
                      {selected.impact}
                  </div>
              )}
          </div>
      </div>

      <div className="px-8 py-5 bg-black/40 border-t border-slate-900 flex justify-between items-center">
          <p className="text-[10px] text-slate-500 italic max-w-md">
              <T>Un ingeniero Staff reduce la complejidad. Aplicar estos patrones elimina el 'boilerplate' y permite que el compilador optimice mejor el binario final.</T>
          </p>
          <button 
            onClick={handleApply}
            className="px-8 py-2 bg-white text-black font-black text-[10px] uppercase rounded-lg hover:bg-emerald-400 transition-all shadow-xl"
          >
              Refactor_Module
          </button>
      </div>
    </div>
  );
};
