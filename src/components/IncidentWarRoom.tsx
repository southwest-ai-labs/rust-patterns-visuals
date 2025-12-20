
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

const CHAT_LOGS = [
    { user: 'Architect_Prime', text: 'Thread_04 is leaking. Check the Arc cycles.', color: 'text-blue-400' },
    { user: 'Guard_Alpha', text: 'Isolating the vulnerable block. Applying Mutex backpressure.', color: 'text-red-400' },
    { user: 'Optimizer_Sigma', text: 'SIMD vectors re-aligned. Throughput returning to 90%.', color: 'text-cyan-400' },
    { user: 'Ferris', text: 'Uplink secure. Safety invariants verified.', color: 'text-orange-500' }
];

export const IncidentWarRoom: React.FC = () => {
  const [messages, setMessages] = useState<typeof CHAT_LOGS>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (active) {
        let i = 0;
        interval = setInterval(() => {
            if (i < CHAT_LOGS.length) {
                setMessages(prev => [...prev, CHAT_LOGS[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 2000);
    } else {
        setMessages([]);
    }
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="my-10 bg-slate-950 border-2 border-red-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)]">
      <div className="bg-red-950/20 px-8 py-4 border-b border-red-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">LIVE_INCIDENT_WAR_ROOM</h3>
          </div>
          <button onClick={() => setActive(!active)} className={`px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-emerald-600' : 'bg-red-600'} text-white shadow-lg`}>
              {active ? 'CLOSE_COMMS' : 'INITIATE_RESPONSE'}
          </button>
      </div>

      <div className="p-8 h-80 flex flex-col gap-4 overflow-y-auto bg-black/40 custom-scrollbar">
          {!active && (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                  <div className="text-4xl mb-4">🛡️</div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Waiting for system escalation...</p>
              </div>
          )}
          
          {messages.map((msg, i) => (
              <div key={i} className="flex gap-4 animate-fade-in-up">
                  <div className="w-24 text-[9px] font-black uppercase text-slate-600 font-mono mt-1">[{msg.user}]</div>
                  <div className={`flex-1 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs font-mono italic leading-relaxed ${msg.color}`}>
                      <T>{msg.text}</T>
                  </div>
              </div>
          ))}
      </div>

      <div className="px-8 py-3 bg-slate-950 border-t border-slate-900 flex justify-between text-[8px] font-mono text-slate-700">
          <div className="flex gap-4">
              <span>ACTIVE_PARTICIPANTS: {active ? '4' : '0'}</span>
              <span>BUFFER_TYPE: NEURAL_RECONCILIATION</span>
          </div>
          <span className="animate-pulse">ENCRYPTED_SIGNAL_STABLE</span>
      </div>
    </div>
  );
};
