
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const AgenticWorkflow: React.FC = () => {
  const [activeNode, setActiveNode] = useState<number>(0);
  const nodes = [
    { id: 0, label: 'Orchestrator', role: 'Decomposes task into sub-goals', color: 'bg-blue-500' },
    { id: 1, label: 'Worker_01', role: 'Generates Rust implementation', color: 'bg-emerald-500' },
    { id: 2, label: 'Auditor', role: 'Verifies memory safety & invariants', color: 'bg-amber-500' },
    { id: 3, label: 'Refiner', role: 'Applies feedback and optimizes', color: 'bg-purple-500' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode(prev => (prev + 1) % nodes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-10 bg-slate-950 border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-blue-950/20 px-8 py-4 border-b border-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">NEURAL_AGENT_ORCHESTRATION</h3>
          </div>
          <span className="text-[8px] font-mono text-blue-700 uppercase">Status: Cyclic_Reasoning_Active</span>
      </div>

      <div className="p-10 flex flex-col items-center">
          <div className="relative w-full max-w-2xl h-64 flex items-center justify-center">
              {/* Circular Path */}
              <div className="absolute w-48 h-48 border-2 border-dashed border-slate-800 rounded-full animate-spin-slow"></div>
              
              {nodes.map((node, i) => {
                const angle = (i * 360) / nodes.length;
                const active = activeNode === i;
                return (
                  <div 
                    key={node.id}
                    className={`absolute transition-all duration-700 transform ${active ? 'scale-125 z-10' : 'scale-100 opacity-40'}`}
                    style={{ 
                        transform: `rotate(${angle}deg) translate(120px) rotate(-${angle}deg)` 
                    }}
                  >
                    <div className={`w-24 h-24 rounded-2xl ${node.color} p-3 flex flex-col items-center justify-center text-center shadow-2xl`}>
                        <span className="text-[9px] font-black text-white uppercase mb-1">{node.label}</span>
                        <div className="w-full h-[1px] bg-white/20 mb-1"></div>
                        <p className="text-[7px] text-white/80 leading-tight font-mono">{node.role}</p>
                    </div>
                    {active && (
                        <div className={`absolute -inset-2 rounded-3xl ${node.color} opacity-20 animate-pulse`}></div>
                    )}
                  </div>
                );
              })}

              <div className="bg-slate-900 border border-slate-800 w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-2xl animate-pulse">🧠</span>
              </div>
          </div>

          <div className="mt-8 bg-black/40 border border-slate-800 p-4 rounded-xl w-full max-w-md text-center">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Protocol Trace</h4>
              <p className="text-xs text-blue-300 font-mono italic">
                  <T>{`[STEP ${activeNode + 1}]: ${nodes[activeNode].label} is currently processing goal stream...`}</T>
              </p>
          </div>
      </div>
    </div>
  );
};
