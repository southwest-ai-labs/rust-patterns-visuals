
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const ReplayLab: React.FC = () => {
  const [events, setEvents] = useState<{id: number, val: number}[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [playbackIdx, setPlaybackIdx] = useState(-1);
  const [state, setState] = useState(0);

  const addEvent = () => {
    if (!isRecording) return;
    const newVal = Math.floor(Math.random() * 100);
    setEvents(prev => [...prev, { id: Date.now(), val: newVal }]);
    setState(s => s + newVal);
  };

  const runReplay = () => {
    setState(0);
    setPlaybackIdx(0);
  };

  useEffect(() => {
    if (playbackIdx >= 0 && playbackIdx < events.length) {
        const timer = setTimeout(() => {
            setState(s => s + events[playbackIdx].val);
            setPlaybackIdx(i => i + 1);
        }, 400);
        return () => clearTimeout(timer);
    } else if (playbackIdx === events.length) {
        setPlaybackIdx(-1);
    }
  }, [playbackIdx, events]);

  return (
    <div className="my-10 bg-slate-950 border border-amber-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-amber-950/20 px-8 py-4 border-b border-amber-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">DETERMINISTIC_REPLAY_ENGINE</h3>
          </div>
          <div className="flex gap-2">
              <button 
                onClick={() => { setIsRecording(!isRecording); if(!isRecording) setEvents([]); }}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-slate-800 text-slate-400'}`}
              >
                {isRecording ? 'Stop_Recording' : 'Start_New_Session'}
              </button>
              <button 
                onClick={runReplay}
                disabled={events.length === 0 || isRecording}
                className="px-4 py-1.5 bg-emerald-600 disabled:opacity-30 text-white text-[9px] font-black uppercase rounded-lg"
              >
                Execute_Replay
              </button>
          </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
              <div className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">Event_Log_Stream</div>
              <div className="h-48 bg-black/40 rounded-2xl border border-slate-800 p-4 overflow-y-auto font-mono text-[10px] space-y-1">
                  {events.map((ev, i) => (
                      <div key={ev.id} className={`${i === playbackIdx ? 'text-amber-400 bg-amber-900/20' : 'text-slate-500'}`}>
                          {`> [TX_${ev.id.toString().slice(-4)}] OP_ADD(${ev.val})`}
                      </div>
                  ))}
                  {events.length === 0 && <div className="text-slate-700 italic">Awaiting events...</div>}
              </div>
          </div>

          <div className="flex flex-col justify-center items-center bg-slate-900/50 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-4 left-6 text-[8px] font-mono text-slate-600 uppercase tracking-widest">System_State_Accumulator</div>
              <div className="text-6xl font-black text-white font-mono mb-2">{state}</div>
              <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Total_Integrity_Check</div>
              
              {isRecording && (
                  <button onClick={addEvent} className="mt-8 px-6 py-2 bg-white text-black text-[9px] font-black uppercase rounded hover:bg-amber-400 transition-all">Push_Random_Event</button>
              )}
          </div>
      </div>

      <div className="px-8 py-4 bg-black/60 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic text-center leading-relaxed">
              <T>En HFT (High-Frequency Trading), el determinismo es ley. Rust permite asegurar que el estado del sistema tras 1 millón de eventos sea idéntico en cada ejecución, eliminando los 'Heisenbugs' financieros.</T>
          </p>
      </div>
    </div>
  );
};
