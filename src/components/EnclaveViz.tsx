
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const EnclaveViz: React.FC = () => {
  const [accessType, setAccessType] = useState<'normal' | 'malicious'>('normal');
  const [encryptionActive, setEncryptionActive] = useState(true);

  return (
    <div className="my-10 bg-slate-950 border border-purple-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">ENCLAVE_MEMORY_ISOLATOR</h3>
          </div>
          <div className="flex bg-black p-1 rounded-lg border border-slate-800">
              <button onClick={() => setAccessType('normal')} className={`px-4 py-1 rounded text-[9px] font-black transition-all ${accessType === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Authorized_App</button>
              <button onClick={() => setAccessType('malicious')} className={`px-4 py-1 rounded text-[9px] font-black transition-all ${accessType === 'malicious' ? 'bg-red-600 text-white' : 'text-slate-500'}`}>Kernel_Exploit</button>
          </div>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full max-w-2xl grid grid-cols-3 gap-4 h-48 relative">
              {/* Normal RAM */}
              <div className="col-span-2 border-2 border-slate-800 rounded-2xl bg-slate-900/30 p-4 relative">
                  <div className="text-[7px] text-slate-700 font-black uppercase absolute top-2 left-4">Public_RAM_Region</div>
                  <div className="grid grid-cols-4 gap-2 mt-4">
                      {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="h-6 bg-slate-800 rounded border border-slate-700 flex items-center justify-center font-mono text-[8px] text-slate-500">0x{Math.floor(Math.random()*255).toString(16)}</div>
                      ))}
                  </div>
              </div>

              {/* Secure Enclave */}
              <div className={`border-2 transition-all duration-500 rounded-2xl p-4 relative flex flex-col items-center justify-center ${encryptionActive ? 'border-purple-500 bg-purple-900/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'border-red-500 bg-red-950/20'}`}>
                  <div className="text-[7px] text-purple-400 font-black uppercase absolute top-2 left-4">Secure_Enclave</div>
                  {encryptionActive ? (
                      <div className="text-4xl animate-pulse">🔒</div>
                  ) : (
                      <div className="text-4xl text-red-500">⚠️</div>
                  )}
                  <div className="mt-4 font-mono text-[10px] text-purple-300 font-black">SECRET_DATA</div>
              </div>

              {/* Data Access Probe */}
              <div 
                className={`absolute h-1 w-32 transition-all duration-1000 flex items-center justify-end ${accessType === 'normal' ? 'top-1/4' : 'bottom-1/4'} left-[-40px]`}
                style={{ transform: accessType === 'normal' ? 'rotate(10deg)' : 'rotate(-10deg)' }}
              >
                  <div className={`w-3 h-3 rounded-full ${accessType === 'normal' ? 'bg-blue-400' : 'bg-red-500 animate-ping'} shadow-lg`}></div>
                  <div className={`h-0.5 w-full ${accessType === 'normal' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
              </div>
          </div>

          <div className="mt-12 bg-black/40 border border-slate-800 p-6 rounded-2xl w-full max-w-xl text-center">
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Confidentiality Report</h4>
              <p className="text-xs text-slate-400 italic">
                  <T>{accessType === 'normal' ? 
                    "La aplicación verificada tiene acceso a la clave criptográfica dentro del enclave. El hardware descifra los datos 'on-the-fly' solo para esta CPU." : 
                    "BLOQUEADO: El proceso atacante intenta leer la RAM. Incluso con privilegios de ROOT, el hardware devuelve basura cifrada. El secreto está a salvo."}
                  </T>
              </p>
          </div>
      </div>
    </div>
  );
};
