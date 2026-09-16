// ============================================================
// MIMI & ME — Progress Manager
// ============================================================
import { ProfileManager } from './ProfileManager.js';
import { getLevelById, getNextLevel } from '../data/levels.js';
import { getWorldById } from '../data/worlds.js';

export const ProgressManager = {
  /**
   * Get the next level the active profile should play.
   */
  getNextLevelForProfile(profile) {
    if (!profile) return null;
    const completed = new Set(profile.completedLevels || []);
    const currentLevelId = profile.currentLevelId || 'learn-a';
    const current = getLevelById(currentLevelId);
    if (!current) return getLevelById('learn-a');
    if (!completed.has(currentLevelId)) return current;
    return getNextLevel(currentLevelId);
  },

  /**
   * Called after a level is completed.
   */
  completeLevel(profileId, levelId, scoreData) {
    const { stars, xp, accuracy } = scoreData;
    ProfileManager.addStars(profileId, xp);
    ProfileManager.markLevelComplete(profileId, levelId);

    // Update stats
    ProfileManager.updateStats(profileId, levelId, {
      accuracy,
      attempts: 1,
    });

    // Advance current level pointer
    const next = getNextLevel(levelId);
    if (next) {
      ProfileManager.update(profileId, { currentLevelId: next.id });
    }

    return { next };
  },

  /**
   * Check if a world is unlocked for a given profile.
   */
  isWorldUnlocked(profile, worldId) {
    const world = getWorldById(worldId);
    if (!world) return false;
    if (!world.unlocksAfter) return true; // first world is always unlocked

    // Check if previous world has enough levels completed
    const prevWorld = getWorldById(world.unlocksAfter);
    if (!prevWorld) return true;
    const prevLevels = prevWorld.levels || [];
    if (prevLevels.length === 0) return true;
    const completed = new Set(profile?.completedLevels || []);
    const completedInPrev = prevLevels.filter(lId => completed.has(lId)).length;
    return completedInPrev / prevLevels.length >= 0.8; // 80% threshold
  },

  /**
   * Get completion percentage for a world.
   */
  getWorldCompletion(profile, worldId) {
    const world = getWorldById(worldId);
    if (!world || !world.levels?.length) return 0;
    const completed = new Set(profile?.completedLevels || []);
    const done = world.levels.filter(lId => completed.has(lId)).length;
    return Math.round((done / world.levels.length) * 100);
  },

  /**
   * Get session stats summary for parent dashboard.
   */
  getParentStats(profile) {
    if (!profile) return null;
    const sessions = profile.stats?.sessionTimes || [];
    const avgMs = sessions.length
      ? sessions.reduce((a, s) => a + (s.durationMs || 0), 0) / sessions.length
      : 0;

    return {
      lettersLearned: (profile.lettersLearned || []).length,
      numbersLearned: (profile.numbersLearned || []).length,
      additionAccuracy: profile.stats?.mathAccuracy?.addition ?? null,
      subtractionAccuracy: profile.stats?.mathAccuracy?.subtraction ?? null,
      avgSessionMinutes: Math.round(avgMs / 60000),
      achievementCount: (profile.achievements || []).length,
    };
  },
};
