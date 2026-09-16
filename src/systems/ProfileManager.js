// ============================================================
// MIMI & ME — Profile Manager
// ============================================================
import { generateId } from '../utils/random.js';
import { getAllProfiles, saveProfile, deleteProfile, setActiveProfile, getActiveProfile, getProfileById } from '../utils/storage.js';

const createEmptyProfile = ({ name, age, className = '', parentName = '' }) => ({
  id: generateId(),
  name,
  age,
  className,
  parentName,
  avatarEmoji: '🐰', // default avatar

  // Learning progress
  lettersLearned: [],          // ['A', 'B', ...]
  lettersMastered: [],
  numbersLearned: [],          // [1, 2, 3, ...]
  numbersMastered: [],

  // Level completion
  completedLevels: [],         // ['learn-a', 'play-a', ...]
  currentWorldId: 'letter-forest',
  currentLevelId: 'learn-a',

  // Gamification
  stars: 0,
  achievements: [],            // ['first-step', ...]
  stickers: [],
  outfitItems: [],
  equippedOutfit: { hat: null, glasses: null, bag: 'mini-backpack', shoes: null, clothes: null },
  roomItems: [],

  // Stats (per level/activity)
  stats: {
    accuracy: {},              // { 'learn-a': 92, ... }
    attempts: {},              // { 'play-a': 3, ... }
    streak: 0,
    maxStreak: 0,
    personalBest: {},          // { 'play-a': 88, ... }
    sessionTimes: [],          // [{ date, durationMs }, ...]
    mathAccuracy: {
      addition: null,
      subtraction: null,
      multiplication: null,
      division: null,
    },
  },

  createdAt: new Date().toISOString(),
  lastPlayed: new Date().toISOString(),
});

export const ProfileManager = {
  create(data) {
    const profile = createEmptyProfile(data);
    saveProfile(profile);
    return profile;
  },

  getAll: getAllProfiles,

  getById: getProfileById,

  getActive: getActiveProfile,

  setActive: setActiveProfile,

  delete: deleteProfile,

  update(id, updates) {
    const profile = getProfileById(id);
    if (!profile) return null;
    const updated = { ...profile, ...updates, lastPlayed: new Date().toISOString() };
    saveProfile(updated);
    return updated;
  },

  addStars(id, amount) {
    const profile = getProfileById(id);
    if (!profile) return;
    this.update(id, { stars: (profile.stars || 0) + amount });
  },

  markLevelComplete(id, levelId) {
    const profile = getProfileById(id);
    if (!profile) return;
    const completedLevels = [...new Set([...(profile.completedLevels || []), levelId])];
    this.update(id, { completedLevels });
  },

  markLetterLearned(id, letter) {
    const profile = getProfileById(id);
    if (!profile) return;
    const lettersLearned = [...new Set([...(profile.lettersLearned || []), letter])];
    this.update(id, { lettersLearned });
  },

  markLetterMastered(id, letter) {
    const profile = getProfileById(id);
    if (!profile) return;
    const lettersMastered = [...new Set([...(profile.lettersMastered || []), letter])];
    const lettersLearned = [...new Set([...(profile.lettersLearned || []), letter])];
    this.update(id, { lettersMastered, lettersLearned });
  },

  markNumberLearned(id, number) {
    const profile = getProfileById(id);
    if (!profile) return;
    const numbersLearned = [...new Set([...(profile.numbersLearned || []), number])];
    this.update(id, { numbersLearned });
  },

  updateStats(id, levelId, { accuracy, attempts, streak }) {
    const profile = getProfileById(id);
    if (!profile) return;
    const stats = { ...profile.stats };
    if (accuracy !== undefined) stats.accuracy = { ...stats.accuracy, [levelId]: accuracy };
    if (attempts !== undefined) stats.attempts = { ...stats.attempts, [levelId]: (stats.attempts[levelId] || 0) + attempts };
    if (streak !== undefined) {
      stats.streak = streak;
      stats.maxStreak = Math.max(stats.maxStreak || 0, streak);
    }
    // Personal best
    const prev = stats.personalBest[levelId];
    if (accuracy !== undefined && (prev === undefined || accuracy > prev)) {
      stats.personalBest = { ...stats.personalBest, [levelId]: accuracy };
    }
    this.update(id, { stats });
  },

  unlockAchievement(id, achievementId) {
    const profile = getProfileById(id);
    if (!profile) return false;
    if ((profile.achievements || []).includes(achievementId)) return false; // already unlocked
    const achievements = [...(profile.achievements || []), achievementId];
    this.update(id, { achievements });
    return true;
  },

  unlockSticker(id, stickerId) {
    const profile = getProfileById(id);
    if (!profile) return;
    const stickers = [...new Set([...(profile.stickers || []), stickerId])];
    this.update(id, { stickers });
  },
};
