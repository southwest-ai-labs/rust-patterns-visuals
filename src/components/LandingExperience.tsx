
import React, { useState, useEffect } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface LandingExperienceProps {
  onSuccess: (xp: number) => void;
}

export const LandingExperience: React.FC<LandingExperienceProps> = ({ onSuccess }) => {
  const [code, setCode] = useState('let status = Auth::Guest;\n\nif status == Auth::Admin {\n    unlock_gate();\n}');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    // Basic simulation of a "compiler" check for the onboarding puzzle
    const cleanedCode = code.replace(/\s/g, '');
    if (cleanedCode.includes('status=Auth::Admin') || 
        cleanedCode.includes('ifletAuth::Admin=status') ||
        (cleanedCode.includes('matchstatus') && cleanedCode.includes('Auth::Admin=>unlock'))) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [code]);

  const handleUnlock = () => {
    if (isAuthorized) {
        setGlitch(true);
        setTimeout(() => onSuccess(50), 800);
    }
  };

  return (
    <div className={`fixed inset-0 z-[300] bg-[#020617] flex items-center justify-center p-4 transition-all duration-1000 ${glitch ? 'opacity-0 scale-110' : 'opacity-100'}`}>
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent"></div>
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left: The Visual Feedback (The Gate) */}
        <div className="flex flex-col items-center justify-center space-y-8 order-2 lg:order-1">
            <div className={`w-64 h-64 rounded-full border-8 flex items-center justify-center transition-all duration-700 shadow-2xl ${isAuthorized ? 'border-emerald-500 shadow-emerald-500/40 rotate-180' : 'border-red-600 shadow-red-600/40 animate-pulse'}`}>
                <div className="text-6xl">{isAuthorized ? '🔓' : '🔒'}</div>
            </div>
            
            <div className="text-center space-y-2">
                <h2 className={`text-4xl font-black uppercase tracking-tighter transition-colors ${isAuthorized ? 'text-emerald-400' : 'text-red-500'}`}>
                    {isAuthorized ? 'Neural_Link_Verified' : 'System_Access_Locked'}
                </h2>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">
                    Uplink: Rust.Hub // Protocol v2.5
                </p>
            </div>

            {isAuthorized && (
                <button 
                    onClick={handleUnlock}
                    className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 active:scale-95 animate-fade-in-up"
                >
                    Establish Neural Handshake
                </button>
            )}
        </div>

        {/* Right: The Code Editor (The Hack) */}
        <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[450px] order-1 lg:order-2 ring-1 ring-white/10">
            <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">auth_bridge.rs — Emergency_Patch</span>
            </div>
            
            <div className="p-6 bg-slate-950/50 flex-1 flex flex-col">
                <p className="text-xs text-blue-400 mb-4 font-mono leading-relaxed">
                    // INFO: Debes elevar el privilegio de 'status' a 'Admin' para desbloquear el núcleo.
                    <br/>// TIP: Modifica la variable 'status' o la condición del 'if'.
                </p>
                <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    className="flex-1 bg-black/40 text-orange-400 font-mono text-sm p-4 rounded-xl border border-slate-800 outline-none focus:border-orange-500/30 transition-colors resize-none leading-relaxed"
                />
            </div>

            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isAuthorized ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    <span className={isAuthorized ? 'text-emerald-500' : 'text-slate-500'}>
                        {isAuthorized ? 'LOGIC_SOUND' : 'LOGIC_ERROR_ACCESS_DENIED'}
                    </span>
                </div>
                <span className="text-slate-600">UTF-8 // Rustc 1.78</span>
            </div>
        </div>
      </div>
      
      {/* Floating Instructions */}
      <div className="fixed bottom-8 text-[10px] text-slate-600 font-mono uppercase tracking-[0.5em] animate-pulse">
        Master the ownership. Control the machine.
      </div>
    </div>
  );
};
