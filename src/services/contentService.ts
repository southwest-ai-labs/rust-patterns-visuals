
import { DEMO_CONTENT_MAP } from '../constants';
import { LessonContent } from '../types';
import { LESSON_LOOKUP } from '../data/curriculum';
import { QUIZ_REGISTRY } from '../data/quizzes/index';

type LocalizedMarkdown = string | { en: string; es: string };

const resolveMarkdownForLanguage = (value: LocalizedMarkdown | undefined, language: 'en' | 'es'): string => {
    if (!value) return "# Content not found\nSorry, this lesson is not available in the demo.";
    if (typeof value === 'string') return value;
    return value[language] || value.en || value.es;
};

export const fetchLessonContent = async (filename: string, language: 'en' | 'es' = 'en'): Promise<LessonContent> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get Raw Markdown
    let markdown = resolveMarkdownForLanguage((DEMO_CONTENT_MAP as Record<string, LocalizedMarkdown>)[filename], language);

    // Clean legacy quizzes from markdown if they exist
    const legacySplit = markdown.split("<!-- QUIZ START -->");
    markdown = legacySplit[0];

    // Look up the specific lesson metadata to see if a Quiz Module is attached
    const lessonMeta = LESSON_LOOKUP.find(l => l.filename === filename);

    // Resolve Quiz from Registry
    const quiz = (lessonMeta && lessonMeta.quizId && QUIZ_REGISTRY[lessonMeta.quizId])
        ? QUIZ_REGISTRY[lessonMeta.quizId]
        : null;

    return {
        markdown,
        quiz
    };
};
