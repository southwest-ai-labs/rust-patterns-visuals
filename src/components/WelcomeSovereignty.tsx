
import React from 'react';

interface WelcomeProps {
  onClose: () => void;
}

export const WelcomeSovereignty: React.FC<WelcomeProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
      <div className="max-w-2xl w-full bg-[#020617] border border-emerald-500/30 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden relative">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="relative p-8 md:p-12">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50 shadow-[0_0_20px_#10b98140]">
                    <span className="text-3xl">🛡️</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                    Data Sovereignty <span className="text-emerald-500">Protocol</span>
                </h1>
                <p className="text-xs font-mono text-emerald-700 uppercase tracking-[0.3em]">Local-First Architecture Active</p>
            </div>

            <div className="space-y-6 text-sm text-slate-400 font-mono leading-relaxed border-y border-slate-800 py-8 my-8">
                <p>
                    <strong className="text-white">Bienvenido, Ingeniero.</strong> Rust.Hub no es una plataforma web tradicional.
                </p>
                <ul className="space-y-4">
                    <li className="flex gap-4 items-start">
                        <span className="text-emerald-500">01.</span>
                        <div>
                            <strong className="text-slate-200">Tu Navegador es el Servidor.</strong>
                            <p className="mt-1 text-xs opacity-70">Toda la lógica de evaluación, visualización de memoria y compilación ocurre localmente en tu dispositivo. Funciona 100% Offline (PWA).</p>
                        </div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <span className="text-emerald-500">02.</span>
                        <div>
                            <strong className="text-slate-200">GitHub es tu Base de Datos.</strong>
                            <p className="mt-1 text-xs opacity-70">No guardamos tus datos en servidores privados. Tu progreso se sincroniza con tu propio repositorio público (<code className="bg-slate-800 px-1 rounded">rust-patterns-storage</code>).</p>
                        </div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <span className="text-emerald-500">03.</span>
                        <div>
                            <strong className="text-slate-200">Propiedad Total.</strong>
                            <p className="mt-1 text-xs opacity-70">Si Rust.Hub desaparece mañana, tú conservas tu historial, tus certificados y tus soluciones. Son tuyos.</p>
                        </div>
                    </li>
                </ul>
            </div>

            <button 
                onClick={onClose}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
                Initialize Local Environment
            </button>
            
            <p className="text-center text-[10px] text-slate-600 mt-4 font-mono">
                v2.0.0 // SYSTEM_READY // ENCRYPTED_STORAGE
            </p>
        </div>
      </div>
    </div>
  );
};
