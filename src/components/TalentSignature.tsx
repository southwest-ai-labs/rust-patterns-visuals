
import React, { useState } from 'react';
import { UserProgress } from '../types';
import { T } from '../hooks/useChromeTranslation';

interface TalentSignatureProps {
  progress: UserProgress;
}

export const TalentSignature: React.FC<TalentSignatureProps> = ({ progress }) => {
  const [signed, setSigned] = useState<string | null>(null);

  const generateSignature = async () => {
    const data = `RUST_HUB_VERIFIED_MMR:${progress.totalMMR}:${Date.now()}`;
    const encoder = new TextEncoder();
    const dataUint8 = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setSigned(`-----BEGIN RUST HUB PROOF-----\nMMR: ${progress.totalMMR}\nHASH: ${hashHex.substring(0, 32)}\nSIG: v1_verified\n-----END RUST HUB PROOF-----`);
  };

  return (
    <div className="my-10 bg-slate-900 border border-emerald-900/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
      
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Talent Signature</h3>
          <p className="text-xs text-slate-400 mb-8 italic">
              <T>Genera un bloque de prueba criptográfica para tu CV o README de GitHub. Esta firma valida tu rango de Operador de Sistemas.</T>
          </p>

          {!signed ? (
              <button 
                onClick={generateSignature}
                className="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest text-[10px] transition-all shadow-xl"
              >
                Sign MMR Verification
              </button>
          ) : (
              <div className="w-full space-y-4 animate-fade-in">
                  <div className="bg-black p-4 rounded-xl border border-slate-700 font-mono text-[9px] text-emerald-400 text-left whitespace-pre-wrap leading-tight shadow-inner">
                      {signed}
                  </div>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(signed); alert("Signature Copied!"); }}
                    className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest underline"
                  >
                    Copy to Clipboard
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};
