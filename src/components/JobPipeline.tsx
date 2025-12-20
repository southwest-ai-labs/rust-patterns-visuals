
import React from 'react';
import { T } from '../hooks/useChromeTranslation';

const JOBS = [
    { co: 'Nebula Systems', role: 'Staff Rust Engineer', loc: 'Remote', salary: '200k-280k', mmr: 3200 },
    { co: 'Quantify HFT', role: 'Low Latency Specialist', loc: 'NY / London', salary: '350k+', mmr: 3500 },
    { co: 'RustCloud Ops', role: 'Senior Infrastructure', loc: 'EU Remote', salary: '140k-180k', mmr: 2200 }
];

export const JobPipeline: React.FC<{ userMMR: number }> = ({ userMMR }) => {
  return (
    <div className="my-10 bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-950 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">DIRECT_TALENT_PIPELINE</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 font-black">Verified_MMR: {userMMR}</span>
      </div>

      <div className="p-8 space-y-4">
          {JOBS.map((job, i) => {
              const isQualified = userMMR >= job.mmr;
              return (
                  <div key={i} className={`flex flex-col md:flex-row justify-between items-center p-5 rounded-2xl border-2 transition-all ${isQualified ? 'bg-slate-950 border-emerald-500/20 hover:border-emerald-500/40' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
                      <div className="mb-4 md:mb-0">
                          <div className="text-[8px] text-slate-500 font-mono uppercase mb-1">Company: {job.co}</div>
                          <div className="text-lg font-black text-white uppercase tracking-tighter">{job.role}</div>
                          <div className="flex gap-4 mt-2">
                              <span className="text-[9px] text-slate-400 font-mono">📍 {job.loc}</span>
                              <span className="text-[9px] text-emerald-400 font-mono">💰 {job.salary}</span>
                          </div>
                      </div>
                      <div className="text-center md:text-right flex flex-col gap-3 min-w-[150px]">
                          <div className="text-[8px] font-black text-slate-500 uppercase">Requirements</div>
                          <div className={`text-xs font-mono font-black ${isQualified ? 'text-emerald-400' : 'text-red-400'}`}>
                              {job.mmr} MMR {isQualified ? '✓' : '✗'}
                          </div>
                          <button 
                            disabled={!isQualified}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${isQualified ? 'bg-white text-black hover:bg-emerald-400 hover:scale-105' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                          >
                              {isQualified ? 'Submit Talent Proof' : 'Underqualified'}
                          </button>
                      </div>
                  </div>
              );
          })}
      </div>
      <div className="p-4 bg-slate-950/50 text-center border-t border-slate-800">
          <p className="text-[9px] text-slate-600 font-mono"><T>Las empresas del pipeline acceden directamente a tu historial de soluciones de L5 firmadas criptográficamente.</T></p>
      </div>
    </div>
  );
};
