
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const IdentityViz: React.FC = () => {
  const [attested, setAttested] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const startAttestation = () => {
    setVerifying(true);
    setTimeout(() => {
        setAttested(true);
        setVerifying(false);
    }, 2000);
  };

  return (
    <div className="my-10 bg-slate-950 border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-emerald-950/20 px-8 py-5 border-b border-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">SPIFFE_IDENTITY_ATTESTOR</h3>
          </div>
          <button 
            onClick={startAttestation}
            disabled={verifying || attested}
            className={`px-6 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${attested ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'} text-white shadow-lg`}
          >
            {verifying ? 'VERIFYING_METADATA...' : attested ? 'IDENTITY_VERIFIED' : 'INIT_ATTESTATION'}
          </button>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="w-full max-w-2xl bg-black border border-slate-800 rounded-2xl p-6 relative overflow-hidden min-h-[200px] flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]"></div>
              
              {!attested && !verifying && (
                  <div className="text-slate-700 font-mono text-[10px] uppercase animate-pulse"># Awaiting_Workload_Passport...</div>
              )}

              {verifying && (
                  <div className="flex flex-col items-center gap-4">
                      <div className="text-[10px] text-blue-400 font-mono animate-bounce">Scanning: CPU_ID // CLOUD_INSTANCE_TAGS // K8S_POD_SPEC</div>
                      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 animate-loading-bar"></div>
                      </div>
                  </div>
              )}

              {attested && (
                  <div className="flex flex-col items-center gap-4 animate-fade-in">
                      <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500 rounded-xl flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                          <div className="text-3xl">🎫</div>
                          <div>
                              <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">SVID_JWT_TOKEN</div>
                              <div className="text-[10px] text-white font-mono">spiffe://rust.hub/workload/engine-v1</div>
                          </div>
                      </div>
                      <div className="text-[8px] text-slate-500 font-mono uppercase tracking-[0.4em]">Signature: ED25519_HARDWARE_BACKED</div>
                  </div>
              )}
          </div>

          <p className="mt-8 text-xs text-slate-500 italic text-center max-w-lg font-mono">
              <T>Identity Sovereignty: En lugar de usar API Keys que pueden ser robadas, Rust usa SPIFFE para que cada servicio demuestre quién es basándose en el hardware donde corre.</T>
          </p>
      </div>
      <style>{`
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-loading-bar {
            animation: loading-bar 1s infinite linear;
          }
      `}</style>
    </div>
  );
};
