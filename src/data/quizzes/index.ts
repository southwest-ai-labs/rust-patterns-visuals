
import { quiz_advanced_ownership } from './advanced_ownership';
import { quiz_async_pro } from './async_pro';
import { quiz_web_architecture } from './web_architecture';
import { quiz_domain_patterns } from './domain_patterns';
import { quiz_quality_assurance } from './quality_assurance';
import { quiz_unsafe_internals } from './unsafe_internals';
import { quiz_foundation } from './foundation';
import { quiz_mastery_final } from './mastery_final';
import { QuizModule } from '../../types';

export const QUIZ_REGISTRY: Record<string, QuizModule> = {
  'quiz_adv_own_01': quiz_advanced_ownership,
  'quiz_async_01': quiz_async_pro,
  'quiz_web_arch_01': quiz_web_architecture,
  'quiz_domain_01': quiz_domain_patterns,
  'quiz_qa_01': quiz_quality_assurance,
  'quiz_unsafe_01': quiz_unsafe_internals,
  'quiz_foundation_01': quiz_foundation,
  'quiz_mastery_final': quiz_mastery_final,
};
