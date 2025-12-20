
import React, { useState, useEffect, useRef } from 'react';
import { T } from '../hooks/useChromeTranslation';

export const HotSwapViz: React.FC = () => {
  const [version, setVersion] = useState(1);
  const [isCompiling, setIsCompiling] = useState(false);
  const [angle, setAngle] = useState(0);
  
  // Simulation of "Game State" that persists across reloads
  const gameState = useRef({ rotationSpeed: 2, color: '#3b82f6', shape: 'cube' });

  useEffect(() => {
    const interval = setInterval(() => {
        setAngle(a => (a + gameState.current.rotationSpeed) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const triggerHotSwap = () => {
    setIsCompiling(true);
    setTimeout(() => {
        setVersion(v => v + 1);
        // Modify Logic without resetting state (angle)
        gameState.current.rotationSpeed = version % 2 === 0 ? 2 : 10;
        gameState.current.color = version % 2 === 0 ? '#3b82f6' : '#f97316'; // Swap Blue <-> Orange
        gameState.current.shape = version % 2 === 0 ? 'cube' : 'sphere';
        setIsCompiling(false);
    }, 1500); // Simulate compile time
  };

  return (
    <div className="my-10 bg-slate-950 border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">DYNAMIC_LINKER_HUD (libloading)</h3>
          </div>
          <div className="text-[9px] font-mono text-slate-500">
              Loaded_Sym: <span className="text-white font-bold">logic_v{version}.so</span>
          </div>
      </div>

      <div className="p-10 flex flex-col md:flex-row gap-12 items-center justify-center h-64 relative bg-black/40">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>

          {/* Code Editor Sim */}
          <div className="w-48 bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-[8px] text-slate-400 opacity-80">
              <div className="text-slate-500 mb-2">// src/lib.rs</div>
              <div>fn update(state: &mut State) {'{'}</div>
              <div className={`transition-colors duration-300 ${isCompiling ? 'text-yellow-400' : 'text-slate-300'}`}>
                  &nbsp;&nbsp;state.speed = {version % 2 === 0 ? '10.0' : '2.0'};
              </div>
              <div className={`transition-colors duration-300 ${isCompiling ? 'text-yellow-400' : 'text-slate-300'}`}>
                  &nbsp;&nbsp;state.color = {version % 2 === 0 ? 'ORANGE' : 'BLUE'};
              </div>
              <div>{'}'}</div>
              
              <button 
                onClick={triggerHotSwap}
                disabled={isCompiling}
                className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase rounded tracking-widest disabled:opacity-50"
              >
                  {isCompiling ? 'Compiling...' : 'Hot_Reload'}
              </button>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2">
              <div className={`h-1 w-16 transition-all duration-300 ${isCompiling ? 'bg-yellow-500 width-full animate-pulse' : 'bg-slate-700'}`}></div>
              <span className="text-[7px] font-mono text-slate-500 uppercase">dlopen()</span>
          </div>

          {/* Running Process */}
          <div className="relative w-32 h-32 flex items-center justify-center">
              <div 
                className={`transition-all duration-500 shadow-2xl ${
                    gameState.current.shape === 'cube' ? 'w-20 h-20' : 'w-20 h-20 rounded-full'
                }`}
                style={{ 
                    backgroundColor: gameState.current.color,
                    transform: `rotate(${angle}deg)`,
                    boxShadow: `0 0 30px ${gameState.current.color}40`
                }}
              >
                  <div className="absolute inset-0 border-2 border-white/20"></div>
              </div>
              <div className="absolute -bottom-8 text-[9px] font-black text-white uppercase tracking-widest">
                  PID: 4092 [Running]
              </div>
          </div>
      </div>

      <div className="px-8 py-4 bg-slate-950 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 italic text-center max-w-lg mx-auto">
              <T>Hot-Swapping permite reemplazar la lógica del programa en tiempo de ejecución sin perder el estado de la memoria. Rust lo hace seguro garantizando que la estructura de datos (ABI) sea compatible entre versiones.</T>
          </p>
      </div>
    </div>
  );
};
