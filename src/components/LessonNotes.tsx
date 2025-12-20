
import React, { useState, useEffect } from 'react';
import * as GithubService from '../services/githubService';

interface LessonNotesProps {
  lessonId: string;
}

export const LessonNotes: React.FC<LessonNotesProps> = ({ lessonId }) => {
  const [notes, setNotes] = useState<GithubService.Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
      const savedAuth = localStorage.getItem('rust_patterns_github_config');
      if (savedAuth) {
          setIsAuthenticated(true);
          loadNotes(JSON.parse(savedAuth));
      }
  }, [lessonId]);

  const loadNotes = async (config: GithubService.GithubConfig) => {
      const fetched = await GithubService.fetchLessonNotes(config, lessonId);
      setNotes(fetched);
  };

  const handleSave = async () => {
      if (!newNote.trim()) return;
      setIsSyncing(true);
      const savedAuth = localStorage.getItem('rust_patterns_github_config');
      if (savedAuth) {
          const config = JSON.parse(savedAuth);
          const saved = await GithubService.postLessonNote(config, lessonId, newNote);
          if (saved) {
              setNotes(prev => [saved, ...prev]);
              setNewNote('');
          }
      }
      setIsSyncing(false);
  };

  if (!isAuthenticated) return (
      <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed text-center">
          <p className="text-[10px] text-slate-500 font-mono">Link GitHub to enable Neural Notes.</p>
      </div>
  );

  return (
    <div className="mt-12 pt-8 border-t border-slate-800">
      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>📝</span> Neural Notes (Private)
      </h3>
      
      <div className="space-y-4">
          <div className="flex flex-col gap-2">
              <textarea 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-orange-500 outline-none min-h-[80px]"
                  placeholder="E.g., Remember to use Arc<Mutex> for shared state..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
              />
              <button 
                  onClick={handleSave}
                  disabled={isSyncing || !newNote.trim()}
                  className="self-end px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase rounded-lg transition-all"
              >
                  {isSyncing ? 'Syncing...' : 'Save to GitHub'}
              </button>
          </div>

          <div className="space-y-3">
              {notes.length === 0 && <p className="text-[10px] text-slate-600 italic">No notes recorded for this module.</p>}
              {notes.map(note => (
                  <div key={note.id} className="p-4 bg-slate-900/30 border border-slate-800/50 rounded-xl group relative">
                      <div className="text-[10px] text-slate-500 font-mono mb-2 flex justify-between">
                          <span>{new Date(note.date).toLocaleDateString()}</span>
                          <a href={note.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View on GitHub ↗</a>
                      </div>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{note.body}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
