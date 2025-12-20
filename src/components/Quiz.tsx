
import React, { useState, useEffect } from 'react';
import { QuizModule } from '../types';

interface QuizProps {
  quiz: QuizModule | null;
  onComplete?: () => void;
  onFail?: () => void;
  lessonTitle?: string;
  onOpenGithub?: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ quiz, onComplete, onFail, onOpenGithub }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [gitUser, setGitUser] = useState("");
  const [signature, setSignature] = useState("");

  if (!quiz) return null;

  const calculateScore = () => {
    let score = 0;
    let maxScore = 0;
    quiz.questions.forEach(q => {
      maxScore += q.points;
      const selected = selectedAnswers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      if (selected === correctOption?.id) score += q.points;
    });
    return { score, maxScore, percentage: (score / maxScore) * 100 };
  };

  const { score, maxScore, percentage } = calculateScore();
  const passed = percentage >= quiz.minPassScore;

  const generateSignature = async (name: string) => {
      const msg = `${name}-${quiz.id}-${score}-${Date.now()}`;
      const msgUint8 = new TextEncoder().encode(msg);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
      setSignature(hashHex.toUpperCase());
  };

  const downloadCertificate = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 1200; canvas.height = 630;
      ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, 1200, 630);
      ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 10; ctx.strokeRect(20, 20, 1160, 590);
      
      ctx.fillStyle = '#ea580c'; ctx.font = 'bold 60px monospace'; ctx.textAlign = 'center';
      ctx.fillText("RUST SYSTEMS CERTIFIED", 600, 150);
      
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 80px sans-serif';
      ctx.fillText(gitUser.toUpperCase() || "OPERATOR", 600, 300);
      
      ctx.fillStyle = '#64748b'; ctx.font = '25px monospace';
      ctx.fillText(`EXAM: ${quiz.title.toUpperCase()}`, 600, 400);
      ctx.fillText(`SCORE: ${score}/${maxScore} (${percentage.toFixed(0)}%)`, 600, 450);
      
      ctx.fillStyle = '#1e293b'; ctx.fillRect(400, 500, 400, 60);
      ctx.fillStyle = '#0ea5e9'; ctx.font = 'bold 20px monospace';
      ctx.fillText(`VERIFICATION_HASH: ${signature}`, 600, 535);

      const link = document.createElement('a');
      link.download = `rust_hub_cert_${signature}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
  };

  return (
    <div className="mt-16 pt-12 border-t border-slate-800">
      <div className="bg-slate-900/50 p-10 rounded-3xl border border-slate-800 relative overflow-hidden">
        <h2 className="text-3xl font-black text-white uppercase mb-8 tracking-tighter flex items-center gap-4">
            <span className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center text-sm shadow-xl shadow-orange-900/20">🛡️</span>
            Engineering Assessment
        </h2>

        {!showResults ? (
            <div className="space-y-10">
                {quiz.questions.map((q, idx) => (
                    <div key={q.id} className="animate-fade-in-up">
                        <p className="text-lg font-medium text-slate-200 mb-6 flex gap-4">
                            <span className="text-slate-600 font-mono">{(idx+1).toString().padStart(2,'0')}</span>
                            {q.question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map(opt => (
                                <button 
                                    key={opt.id}
                                    onClick={() => setSelectedAnswers(p => ({...p, [q.id]: opt.id}))}
                                    className={`text-left p-4 rounded-xl border-2 transition-all ${selectedAnswers[q.id] === opt.id ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'}`}
                                >
                                    <span className="text-[10px] font-mono mr-2 opacity-50">{opt.id.slice(-1).toUpperCase()})</span> {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <button 
                    disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                    onClick={() => { setShowResults(true); if(passed) generateSignature(gitUser); }}
                    className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl disabled:opacity-50"
                >
                    Finalize Neural Evaluation
                </button>
            </div>
        ) : (
            <div className="text-center py-10 animate-fade-in">
                <div className={`text-6xl font-black uppercase mb-4 ${passed ? 'text-emerald-400' : 'text-red-500'}`}>{passed ? "Passed" : "Failed"}</div>
                <div className="text-slate-500 font-mono text-sm mb-10 tracking-widest">SYSTEM_SCORE: {score} / {maxScore}</div>
                
                {passed ? (
                    <div className="max-w-md mx-auto space-y-6">
                        <input 
                            className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-center font-mono focus:border-orange-500 outline-none"
                            placeholder="OPERATOR_NAME"
                            value={gitUser}
                            onChange={e => { setGitUser(e.target.value); generateSignature(e.target.value); }}
                        />
                        <button onClick={downloadCertificate} className="w-full py-4 bg-white text-slate-950 font-black uppercase tracking-tighter rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                            <span>📜</span> Mint Verified Certificate
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setShowResults(false)} className="px-8 py-3 bg-slate-800 text-white font-bold rounded-lg">Retake Session</button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
