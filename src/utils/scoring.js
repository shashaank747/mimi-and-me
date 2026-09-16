// ============================================================
// MIMI & ME — Scoring Engine
// Time has the LOWEST weight. Speed never pressures young children.
// ============================================================

/**
 * Calculate star rating (1–3) from session stats.
 * @param {Object} stats
 * @param {number} stats.correct    - correct answers
 * @param {number} stats.total      - total questions
 * @param {number} stats.hints      - hints used
 * @param {number} stats.mistakes   - wrong attempts
 * @param {number} stats.timeMs     - time taken in ms
 * @param {number} stats.timeLimitMs- allowed time (null = no limit)
 * @returns {{ stars: 1|2|3, xp: number, accuracy: number }}
 */
export function calculateScore({ correct, total, hints = 0, mistakes = 0, timeMs = 0, timeLimitMs = null }) {
  if (total === 0) return { stars: 1, xp: 10, accuracy: 0 };

  const accuracy = correct / total; // 0–1

  // Base score from accuracy (weight: highest)
  let score = accuracy * 70;

  // Hint penalty (weight: medium) — max -10
  score -= Math.min(hints * 3, 10);

  // Mistake penalty (weight: medium, gentle) — max -10
  score -= Math.min(mistakes * 2, 10);

  // Time bonus (weight: lowest) — only applies if time limit exists, max +10
  if (timeLimitMs && timeMs > 0) {
    const timeRatio = Math.min(timeMs / timeLimitMs, 1);
    const timeBonus = (1 - timeRatio) * 10; // faster = small bonus
    score += timeBonus;
  }

  score = Math.max(0, Math.min(100, score));

  let stars;
  if (score >= 85)      stars = 3;
  else if (score >= 60) stars = 2;
  else                  stars = 1;

  // XP earned
  const xp = Math.round(10 + stars * 10 + accuracy * 20);

  return { stars, xp, accuracy: Math.round(accuracy * 100) };
}

/**
 * Check if this attempt is a personal best.
 * @param {number} newAccuracy - 0–100
 * @param {number|undefined} prevBest - previous best accuracy (0–100)
 */
export function isPersonalBest(newAccuracy, prevBest) {
  if (prevBest === undefined || prevBest === null) return true;
  return newAccuracy > prevBest;
}

/**
 * Calculate streak message for display.
 */
export function getStreakMessage(streak) {
  if (streak >= 20) return '🔥 SUPER STREAK!';
  if (streak >= 10) return '🎯 Great streak!';
  if (streak >= 5)  return '⭐ Nice streak!';
  return null;
}
