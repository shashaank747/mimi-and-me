// ============================================================
// MIMI & ME — Random Utilities
// ============================================================

// Shuffle an array (Fisher-Yates)
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N random items from an array
export function pickRandom(arr, n = 1) {
  return shuffle(arr).slice(0, n);
}

// Random integer between min and max (inclusive)
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random item from array
export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Place items at random non-overlapping positions in a grid
export function randomGridPositions(count, cols = 4) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({ row: Math.floor(i / cols), col: i % cols });
  }
  return shuffle(positions);
}
