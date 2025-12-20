import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionId: string, optionId: string) => {
    if (showResults) return; // Freeze after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      if (selected === correctOption?.id) score++;
    });
    return score;
  };

  const handleSubmit = () => {
      setShowResults(true);
      if (onComplete) {
          // You could enforce a minimum score here if desired, e.g.:
          // if (calculateScore() === questions.length) onComplete();
          onComplete(); 
      }
  };

  const reset = () => {
      setSelectedAnswers({});
      setShowResults(false);
  };

  if (questions.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <span className="bg-indigo-500 w-8 h-8 rounded flex items-center justify-center text-sm">?</span>
        Knowledge Check
      </h2>

      <div className="space-y-8">
        {questions.map((q, idx) => {
          const selectedId = selectedAnswers[q.id];
          const correctOption = q.options.find(o => o.isCorrect);
          const isCorrect = selectedId === correctOption?.id;
          
          return (
            <div key={q.id} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <p className="text-lg font-medium text-slate-200 mb-4">
                <span className="text-slate-500 mr-2">{idx + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-3">
                {q.options.map((opt) => {
                  let buttonClass = "w-full text-left p-4 rounded-md border transition-all duration-200 flex justify-between items-center ";
                  
                  if (showResults) {
                     if (opt.isCorrect) {
                         buttonClass += "bg-green-900/30 border-green-500 text-green-200";
                     } else if (selectedId === opt.id && !opt.isCorrect) {
                         buttonClass += "bg-red-900/30 border-red-500 text-red-200";
                     } else {
                         buttonClass += "bg-slate-800 border-slate-700 opacity-50";
                     }
                  } else {
                      if (selectedId === opt.id) {
                          buttonClass += "bg-indigo-600/20 border-indigo-500 text-indigo-200";
                      } else {
                          buttonClass += "bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-500";
                      }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={buttonClass}
                      disabled={showResults}
                    >
                      <span>{opt.text}</span>
                      {showResults && opt.isCorrect && (
                          <span className="text-green-400">✓</span>
                      )}
                      {showResults && !opt.isCorrect && selectedId === opt.id && (
                          <span className="text-red-400">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Feedback */}
              {showResults && (
                  <div className={`mt-4 p-4 rounded border ${isCorrect ? 'bg-green-900/10 border-green-900/50' : 'bg-red-900/10 border-red-900/50'}`}>
                      <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                              {isCorrect ? 'Correct!' : 'Incorrect.'}
                          </span>
                      </div>
                      
                      {!isCorrect && correctOption && (
                          <div className="mt-1 text-sm text-slate-300">
                              The correct answer is: <span className="text-green-400 font-medium">{correctOption.text}</span>
                          </div>
                      )}
                      
                      {q.explanation && (
                          <div className="mt-3 pt-3 border-t border-slate-700/50 text-sm text-slate-400">
                              <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Why:</span> {q.explanation}
                          </div>
                      )}
                  </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className={`px-6 py-3 rounded-md font-bold text-white transition-colors ${
              Object.keys(selectedAnswers).length < questions.length
                ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
            }`}
          >
            Submit Answers
          </button>
        ) : (
          <div className="flex items-center gap-6 w-full animate-fade-in justify-between bg-slate-800/80 p-4 rounded-lg border border-slate-700">
             <div className="text-xl">
                 Score: <span className="font-bold text-white">{calculateScore()} / {questions.length}</span>
             </div>
             <button 
                onClick={reset}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded transition-colors shadow-lg"
             >
                 Retry Quiz
             </button>
          </div>
        )}
      </div>
    </div>
  );
};