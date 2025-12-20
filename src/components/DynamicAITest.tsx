
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { UserProgress, AIDynamicChallenge } from '../types';
import * as GithubService from '../services/githubService';

interface DynamicAITestProps {
  lessonTitle: string;
  lessonContent: string;
  userProgress: UserProgress;
  onSolve: (xp: number) => void;
  onActivatePro: () => void;
}

export const DynamicAITest: React.FC<DynamicAITestProps> = ({ 
    lessonTitle, 
    lessonContent, 
    userProgress,
    onSolve, 
    onActivatePro 
}) => {
  const [stage, setStage] = useState<'idle' | 'generating' | 'solving' | 'grading' | 'result'>('idle');
  const [challenge, setChallenge] = useState<AIDynamicChallenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [gradingResult, setGradingResult] = useState<{ pass: boolean; score: number; feedback: string; copilotScore?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [persisting, setPersisting] = useState(false);

  const generateChallenge = async () => {
    if (!userProgress.isProEnabled) { onActivatePro(); return; }
    setStage('generating');
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Context: ${lessonTitle}. Generate complex L5 Rust architectural puzzle. Schema: {title, scenario, starterCode, constraints}`;
      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 8000 }
        }
      });
      const data = JSON.parse(result.text || "{}");
      setChallenge(data);
      setUserCode(data.starterCode);
      setStage('solving');
    } catch (err: any) { setStage('idle'); setError(err.message); }
  };

  const submitSolution = async () => {
    setStage('grading');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Pedimos a Gemini que actúe como proxy de Copilot para el feedback de arquitectura profunda
      const prompt = `Act as a Senior Architect with Copilot Insights. Grade this Rust solution for ${challenge?.title}. User code: ${userCode}. Output JSON {pass: bool, score: number, copilotScore: number (0-100), feedback: string}`;
      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 12000 }
        }
      });
      const res = JSON.parse(result.text || "{}");
      setGradingResult(res);
      setStage('result');
      
      const savedAuth = localStorage.getItem('rust_patterns_github_config');
      if (savedAuth && challenge) {
          setPersisting(true);
          const config = JSON.parse(savedAuth);
          // Enviar el .md con el copilot score incluido
          await GithubService.saveDynamicChallengeToFork(config, challenge, `${res.feedback}\n\n**Copilot Architectural Score: ${res.copilotScore}/100**`, res.score);
          setPersisting(false);
      }

      if (res.pass) onSolve(Math.floor(res.score));
    } catch (err: any) { setStage('idle'); setError(err.message); }
  };

  return (
    <div className="mt-12 border-t border-slate-700/50 pt-12">
      {stage === 'idle' && (
        <div className="text-center p-12 bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed">
          <h3 className="text-2xl font-bold text-white mb-3">Neural Mastery Assessment</h3>
          <p className="text-slate-400 text-xs mb-8 font-mono">SOUTHWEST AI LABS // NEURAL ENGINE v1.4</p>
          <button onClick={generateChallenge} className="px-10 py-4 bg-orange-600 rounded-xl font-black text-white uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:scale-105 transition-transform">
            Synthesize L5 Challenge
          </button>
        </div>
      )}

      {stage === 'solving' && challenge && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-950 p-8 rounded-2xl border border-orange-500/20 shadow-2xl relative">
             <div className="absolute top-4 right-8 text-[10px] font-mono text-slate-500 animate-pulse"># LIVE_SYNTHESIS_ACTIVE</div>
             <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter">{challenge.title}</h3>
             <p className="text-slate-300 mb-8 text-sm leading-relaxed">{challenge.scenario}</p>
             <textarea 
               value={userCode}
               onChange={(e) => setUserCode(e.target.value)}
               className="w-full h-[450px] bg-black text-emerald-400 font-mono text-sm p-6 rounded-xl border border-slate-800 outline-none focus:border-orange-500/50 transition-colors"
               spellCheck={false}
             />
             <div className="mt-6 flex justify-between items-center">
                <div className="text-[9px] text-slate-500 font-mono uppercase">Constraints: {challenge.constraints.length} detected</div>
                <button onClick={submitSolution} className="px-10 py-4 bg-emerald-600 text-white font-black rounded-xl uppercase tracking-widest text-[10px] shadow-lg hover:bg-emerald-500 transition-colors">
                    Deploy Soundness Proof
                </button>
             </div>
          </div>
        </div>
      )}

      {stage === 'result' && gradingResult && (
        <div className="animate-fade-in-up">
           <div className={`p-10 rounded-2xl border-2 ${gradingResult.pass ? 'bg-emerald-950/10 border-emerald-500/30' : 'bg-red-950/10 border-red-500/30'}`}>
              <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className={`text-4xl font-black uppercase mb-1 ${gradingResult.pass ? 'text-emerald-400' : 'text-red-500'}`}>
                        {gradingResult.pass ? "Sound Logic" : "Safety Violation"}
                    </h3>
                    <p className="text-slate-500 text-[10px] font-mono">SOUTHWEST NEURAL ANALYSIS COMPLETE</p>
                  </div>
                  {gradingResult.copilotScore !== undefined && (
                      <div className="text-right">
                          <div className="text-[10px] text-slate-500 font-mono uppercase">Copilot Score</div>
                          <div className="text-3xl font-black text-blue-400">{gradingResult.copilotScore}%</div>
                      </div>
                  )}
              </div>
              
              <div className="bg-black/40 p-6 rounded-xl border border-slate-800 mb-8">
                  <p className="text-slate-300 text-sm leading-relaxed italic">"{gradingResult.feedback}"</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="text-[10px] text-slate-500 font-mono">
                      {persisting ? (
                          <span className="text-orange-500 animate-pulse"># ARCHIVING_FOR_COMMUNITY_BLOG...</span>
                      ) : (
                          <span># EVALUATION_STORED_IN_NEURAL_FORK</span>
                      )}
                  </div>
                  <button onClick={() => setStage('idle')} className="px-8 py-3 bg-white text-slate-900 rounded-lg font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-slate-200 transition-all">Close Neural Session</button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-800/50">
                  <p className="text-[9px] text-slate-600 font-mono leading-tight">
                      Tu solución está siendo procesada en cola para ser publicada en el **Community Insight Forum**. Prepárate para recibir discusiones técnicas y forks de tu resolución por otros operadores de L5.
                  </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
