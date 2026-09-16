// ============================================================
// MIMI & ME — Mimi Asset Manifest
//
// MASTER REFERENCES (design locked — do not alter):
//   public/images/characters/mimi/mimi-reference.png
//   public/images/characters/mimi/mimi-expressions-reference.png
//   public/images/characters/mimi/mimi-poses-reference.png
//
// Individual expression/pose assets will be added here as .webp
// files when the artist supplies them.
// The Mimi component will automatically pick them up — no code changes needed.
// ============================================================

// ── Expressions ──
// Sourced from: mimi-expressions-reference.png
export const MIMI_EXPRESSIONS = [
  'happy',
  'excited',
  'curious',
  'thinking',
  'surprised',
  'confused',
  'celebrating',
  'sleeping',
  'gentle-disappointment',
  'listening',
];

// ── Poses ──
// Sourced from: mimi-poses-reference.png
export const MIMI_POSES = [
  'standing',
  'sitting',
  'jumping',
  'running',
  'waving',
  'pointing',
  'walking',
  'cheering',
];

// ── Expression → game context mapping ──
// Use these to pick the right expression for each game event.
export const MIMI_EXPRESSION_CONTEXT = {
  correctAnswer:      'happy',
  levelComplete:      'celebrating',
  excellentScore:     'celebrating',
  exploring:          'curious',
  thinkingQuestion:   'thinking',
  waitingForInput:    'listening',
  unexpectedEvent:    'surprised',
  wrongAnswer:        'gentle-disappointment', // never shame — gentle only
  hintRequested:      'thinking',
  idle:               'curious',
  longIdle:           'sleeping',
  greeting:           'excited',
  encouragement:      'happy',
};

// ── Asset path resolver ──
// Returns the path for a given expression or pose.
// Falls back to mimi-reference.png if the individual file hasn't been supplied yet.
const BASE = '/images/characters/mimi';
const FALLBACK = `${BASE}/mimi-reference.png`;

export function getMimiExpressionPath(expression) {
  if (!expression || !MIMI_EXPRESSIONS.includes(expression)) return FALLBACK;
  return `${BASE}/mimi-${expression}.webp`;
}

export function getMimiPosePath(pose) {
  if (!pose || !MIMI_POSES.includes(pose)) return FALLBACK;
  return `${BASE}/mimi-${pose}.webp`;
}

// ── Context helper ──
// Given a game event key, returns the correct expression string.
export function getMimiExpressionForContext(contextKey) {
  return MIMI_EXPRESSION_CONTEXT[contextKey] || 'happy';
}
