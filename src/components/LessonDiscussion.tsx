
import React, { useState, useEffect } from 'react';
import * as GithubService from '../services/githubService';

interface LessonDiscussionProps {
  lessonId: string;
}

export const LessonDiscussion: React.FC<LessonDiscussionProps> = ({ lessonId }) => {
  const [issueId, setIssueId] = useState<number | null>(null);
  const [comments, setComments] = useState<GithubService.Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
      const savedAuth = localStorage.getItem('rust_patterns_github_config');
      let t = undefined;
      if (savedAuth) {
          const config = JSON.parse(savedAuth);
          setToken(config.token);
          t = config.token;
      }
      loadDiscussion(t);
  }, [lessonId]);

  const loadDiscussion = async (authToken: string | undefined) => {
      setLoading(true);
      const id = await GithubService.findDiscussionIssue(authToken, lessonId);
      setIssueId(id);
      if (id) {
          const cms = await GithubService.fetchComments(authToken, id);
          setComments(cms);
      }
      setLoading(false);
  };

  const handlePost = async () => {
      if (!token || !issueId || !newComment.trim()) return;
      setPosting(true);
      const success = await GithubService.postComment(token, issueId, newComment);
      if (success) {
          setNewComment('');
          loadDiscussion(token); // Refresh
      } else {
          alert("Failed to post comment. Ensure you are linked to GitHub.");
      }
      setPosting(false);
  };

  const handleReaction = async (commentId: number, type: '+1' | 'rocket') => {
      if (!token) {
          alert("Link GitHub to react!");
          return;
      }
      await GithubService.addReaction(token, commentId, type);
      // Optimistic update or refresh
      loadDiscussion(token);
  };

  if (loading) return <div className="p-4 text-center text-xs font-mono text-slate-500 animate-pulse">SYNCING_COMMUNITY_NODES...</div>;

  return (
    <div className="mt-12 pt-8 border-t border-slate-800">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span>📡</span> Global Signal Feed
          </h3>
          {!issueId && (
              <span className="text-[9px] text-slate-500 font-mono">NO_ACTIVE_CHANNEL</span>
          )}
      </div>

      {issueId ? (
          <div className="space-y-6">
              {comments.map(c => (
                  <div key={c.id} className="flex gap-4">
                      <img src={c.avatar} alt={c.user} className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900" />
                      <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold text-slate-300">@{c.user}</span>
                              <span className="text-[9px] text-slate-600 font-mono">{new Date(c.date).toLocaleDateString()}</span>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-sm text-slate-400 leading-relaxed font-mono">
                              {c.body}
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => handleReaction(c.id, '+1')} className="flex items-center gap-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
                                  <span>👍</span> {c.reactions.plus1}
                              </button>
                              <button onClick={() => handleReaction(c.id, 'rocket')} className="flex items-center gap-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-500 hover:text-orange-400 hover:border-orange-500/30 transition-all">
                                  <span>🚀</span> {c.reactions.rocket}
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
              
              {comments.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-600 italic">No signals intercepted yet. Be the first to broadcast.</div>
              )}

              {token ? (
                  <div className="flex gap-4 mt-6">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-500">YOU</div>
                      <div className="flex-1">
                          <textarea 
                              value={newComment}
                              onChange={e => setNewComment(e.target.value)}
                              placeholder="Broadcast your solution or query..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-blue-500 min-h-[80px]"
                          />
                          <button 
                              onClick={handlePost}
                              disabled={posting || !newComment.trim()}
                              className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase rounded-lg shadow-lg disabled:opacity-50"
                          >
                              {posting ? 'TRANSMITTING...' : 'SEND_SIGNAL'}
                          </button>
                      </div>
                  </div>
              ) : (
                  <div className="p-4 bg-blue-900/10 border border-blue-500/30 rounded-xl text-center">
                      <p className="text-xs text-blue-300 mb-2">Connect your Neural Link (GitHub) to participate in global communications.</p>
                  </div>
              )}
          </div>
      ) : (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center">
              <p className="text-xs text-slate-500 mb-4">Signal frequency not established for this sector.</p>
              {token ? (
                  <a 
                    href={`https://github.com/southwest-ai-labs/rust-hub-community/issues/new?title=Discussion: ${lessonId}&labels=lesson:${lessonId}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] uppercase rounded-lg transition-all"
                  >
                      Initialize Frequency (Create Issue)
                  </a>
              ) : (
                  <span className="text-[10px] text-red-400">Link GitHub to initialize.</span>
              )}
          </div>
      )}
    </div>
  );
};
