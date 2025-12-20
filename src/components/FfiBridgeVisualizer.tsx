
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const FfiBridgeVisualizer: React.FC = () => {
  const [isCCompat, setIsCCompat] = useState(false);

  return (
    <div className="my-10 bg-slate-950 border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-blue-950/20 px-8 py-4 border-b border-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">FFI_ABI_BOUNDARY</h3>
          </div>
          <button 
            onClick={() => setIsCCompat(!isCCompat)}
            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${isCCompat ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {isCCompat ? 'ENABLE #[repr(C)]' : 'RESTORE RUST_LAYOUT'}
          </button>
      </div>

      <div className="p-10 flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Rust Side */}
          <div className="w-48 space-y-4">
              <div className="text-center text-[10px] font-black text-orange-500 uppercase tracking-widest">Safe Rust</div>
              <div className="border-2 border-orange-500/30 bg-orange-900/5 p-4 rounded-xl space-y-2">
                  <div className="h-6 bg-orange-600/20 rounded flex items-center justify-center text-[10px] font-mono">u32: ID</div>
                  <div className={`h-6 bg-emerald-600/20 rounded flex items-center justify-center text-[10px] font-mono transition-all ${isCCompat ? 'mt-0' : 'mt-4'}`}>u8: FLAG</div>
                  <div className="h-6 bg-blue-600/20 rounded flex items-center justify-center text-[10px] font-mono">u32: VAL</div>
              </div>
          </div>

          {/* The Bridge */}
          <div className="flex flex-col items-center">
              <div className="h-24 w-0.5 bg-gradient-to-b from-orange-500 via-white to-blue-500 opacity-30"></div>
              <div className={`text-[10px] font-black my-2 font-mono ${isCCompat ? 'text-emerald-500' : 'text-red-500 animate-pulse'}`}>
                  {isCCompat ? 'ABI_MATCH' : 'MEMORY_MISMATCH!'}
              </div>
              <div className="h-24 w-0.5 bg-gradient-to-t from-blue-500 via-white to-orange-500 opacity-30"></div>
          </div>

          {/* C Side */}
          <div className="w-48 space-y-4">
              <div className="text-center text-[10px] font-black text-blue-500 uppercase tracking-widest">C Library (ABI)</div>
              <div className="border-2 border-blue-500/30 bg-blue-900/5 p-4 rounded-xl space-y-2">
                  <div className="h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] font-mono">uint32_t id</div>
                  <div className="h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] font-mono">uint8_t flag</div>
                  <div className="h-6 bg-slate-700/50 rounded flex items-center justify-center text-[8px] font-mono italic">PADDING [3b]</div>
                  <div className="h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] font-mono">uint32_t val</div>
              </div>
          </div>
      </div>

      <div className="px-8 py-4 bg-black/40 text-center border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic max-w-lg mx-auto leading-relaxed">
              <T>{isCCompat ? 
                "Con #[repr(C)], Rust respeta el orden y añade el acolchado (padding) necesario para que la memoria sea legible por C sin corrupción." : 
                "Rust por defecto reordena campos para optimizar espacio. C leería los bytes equivocados causando un desastre de memoria."}
              </T>
          </p>
      </div>
    </div>
  );
};
