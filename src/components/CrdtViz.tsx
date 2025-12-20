
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface Replica {
  id: string;
  counter: number;
  // Vector clock: { [nodeId]: count }
  vector: Record<string, number>;
}

export const CrdtViz: React.FC = () => {
  const [partitioned, setPartitioned] = useState(false);
  const [nodeA, setNodeA] = useState<Replica>({ id: 'EU_WEST', counter: 0, vector: { 'EU_WEST': 0, 'US_EAST': 0 } });
  const [nodeB, setNodeB] = useState<Replica>({ id: 'US_EAST', counter: 0, vector: { 'EU_WEST': 0, 'US_EAST': 0 } });

  const increment = (target: 'A' | 'B') => {
    if (target === 'A') {
        setNodeA(prev => {
            const nextVal = prev.vector['EU_WEST'] + 1;
            const nextVec = { ...prev.vector, 'EU_WEST': nextVal };
            // G-Counter logic (simplified): sum of vector parts
            return { ...prev, vector: nextVec, counter: nextVec['EU_WEST'] + nextVec['US_EAST'] };
        });
        if (!partitioned) {
            // Auto sync to B if connected
            setTimeout(() => merge('B'), 100);
        }
    } else {
        setNodeB(prev => {
            const nextVal = prev.vector['US_EAST'] + 1;
            const nextVec = { ...prev.vector, 'US_EAST': nextVal };
            return { ...prev, vector: nextVec, counter: nextVec['EU_WEST'] + nextVec['US_EAST'] };
        });
        if (!partitioned) {
            setTimeout(() => merge('A'), 100);
        }
    }
  };

  const merge = (target: 'A' | 'B') => {
      // CRDT Merge Function: Max(Local, Remote) per vector component
      if (target === 'A') {
          setNodeA(prev => {
              const newVec = {
                  'EU_WEST': Math.max(prev.vector['EU_WEST'], nodeB.vector['EU_WEST']),
                  'US_EAST': Math.max(prev.vector['US_EAST'], nodeB.vector['US_EAST'])
              };
              return { ...prev, vector: newVec, counter: newVec['EU_WEST'] + newVec['US_EAST'] };
          });
      } else {
          setNodeB(prev => {
              const newVec = {
                  'EU_WEST': Math.max(prev.vector['EU_WEST'], nodeA.vector['EU_WEST']),
                  'US_EAST': Math.max(prev.vector['US_EAST'], nodeA.vector['US_EAST'])
              };
              return { ...prev, vector: newVec, counter: newVec['EU_WEST'] + newVec['US_EAST'] };
          });
      }
  };

  const healNetwork = () => {
      setPartitioned(false);
      // Bi-directional sync
      setTimeout(() => { merge('A'); merge('B'); }, 500);
  };

  return (
    <div className="my-10 bg-slate-950 border border-teal-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-teal-950/20 px-8 py-5 border-b border-teal-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_10px_#14b8a6] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">GLOBAL_STATE_CRDT_ENGINE</h3>
          </div>
          <button 
            onClick={() => partitioned ? healNetwork() : setPartitioned(true)}
            className={`px-6 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${partitioned ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {partitioned ? 'NETWORK_PARTITIONED (HEAL)' : 'CUT_CONNECTION'}
          </button>
      </div>

      <div className="p-10 flex justify-between items-center relative">
          {/* Node A */}
          <div className="flex flex-col items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 z-10 w-48">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{nodeA.id}</div>
              <div className="text-5xl font-black text-white font-mono">{nodeA.counter}</div>
              <div className="text-[8px] font-mono text-slate-500">
                  Vector: [{nodeA.vector['EU_WEST']}, {nodeA.vector['US_EAST']}]
              </div>
              <button 
                onClick={() => increment('A')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-black text-[10px] uppercase shadow-lg"
              >
                  Increment Local
              </button>
          </div>

          {/* Network Link */}
          <div className="flex-1 h-1 bg-slate-800 relative mx-4">
              {partitioned ? (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl animate-bounce">✂️</div>
              ) : (
                  <div className="absolute inset-0 bg-teal-500/50 animate-pulse shadow-[0_0_15px_#14b8a6]"></div>
              )}
          </div>

          {/* Node B */}
          <div className="flex flex-col items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 z-10 w-48">
              <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">{nodeB.id}</div>
              <div className="text-5xl font-black text-white font-mono">{nodeB.counter}</div>
              <div className="text-[8px] font-mono text-slate-500">
                  Vector: [{nodeB.vector['EU_WEST']}, {nodeB.vector['US_EAST']}]
              </div>
              <button 
                onClick={() => increment('B')}
                className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded font-black text-[10px] uppercase shadow-lg"
              >
                  Increment Local
              </button>
          </div>
      </div>

      <div className="px-8 py-5 bg-slate-950 border-t border-slate-900 text-center">
          <p className="text-[10px] text-slate-500 italic font-mono max-w-xl mx-auto">
              <T>Los CRDTs garantizan la convergencia matemática. Incluso si la red se corta y ambos lados editan, al reconectar, el estado se fusiona automáticamente sin conflictos (merge = max(v1, v2)).</T>
          </p>
      </div>
    </div>
  );
};
