import { DEMO_CONTENT_MAP } from '../constants'; // Still using constants as the bridge, or could import directly from data
import { LessonContent, QuizQuestion } from '../types';

export const fetchLessonContent = async (filename: string): Promise<LessonContent> => {
    // In a real implementation:
    // const response = await fetch(`/content/${filename}`);
    // const text = await response.text();
    
    // For this demo, we simulate fetch latency and use the map
    await new Promise(resolve => setTimeout(resolve, 300)); // 300ms network sim
    
    const text = DEMO_CONTENT_MAP[filename] || "# Content not found\nSorry, this lesson is not available in the demo.";
    
    return parseLessonContent(text);
};

const parseLessonContent = (rawText: string): LessonContent => {
    const quizSeparator = "<!-- QUIZ START -->";
    const parts = rawText.split(quizSeparator);
    
    const markdown = parts[0];
    const quizRaw = parts.length > 1 ? parts[1] : '';
    
    return {
        markdown,
        quiz: parseQuiz(quizRaw)
    };
};

const parseQuiz = (quizText: string): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    const rawQuestions = quizText.split('[?]').filter(q => q.trim().length > 0);
    
    rawQuestions.forEach((block, index) => {
        const lines = block.trim().split('\n');
        const questionText = lines[0].trim();
        const optionsLines = lines.slice(1);
        
        const options = optionsLines
            .filter(line => line.includes('[ ]') || line.includes('[x]'))
            .map((line, optIdx) => {
                const isCorrect = line.includes('[x]');
                const text = line.replace(/\[\s?x?\s?\]/, '').trim();
                return {
                    id: `q${index}_o${optIdx}`,
                    text,
                    isCorrect
                };
            });
            
        if (questionText && options.length > 0) {
            questions.push({
                id: `q${index}`,
                question: questionText,
                options
            });
        }
    });
    
    return questions;
};
