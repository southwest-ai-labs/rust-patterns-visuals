
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MarkdownRenderer } from './MarkdownRenderer';
import { WasmLinter } from './WasmLinter';

interface DailyChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlayground: (code: string) => void;
  model: string;
  onMissingKey: () => void;
  onSolve: () => void; 
}

interface LinterError {
  line: number;
  message: string;
  type: string;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ 
    isOpen, onClose, onOpenPlayground, model, onMissingKey, onSolve 
}) => {
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [userSolution, setUserSolution] = useState<string>('');
  const [errors, setErrors] = useState<LinterError[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const topics = ["Tokio Async", "Lifetimes", "Unsafe Rust", "Generics", "Interior Mutability"];

  useEffect(() => {
    if (isOpen && !content) loadChallenge();
  }, [isOpen]);

  const loadChallenge = async () => {
    const hasKey = await window.aistudio?.hasSelectedApiKey();
    if (!hasKey) { onMissingKey(); return; }
    setLoading(true);
    try {
      const topic = topics[new Date().getDate() % topics.length];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a Rust L5 architectural puzzle about ${topic}. Include a scenario and starter code with a flaw. Return JSON: {markdown: string, starterCode: string}`;
      const result = await ai.models.generateContent({
        model: model, 
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(result.text || '{}');
      setContent(data.markdown);
      setUserSolution(data.starterCode);
    } catch (err: any) { console.error(err); }
    setLoading(false);
  };

  const handlePairSugerence = async () => {
    setGrading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Current code: \n${userSolution}\n Suggest ONE advanced Rust pattern (Typestate, Newtype, or Marker Trait) to improve this. Be very brief.`;
        const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        setFeedback(`🤖 FERRIS_SUGGESTION: ${result.text}`);
    } catch (e) { console.error(e); }
    setGrading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-orange-500/30 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-orange-900/30">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444] animate-pulse"></div>
             <span className="font-mono text-sm text-orange-500 font-bold uppercase tracking-widest">Neural_Lab // Challenge_Terminal</span>
          </div>
          <div className="flex gap-4">
              <button onClick={handlePairSugerence} className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded hover:bg-blue-600/40 transition-all font-black uppercase">Pair with Ferris</button>
              <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="md:w-1/3 overflow-y-auto p-6 bg-slate-900/50 border-r border-slate-800">
                {loading ? <div className="text-orange-500 animate-pulse font-mono text-xs">SYNTHESIZING RETO...</div> : <MarkdownRenderer content={content} />}
            </div>

            <div className="md:w-2/3 flex flex-col bg-slate-950 relative">
                <WasmLinter code={userSolution} onUpdateErrors={setErrors} />
                <textarea 
                    className="flex-1 bg-[#0d1117] text-emerald-400 font-mono text-sm p-8 outline-none resize-none leading-relaxed"
                    value={userSolution}
                    onChange={(e) => setUserSolution(e.target.value)}
                    spellCheck={false}
                />
                
                {/* Linter Error HUD */}
                {errors.length > 0 && (
                    <div className="absolute bottom-24 left-8 right-8 space-y-2 pointer-events-none">
                        {errors.map((err, i) => (
                            <div key={i} className="bg-red-950/90 border border-red-500 p-2 rounded text-[10px] text-red-200 font-mono shadow-lg animate-fade-in-up">
                                <span className="font-black">[LINE {err.line}] {err.type}:</span> {err.message}
                            </div>
                        ))}
                    </div>
                )}

                <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-[60%]">{feedback || "Awaiting submission..."}</div>
                    <div className="flex gap-3">
                        <button onClick={() => onOpenPlayground(userSolution)} className="text-[10px] text-slate-400 uppercase font-bold hover:text-white">Open Playground</button>
                        <button onClick={() => setSuccess(true)} className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] uppercase rounded">Deploy Soundness Proof</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
