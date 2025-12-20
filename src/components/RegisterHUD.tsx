
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const RegisterHUD: React.FC = () => {
  const [bits, setBits] = useState(Array(8).fill(0));
  
  const toggleBit = (idx: number) => {
    const next = [...bits];
    next[idx] = next[idx] === 0 ? 1 : 0;
    setBits(next);
  };

  const hexValue = parseInt(bits.join(''), 2).toString(16).toUpperCase().padStart(2, '0');

  return (
    <div className="my-10 bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-mono">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest">HARDWARE_PAC_DEBUGGER</h3>
          </div>
          <span className="text-[10px] text-orange-500 font-black">ADDR: 0x4000_1000 [GPIO_PORT_A]</span>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="flex gap-2 mb-10">
              {bits.map((bit, i) => (
                  <button 
                    key={i}
                    onClick={() => toggleBit(i)}
                    className={`w-10 h-14 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${bit === 1 ? 'border-orange-500 bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
                  >
                      <span className="text-[8px] text-slate-500 mb-1">B{7-i}</span>
                      <span className={`text-lg font-black ${bit === 1 ? 'text-white' : 'text-slate-700'}`}>{bit}</span>
                  </button>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
                  <div className="text-[8px] text-slate-500 uppercase mb-1">Hex_Value</div>
                  <div className="text-3xl font-black text-white">0x{hexValue}</div>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col justify-center">
                  <div className="text-[8px] text-slate-500 uppercase mb-2">HAL_STATUS</div>
                  <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">LED_ENABLE:</span>
                          <span className={bits[7] ? 'text-emerald-400' : 'text-slate-600'}>{bits[7] ? 'TRUE' : 'FALSE'}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">CLK_SOURCE:</span>
                          <span className="text-blue-400">{bits[0] ? 'HSE' : 'HSI'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="px-8 py-4 bg-slate-950/80 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic text-center leading-relaxed">
              <T>En sistemas embebidos (Bare Metal), Rust mapea estas estructuras directamente a memoria física. Manipular un bit puede encender un LED o activar un motor sin overhead de sistema operativo.</T>
          </p>
      </div>
    </div>
  );
};
