// ============================================================
// MIMI & ME — Skill Assessment Framework
// Feels like a game, not an exam. Mimi guides it.
// Classifies: Unknown → LEARN | Partial → PRACTICE | Known → PLAY
// ============================================================
import { LETTERS } from '../data/letters.js';
import { shuffle, pickRandom } from '../utils/random.js';

const ASSESSMENT_QUESTIONS_PER_AREA = 5;

/**
 * Generate a small assessment quiz for a given subject.
 * @param {'letters'|'numbers'} subject
 * @returns {Array} questions
 */
export function generateAssessmentQuestions(subject) {
  if (subject === 'letters') {
    // Pick 5 random letters to test recognition
    const sample = pickRandom(LETTERS, ASSESSMENT_QUESTIONS_PER_AREA);
    return sample.map(letterData => {
      const distractors = LETTERS
        .filter(l => l.letter !== letterData.letter)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      const choices = shuffle([letterData, ...distractors]);
      return {
        type: 'letter-recognition',
        target: letterData.letter,
        targetData: letterData,
        choices,
        mimiSays: `Which one is ${letterData.letter}?`,
      };
    });
  }
  // Numbers — placeholder for Phase 3
  return [];
}

/**
 * Classify results into placement.
 * @param {number} correct - number of correct answers
 * @param {number} total   - total questions
 * @returns {'LEARN'|'PRACTICE'|'PLAY'}
 */
export function classifyPlacement(correct, total) {
  if (total === 0) return 'LEARN';
  const ratio = correct / total;
  if (ratio >= 0.8) return 'PLAY';
  if (ratio >= 0.4) return 'PRACTICE';
  return 'LEARN';
}

export const SkillAssessment = {
  generateQuestions: generateAssessmentQuestions,
  classify: classifyPlacement,
  QUESTIONS_PER_AREA: ASSESSMENT_QUESTIONS_PER_AREA,
};
