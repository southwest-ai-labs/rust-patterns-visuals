
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

type NodeState = 'leader' | 'follower' | 'candidate' | 'dead';

export const QuorumLab: React.FC = () => {
  const [nodes, setNodes] = useState<NodeState[]>(['leader', 'follower', 'follower', 'follower', 'follower']);
  const [term, setTerm] = useState(1);
  const [logIndex, setLogIndex] = useState(10);

  const killLeader = () => {
    setNodes(prev => {
        const next = [...prev];
        const leaderIdx = next.indexOf('leader');
        if (leaderIdx !== -1) {
            next[leaderIdx] = 'dead';
            setTimeout(() => startElection(), 1500);
        }
        return next;
    });
  };

  const startElection = () => {
    setNodes(prev => prev.map(s => s === 'dead' ? 'dead' : 'candidate'));
    setTerm(t => t + 1);
    
    setTimeout(() => {
        setNodes(prev => {
            const alive = prev.map((s, i) => s !== 'dead' ? i : -1).filter(i => i !== -1);
            if (alive.length === 0) return prev;
            const newLeaderIdx = alive[Math.floor(Math.random() * alive.length)];
            return prev.map((s, i) => i === newLeaderIdx ? 'leader' : (s === 'dead' ? 'dead' : 'follower'));
        });
    }, 1000);
  };

  return (
    <div className="my-10 bg-slate-950 border border-amber-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-amber-950/20 px-8 py-5 border-b border-amber-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">RAFT_CONSENSUS_LAB</h3>
          </div>
          <button onClick={killLeader} className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[9px] font-black uppercase rounded-lg">Simulate_Leader_Failure</button>
      </div>

      <div className="p-10 flex justify-center items-center gap-6 h-48">
          {nodes.map((state, i) => (
              <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-500 ${state === 'dead' ? 'opacity-30' : 'opacity-100'}`}>
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${
                      state === 'leader' ? 'border-amber-500 bg-amber-500/20 shadow-lg scale-110' :
                      state === 'candidate' ? 'border-blue-400 bg-blue-400/20 animate-pulse' :
                      state === 'dead' ? 'border-slate-800 bg-black' : 'border-slate-700 bg-slate-900'
                  }`}>
                      <span className="text-[8px] font-black text-white uppercase">{state}</span>
                  </div>
                  <div className="text-[7px] font-mono text-slate-600">NODE_0{i}</div>
              </div>
          ))}
      </div>

      <div className="px-8 py-4 bg-slate-900/50 border-t border-slate-800 text-[10px] font-mono flex justify-between text-slate-500">
          <span>TERM: {term}</span>
          <span>QUORUM: 3/5</span>
          <span className="text-emerald-500"># CONSENSUS_STABLE</span>
      </div>
    </div>
  );
};
