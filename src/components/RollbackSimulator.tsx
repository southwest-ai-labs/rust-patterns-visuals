
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

// Added explicit type for History items to fix TS inference issues in state updates
interface HistoryItem {
  id: number;
  type: 'predicted' | 'reconciled' | 'mismatch';
  pos: number;
}

export const RollbackSimulator: React.FC = () => {
  const [frame, setFrame] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
        setFrame(f => {
            const newFrame = f + 1;
            const isMismatch = newFrame % 10 === 0;
            
            // Fixed type inference error by explicitly typing the state update and mapping return values
            setHistory(prev => {
                const updated: HistoryItem[] = [...prev, { 
                    id: newFrame, 
                    type: isMismatch ? 'mismatch' : 'predicted', 
                    pos: Math.sin(newFrame * 0.5) * 100 
                }];
                if (isMismatch) {
                    // Simular rollback 3 frames atras - explicitly cast the mapped item to HistoryItem
                    return updated.map((item): HistoryItem => 
                        item.id > newFrame - 3 ? { ...item, type: 'reconciled' } : item
                    );
                }
                return updated.slice(-15);
            });
            return newFrame;
        });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-10 bg-slate-950 border border-red-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-red-950/20 px-8 py-4 border-b border-red-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">GGRS_ROLLBACK_ENGINE</h3>
          </div>
          <span className="text-[10px] font-mono text-red-700">FRAME: {frame}</span>
      </div>

      <div className="p-8 h-48 flex items-end gap-1 overflow-hidden relative">
          <div className="absolute top-4 left-8 text-[10px] font-mono text-slate-700 uppercase">State Timeline</div>
          {history.map(item => (
              <div 
                key={item.id} 
                className={`flex-1 transition-all duration-300 rounded-t ${
                    item.type === 'predicted' ? 'bg-blue-500/40 border-blue-400 border-t' : 
                    item.type === 'reconciled' ? 'bg-emerald-500/40 border-emerald-400 border-t' : 
                    'bg-red-500 animate-bounce shadow-[0_0_15px_#ef4444]'
                }`}
                style={{ height: `${Math.abs(item.pos) + 20}%` }}
              >
                  <div className="hidden group-hover:block absolute bottom-full mb-2 text-[6px] text-white font-mono bg-black p-1 rounded">
                      {item.type}
                  </div>
              </div>
          ))}
      </div>

      <div className="p-6 bg-slate-900/50 border-t border-slate-800">
          <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                  <div className="text-[8px] text-slate-500 uppercase font-black">Prediction</div>
                  <div className="text-xs text-blue-400 font-mono">Running local...</div>
              </div>
              <div>
                  <div className="text-[8px] text-slate-500 uppercase font-black">Reconciliation</div>
                  <div className="text-xs text-emerald-400 font-mono">Catching up...</div>
              </div>
              <div>
                  <div className="text-[8px] text-slate-500 uppercase font-black">Rollback Event</div>
                  <div className="text-xs text-red-500 font-mono font-black">RE-SIMULATING</div>
              </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 italic text-center max-w-lg mx-auto">
              <T>GGRS detecta cuando el input remoto difiere de la predicción local, rebobina el estado del mundo y vuelve a simular los frames con los datos correctos.</T>
          </p>
      </div>
    </div>
  );
};
