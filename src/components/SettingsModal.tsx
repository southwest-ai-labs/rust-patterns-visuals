
import React, { useState, useEffect } from 'react';

interface UserConfig {
  model: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserConfig;
  onSave: (config: UserConfig) => void;
  isProEnabled: boolean;
  onActivatePro: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave, isProEnabled, onActivatePro }) => {
  const [model, setModel] = useState(config.model);

  useEffect(() => {
    if (isOpen) setModel(config.model);
  }, [isOpen, config]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System_Configuration</h2>
            <button onClick={onClose} className="text-slate-600 hover:text-white">✕</button>
        </div>

        <div className="p-8 space-y-8">
            <div className="p-5 bg-gradient-to-br from-orange-950/30 to-red-950/30 border border-orange-500/20 rounded-xl relative group">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🛡️</span>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Mastery Protocol</h3>
                        <p className="text-[9px] text-slate-500 font-mono mt-1">Uplink to Google Cloud Neural Engines (L5 Reasoning).</p>
                    </div>
                </div>
                
                {isProEnabled ? (
                    <div className="flex items-center justify-between py-2 px-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg">
                        <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-pulse"># Status: Uplink_Verified</span>
                        <span className="text-emerald-500 text-xs">●</span>
                    </div>
                ) : (
                    <button 
                        onClick={onActivatePro}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                    >
                        Initialize Neural Handshake
                    </button>
                )}
                <p className="text-[8px] text-slate-600 mt-3 italic text-center font-mono leading-tight">
                    *Requires a billing-enabled GCP project. No keys are stored on our servers.
                </p>
            </div>

            <div className="space-y-4">
                <label className="block text-[10px] font-black text-blue-500 uppercase tracking-widest">Intelligence_Model</label>
                <div className="grid grid-cols-1 gap-2">
                    {[
                        { id: 'gemini-3-flash-preview', name: 'Flash 3.0', desc: 'Optimal for real-time tutoring.' },
                        { id: 'gemini-3-pro-preview', name: 'Pro 3.0', desc: 'Required for Architectural Audit.' }
                    ].map(m => (
                        <button 
                            key={m.id}
                            onClick={() => setModel(m.id)}
                            className={`text-left px-5 py-3 rounded-xl border-2 transition-all ${model === m.id ? 'border-blue-500 bg-blue-900/10' : 'border-slate-800 bg-black/40 opacity-60 hover:opacity-100'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-black text-white text-xs uppercase tracking-tighter">{m.name}</span>
                                {model === m.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>}
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono italic">{m.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-end">
            <button 
                onClick={() => { onSave({ model }); onClose(); }}
                className="px-10 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-xl"
            >
                Commit_State
            </button>
        </div>
      </div>
    </div>
  );
};
