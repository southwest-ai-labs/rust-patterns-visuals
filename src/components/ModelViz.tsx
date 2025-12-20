
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const ModelViz: React.FC = () => {
  const [nodes, setNodes] = useState<{id: number, state: 'safe' | 'checking' | 'error', x: number, y: number}[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const startVerification = () => {
    setIsVerifying(true);
    setNodes([{ id: 0, state: 'checking', x: 50, y: 10 }]);
  };

  useEffect(() => {
    if (isVerifying && nodes.length < 15) {
      const timer = setTimeout(() => {
        setNodes(prev => {
          const last = prev[prev.length - 1];
          const newNodes = [...prev];
          const branches = 2;
          for (let i = 0; i < branches; i++) {
              newNodes.push({
                  id: newNodes.length,
                  state: Math.random() > 0.9 ? 'error' : 'safe',
                  x: last.x + (i === 0 ? -15 : 15),
                  y: last.y + 15
              });
          }
          return newNodes;
        });
      }, 600);
      return () => clearTimeout(timer);
    } else if (nodes.length >= 15) {
        setIsVerifying(false);
    }
  }, [isVerifying, nodes]);

  return (
    <div className="my-10 bg-slate-950 border border-indigo-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">FORMAL_MODEL_CHECKER</h3>
          </div>
          <button 
            onClick={startVerification}
            disabled={isVerifying}
            className="px-6 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-[9px] font-black uppercase rounded-lg transition-all"
          >
            {isVerifying ? 'EXPLORING_STATE_SPACE...' : 'INIT_FORMAL_PROOF'}
          </button>
      </div>

      <div className="p-10 h-80 relative bg-black/40">
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {nodes.map((node, i) => {
                  if (i === 0) return null;
                  const parentIdx = Math.floor((i - 1) / 2);
                  const parent = nodes[parentIdx];
                  return (
                      <line 
                        key={`l-${i}`} 
                        x1={`${parent.x}%`} y1={`${parent.y}%`} 
                        x2={`${node.x}%`} y2={`${node.y}%`} 
                        stroke="white" strokeWidth="0.5" 
                      />
                  );
              })}
          </svg>
          
          {nodes.map(node => (
              <div 
                key={node.id}
                className={`absolute w-4 h-4 rounded-full transition-all duration-500 flex items-center justify-center shadow-lg ${
                    node.state === 'checking' ? 'bg-blue-400 animate-ping' :
                    node.state === 'error' ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' :
                    'bg-emerald-500 shadow-[0_0_10px_#10b981]'
                }`}
                style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                  {node.state === 'error' && <span className="text-[6px] text-white font-black">!</span>}
              </div>
          ))}
          
          <div className="absolute bottom-4 left-6 flex gap-4 text-[8px] font-mono uppercase">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Valid Path</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Invariant Violation</div>
          </div>
      </div>

      <div className="px-8 py-6 bg-slate-900/50 border-t border-slate-800">
          <p className="text-xs text-slate-400 italic text-center max-w-xl mx-auto leading-relaxed">
              <T>A diferencia de los tests, la verificación formal (Kani) prueba matemáticamente que bajo NINGUNA circunstancia el sistema entrará en un estado inválido. Es la diferencia entre "parece seguro" y "es matemáticamente seguro".</T>
          </p>
      </div>
    </div>
  );
};
