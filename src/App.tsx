
import React, { useState, useEffect, useRef } from 'react';
import { CURRICULUM, LESSON_LOOKUP } from './constants';
import { fetchLessonContent } from './services/contentService';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { Quiz } from './components/Quiz';
import { LessonContent, DifficultyLevel, UserProgress } from './types';
import { ThreeBackground } from './components/ThreeBackground';
import { PlaygroundModal } from './components/PlaygroundModal';
import { StaffFinalGate } from './components/StaffFinalGate';
import { Dashboard } from './components/Dashboard';
import { DailyChallenge } from './components/DailyChallenge';
import { SettingsModal } from './components/SettingsModal';
import { GithubModal } from './components/GithubModal';
import { CommandPalette } from './components/CommandPalette';
import { WelcomeSovereignty } from './components/WelcomeSovereignty';
import { LessonNotes } from './components/LessonNotes';
import { LessonDiscussion } from './components/LessonDiscussion';
import { AiTutor } from './components/AiTutor';
import { MetaUpdater } from './components/MetaUpdater';
import { ShareButton } from './components/ShareButton';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { TranslationProvider } from './hooks/useChromeTranslation';

const STORAGE_KEY = 'rust_patterns_progress_v2';

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
      const params = new URLSearchParams(window.location.search);
      const lessonParam = params.get('lesson');
      return (lessonParam && LESSON_LOOKUP.some(l => l.id === lessonParam)) ? lessonParam : LESSON_LOOKUP[0]?.id || '';
  });

  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playgroundCode, setPlaygroundCode] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'hub' | 'dashboard'>('hub');
  
  const [showDaily, setShowDaily] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGithub, setShowGithub] = useState(false);
  const [showStaffGate, setShowStaffGate] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const [config, setConfig] = useState({ model: 'gemini-3-flash-preview' });
  const mainRef = useRef<HTMLElement>(null);

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { history: [], totalMMR: 0, lastActive: Date.now(), currentStreak: 0, isProEnabled: false };
  });

  const [expandedTracks, setExpandedTracks] = useState<Set<string>>(new Set([CURRICULUM.tracks[0].id]));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const getRank = (mmr: number) => {
      if (mmr < 100) return { title: 'Initiate', color: 'text-slate-400' };
      if (mmr < 500) return { title: 'Ferris Fan', color: 'text-blue-400' };
      if (mmr < 1500) return { title: 'Apprentice', color: 'text-amber-400' };
      if (mmr < 3000) return { title: 'Journeyman', color: 'text-orange-400' };
      return { title: 'Grand Rustacean', color: 'text-red-500 font-bold' };
  };

  const currentRank = getRank(progress.totalMMR);

  useEffect(() => {
      const activeTrack = CURRICULUM.tracks.find(t => t.lessons.some(l => l.id === activeLessonId));
      if (activeTrack) setExpandedTracks(prev => new Set(prev).add(activeTrack.id));
      
      const url = new URL(window.location.href);
      url.searchParams.set('lesson', activeLessonId);
      window.history.pushState({}, '', url);
  }, [activeLessonId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowCommandPalette(true); }
        if (e.altKey && e.key === 's') { e.preventDefault(); setShowSettings(true); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      const metadata = LESSON_LOOKUP.find(l => l.id === activeLessonId);
      if (metadata) {
        try {
            const data = await fetchLessonContent(metadata.filename);
            setContent(data);
        } catch (error) { console.error("Data Stream Error", error); }
      }
      setLoading(false);
      setMobileMenuOpen(false);
      if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (activeLessonId && currentView === 'hub') loadLesson();
  }, [activeLessonId, currentView]);

  const handleCompletion = (xp: number) => {
      const lessonMeta = LESSON_LOOKUP.find(l => l.id === activeLessonId);
      if (!lessonMeta) return;

      setProgress(prev => {
          if (prev.history.some(h => h.itemId === activeLessonId && h.type === 'lesson')) return prev;
          return {
              ...prev,
              totalMMR: prev.totalMMR + xp,
              history: [...prev.history, { itemId: activeLessonId, type: 'lesson', timestamp: Date.now(), xpEarned: xp }]
          };
      });
  };

  const activeMetadata = LESSON_LOOKUP.find(l => l.id === activeLessonId);

  return (
    <>
    <ThreeBackground isDark={true} />
    
    {activeMetadata && (
        <MetaUpdater 
            title={activeMetadata.title}
            description={activeMetadata.description || "Master Idiomatic Rust architecture."}
        />
    )}

    {showWelcome && <WelcomeSovereignty onClose={() => setShowWelcome(false)} />}

    <div className="flex h-screen overflow-hidden text-slate-200 font-sans selection:bg-orange-500/30">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full glass-panel z-50 flex justify-between items-center p-4 border-b border-slate-700/50">
          <div className="font-bold text-orange-500 tracking-wider">RUST.HUB</div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300">{mobileMenuOpen ? '✕' : '☰'}</button>
      </div>

      {/* Sidebar HUD */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-80 glass-panel border-r border-slate-700/30 transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 shrink-0">
          <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentView('hub'); setMobileMenuOpen(false); }}>
                <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316] animate-pulse"></div>
                RUST<span className="text-slate-500 font-light">.HUB</span>
              </h1>
              {/* Selector de Idioma */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="text-[9px] font-black border border-slate-700 px-2 py-1 rounded hover:bg-slate-800 transition-colors uppercase"
              >
                  {language}
              </button>
          </div>
          
          {/* Rank Monitor */}
          <div className="mt-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 shadow-inner group relative overflow-hidden">
              <div className="flex justify-between items-baseline mb-1">
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">{t('operator_mmr')}</div>
                  <div className="text-[9px] text-orange-500 font-mono font-bold">{progress.totalMMR}</div>
              </div>
              <div className={`text-md font-black font-mono ${currentRank.color} tracking-tighter uppercase`}>{currentRank.title}</div>
              <div className="w-full bg-slate-800 h-1.5 mt-3 rounded-full overflow-hidden border border-slate-700">
                  <div className="bg-gradient-to-r from-orange-600 to-red-500 h-full transition-all duration-1000 shadow-[0_0_10px_#f97316]" style={{ width: `${Math.min(100, (progress.totalMMR / 3000) * 100)}%`}}></div>
              </div>
              {progress.totalMMR >= 3000 && (
                  <button onClick={() => setShowStaffGate(true)} className="absolute inset-0 bg-red-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 font-black text-white text-[10px] tracking-[0.2em] uppercase">
                      ⚠️ ACCESS_STAFF_GATE
                  </button>
              )}
          </div>

          <div className="flex gap-2 mt-4">
              <button onClick={() => setShowDaily(true)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[9px] font-black uppercase tracking-widest text-orange-500 transition-all">{t('daily_challenge')}</button>
              <button onClick={() => setShowSettings(true)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-400" title={`${t('settings')} (Alt+S)`}>⚙️</button>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 pb-12 overflow-y-auto custom-scrollbar">
          {CURRICULUM.tracks.map((track) => {
            const isExpanded = expandedTracks.has(track.id);
            return (
            <div key={track.id} className="mb-4">
              <button onClick={() => setExpandedTracks(p => { const n = new Set(p); isExpanded ? n.delete(track.id) : n.add(track.id); return n; })} className="w-full flex items-center justify-between group mb-1 px-2 py-1.5 rounded hover:bg-slate-800/40 transition-all">
                  <div className="flex items-center gap-2">
                    <div className={`h-[1px] w-3 ${isExpanded ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
                    <h3 className={`text-[9px] font-black uppercase tracking-widest ${isExpanded ? 'text-orange-400' : 'text-slate-500'}`}>{track.title}</h3>
                  </div>
                  <svg className={`w-2.5 h-2.5 text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={3} /></svg>
              </button>
              {isExpanded && (
                <ul className="space-y-0.5 ml-2 border-l border-slate-800/50 pl-2 animate-fade-in">
                    {track.lessons.map(lesson => {
                    const isCompleted = progress.history.some(h => h.itemId === lesson.id);
                    const isActive = activeLessonId === lesson.id && currentView === 'hub';
                    return (
                        <li key={lesson.id}>
                        <button onClick={() => { setActiveLessonId(lesson.id); setCurrentView('hub'); }} className={`w-full text-left px-3 py-2 rounded text-[11px] font-medium transition-all flex items-center justify-between ${isActive ? 'bg-orange-600/10 text-orange-400' : isCompleted ? 'text-emerald-400/80 hover:text-emerald-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}>
                            <span className="truncate">{lesson.title}</span>
                            {isCompleted && <span className="text-[10px]">✓</span>}
                        </button>
                        </li>
                    );})}
                </ul>
              )}
            </div>
          )})}
        </nav>

        {/* Global Sync Status */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 shrink-0">
             <button onClick={() => setShowGithub(true)} className="w-full flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
                <span>{t('network_status')}</span>
                <span className="text-emerald-500">{t('local_first')}</span>
             </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto pt-16 lg:pt-0 relative z-10 scroll-smooth">
        <div className="max-w-6xl mx-auto p-4 lg:p-10">
          <div className="glass-panel rounded-2xl min-h-[90vh] p-6 lg:p-12 shadow-2xl flex flex-col relative overflow-hidden border border-slate-700/40">
              
              {/* Tab Nav */}
              <div className="flex gap-10 border-b border-slate-700/30 mb-10 shrink-0">
                  <button onClick={() => setCurrentView('hub')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${currentView === 'hub' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>{t('neural_uplink')}</button>
                  <button onClick={() => setCurrentView('dashboard')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${currentView === 'dashboard' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}>{t('command_deck')}</button>
                  <button onClick={() => setShowCommandPalette(true)} className="ml-auto pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-white flex items-center gap-2"><span>🔍</span> {t('search_core')}</button>
              </div>

              {currentView === 'hub' ? (
                  loading ? (
                     <div className="flex flex-col items-center justify-center flex-1 h-full min-h-[50vh]">
                        <div className="w-20 h-20 rounded-full bg-orange-600/10 flex items-center justify-center border-2 border-orange-500/30 animate-pulse shadow-[0_0_30px_rgba(234,88,12,0.2)]">
                            <span className="text-4xl animate-bounce">🦀</span>
                        </div>
                        <h2 className="mt-8 text-xl font-black text-white tracking-[0.5em] animate-pulse">SYNCHRONIZING...</h2>
                     </div>
                  ) : content && activeMetadata ? (
                    <div className="animate-fade-in flex-1">
                      <header className="mb-10 pb-8 border-b border-slate-800/50 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 bg-slate-800 rounded text-[8px] font-black uppercase text-slate-500 border border-slate-700 tracking-widest">Sector_{activeMetadata.id.split('_')[1]}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${activeMetadata.difficulty === 'Rustacean' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-slate-600 text-slate-400'}`}>{activeMetadata.difficulty}</span>
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{activeMetadata.title}</h2>
                        </div>
                        <div className="flex gap-2">
                            <ShareButton />
                        </div>
                      </header>

                      <div className="flex-1">
                          <MarkdownRenderer 
                            content={content.markdown} 
                            onRunCode={(code) => setPlaygroundCode(code)}
                            userProgress={progress}
                          />
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-20">
                              <LessonNotes lessonId={activeLessonId} />
                              <LessonDiscussion lessonId={activeLessonId} />
                          </div>
                          <Quiz 
                            quiz={content.quiz} 
                            onComplete={() => handleCompletion(100)} 
                          />
                      </div>
                    </div>
                  ) : <div className="text-center text-red-500 mt-20 font-mono text-xs tracking-widest"># CRITICAL_FAILURE: SECTOR_CORRUPTED</div>
              ) : (
                  <Dashboard progress={progress} />
              )}

              {/* HUD Decoration */}
              <div className="absolute top-2 left-2 text-[6px] font-mono text-slate-800 pointer-events-none">SYS_MONITOR: ACTIVE // ENCRYPTED_LINK: TRUE</div>
          </div>
        </div>
      </main>
    </div>

    {/* Floating AI Agent */}
    {content && activeMetadata && (
        <AiTutor 
            currentContext={content.markdown} 
            lessonTitle={activeMetadata.title}
            model={config.model}
            onOpenSettings={() => setShowSettings(true)}
        />
    )}

    {/* Modals */}
    {playgroundCode && (
      <PlaygroundModal isOpen={true} onClose={() => setPlaygroundCode(null)} code={playgroundCode} />
    )}

    <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} onSelect={(id) => { setActiveLessonId(id); setCurrentView('hub'); }} />
    
    <DailyChallenge 
        isOpen={showDaily} 
        onClose={() => setShowDaily(false)} 
        onOpenPlayground={(code) => { setShowDaily(false); setPlaygroundCode(code); }}
        model={config.model}
        onMissingKey={() => setShowSettings(true)}
        onSolve={() => setProgress(prev => ({ ...prev, totalMMR: prev.totalMMR + 50 }))}
    />

    <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        config={config} 
        onSave={setConfig}
        isProEnabled={progress.isProEnabled}
        onActivatePro={async () => {
            await window.aistudio?.openSelectKey();
            setProgress(p => ({ ...p, isProEnabled: true }));
            setShowSettings(false);
        }}
    />

    <GithubModal 
        isOpen={showGithub} 
        onClose={() => setShowGithub(false)} 
        progress={progress}
        onSyncComplete={setProgress}
    />

    {showStaffGate && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-fade-in">
            <button onClick={() => setShowStaffGate(false)} className="absolute top-6 right-8 text-slate-500 hover:text-white z-50 font-black text-[10px] uppercase tracking-widest">{t('exit_gate')}</button>
            <StaffFinalGate 
                progress={progress} 
                onCertificationEarned={(id) => setProgress(p => ({ ...p, history: [...p.history, { itemId: id, type: 'exam', timestamp: Date.now(), xpEarned: 500 }], totalMMR: p.totalMMR + 500 }))} 
            />
        </div>
    )}
    </>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  </LanguageProvider>
);

export default App;
