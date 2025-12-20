
import React, { useState } from 'react';
import { T } from '../hooks/useChromeTranslation';

interface MemoryItem {
  id: string;
  name?: string;
  value: string;
  status?: 'active' | 'moved' | 'dropped' | 'borrowed';
  isPointerTo?: string; // ID of the heap item
}

interface HeapItem {
  id: string;
  value: string;
  refs: number; // Reference count visualization
}

interface Step {
  code: string;
  description: string;
  stack: MemoryItem[];
  heap: HeapItem[];
}

interface MemoryVisualizerProps {
  data: {
    title: string;
    steps: Step[];
  };
}

export const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({ data }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = data.steps[currentStep];

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
          <span className="text-xl">🧠</span> <T>{data.title}</T>
        </h3>
        <div className="text-xs font-mono text-slate-500">
          STEP {currentStep + 1} / {data.steps.length}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-black/50 border-b border-slate-800 p-4 font-mono text-sm overflow-x-auto">
        {data.steps.map((s, idx) => (
          <div 
            key={idx}
            className={`transition-colors duration-300 px-2 py-1 rounded ${
              idx === currentStep 
                ? 'bg-blue-900/30 text-blue-300 border-l-2 border-blue-500' 
                : 'text-slate-600'
            }`}
          >
            {idx === currentStep && <span className="mr-2 text-blue-500">▶</span>}
            {s.code}
          </div>
        ))}
      </div>

      {/* Visualization Area */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 relative">
        
        {/* Connector Lines Layer (Simplified for React/CSS) */}
        {/* Note: True SVG lines would require calculating element positions. 
            For this simplified version, we use color coding to indicate pointers. */}

        {/* STACK */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-2">Stack Frame</h4>
          <div className="space-y-3">
            {step.stack.map((item) => (
              <div 
                key={item.id}
                className={`
                  relative p-3 rounded border flex justify-between items-center transition-all duration-500
                  ${item.status === 'moved' ? 'opacity-40 border-dashed border-red-900 bg-red-900/10' : ''}
                  ${item.status === 'active' ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-700 bg-slate-800'}
                `}
              >
                <div className="flex flex-col">
                  <span className="font-mono text-sm font-bold text-slate-300">{item.name}</span>
                  {item.status === 'moved' && <span className="text-[10px] text-red-400 font-mono uppercase">MOVED / INVALID</span>}
                </div>
                
                <div className="flex items-center gap-2">
                    {item.isPointerTo && (
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    )}
                    <code className="bg-black/30 px-2 py-1 rounded text-xs text-slate-400 font-mono">
                        {item.value}
                    </code>
                </div>
              </div>
            ))}
            {step.stack.length === 0 && (
                <div className="text-center text-slate-600 text-xs py-4 italic">Empty Stack</div>
            )}
          </div>
        </div>

        {/* HEAP */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-2">Heap Memory</h4>
          <div className="space-y-3 min-h-[100px] border-2 border-dashed border-slate-800 rounded-lg p-4 bg-black/20">
            {step.heap.map((item) => (
              <div 
                key={item.id}
                className="p-3 rounded border border-orange-500/30 bg-orange-900/10 flex justify-between items-center shadow-[0_0_15px_rgba(234,88,12,0.1)] transition-all duration-500 transform"
              >
                <span className="font-mono text-xs text-orange-400">@{item.id}</span>
                <span className="font-bold text-slate-200">"{item.value}"</span>
                {item.refs > 1 && (
                    <span className="text-[10px] bg-slate-800 px-1.5 rounded text-slate-400 border border-slate-700">refs: {item.refs}</span>
                )}
              </div>
            ))}
            {step.heap.length === 0 && (
                <div className="text-center text-slate-600 text-xs py-8 italic">Empty Heap</div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
        <p className="text-sm text-slate-400 italic max-w-[60%]">
            <T>{step.description}</T>
        </p>
        <div className="flex gap-2">
            <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
            >
                ← <T>Prev</T>
            </button>
            <button 
                onClick={() => setCurrentStep(Math.min(data.steps.length - 1, currentStep + 1))}
                disabled={currentStep === data.steps.length - 1}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-lg shadow-blue-900/20"
            >
                <T>Next</T> →
            </button>
        </div>
      </div>
    </div>
  );
};
