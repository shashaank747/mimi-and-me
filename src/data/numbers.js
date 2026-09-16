// ============================================================
// MIMI & ME — Numbers Data (1–20)
// ============================================================

export const NUMBERS = [
  { number: 1,  word: 'One',      emoji: '🌟', color: '#FF6B6B' },
  { number: 2,  word: 'Two',      emoji: '🦋', color: '#4ECDC4' },
  { number: 3,  word: 'Three',    emoji: '🐝', color: '#FFE66D' },
  { number: 4,  word: 'Four',     emoji: '🍀', color: '#A855F7' },
  { number: 5,  word: 'Five',     emoji: '⭐', color: '#FF8C42' },
  { number: 6,  word: 'Six',      emoji: '🍎', color: '#38BDF8' },
  { number: 7,  word: 'Seven',    emoji: '🌈', color: '#22C55E' },
  { number: 8,  word: 'Eight',    emoji: '🎈', color: '#F472B6' },
  { number: 9,  word: 'Nine',     emoji: '🐶', color: '#8B5CF6' },
  { number: 10, word: 'Ten',      emoji: '🎉', color: '#F59E0B' },
  { number: 11, word: 'Eleven',   emoji: '🦁', color: '#34D399' },
  { number: 12, word: 'Twelve',   emoji: '🌸', color: '#FB923C' },
  { number: 13, word: 'Thirteen', emoji: '🐱', color: '#60A5FA' },
  { number: 14, word: 'Fourteen', emoji: '🍓', color: '#A78BFA' },
  { number: 15, word: 'Fifteen',  emoji: '🦊', color: '#FBBF24' },
  { number: 16, word: 'Sixteen',  emoji: '🌺', color: '#6EE7B7' },
  { number: 17, word: 'Seventeen',emoji: '🐸', color: '#FDE68A' },
  { number: 18, word: 'Eighteen', emoji: '🦄', color: '#818CF8' },
  { number: 19, word: 'Nineteen', emoji: '🌙', color: '#94A3B8' },
  { number: 20, word: 'Twenty',   emoji: '🎊', color: '#FF6B6B' },
];

export const getNumberData = (n) => NUMBERS.find(num => num.number === n);

export const getNumberDistractors = (number, count = 2) => {
  const others = NUMBERS.filter(n => n.number !== number);
  return [...others].sort(() => Math.random() - 0.5).slice(0, count);
};
