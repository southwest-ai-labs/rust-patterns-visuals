import { CompletionEvent, DifficultyLevel, UserProgress, CompletionType } from '../types';
import { LESSON_LOOKUP } from '../constants';

const XP_TABLE = {
    'Beginner': 10,
    'Intermediate': 30,
    'Rustacean': 50,
    'Daily': 100,
    'Exam': 200,
    'Failure': -20,
    'DecayPerDay': -5
};

const STREAK_BONUS_MULTIPLIER = 0.1;

export const currentRank = (mmr: number) => {
    if (mmr < 100) return { title: 'Initiate', color: 'text-slate-400' };
    if (mmr < 500) return { title: 'Ferris Fan', color: 'text-blue-400' };
    if (mmr < 1000) return { title: 'Apprentice', color: 'text-amber-400' };
    if (mmr < 2500) return { title: 'Journeyman', color: 'text-orange-400' };
    if (mmr < 3000) return { title: 'Grand Rustacean', color: 'text-red-500 font-bold' };
    return { title: 'SYSTEM ARCHITECT', color: 'text-red-600 font-black animate-pulse' };
};

export const getBadges = (progress: UserProgress): string[] => {
    const badges: string[] = [];
    if (progress.currentStreak >= 30) badges.push('Unstoppable Streak');
    if (progress.totalMMR >= 3000) badges.push('L5 Visionary');
    
    // Check for seasonal badges in history
    const architectEvent = progress.history.find(h => h.itemId === 'GENESIS_ARCHITECT_S1');
    if (architectEvent) badges.push('Season 1: Genesis Architect');
    
    return badges;
};

export const calculateLessonXP = (lessonId: string): number => {
    const lesson = LESSON_LOOKUP.find(l => l.id === lessonId);
    if (!lesson) return 10;
    return XP_TABLE[lesson.difficulty] || 10;
};

export const getDailyXP = () => XP_TABLE['Daily'];

// Fix: Add calculateSeasonalScore to track weekly and monthly performance
export const calculateSeasonalScore = (progress: UserProgress) => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    let weeklyScore = 0;
    let monthlyScore = 0;

    progress.history.forEach(event => {
        if (now - event.timestamp < oneWeek) {
            weeklyScore += event.xpEarned;
        }
        if (now - event.timestamp < oneMonth) {
            monthlyScore += event.xpEarned;
        }
    });

    return { weeklyScore, monthlyScore };
};

export const addCompletion = (
    currentProgress: UserProgress, 
    itemId: string, 
    type: CompletionType,
    xpOverride?: number
): UserProgress => {
    const now = Date.now();
    let xp = xpOverride ?? (type === 'lesson' ? calculateLessonXP(itemId) : (type === 'failure' ? XP_TABLE.Failure : getDailyXP()));
    let streak = currentProgress.currentStreak;
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = Math.abs(now - (currentProgress.lastActive || 0));
    
    if (type !== 'failure') {
        if (diffTime < oneDay * 2) {
            if (new Date(now).toDateString() !== new Date(currentProgress.lastActive || 0).toDateString()) streak += 1;
        } else streak = 1;
        if (xp > 0 && streak > 1) {
            xp += Math.floor(xp * Math.min(0.5, streak * STREAK_BONUS_MULTIPLIER));
        }
    }

    return {
        ...currentProgress,
        history: [...currentProgress.history, { itemId, type, timestamp: now, xpEarned: xp }],
        totalMMR: Math.max(0, currentProgress.totalMMR + xp),
        lastActive: now,
        currentStreak: streak
    };
};