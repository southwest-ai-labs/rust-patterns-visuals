
import React, { useState } from 'react';
import { PERFORMANCE_BENCHMARKS, TradeOff } from '../data/benchmarkData';
import { T } from '../hooks/useChromeTranslation';

export const PerformanceComparator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(Object.keys(PERFORMANCE_BENCHMARKS)[0]);
  const current = PERFORMANCE_BENCHMARKS[activeTab];

  const maxVal = Math.max(...current.metrics.map(m => m.value));

  return (
    <div className="my-10 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <span className="text-orange-500 font-bold">⚡</span>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Performance Analyzer</h3>
          </div>
          <div className="flex gap-2">
              {Object.keys(PERFORMANCE_BENCHMARKS).map(key => (
                  <button 
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${activeTab === key ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-white'}`}
                  >
                      {key}
                  </button>
              ))}
          </div>
      </div>

      <div className="p-8 flex flex-col md:flex-row gap-10">
          {/* Chart Side */}
          <div className="flex-1 space-y-6">
              {current.metrics.map(metric => (
                  <div key={metric.id} className="space-y-1 group">
                      <div className="flex justify-between items-baseline text-[10px] font-mono">
                          <span className="text-slate-300 font-bold uppercase tracking-wider">{metric.label}</span>
                          <span className="text-orange-400">{metric.value} {metric.unit}</span>
                      </div>
                      <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div 
                              className="h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-1000 ease-out group-hover:brightness-125"
                              style={{ width: `${(metric.value / maxVal) * 100}%` }}
                          ></div>
                      </div>
                      <p className="text-[9px] text-slate-500 italic"><T>{metric.description}</T></p>
                  </div>
              ))}
          </div>

          {/* Analysis Side */}
          <div className="md:w-64 bg-slate-950/50 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                  <h4 className="text-[10px] font-black text-blue-400 uppercase mb-3 tracking-tighter">Architectural Verdict</h4>
                  <p className="text-xs text-slate-400 leading-relaxed italic"><T>{current.conclusion}</T></p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800">
                  <div className="text-[8px] text-slate-600 font-mono uppercase tracking-widest">Environment: Linux x86_64</div>
                  <div className="text-[8px] text-slate-600 font-mono uppercase tracking-widest">Profile: Release --lto</div>
              </div>
          </div>
      </div>
    </div>
  );
};
