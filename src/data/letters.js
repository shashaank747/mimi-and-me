// ============================================================
// MIMI & ME — Letters Data (A–Z) with Tracing & Phonics
// ============================================================

export const LETTERS = [
  {
    letter: 'A', lowercase: 'a', word: 'Apple', emoji: '🍎', color: '#FF6B6B',
    phonics: 'ah', sentence: 'A is for sweet Apple!', isVowel: true,
    tracingPath: 'M 30 90 L 60 20 L 90 90 M 45 65 L 75 65',
    waypoints: [{ x: 30, y: 90 }, { x: 45, y: 55 }, { x: 60, y: 20 }, { x: 75, y: 55 }, { x: 90, y: 90 }, { x: 45, y: 65 }, { x: 75, y: 65 }],
  },
  {
    letter: 'B', lowercase: 'b', word: 'Ball', emoji: '⚽', color: '#4ECDC4',
    phonics: 'buh', sentence: 'B is for bouncy Ball!', isVowel: false,
    tracingPath: 'M 35 20 L 35 90 M 35 20 C 65 20, 65 55, 35 55 C 70 55, 70 90, 35 90',
    waypoints: [{ x: 35, y: 20 }, { x: 35, y: 55 }, { x: 35, y: 90 }, { x: 60, y: 35 }, { x: 35, y: 55 }, { x: 65, y: 72 }, { x: 35, y: 90 }],
  },
  {
    letter: 'C', lowercase: 'c', word: 'Cat', emoji: '🐱', color: '#FFE66D',
    phonics: 'kuh', sentence: 'C is for cute Cat!', isVowel: false,
    tracingPath: 'M 85 35 C 70 15, 35 20, 35 55 C 35 90, 70 95, 85 75',
    waypoints: [{ x: 85, y: 35 }, { x: 55, y: 20 }, { x: 35, y: 55 }, { x: 55, y: 90 }, { x: 85, y: 75 }],
  },
  {
    letter: 'D', lowercase: 'd', word: 'Dog', emoji: '🐶', color: '#FF8C42',
    phonics: 'duh', sentence: 'D is for friendly Dog!', isVowel: false,
    tracingPath: 'M 35 20 L 35 90 M 35 20 C 80 20, 80 90, 35 90',
    waypoints: [{ x: 35, y: 20 }, { x: 35, y: 55 }, { x: 35, y: 90 }, { x: 65, y: 35 }, { x: 75, y: 55 }, { x: 65, y: 75 }, { x: 35, y: 90 }],
  },
  {
    letter: 'E', lowercase: 'e', word: 'Elephant', emoji: '🐘', color: '#A855F7',
    phonics: 'eh', sentence: 'E is for big Elephant!', isVowel: true,
    tracingPath: 'M 80 20 L 35 20 L 35 90 L 80 90 M 35 55 L 70 55',
    waypoints: [{ x: 80, y: 20 }, { x: 35, y: 20 }, { x: 35, y: 55 }, { x: 35, y: 90 }, { x: 80, y: 90 }, { x: 35, y: 55 }, { x: 70, y: 55 }],
  },
  {
    letter: 'F', lowercase: 'f', word: 'Fish', emoji: '🐟', color: '#38BDF8',
    phonics: 'fuh', sentence: 'F is for swift Fish!', isVowel: false,
    tracingPath: 'M 80 20 L 35 20 L 35 90 M 35 55 L 70 55',
    waypoints: [{ x: 80, y: 20 }, { x: 35, y: 20 }, { x: 35, y: 55 }, { x: 35, y: 90 }, { x: 35, y: 55 }, { x: 70, y: 55 }],
  },
  {
    letter: 'G', lowercase: 'g', word: 'Grapes', emoji: '🍇', color: '#8B5CF6',
    phonics: 'guh', sentence: 'G is for juicy Grapes!', isVowel: false,
    tracingPath: 'M 85 35 C 70 15, 35 20, 35 55 C 35 90, 75 90, 85 70 L 85 55 L 60 55',
    waypoints: [{ x: 85, y: 35 }, { x: 55, y: 20 }, { x: 35, y: 55 }, { x: 55, y: 90 }, { x: 85, y: 70 }, { x: 85, y: 55 }, { x: 60, y: 55 }],
  },
  {
    letter: 'H', lowercase: 'h', word: 'House', emoji: '🏠', color: '#F59E0B',
    phonics: 'huh', sentence: 'H is for cozy House!', isVowel: false,
    tracingPath: 'M 35 20 L 35 90 M 85 20 L 85 90 M 35 55 L 85 55',
    waypoints: [{ x: 35, y: 20 }, { x: 35, y: 90 }, { x: 85, y: 20 }, { x: 85, y: 90 }, { x: 35, y: 55 }, { x: 85, y: 55 }],
  },
  {
    letter: 'I', lowercase: 'i', word: 'Ice Cream', emoji: '🍦', color: '#F472B6',
    phonics: 'ih', sentence: 'I is for yummy Ice Cream!', isVowel: true,
    tracingPath: 'M 35 20 L 85 20 M 60 20 L 60 90 M 35 90 L 85 90',
    waypoints: [{ x: 35, y: 20 }, { x: 85, y: 20 }, { x: 60, y: 20 }, { x: 60, y: 90 }, { x: 35, y: 90 }, { x: 85, y: 90 }],
  },
  {
    letter: 'J', lowercase: 'j', word: 'Jellyfish', emoji: '🪼', color: '#6EE7B7',
    phonics: 'juh', sentence: 'J is for glowing Jellyfish!', isVowel: false,
    tracingPath: 'M 40 20 L 80 20 M 65 20 L 65 75 C 65 92, 35 92, 35 75',
    waypoints: [{ x: 40, y: 20 }, { x: 80, y: 20 }, { x: 65, y: 20 }, { x: 65, y: 75 }, { x: 50, y: 90 }, { x: 35, y: 75 }],
  },
  {
    letter: 'K', lowercase: 'k', word: 'Kite', emoji: '🪁', color: '#34D399',
    phonics: 'kuh', sentence: 'K is for high flying Kite!', isVowel: false,
    tracingPath: 'M 35 20 L 35 90 M 85 20 L 35 55 L 85 90',
    waypoints: [{ x: 35, y: 20 }, { x: 35, y: 90 }, { x: 85, y: 20 }, { x: 35, y: 55 }, { x: 85, y: 90 }],
  },
  {
    letter: 'L', lowercase: 'l', word: 'Lion', emoji: '🦁', color: '#FBBF24',
    phonics: 'luh', sentence: 'L is for brave Lion!', isVowel: false,
    tracingPath: 'M 35 20 L 35 90 L 85 90',
    waypoints: [{ x: 35, y: 20 }, { x: 35, y: 55 }, { x: 35, y: 90 }, { x: 60, y: 90 }, { x: 85, y: 90 }],
  },
  {
    letter: 'M', lowercase: 'm', word: 'Monkey', emoji: '🐒', color: '#FB923C',
    phonics: 'muh', sentence: 'M is for playful Monkey!', isVowel: false,
    tracingPath: 'M 30 90 L 30 20 L 60 60 L 90 20 L 90 90',
    waypoints: [{ x: 30, y: 90 }, { x: 30, y: 20 }, { x: 60, y: 60 }, { x: 90, y: 20 }, { x: 90, y: 90 }],
  },
  {
    letter: 'N', lowercase: 'n', word: 'Nest', emoji: '🪺', color: '#A78BFA',
    phonics: 'nuh', sentence: 'N is for cozy Nest!', isVowel: false,
    tracingPath: 'M 35 90 L 35 20 L 85 90 L 85 20',
    waypoints: [{ x: 35, y: 90 }, { x: 35, y: 20 }, { x: 60, y: 55 }, { x: 85, y: 90 }, { x: 85, y: 20 }],
  },
  {
    letter: 'O', lowercase: 'o', word: 'Orange', emoji: '🍊', color: '#FB923C',
    phonics: 'oh', sentence: 'O is for round Orange!', isVowel: true,
    tracingPath: 'M 60 20 C 30 20, 30 90, 60 90 C 90 90, 90 20, 60 20',
    waypoints: [{ x: 60, y: 20 }, { x: 35, y: 45 }, { x: 35, y: 65 }, { x: 60, y: 90 }, { x: 85, y: 65 }, { x: 85, y: 45 }, { x: 60, y: 20 }],
  },
  {
    letter: 'P', lowercase: 'p', word: 'Penguin', emoji: '🐧', color: '#60A5FA',
    phonics: 'puh', sentence: 'P is for cute Penguin!', isVowel: false,
    tracingPath: 'M 35 20 L 35 90 M 35 20 C 75 20, 75 60, 35 60',
    waypoints: [{ x: 35, y: 20 }, { x: 35, y: 90 }, { x: 65, y: 25 }, { x: 75, y: 40 }, { x: 35, y: 60 }],
  },
  {
    letter: 'Q', lowercase: 'q', word: 'Queen', emoji: '👑', color: '#FBBF24',
    phonics: 'kwuh', sentence: 'Q is for royal Queen!', isVowel: false,
    tracingPath: 'M 60 20 C 30 20, 30 85, 60 85 C 90 85, 90 20, 60 20 M 65 65 L 88 88',
    waypoints: [{ x: 60, y: 20 }, { x: 35, y: 50 }, { x: 60, y: 85 }, { x: 85, y: 50 }, { x: 60, y: 20 }, { x: 65, y: 65 }, { x: 88, y: 88 }],
  },
  {
    letter: 'R', lowercase: 'r', word: 'Rainbow', emoji: '🌈', color: '#34D399',
    phonics: 'ruh', sentence: 'R is for colorful Rainbow!', isVowel: false,
    tracingPath: 'M 35 20 L 35 90 M 35 20 C 75 20, 75 58, 35 58 M 55 58 L 85 90',
    waypoints: [{ x: 35, y: 20 }, { x: 35, y: 90 }, { x: 65, y: 25 }, { x: 35, y: 58 }, { x: 85, y: 90 }],
  },
  {
    letter: 'S', lowercase: 's', word: 'Star', emoji: '⭐', color: '#F59E0B',
    phonics: 'suh', sentence: 'S is for shining Star!', isVowel: false,
    tracingPath: 'M 85 32 C 75 18, 38 18, 38 38 C 38 58, 82 58, 82 76 C 82 95, 38 95, 35 78',
    waypoints: [{ x: 85, y: 32 }, { x: 60, y: 20 }, { x: 38, y: 38 }, { x: 60, y: 58 }, { x: 82, y: 76 }, { x: 60, y: 92 }, { x: 35, y: 78 }],
  },
  {
    letter: 'T', lowercase: 't', word: 'Tiger', emoji: '🐯', color: '#FB923C',
    phonics: 'tuh', sentence: 'T is for speedy Tiger!', isVowel: false,
    tracingPath: 'M 25 20 L 95 20 M 60 20 L 60 90',
    waypoints: [{ x: 25, y: 20 }, { x: 95, y: 20 }, { x: 60, y: 20 }, { x: 60, y: 55 }, { x: 60, y: 90 }],
  },
  {
    letter: 'U', lowercase: 'u', word: 'Umbrella', emoji: '☂️', color: '#818CF8',
    phonics: 'uh', sentence: 'U is for handy Umbrella!', isVowel: true,
    tracingPath: 'M 35 20 L 35 70 C 35 92, 85 92, 85 70 L 85 20',
    waypoints: [{ x: 35, y: 20 }, { x: 35, y: 65 }, { x: 60, y: 90 }, { x: 85, y: 65 }, { x: 85, y: 20 }],
  },
  {
    letter: 'V', lowercase: 'v', word: 'Violin', emoji: '🎻', color: '#F472B6',
    phonics: 'vuh', sentence: 'V is for melodic Violin!', isVowel: false,
    tracingPath: 'M 30 20 L 60 90 L 90 20',
    waypoints: [{ x: 30, y: 20 }, { x: 45, y: 55 }, { x: 60, y: 90 }, { x: 75, y: 55 }, { x: 90, y: 20 }],
  },
  {
    letter: 'W', lowercase: 'w', word: 'Whale', emoji: '🐳', color: '#38BDF8',
    phonics: 'wuh', sentence: 'W is for gentle Whale!', isVowel: false,
    tracingPath: 'M 25 20 L 40 90 L 60 45 L 80 90 L 95 20',
    waypoints: [{ x: 25, y: 20 }, { x: 40, y: 90 }, { x: 60, y: 45 }, { x: 80, y: 90 }, { x: 95, y: 20 }],
  },
  {
    letter: 'X', lowercase: 'x', word: 'Xylophone', emoji: '🎵', color: '#A3E635',
    phonics: 'eks', sentence: 'X is for musical Xylophone!', isVowel: false,
    tracingPath: 'M 30 20 L 90 90 M 90 20 L 30 90',
    waypoints: [{ x: 30, y: 20 }, { x: 60, y: 55 }, { x: 90, y: 90 }, { x: 90, y: 20 }, { x: 30, y: 90 }],
  },
  {
    letter: 'Y', lowercase: 'y', word: 'Yak', emoji: '🦬', color: '#FDE68A',
    phonics: 'yuh', sentence: 'Y is for furry Yak!', isVowel: false,
    tracingPath: 'M 30 20 L 60 55 L 90 20 M 60 55 L 60 90',
    waypoints: [{ x: 30, y: 20 }, { x: 60, y: 55 }, { x: 90, y: 20 }, { x: 60, y: 55 }, { x: 60, y: 90 }],
  },
  {
    letter: 'Z', lowercase: 'z', word: 'Zebra', emoji: '🦓', color: '#94A3B8',
    phonics: 'zuh', sentence: 'Z is for striped Zebra!', isVowel: false,
    tracingPath: 'M 30 20 L 90 20 L 30 90 L 90 90',
    waypoints: [{ x: 30, y: 20 }, { x: 90, y: 20 }, { x: 60, y: 55 }, { x: 30, y: 90 }, { x: 90, y: 90 }],
  },
];

// Get a letter object by its uppercase letter
export const getLetterData = (letter) =>
  LETTERS.find(l => l.letter === String(letter).toUpperCase());

// Get distractors (wrong answer choices) for a letter
export const getLetterDistractors = (letter, count = 2) => {
  const target = String(letter).toUpperCase();
  const others = LETTERS.filter(l => l.letter !== target);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
