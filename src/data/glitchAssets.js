// ============================================================
// MIMI & ME — Glitch Asset Manifest
//
// MASTER REFERENCE (design locked — do not alter):
//   public/images/characters/glitch/glitch-reference.png
//
// Individual expression/pose assets will be added here as .webp
// files when the artist supplies them.
// The Glitch component will automatically pick them up — no code changes needed.
// ============================================================

// ── Expressions ──
export const GLITCH_EXPRESSIONS = [
  'mischievous',
  'sneaky',
  'laughing',
  'surprised',
  'confused',
  'defeated',
  'angry',
  'happy',
  'celebrating',
  'idle',
];

// ── Poses ──
export const GLITCH_POSES = [
  'standing',
  'floating',
  'sneaking',
  'running',
  'scrambling',
  'hiding',
  'casting',
  'cheering',
];

// ── Expression → game context mapping ──
export const GLITCH_EXPRESSION_CONTEXT = {
  stealingLetters:    'mischievous',
  scramblingNumbers:  'mischievous',
  playerFails:        'laughing',
  playerSucceeds:     'defeated',
  bossFight:          'angry',
  spottedByPlayer:    'surprised',
  hiding:             'sneaky',
  idle:               'idle',
  taunting:           'mischievous',
};

// ── Asset path resolver ──
const BASE = '/images/characters/glitch';
const FALLBACK = `${BASE}/glitch-reference.png`;

export function getGlitchExpressionPath(expression) {
  if (!expression || !GLITCH_EXPRESSIONS.includes(expression)) return FALLBACK;
  return `${BASE}/glitch-${expression}.webp`;
}

export function getGlitchPosePath(pose) {
  if (!pose || !GLITCH_POSES.includes(pose)) return FALLBACK;
  return `${BASE}/glitch-${pose}.webp`;
}

// ── Context helper ──
export function getGlitchExpressionForContext(contextKey) {
  return GLITCH_EXPRESSION_CONTEXT[contextKey] || 'mischievous';
}
