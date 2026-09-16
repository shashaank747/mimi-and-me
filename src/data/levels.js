// ============================================================
// MIMI & ME — Levels Data (Complete A–Z Curriculum)
// ============================================================
import { LETTERS, getLetterData, getLetterDistractors } from './letters.js';

// Base levels array with comprehensive Letter Forest curriculum
const GENERATED_LEVELS = [
  // ── Tutorial ──
  {
    id: 'tutorial-1',
    type: 'learn',
    world: 'mimis-home',
    subject: 'tutorial',
    title: "Let's Meet Mimi!",
    difficulty: 1,
    hintsEnabled: true,
    storyBefore: "Hi! I'm Mimi! Let's go on an adventure together!",
  },
];

// Generate comprehensive levels for all 26 letters (A–Z)
LETTERS.forEach((l, idx) => {
  const char = l.letter.toLowerCase();
  const world = idx < 7 ? 'letter-forest' : (idx < 14 ? 'sunny-meadow' : 'little-village');
  const distractors = getLetterDistractors(l.letter, 2).map(d => d.letter);
  const choices = [l.letter, ...distractors].sort(() => Math.random() - 0.5);

  // 1. Learn Mode
  GENERATED_LEVELS.push({
    id: `learn-${char}`,
    type: 'learn',
    world,
    subject: 'letters',
    target: l.letter,
    difficulty: 1,
    hintsEnabled: true,
    storyBefore: idx === 0 ? "Oh no! Glitch scattered the letters! Help me find them!" : `Let's discover the letter ${l.letter}!`,
  });

  // 2. Tracing Mode
  GENERATED_LEVELS.push({
    id: `trace-${char}`,
    type: 'trace',
    world,
    subject: 'letters',
    target: l.letter,
    difficulty: 1,
    hintsEnabled: true,
  });

  // 3. Practice Recognition
  GENERATED_LEVELS.push({
    id: `practice-${char}-recognition`,
    type: 'practice-recognition',
    world,
    subject: 'letters',
    target: l.letter,
    choices,
    difficulty: 1,
    hintsEnabled: true,
  });

  // 4. Practice Matching (Capital ↔ Lowercase)
  GENERATED_LEVELS.push({
    id: `practice-${char}-matching`,
    type: 'practice-matching',
    world,
    subject: 'letters',
    target: l.letter,
    difficulty: 1,
    hintsEnabled: true,
  });

  // 5. Practice Picture
  GENERATED_LEVELS.push({
    id: `practice-${char}-picture`,
    type: 'practice-picture',
    world,
    subject: 'letters',
    target: l.letter,
    choices,
    difficulty: 1,
    hintsEnabled: true,
  });

  // 6. Practice Missing Letter
  GENERATED_LEVELS.push({
    id: `practice-${char}-missing`,
    type: 'practice-missing',
    world,
    subject: 'letters',
    target: l.letter,
    choices,
    difficulty: 1,
    hintsEnabled: true,
  });

  // 7. Play Hunt Mode
  GENERATED_LEVELS.push({
    id: `play-${char}`,
    type: 'play-hunt',
    world,
    subject: 'letters',
    target: l.letter,
    difficulty: 1,
    hintsEnabled: true,
    itemCount: 8,
    targetCount: 3,
  });
});

// Letter Sequence Mini-games
GENERATED_LEVELS.push(
  {
    id: 'play-sequence-a-e',
    type: 'play-sequence',
    world: 'letter-forest',
    subject: 'letters',
    target: 'A-E',
    letters: ['A', 'B', 'C', 'D', 'E'],
    difficulty: 1,
    hintsEnabled: true,
  },
  {
    id: 'play-sequence-f-j',
    type: 'play-sequence',
    world: 'letter-forest',
    subject: 'letters',
    target: 'F-J',
    letters: ['F', 'G', 'H', 'I', 'J'],
    difficulty: 1,
    hintsEnabled: true,
  },
  {
    id: 'play-sequence-k-o',
    type: 'play-sequence',
    world: 'sunny-meadow',
    subject: 'letters',
    target: 'K-O',
    letters: ['K', 'L', 'M', 'N', 'O'],
    difficulty: 2,
    hintsEnabled: true,
  },
  {
    id: 'play-sequence-a-z',
    type: 'play-sequence',
    world: 'glitchs-castle',
    subject: 'letters',
    target: 'A-Z',
    letters: LETTERS.slice(0, 10).map(l => l.letter),
    difficulty: 3,
    hintsEnabled: true,
  }
);

export const LEVELS = GENERATED_LEVELS;

export const getLevelById = (id) => {
  if (!id) return null;
  const direct = LEVELS.find(l => l.id === id);
  if (direct) return direct;

  // Dynamic fallback for any letter mode request:
  // e.g. 'learn-m', 'trace-k', 'practice-g', 'play-z'
  const match = id.match(/^(learn|trace|practice|play)-([a-z])(-recognition|-matching|-picture|-missing)?$/);
  if (match) {
    const [, mode, char, subMode] = match;
    const letterObj = getLetterData(char.toUpperCase());
    if (letterObj) {
      const target = letterObj.letter;
      const distractors = getLetterDistractors(target, 2).map(d => d.letter);
      const choices = [target, ...distractors].sort(() => Math.random() - 0.5);

      if (mode === 'learn') {
        return { id, type: 'learn', world: 'letter-forest', subject: 'letters', target, difficulty: 1, hintsEnabled: true };
      }
      if (mode === 'trace') {
        return { id, type: 'trace', world: 'letter-forest', subject: 'letters', target, difficulty: 1, hintsEnabled: true };
      }
      if (mode === 'practice') {
        const type = subMode ? `practice${subMode}` : 'practice-recognition';
        return { id, type, world: 'letter-forest', subject: 'letters', target, choices, difficulty: 1, hintsEnabled: true };
      }
      if (mode === 'play') {
        return { id, type: 'play-hunt', world: 'letter-forest', subject: 'letters', target, difficulty: 1, hintsEnabled: true, itemCount: 8, targetCount: 3 };
      }
    }
  }

  return null;
};

export const getLevelsForWorld = (worldId) =>
  LEVELS.filter(l => l.world === worldId);

export const getNextLevel = (currentLevelId) => {
  const idx = LEVELS.findIndex(l => l.id === currentLevelId);
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
};
