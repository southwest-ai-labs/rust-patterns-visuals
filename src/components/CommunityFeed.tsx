
import React, { useState } from 'react';
import * as GithubService from '../services/githubService';

interface Insight {
  id: string;
  user: string;
  avatar: string;
  title: string;
  score: number;
  snippet: string;
  tags: string[];
}

const MOCK_INSIGHTS: Insight[] = [
  {
    id: '1',
    user: 'CrabMaster_88',
    avatar: '🦀',
    title: 'Zero-Copy Parser Optimization',
    score: 98,
    snippet: 'Using Pin<P> to avoid moves in self-referential buffers...',
    tags: ['L5', 'Unsafe', 'Perf']
  },
  {
    id: '2',
    user: 'FerrisWheel',
    avatar: '🎡',
    title: 'Graceful Shutdown with Atomic Flags',
    score: 95,
    snippet: 'Implementing a broadcast signal using only atomic relaxed logic...',
    tags: ['Async', 'Atomics']
  }
];

export const CommunityFeed: React.FC = () => {
  const [forkingId, setForkingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleFork = async (insight: Insight) => {
    const savedAuth = localStorage.getItem('rust_patterns_github_config');
    if (!savedAuth) {
        alert("Please connect your GitHub account first!");
        return;
    }

    setForkingId(insight.id);
    setStatus('CLONING_NEURAL_BUFFER...');
    
    try {
        const config = JSON.parse(savedAuth);
        const success = await GithubService.forkSolutionToUserRepo(
            config, 
            insight.title, 
            insight.user, 
            insight.snippet
        );
        
        if (success) {
            setStatus('UPLINK_COMPLETE');
            setTimeout(() => setForkingId(null), 2000);
        } else {
            setStatus('ACCESS_DENIED');
            setTimeout(() => setForkingId(null), 2000);
        }
    } catch (e) {
        setStatus('ERROR_HANDSHAKE');
        setTimeout(() => setForkingId(null), 2000);
    }
  };

  return (
    <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <span className="text-xl">📡</span>
              <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tighter">Community Insight Feed</h3>
                  <p className="text-[10px] text-slate-500 font-mono tracking-widest">LIVE_NEURAL_UPLINK</p>
              </div>
          </div>
          <button className="text-[10px] text-orange-500 font-bold hover:underline uppercase">View All Insights</button>
      </div>

      <div className="p-6 space-y-4">
          {MOCK_INSIGHTS.map(insight => (
              <div key={insight.id} className="group bg-slate-900 border border-slate-800 p-4 rounded-xl hover:border-orange-500/50 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-lg">{insight.avatar}</div>
                          <div>
                              <div className="text-xs font-bold text-white">@{insight.user}</div>
                              <div className="text-[10px] text-slate-500">Shared their solution for: <span className="text-blue-400">{insight.title}</span></div>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className="text-[10px] text-slate-500 font-mono">COPILOT_SCORE</div>
                          <div className="text-lg font-black text-emerald-400">{insight.score}%</div>
                      </div>
                  </div>
                  <p className="text-xs text-slate-400 font-mono line-clamp-2 italic">"{insight.snippet}"</p>
                  <div className="mt-4 flex gap-2">
                      {insight.tags.map(tag => (
                          <span key={tag} className="text-[8px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">#{tag}</span>
                      ))}
                      <button 
                        onClick={() => handleFork(insight)}
                        disabled={forkingId === insight.id}
                        className={`ml-auto text-[9px] font-black uppercase tracking-widest transition-all ${forkingId === insight.id ? 'text-emerald-500 animate-pulse' : 'text-orange-500 opacity-0 group-hover:opacity-100'}`}
                      >
                         {forkingId === insight.id ? `# ${status}` : '↗ Fork Solution'}
                      </button>
                  </div>
              </div>
          ))}
      </div>
      <div className="p-4 bg-slate-950/50 text-center">
          <p className="text-[9px] text-slate-600 font-mono">Tus soluciones con puntuación superior a 90% aparecen aquí automáticamente.</p>
      </div>
    </div>
  );
};
