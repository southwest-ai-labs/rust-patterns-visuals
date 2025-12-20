// Re-exporting from the new data architecture to maintain backward compatibility
// or to serve as the single entry point for data.

import { CURRICULUM as CURR, LESSON_LOOKUP as LOOKUP } from './src/data/curriculum';
import { CONTENT_MAP } from './src/data/contentRegistry';

export const CURRICULUM = CURR;
export const LESSON_LOOKUP = LOOKUP;
export const DEMO_CONTENT_MAP = CONTENT_MAP;
