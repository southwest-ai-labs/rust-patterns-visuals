
import { DEMO_CONTENT_MAP } from '../constants';
import { LessonContent } from '../types';
import { LESSON_LOOKUP } from '../data/curriculum';
import { QUIZ_REGISTRY } from '../data/quizzes/index';

export const fetchLessonContent = async (filename: string): Promise<LessonContent> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get Raw Markdown
    let markdown = DEMO_CONTENT_MAP[filename] || "# Content not found\nSorry, this lesson is not available in the demo.";
    
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
