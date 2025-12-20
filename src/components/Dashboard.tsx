
import React, { useState } from 'react';
import { CareerMatrix } from './CareerMatrix';
import { JobPipeline } from './JobPipeline';
import { CommunityFeed } from './CommunityFeed';
import { TalentSignature } from './TalentSignature';
import { SkillTree } from './SkillTree'; // New Import
import { UserProgress } from '../types';

interface DashboardProps {
  progress: UserProgress;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'career' | 'community' | 'identity'>('map');

  return (
    <div className="animate-fade-in pb-20">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-700/50 pb-6">
          <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  <span className="text-4xl">🚀</span> Command Deck
              </h2>
              <p className="text-slate-400 font-mono text-sm mt-2">
                  OPERATOR_MMR: <span className="text-orange-500 font-bold">{progress.totalMMR}</span> // SYSTEM_STATUS: ONLINE
              </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0 bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-x-auto">
              <button 
                onClick={() => setActiveTab('map')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'map' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                  Neural_Map
              </button>
              <button 
                onClick={() => setActiveTab('career')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'career' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                  Career_Path
              </button>
              <button 
                onClick={() => setActiveTab('community')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'community' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                  Hive_Mind
              </button>
              <button 
                onClick={() => setActiveTab('identity')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'identity' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                  Identity
              </button>
          </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[60vh]">
          {activeTab === 'map' && (
              <div className="animate-fade-in-up">
                  <SkillTree 
                    progress={progress} 
                    onSelectLesson={(id) => {
                        // Navigation handled by parent or a context could be better, 
                        // but for now we just log or use window location hack if needed, 
                        // or better: The App component should pass a handler.
                        // Ideally, we lift state up, but here we can just alert or dispatch custom event.
                        window.dispatchEvent(new CustomEvent('lesson-select', { detail: id }));
                    }} 
                  />
                  <p className="mt-4 text-center text-[10px] text-slate-500 font-mono">Interactúa con los nodos para saltar directamente a la simulación.</p>
              </div>
          )}

          {activeTab === 'career' && (
              <div className="space-y-8 animate-fade-in-up">
                  <CareerMatrix progress={progress} />
                  <JobPipeline userMMR={progress.totalMMR} />
              </div>
          )}

          {activeTab === 'community' && (
              <div className="animate-fade-in-up">
                  <div className="mb-6 p-6 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                      <div className="text-2xl">📡</div>
                      <div>
                          <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Neural Uplink Active</h4>
                          <p className="text-slate-400 text-xs mt-1">Conectado al enjambre global. Las soluciones de alto nivel (L5) se sincronizan aquí automáticamente.</p>
                      </div>
                  </div>
                  <CommunityFeed />
              </div>
          )}

          {activeTab === 'identity' && (
              <div className="animate-fade-in-up max-w-4xl mx-auto">
                  <TalentSignature progress={progress} />
                  
                  <div className="mt-12 p-8 bg-slate-900 border border-slate-700 rounded-3xl text-center">
                      <h3 className="text-white font-bold uppercase tracking-widest mb-4">Official Certification</h3>
                      <p className="text-slate-400 text-sm mb-6">
                          La firma criptográfica anterior es válida para validación en <span className="text-white font-mono">rust-patterns.app/verify</span>.
                      </p>
                      <div className="inline-block px-4 py-2 bg-black rounded border border-slate-800 font-mono text-xs text-slate-500">
                          PUBLIC_KEY: 0x7F2A...9B1C
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
