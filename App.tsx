
import React, { useState, useEffect } from 'react';
import { CURRICULUM, LESSON_LOOKUP } from './constants';
import { fetchLessonContent } from './services/contentService';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { Quiz } from './components/Quiz';
import { LessonContent } from './types';
import { ThreeBackground } from './components/ThreeBackground';

const STORAGE_KEY = 'rust_patterns_progress';

const App: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSON_LOOKUP[0]?.id || '');
  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Progress State initialized from LocalStorage
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch (e) {
      console.error("Failed to load progress", e);
      return new Set();
    }
  });

  // Calculate Rank
  const getRank = (completedCount: number) => {
      const total = LESSON_LOOKUP.length;
      const percentage = completedCount / total;
      
      if (completedCount === 0) return { title: 'Initiate', color: 'text-slate-400' };
      if (percentage < 0.4) return { title: 'Ferris Fan', color: 'text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]' };
      if (percentage < 0.8) return { title: 'Apprentice', color: 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]' };
      if (percentage < 1) return { title: 'Journeyman', color: 'text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.8)]' };
      return { title: 'Grand Rustacean', color: 'text-red-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' };
  };

  const currentRank = getRank(completedLessons.size);

  // Persist progress when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedLessons)));
  }, [completedLessons]);

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      const metadata = LESSON_LOOKUP.find(l => l.id === activeLessonId);
      if (metadata) {
        try {
            const data = await fetchLessonContent(metadata.filename);
            setContent(data);
        } catch (error) {
            console.error("Failed to load lesson", error);
        }
      }
      setLoading(false);
      setMobileMenuOpen(false);
      window.scrollTo(0, 0);
    };

    if (activeLessonId) {
        loadLesson();
    }
  }, [activeLessonId]);

  const handleLessonComplete = () => {
      if (!completedLessons.has(activeLessonId)) {
          const newSet = new Set(completedLessons);
          newSet.add(activeLessonId);
          setCompletedLessons(newSet);
      }
  };

  const activeMetadata = LESSON_LOOKUP.find(l => l.id === activeLessonId);

  return (
    <>
    {/* 60FPS 3D Background Layer */}
    <ThreeBackground />

    <div className="flex h-screen overflow-hidden text-slate-200">
      
      {/* Mobile Header (HUD Style) */}
      <div className="lg:hidden fixed top-0 w-full glass-panel z-50 flex justify-between items-center p-4 border-b border-slate-700/50">
          <div className="font-bold text-orange-500 tracking-wider">RUST.PATTERNS</div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300">
              {mobileMenuOpen ? '✕' : '☰'}
          </button>
      </div>

      {/* Sidebar - Glassmorphism HUD */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-80 glass-panel border-r border-slate-700/30 transform transition-transform duration-200 ease-in-out z-40
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]"></div>
            RUST<span className="text-slate-500 font-light">.HUB</span>
          </h1>
          
          {/* Rank Card - HUD Style */}
          <div className="mt-6 bg-slate-900/40 p-4 rounded-lg border border-slate-700/50 shadow-inner">
              <div className="flex justify-between items-baseline mb-1">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Operator Rank</div>
                  <div className="text-[10px] text-slate-400 font-mono">{completedLessons.size}/{LESSON_LOOKUP.length}</div>
              </div>
              <div className={`text-lg font-bold font-mono ${currentRank.color}`}>
                  {currentRank.title}
              </div>
              
              {/* XP Bar */}
              <div className="w-full bg-slate-800 h-2 mt-3 rounded-sm overflow-hidden border border-slate-700 relative">
                  <div 
                      className="bg-gradient-to-r from-green-600 to-emerald-400 h-full transition-all duration-500 shadow-[0_0_10px_#10b981]" 
                      style={{ width: `${(completedLessons.size / LESSON_LOOKUP.length) * 100}%`}}
                  ></div>
              </div>
          </div>
        </div>

        <nav className="px-4 pb-12 overflow-y-auto h-[calc(100vh-220px)] scrollbar-hide">
          {CURRICULUM.tracks.map((track) => (
            <div key={track.id} className="mb-6">
              <div className="px-2 mb-2 flex items-center gap-2">
                <div className="h-[1px] bg-slate-700 w-4"></div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    {track.title}
                </h3>
              </div>
              
              <ul className="space-y-1">
                {track.lessons.map(lesson => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const isActive = activeLessonId === lesson.id;
                  
                  // Styles for state-based appearance
                  let buttonClass = "w-full text-left px-3 py-2.5 rounded text-sm transition-all group flex items-start justify-between border ";
                  
                  if (isActive) {
                      buttonClass += "bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]";
                  } else if (isCompleted) {
                      // Completed but not active
                      buttonClass += "bg-emerald-900/10 text-slate-300 border-emerald-500/10 hover:bg-emerald-900/20 hover:text-emerald-200";
                  } else {
                      // Default
                      buttonClass += "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700";
                  }

                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={buttonClass}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                            {/* Status Indicator */}
                            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                {isCompleted ? (
                                    // Checkmark for completed
                                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_6px_rgba(16,185,129,0.3)]">
                                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                         </svg>
                                    </div>
                                ) : (
                                    // Dot for incomplete
                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                        isActive ? 'bg-orange-500 shadow-[0_0_5px_#f97316]' : 'bg-slate-700 group-hover:bg-slate-500'
                                    }`}></div>
                                )}
                            </div>
                            
                            <span className={`truncate font-medium ${isCompleted && !isActive ? 'opacity-90' : ''}`}>{lesson.title}</span>
                        </div>
                        
                        {lesson.difficulty === 'Rustacean' && (
                            <span className="ml-2 text-[9px] font-bold border border-red-900 bg-red-900/20 text-red-400 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 shadow-[0_0_5px_rgba(239,68,68,0.2)]">
                                Gem
                            </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content - Floating Panel */}
      <main className="flex-1 overflow-y-auto w-full pt-16 lg:pt-0 relative z-10">
        <div className="max-w-5xl mx-auto p-4 lg:p-8">
            
          {/* Main Glass Panel */}
          <div className="glass-panel rounded-xl min-h-[85vh] p-6 lg:p-10 shadow-2xl relative overflow-hidden">
             {/* Decorative HUD corners */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500/30 rounded-tl-lg"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500/30 rounded-tr-lg"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500/30 rounded-bl-lg"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500/30 rounded-br-lg"></div>

              {loading ? (
                 <div className="flex flex-col items-center justify-center h-96 text-orange-500 animate-pulse font-mono">
                     <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                     <span className="tracking-widest">INITIALIZING DATA STREAM...</span>
                 </div>
              ) : content && activeMetadata ? (
                <>
                  <header className="mb-8 pb-6 border-b border-slate-700/50">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-600">
                            {CURRICULUM.tracks.find(t => t.lessons.some(l => l.id === activeMetadata.id))?.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                            activeMetadata.difficulty === 'Rustacean' 
                            ? 'bg-red-950/40 text-red-400 border-red-900 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                            : activeMetadata.difficulty === 'Intermediate'
                            ? 'bg-amber-950/40 text-amber-400 border-amber-900'
                            : 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                        }`}>
                            {activeMetadata.difficulty}
                        </span>
                        {activeMetadata.readTime && (
                            <span className="text-xs text-slate-500 flex items-center font-mono">
                                {activeMetadata.readTime}
                            </span>
                        )}
                    </div>
                  </header>
                  
                  <MarkdownRenderer content={content.markdown} />
                  
                  <Quiz 
                    questions={content.quiz} 
                    onComplete={handleLessonComplete}
                  />

                  <footer className="mt-16 pt-8 border-t border-slate-800/50 text-center text-slate-600 text-xs font-mono">
                      <p>SYSTEM.VERSION: 1.0.4 • RUST.PATTERNS.VISUALS</p>
                  </footer>
                </>
              ) : (
                <div className="text-center text-red-400 mt-20 font-mono border border-red-900 p-8 rounded bg-red-950/20">
                    ERROR: DATA_CORRUPTION_DETECTED
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default App;
