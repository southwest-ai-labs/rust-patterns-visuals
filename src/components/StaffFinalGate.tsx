
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserProgress } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface StaffFinalGateProps {
  progress: UserProgress;
  onCertificationEarned: (badgeId: string) => void;
}

export const StaffFinalGate: React.FC<StaffFinalGateProps> = ({ progress, onCertificationEarned }) => {
  const [active, setActive] = useState(false);
  const [mission, setMission] = useState<{ scenario: string, brokenCode: string, target: string } | null>(null);
  const [solution, setSolution] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  // Solo se activa si el MMR es suficiente
  const isQualified = progress.totalMMR >= 3000;

  const startMission = async () => {
    setAnalyzing(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Act as a Systems Emergency Dispatcher. Generate a CRITICAL RUST SYSTEM FAILURE scenario (L5 level). 
        Include: 
        1. A scenario description (e.g. Memory leak in high-frequency trading bot).
        2. A code snippet with a very subtle Soundness or Async bug.
        3. A clear objective.
        Return JSON: { scenario: string, brokenCode: string, target: string }`;
        
        const result = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 12000 }
            }
        });
        const data = JSON.parse(result.text || '{}');
        setMission(data);
        setSolution(data.brokenCode);
        setActive(true);
    } catch (e) { console.error(e); }
    setAnalyzing(false);
  };

  const submitAudit = async () => {
    setAnalyzing(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `FORENSIC AUDIT REQUEST:
        Original Scenario: ${mission?.scenario}
        Proposed Fix: ${solution}
        
        Determine if the fix is correct, memory safe, and architectural sound.
        Return JSON: { success: boolean, forensicReport: string, integrityScore: number }`;

        const result = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 16000 }
            }
        });
        const data = JSON.parse(result.text || '{}');
        setReport(data.forensicReport);
        if (data.success && data.integrityScore > 90) {
            onCertificationEarned('GENESIS_ARCHITECT_S1');
        }
    } catch (e) { console.error(e); }
    setAnalyzing(false);
  };

  if (!isQualified) return null;

  return (
    <div className="my-16 relative">
      {!active ? (
        <div className="p-12 bg-black border-2 border-red-600 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.2)] text-center overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10">
                <div className="inline-block px-4 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-pulse">
                    Critical Alert: Singularity Gate Detected
                </div>
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">The Architect Test</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-8 font-mono text-sm leading-relaxed">
                    Has alcanzado el límite de la comprensión humana de Rust. Tu MMR indica que estás listo para la Sala de Guerra L5. Este reto es único, dinámico y evaluado por el núcleo de razonamiento avanzado.
                </p>
                <button 
                    onClick={startMission}
                    disabled={analyzing}
                    className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-red-600 hover:text-white transition-all shadow-2xl"
                >
                    {analyzing ? "Accessing Core..." : "Initiate System Audit"}
                </button>
            </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-fade-in">
            <div className="h-1 bg-red-600 animate-pulse w-full"></div>
            <div className="flex-1 flex overflow-hidden">
                <div className="w-1/3 p-8 border-r border-red-900/30 overflow-y-auto bg-slate-950">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-4 h-4 bg-red-600 rounded-full animate-ping"></div>
                        <span className="font-mono text-red-500 font-black uppercase tracking-widest">Incident_Report // L5_CRITICAL</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-6">SITUACIÓN: {mission?.target}</h3>
                    <div className="prose prose-invert prose-sm">
                         <MarkdownRenderer content={mission?.scenario || ''} />
                    </div>
                    {report && (
                        <div className="mt-12 p-6 bg-red-950/20 border border-red-500/50 rounded-xl animate-fade-in-up">
                            <h4 className="text-xs font-black text-red-500 uppercase mb-3 font-mono">Forensic Review</h4>
                            <p className="text-xs text-red-200 font-mono leading-relaxed italic">"{report}"</p>
                        </div>
                    )}
                </div>
                <div className="flex-1 flex flex-col bg-black relative">
                    <div className="absolute top-4 right-8 flex gap-4 z-20">
                        <button onClick={() => setActive(false)} className="text-slate-600 hover:text-white font-mono text-[10px] uppercase">Abort_Session</button>
                        <button 
                            onClick={submitAudit}
                            disabled={analyzing}
                            className="px-8 py-2 bg-red-600 text-white font-black rounded text-[10px] uppercase tracking-widest shadow-xl hover:bg-red-500 transition-all"
                        >
                            {analyzing ? "Analyzing Soundness..." : "Deploy Global Fix"}
                        </button>
                    </div>
                    <textarea 
                        className="flex-1 bg-black text-red-400 font-mono text-sm p-12 outline-none resize-none leading-relaxed"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        spellCheck={false}
                    />
                    <div className="p-4 border-t border-red-900/20 flex justify-between items-center bg-slate-950/50">
                        <div className="text-[9px] text-red-900 font-mono animate-pulse"># WARNING: UNAUTHORIZED CODE EXECUTION PROHIBITED // ENCRYPTED_UPLINK_ENABLED</div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Season 01 // Genesis Architect</div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
