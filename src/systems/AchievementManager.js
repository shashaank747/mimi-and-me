// ============================================================
// MIMI & ME — Achievement Manager (centralized, data-driven)
// ============================================================
import { ACHIEVEMENTS } from '../data/achievements.js';
import { ProfileManager } from './ProfileManager.js';

/**
 * Check all achievements against the current profile state.
 * Returns list of newly unlocked achievement IDs.
 */
export function checkAchievements(profile) {
  const newlyUnlocked = [];
  const already = profile.achievements || [];

  for (const achievement of ACHIEVEMENTS) {
    if (already.includes(achievement.id)) continue;

    if (evaluateCondition(achievement.condition, profile)) {
      const unlocked = ProfileManager.unlockAchievement(profile.id, achievement.id);
      if (unlocked) {
        // Apply reward
        if (achievement.reward?.stars) {
          ProfileManager.addStars(profile.id, achievement.reward.stars);
        }
        if (achievement.reward?.sticker) {
          ProfileManager.unlockSticker(profile.id, achievement.reward.sticker);
        }
        newlyUnlocked.push(achievement.id);
      }
    }
  }

  return newlyUnlocked;
}

function evaluateCondition(condition, profile) {
  if (condition.levelsCompleted !== undefined) {
    return (profile.completedLevels?.length || 0) >= condition.levelsCompleted;
  }
  if (condition.lettersLearned !== undefined) {
    return (profile.lettersLearned?.length || 0) >= condition.lettersLearned;
  }
  if (condition.numbersLearned !== undefined) {
    return (profile.numbersLearned?.length || 0) >= condition.numbersLearned;
  }
  if (condition.streak !== undefined) {
    return (profile.stats?.maxStreak || 0) >= condition.streak;
  }
  if (condition.personalBest) {
    // Checked externally — passed in as a flag
    return false;
  }
  if (condition.perfectLevel) {
    // Checked externally after a perfect run
    return false;
  }
  return false;
}

export const AchievementManager = {
  check: checkAchievements,
  getAll: () => ACHIEVEMENTS,
  getById: (id) => ACHIEVEMENTS.find(a => a.id === id),
};
