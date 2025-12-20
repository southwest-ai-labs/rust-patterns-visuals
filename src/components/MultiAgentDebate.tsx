
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface DebateMessage {
  persona: 'optimizer' | 'guard' | 'architect';
  text: string;
}

export const MultiAgentDebate: React.FC<{ code: string }> = ({ code }) => {
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [debating, setDebating] = useState(false);

  const triggerDebate = async () => {
    setDebating(true);
    setMessages([]);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Act as three different Staff Rust Engineers debating this code:
        1. The Optimizer: Focus on performance and zero-cost abstractions.
        2. The Guard: Focus on memory safety, Unsafe rules, and soundness.
        3. The Architect: Focus on patterns and maintainability.
        
        Return JSON { debate: [{persona: 'optimizer'|'guard'|'architect', text: string}] }.
        Code: \n${code}`;

        const result = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(result.text || '{"debate":[]}');
        setMessages(data.debate);
    } catch (e) {
        console.error("Debate failed", e);
    } finally {
        setDebating(false);
    }
  };

  const personaConfig = {
    optimizer: { name: 'THE_OPTIMIZER', color: 'text-cyan-400', border: 'border-cyan-900/30', bg: 'bg-cyan-950/10' },
    guard: { name: 'THE_SAFETY_GUARD', color: 'text-red-400', border: 'border-red-900/30', bg: 'bg-red-950/10' },
    architect: { name: 'THE_ARCHITECT', color: 'text-amber-400', border: 'border-amber-900/30', bg: 'bg-amber-950/10' },
  };

  return (
    <div className="my-10 p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      <div className="flex justify-between items-center mb-6">
          <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Multi-Agent Tech Debate</h3>
              <p className="text-[10px] text-slate-500 font-mono">STAFF_VIRTUAL_CONSULTANCY // LINK_ACTIVE</p>
          </div>
          <button 
            onClick={triggerDebate}
            disabled={debating || !code}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg disabled:opacity-50"
          >
            {debating ? "Summoning Spirits..." : "Trigger Staff Review"}
          </button>
      </div>

      <div className="space-y-4">
          {messages.length === 0 && !debating && (
              <div className="text-center py-8 text-slate-600 italic text-xs font-mono">
                  # Haz clic en el botón para iniciar un debate técnico sobre tu solución actual.
              </div>
          )}
          
          {debating && (
              <div className="flex flex-col gap-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-900 animate-pulse rounded-lg border border-slate-800"></div>)}
              </div>
          )}

          {messages.map((msg, i) => (
              <div key={i} className={`p-4 rounded-xl border-l-4 ${personaConfig[msg.persona].border} ${personaConfig[msg.persona].bg} animate-fade-in-up`} style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className={`text-[9px] font-black uppercase mb-1 ${personaConfig[msg.persona].color}`}>{personaConfig[msg.persona].name}</div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed italic">"{msg.text}"</p>
              </div>
          ))}
      </div>
    </div>
  );
};
