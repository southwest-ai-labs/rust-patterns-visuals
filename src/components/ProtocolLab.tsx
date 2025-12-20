
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface BitField {
  name: string;
  size: number; // in bits
  color: string;
}

export const ProtocolLab: React.FC = () => {
  const [fields, setFields] = useState<BitField[]>([
    { name: 'VERSION', size: 4, color: 'bg-blue-500' },
    { name: 'FLAGS', size: 4, color: 'bg-orange-500' },
    { name: 'MSG_ID', size: 8, color: 'bg-purple-500' },
    { name: 'PAYLOAD_LEN', size: 16, color: 'bg-emerald-500' },
  ]);

  const totalBits = fields.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="my-10 bg-slate-950 border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">BINARY_PROTOCOL_DESIGNER</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Current_Frame_Size: {totalBits} bits</span>
      </div>

      <div className="p-10 flex flex-col items-center">
          {/* Bit Grid */}
          <div className="w-full max-w-3xl space-y-4">
              <div className="flex flex-wrap gap-1 p-4 bg-black/60 rounded-2xl border border-slate-800 shadow-inner">
                  {fields.map((field, fIdx) => (
                      Array.from({ length: field.size }).map((_, bIdx) => (
                          <div 
                            key={`${fIdx}-${bIdx}`} 
                            className={`w-4 h-8 rounded-sm ${field.color} opacity-80 hover:opacity-100 transition-all cursor-help border border-black/20`}
                            title={`${field.name} (bit ${bIdx})`}
                          ></div>
                      ))
                  ))}
                  {Array.from({ length: 64 - totalBits }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-4 h-8 rounded-sm bg-slate-900 border border-slate-800 opacity-20"></div>
                  ))}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {fields.map(field => (
                      <div key={field.name} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800 group hover:border-slate-600 transition-all">
                          <div className={`w-3 h-3 rounded ${field.color}`}></div>
                          <div className="flex flex-col">
                              <span className="text-[9px] font-black text-white uppercase">{field.name}</span>
                              <span className="text-[8px] text-slate-500 font-mono">{field.size} bits</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="mt-12 bg-black/40 p-6 rounded-2xl border border-slate-800 w-full max-w-lg">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-3 tracking-widest font-mono">Idiomatic_Codec.rs</h4>
              <code className="text-[11px] text-emerald-400/80 font-mono leading-relaxed block">
                  #[bitfield]<br/>
                  pub struct NetworkHeader {'{'}<br/>
                  &nbsp;&nbsp;version: B4,<br/>
                  &nbsp;&nbsp;flags: B4,<br/>
                  &nbsp;&nbsp;msg_id: u8,<br/>
                  &nbsp;&nbsp;payload_len: u16,<br/>
                  {'}'}
              </code>
          </div>

          <p className="mt-8 text-xs text-slate-500 italic text-center max-w-md">
              <T>En sistemas de alta frecuencia, cada bit cuenta. Rust permite definir layouts exactos en memoria que se mapean directamente al hardware de red con cero costo de transformación.</T>
          </p>
      </div>
    </div>
  );
};
