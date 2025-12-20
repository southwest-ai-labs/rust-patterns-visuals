export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Rustacean';

export interface LessonMetadata {
  id: string;
  title: string;
  description?: string;
  filename: string;
  difficulty: DifficultyLevel;
  readTime?: string;
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
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
}

export interface LessonContent {
  markdown: string;
  quiz: QuizQuestion[];
}