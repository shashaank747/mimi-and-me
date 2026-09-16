// ============================================================
// MIMI & ME — Difficulty Manager
// Age sets INITIAL content range/UI complexity only.
// Actual difficulty adapts from REAL performance.
// Two same-age children can have completely different abilities.
// ============================================================

const DIFFICULTY_LEVELS = {
  EASY:   { label: 'Easy',   choices: 2, showPicture: true,  hintDelay: 3000, timeMultiplier: 2.0 },
  MEDIUM: { label: 'Medium', choices: 3, showPicture: true,  hintDelay: 5000, timeMultiplier: 1.5 },
  HARD:   { label: 'Hard',   choices: 4, showPicture: false, hintDelay: 8000, timeMultiplier: 1.0 },
};

/**
 * Get initial UI settings based on age alone (NOT difficulty).
 * Age only determines: font size, touch target size, whether to show tracing.
 */
export function getAgeUIConfig(age) {
  if (age <= 4) return { showTracing: true, fontSize: 'xl',  tapSize: 'xl',   showEmojiHint: true };
  if (age <= 6) return { showTracing: true, fontSize: 'lg',  tapSize: 'large',showEmojiHint: true };
  return           { showTracing: false, fontSize: 'md', tapSize: 'normal',showEmojiHint: false };
}

/**
 * Compute current difficulty level from performance history.
 * @param {Object} stats - profile.stats
 * @returns {'EASY'|'MEDIUM'|'HARD'}
 */
export function computeDifficulty(stats) {
  const accuracyValues = Object.values(stats?.accuracy || {});
  if (accuracyValues.length < 3) return 'EASY'; // not enough data yet

  const recent = accuracyValues.slice(-5); // last 5 levels
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;

  if (avg >= 85) return 'HARD';
  if (avg >= 60) return 'MEDIUM';
  return 'EASY';
}

/**
 * Get the full difficulty config object.
 */
export function getDifficultyConfig(stats) {
  const level = computeDifficulty(stats);
  return { level, ...DIFFICULTY_LEVELS[level] };
}

export const DifficultyManager = {
  getAgeUIConfig,
  computeDifficulty,
  getDifficultyConfig,
  LEVELS: DIFFICULTY_LEVELS,
};
