
import React, { useMemo } from 'react';
import { UserProgress } from '../types';
import { T } from '../hooks/useChromeTranslation';

interface CareerMatrixProps {
  progress: UserProgress;
}

const ROLES = [
  { mmr: 0, title: 'Junior Systems Dev', perks: ['Code Reviews', 'Feature Implementation'], co: 'Tech Startups' },
  { mmr: 1000, title: 'Senior Rust Engineer', perks: ['Architecture Design', 'Performance Tuning'], co: 'Cloud Providers' },
  { mmr: 2500, title: 'Staff Engineer (L6)', perks: ['Cross-team Leadership', 'Safe Abstractions'], co: 'High-Freq Trading' },
  { mmr: 3000, title: 'Principal / Architect (L7)', perks: ['Global Infrastructure', 'Compiler Design'], co: 'Southwest AI Labs' },
];

export const CareerMatrix: React.FC<CareerMatrixProps> = ({ progress }) => {
  const currentMMR = progress.totalMMR;
  
  const opportunities = useMemo(() => {
    return ROLES.filter(r => currentMMR >= r.mmr - 500).reverse();
  }, [currentMMR]);

  return (
    <div className="my-12 bg-slate-900 border border-blue-900/40 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-blue-950/30 px-8 py-6 border-b border-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">CAREER_TRAJECTORY_MATRIX</h3>
          </div>
          <span className="text-[10px] font-mono text-blue-500 uppercase">Profile: Verified_Operator</span>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Column */}
          <div className="lg:col-span-2 space-y-6">
              {ROLES.map((role, i) => {
                  const isLocked = currentMMR < role.mmr;
                  const isActive = currentMMR >= role.mmr && (i === ROLES.length - 1 || currentMMR < ROLES[i+1].mmr);
                  
                  return (
                    <div key={role.title} className={`p-5 rounded-2xl border-2 transition-all ${
                        isActive ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 
                        isLocked ? 'bg-slate-950 border-slate-800 opacity-40 grayscale' : 
                        'bg-slate-800 border-slate-700 opacity-80'
                    }`}>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-black text-white uppercase">{role.title}</h4>
                            <span className="text-[9px] font-mono text-blue-400">{role.mmr} MMR REQ</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {role.perks.map(p => (
                                <span key={p} className="text-[8px] px-2 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-400"># {p}</span>
                            ))}
                        </div>
                    </div>
                  );
              })}
          </div>

          {/* Opportunities Column */}
          <div className="bg-black/40 border border-slate-800 rounded-3xl p-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Active Pipeline</h4>
              <div className="space-y-4">
                  {opportunities.map((opp, i) => (
                      <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className="text-[8px] text-emerald-500 font-mono mb-1">INCOMING_PING // {opp.co}</div>
                          <div className="text-xs font-bold text-white mb-2">{opp.title}</div>
                          <button className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-[9px] font-black uppercase rounded transition-all">Review Specs</button>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      
      <div className="px-8 py-3 bg-slate-950 border-t border-slate-900 flex justify-center">
          <p className="text-[9px] text-slate-600 font-mono italic"><T>Tu MMR es un activo verificado. Sigue completando desafíos L5 para desbloquear el rango de Arquitecto de Sistemas.</T></p>
      </div>
    </div>
  );
};
