
import React, { useState, useEffect } from 'react';

const LOGS = [
    { user: 'CrabMaster', action: 'solving Unsafe', level: 'L4' },
    { user: 'FerrisWheel', action: 'optimizing SIMD', level: 'L5' },
    { user: 'RustyDev', action: 'linked Neural Fork', level: 'L2' },
    { user: 'Staff_A', action: 'deployed Smart Contract', level: 'L5' },
    { user: 'Ghost_Shell', action: 'auditing Stack Borrows', level: 'L5' }
];

export const PresenceWidget: React.FC = () => {
  const [activeLogs, setActiveLogs] = useState<typeof LOGS>([]);

  useEffect(() => {
    const interval = setInterval(() => {
        const randomLog = LOGS[Math.floor(Math.random() * LOGS.length)];
        setActiveLogs(prev => [randomLog, ...prev].slice(0, 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">Neural Network Activity</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        {activeLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-900/40 p-2 rounded-lg border border-slate-800/50 animate-fade-in-up">
                <div className="text-[10px]">👤</div>
                <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between">
                        <span className="text-[9px] font-black text-slate-200">@{log.user}</span>
                        <span className="text-[7px] text-orange-500 font-mono">{log.level}</span>
                    </div>
                    <div className="text-[8px] text-slate-500 truncate lowercase">{log.action}...</div>
                </div>
            </div>
        ))}
        {activeLogs.length === 0 && <div className="text-[8px] text-slate-700 italic font-mono text-center py-4">Waiting for peers...</div>}
    </div>
  );
};
