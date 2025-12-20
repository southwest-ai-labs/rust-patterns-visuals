
import React, { useState, useEffect, useRef } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const DspViz: React.FC = () => {
  const [mode, setMode] = useState<'rust' | 'gc'>('rust');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let audioTime = 0;
    
    const render = () => {
      frame++;
      audioTime += 0.1;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, width, height);

      // Simulate GC Pause in GC mode
      const isGcPause = mode === 'gc' && frame % 120 > 110; // Pause every ~2 seconds
      
      if (isGcPause) {
          setGlitch(true);
          // Don't update audioTime, effectively freezing the wave (buffer underrun)
          ctx.fillStyle = 'rgba(220, 38, 38, 0.2)'; // Red overlay
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = '#ef4444';
          ctx.font = '10px monospace';
          ctx.fillText("GARBAGE_COLLECTOR_PAUSE [24ms]", 10, 20);
      } else {
          setGlitch(false);
          // Draw Waveform
          ctx.beginPath();
          ctx.strokeStyle = mode === 'rust' ? '#10b981' : '#a855f7'; // Emerald vs Purple
          ctx.lineWidth = 2;
          
          for (let x = 0; x < width; x++) {
              // Synthetic wave: Sine + Harmonics
              const y = Math.sin(x * 0.05 + audioTime) * 30 + 
                        Math.sin(x * 0.1 + audioTime * 2) * 15;
              ctx.lineTo(x, height / 2 + y);
          }
          ctx.stroke();

          // Draw FFT Bars (Simulated)
          const barCount = 32;
          const barWidth = width / barCount;
          ctx.fillStyle = mode === 'rust' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(168, 85, 247, 0.3)';
          
          for (let i = 0; i < barCount; i++) {
              const freq = (i + 1) * 0.5;
              const amp = (Math.sin(audioTime * freq) + 1) / 2;
              const h = amp * (height / 3);
              ctx.fillRect(i * barWidth + 1, height - h, barWidth - 2, h);
          }
      }

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode]);

  return (
    <div className="my-10 bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${mode === 'rust' ? 'bg-emerald-500' : 'bg-purple-500'} animate-pulse`}></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">REALTIME_DSP_ENGINE</h3>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button onClick={() => setMode('rust')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${mode === 'rust' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>Rust_CPAL</button>
              <button onClick={() => setMode('gc')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${mode === 'gc' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>Managed_GC</button>
          </div>
      </div>

      <div className="relative">
          <canvas ref={canvasRef} width={600} height={200} className="w-full h-48 bg-black/50" />
          
          {glitch && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-red-600 text-white px-4 py-2 font-black text-xs uppercase tracking-widest rotate-12 shadow-2xl border-2 border-white">
                      BUFFER_UNDERRUN!
                  </div>
              </div>
          )}
      </div>

      <div className="px-8 py-4 bg-slate-950 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic text-center max-w-lg mx-auto">
              <T>{mode === 'rust' ? 
                 "Rust garantiza cero asignaciones en el hilo de audio. El procesamiento es determinista, asegurando latencia < 2ms para audio profesional." : 
                 "Lenguajes con GC pausan el mundo aleatoriamente para limpiar memoria. En audio, una pausa > 10ms causa pops audibles y arruina la señal."}
              </T>
          </p>
      </div>
    </div>
  );
};
