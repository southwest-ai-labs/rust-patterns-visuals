
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Rustacean';

export type EngineeringLevel = 1 | 2 | 3 | 4 | 5;

export interface LessonMetadata {
  id: string;
  title: string;
  description?: string;
  filename: string;
  difficulty: DifficultyLevel;
  readTime?: string;
  quizId?: string;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  lessons: LessonMetadata[];
}

export interface Curriculum {
  tracks: Track[];
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  level: EngineeringLevel;
  points: number;
  question: string;
  codeSnippet?: string;
  options: QuizOption[];
  explanation: string;
}

export interface QuizModule {
  id: string;
  title: string;
  minPassScore: number;
  timeLimitSeconds?: number;
  questions: Question[];
}

export interface LessonContent {
  markdown: string;
  quiz: QuizModule | null;
}

export type CompletionType = 'lesson' | 'daily_challenge' | 'exam' | 'decay' | 'failure' | 'ai_dynamic_test';

export interface CompletionEvent {
  itemId: string;
  type: CompletionType;
  timestamp: number;
  xpEarned: number;
}

export interface UserProgress {
  history: CompletionEvent[];
  totalMMR: number;
  lastActive: number;
  currentStreak: number;
  isProEnabled: boolean;
}

export interface AIDynamicChallenge {
  title: string;
  scenario: string;
  starterCode: string;
  constraints: string[];
}

// Global augmentation for environment-provided APIs.
declare global {
  // Removed explicit AIStudio interface definition to resolve "Duplicate identifier" errors,
  // as hasSelectedApiKey and openSelectKey are already provided by the execution environment.

  interface Window {
    translation?: {
      canTranslate(options: { sourceLanguage: string; targetLanguage: string }): Promise<'no' | 'readily' | 'after-download'>;
      createTranslator(options: { sourceLanguage: string; targetLanguage: string }): Promise<any>;
    };
    /**
     * Fix: Use the global AIStudio type provided by the environment.
     * This resolves type mismatch and modifier errors on the Window augmentation.
     */
    aistudio?: AIStudio;
  }
}
