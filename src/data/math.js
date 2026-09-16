// ============================================================
// MIMI & ME — Math Data
// ============================================================

// Operations unlock progressively based on accuracy
export const MATH_OPERATIONS = [
  { id: 'addition',       symbol: '+', label: 'Addition',       emoji: '➕', color: '#22C55E', unlockAfterAccuracy: 0 },
  { id: 'subtraction',    symbol: '-', label: 'Subtraction',    emoji: '➖', color: '#6B78BB', unlockAfterAccuracy: 80 },
  { id: 'multiplication', symbol: '×', label: 'Multiplication', emoji: '✖️', color: '#F59E0B', unlockAfterAccuracy: 80 },
  { id: 'division',       symbol: '÷', label: 'Division',       emoji: '➗', color: '#E76F51', unlockAfterAccuracy: 80 },
];

// Addition levels (visual object-first for young children)
export const ADDITION_LEVELS = Array.from({ length: 10 }, (_, i) => {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 1;
  return { id: `add-${i+1}`, operation: 'addition', a, b, answer: a + b, difficulty: Math.ceil((i+1)/3) };
});

// Subtraction levels
export const SUBTRACTION_LEVELS = Array.from({ length: 10 }, (_, i) => {
  const a = Math.floor(Math.random() * 8) + 3;
  const b = Math.floor(Math.random() * (a-1)) + 1;
  return { id: `sub-${i+1}`, operation: 'subtraction', a, b, answer: a - b, difficulty: Math.ceil((i+1)/3) };
});

// Generate wrong answers for math questions
export const getMathDistractors = (answer, count = 3) => {
  const distractors = new Set();
  while (distractors.size < count) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const wrong = Math.random() > 0.5 ? answer + offset : Math.max(0, answer - offset);
    if (wrong !== answer) distractors.add(wrong);
  }
  return [...distractors];
};
