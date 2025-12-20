
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface Frame {
  name: string;
  width: number; // percentage
  color: string;
  children?: Frame[];
}

export const FlameVisualizer: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const stack: Frame[] = [
    { name: 'tokio::runtime', width: 100, color: 'bg-orange-900/40', children: [
        { name: 'axum::handler', width: 90, color: 'bg-orange-800/50', children: [
            { name: 'serde_json::from_slice', width: 45, color: 'bg-red-500', children: [
                { name: 'alloc::string::String', width: 30, color: 'bg-red-600' }
            ]},
            { name: 'sqlx::query', width: 40, color: 'bg-blue-500', children: [
                { name: 'tokio::net::TcpStream', width: 35, color: 'bg-blue-600' }
            ]}
        ]}
    ]}
  ];

  const renderFrames = (frames: Frame[], depth: number = 0) => {
    return (
      <div className="flex w-full flex-col gap-0.5">
        <div className="flex w-full gap-0.5">
          {frames.map((f, i) => (
            <div 
              key={i}
              onClick={() => setSelected(f.name)}
              className={`${f.width > 0 ? 'block' : 'hidden'} ${f.color} border border-white/5 h-8 flex items-center justify-center cursor-pointer hover:brightness-125 transition-all group relative`}
              style={{ width: `${f.width}%` }}
            >
              <span className="text-[7px] font-black text-white/80 truncate px-1 uppercase font-mono">{f.name}</span>
              {selected === f.name && (
                  <div className="absolute inset-0 border-2 border-white animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
        {frames.some(f => f.children) && (
            <div className="flex w-full">
                {frames.map((f, i) => f.children ? (
                    <div key={i} style={{ width: `${f.width}%` }}>
                        {renderFrames(f.children, depth + 1)}
                    </div>
                ) : <div key={i} style={{ width: `${f.width}%` }}></div>)}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="my-10 bg-slate-950 border border-red-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-red-950/20 px-8 py-4 border-b border-red-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">CPU_FLAMEGRAPH_PROBE</h3>
          </div>
          <span className="text-[10px] text-red-700 font-mono">Sampling_Rate: 99Hz</span>
      </div>

      <div className="p-8 bg-black/40 flex flex-col items-center">
          <div className="w-full max-w-4xl rotate-180 mb-8">
              {renderFrames(stack)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl border-t border-slate-900 pt-8">
              <div className="space-y-4">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Selected_Frame_Telemetry</div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-white mb-1">{selected || 'IDLE_CPU_WAIT'}</div>
                      <div className="text-[10px] text-red-400 font-mono">Total Time: {selected ? '42.5ms' : '0ms'}</div>
                  </div>
              </div>
              <div className="flex flex-col justify-center">
                  <p className="text-[11px] text-slate-500 italic leading-relaxed font-mono">
                      <T>Los Flamegraphs permiten visualizar dónde gasta la CPU su tiempo. En Rust, esto suele revelar copias innecesarias (memcpy) o esperas en locks de hilos.</T>
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};
