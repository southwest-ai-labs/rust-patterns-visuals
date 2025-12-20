
import React, { useState, useEffect } from 'react';
import * as GithubService from '../services/githubService';
import { UserProgress } from '../types';

interface GithubModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSyncComplete: (mergedProgress: UserProgress) => void;
}

export const GithubModal: React.FC<GithubModalProps> = ({ isOpen, onClose, progress, onSyncComplete }) => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
      const saved = localStorage.getItem('rust_patterns_github_config');
      if (saved) {
          const config = JSON.parse(saved);
          setUsername(config.username);
          setToken(config.token);
      }
  }, [isOpen]);

  if (!isOpen) return null;

  const addLog = (msg: string) => setLog(prev => [...prev, `> ${msg}`]);

  const handleSync = async () => {
    if (!token || !username) return;
    setStatus('syncing');
    setLog([]);
    addLog(`Initiating Sovereign Sync for @${username}...`);

    const config = { token, username };

    try {
        const exists = await GithubService.checkRepoExists(config);
        if (!exists) {
            addLog(`Storage repo not found. Provisioning 'rust-patterns-storage'...`);
            const created = await GithubService.createRepo(config);
            if (!created) throw new Error("Repo creation failed");
        }

        addLog(`Accessing Remote State...`);
        const remote = await GithubService.getProgressFile(config);
        
        let mergedProgress: UserProgress = { ...progress };
        const sha = remote?.sha;

        if (remote && remote.data) {
            addLog(`Merging remote state (${remote.data.totalMMR} MMR)...`);
            // Basic merge logic: union of completed lesson history
            const localIds = new Set(progress.history.map(h => h.itemId));
            const newHistory = [...progress.history];
            remote.data.history.forEach(rItem => {
                if (!localIds.has(rItem.itemId)) newHistory.push(rItem);
            });
            const totalMMR = newHistory.reduce((acc, curr) => acc + curr.xpEarned, 0);
            mergedProgress = {
                ...progress,
                history: newHistory,
                totalMMR,
                lastActive: Math.max(progress.lastActive, remote.data.lastActive)
            };
        }

        addLog(`Pushing unified state to GitHub...`);
        const saved = await GithubService.saveProgress(config, mergedProgress, sha);
        if (saved) {
            localStorage.setItem('rust_patterns_github_config', JSON.stringify(config));
            onSyncComplete(mergedProgress);
            setStatus('success');
            addLog(`HANDSHAKE_COMPLETE: Systems Synchronized.`);
        } else throw new Error("Push failed");
    } catch (e: any) {
        setStatus('error');
        addLog(`CRITICAL_ERROR: ${e.message || "Uplink denied"}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-8">
            <h2 className="text-xl font-black text-white flex items-center gap-3 mb-2 uppercase tracking-tighter">
                <span className="text-2xl">📡</span> Network Sovereignty
            </h2>
            <p className="text-slate-500 text-[10px] font-mono mb-8 uppercase tracking-widest">Local-First Persistence Bridge</p>

            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">GitHub Username</label>
                    <input 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none font-mono text-sm transition-all"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="operator_name"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Personal Access Token (PAT)</label>
                    <input 
                        type="password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none font-mono text-sm transition-all"
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxx"
                    />
                    <p className="mt-2 text-[8px] text-slate-600 font-mono italic">
                        *Generate at settings/tokens with 'repo' scope. No backend involved.
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-black/60 rounded-xl border border-slate-800 p-4 h-24 overflow-y-auto font-mono text-[9px] text-emerald-500 leading-tight">
                {log.map((l, i) => <div key={i}>{l}</div>)}
                {status === 'idle' && <span className="text-slate-700 animate-pulse"># Awaiting_Uplink_Parameters...</span>}
            </div>

            <div className="mt-8 flex gap-4">
                <button onClick={onClose} className="px-6 py-3 text-slate-500 font-black text-[10px] uppercase tracking-widest">Abort</button>
                <button 
                    onClick={handleSync}
                    disabled={status === 'syncing' || !token || !username}
                    className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl"
                >
                    {status === 'syncing' ? 'Syncing_Nodes...' : 'Initiate_Handshake'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
