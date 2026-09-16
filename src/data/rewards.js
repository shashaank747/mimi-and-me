// ============================================================
// MIMI & ME — Rewards Data
// ============================================================

// Stickers
export const STICKERS = [
  { id: 'first-step-sticker',     name: 'First Star',      emoji: '⭐', category: 'milestone' },
  { id: 'letter-explorer-sticker',name: 'Letter Badge',    emoji: '🔤', category: 'letters' },
  { id: 'abc-hero-sticker',       name: 'ABC Crown',       emoji: '👑', category: 'letters' },
  { id: 'number-explorer-sticker',name: 'Number Badge',    emoji: '🔢', category: 'numbers' },
  { id: 'number-hero-sticker',    name: 'Number Crown',    emoji: '💯', category: 'numbers' },
  { id: 'sharp-eyes-sticker',     name: 'Eagle Eye',       emoji: '🎯', category: 'skill' },
  { id: 'quick-sticker',          name: 'Lightning',       emoji: '⚡', category: 'skill' },
  { id: 'perfect-sticker',        name: 'Perfect Star',    emoji: '🌟', category: 'skill' },
  { id: 'streak-sticker',         name: 'Fire Streak',     emoji: '🔥', category: 'skill' },
  { id: 'match-sticker',          name: 'Match Maker',     emoji: '🧩', category: 'skill' },
  { id: 'math-sticker',           name: 'Math Wizard',     emoji: '🧮', category: 'math' },
  { id: 'apple-sticker',          name: 'Apple',           emoji: '🍎', category: 'object' },
  { id: 'rainbow-sticker',        name: 'Rainbow',         emoji: '🌈', category: 'object' },
  { id: 'star-sticker',           name: 'Star',            emoji: '⭐', category: 'object' },
];

// Mimi outfit items
export const OUTFIT_ITEMS = [
  { id: 'party-hat',       name: 'Party Hat',    emoji: '🎉', slot: 'hat',       unlockStars: 0 },
  { id: 'alphabet-crown',  name: 'ABC Crown',    emoji: '👑', slot: 'hat',       unlockStars: 200 },
  { id: 'fire-hat',        name: 'Fire Hat',     emoji: '🔥', slot: 'hat',       unlockStars: 300 },
  { id: 'star-glasses',    name: 'Star Glasses', emoji: '🌟', slot: 'glasses',   unlockStars: 100 },
  { id: 'math-glasses',    name: 'Math Glasses', emoji: '🤓', slot: 'glasses',   unlockStars: 400 },
  { id: 'mini-backpack',   name: 'Mini Backpack',emoji: '🎒', slot: 'bag',       unlockStars: 0 },
  { id: 'rainbow-bag',     name: 'Rainbow Bag',  emoji: '🌈', slot: 'bag',       unlockStars: 150 },
  { id: 'red-shoes',       name: 'Red Shoes',    emoji: '👟', slot: 'shoes',     unlockStars: 50 },
  { id: 'star-cape',       name: 'Star Cape',    emoji: '🦸', slot: 'clothes',   unlockStars: 250 },
];

// Room decorations for Mimi's Room
export const ROOM_ITEMS = [
  { id: 'trophy-shelf',  name: 'Trophy Shelf', emoji: '🏆', category: 'furniture', unlockStars: 100 },
  { id: 'abc-poster',    name: 'ABC Poster',   emoji: '🔤', category: 'decor',     unlockStars: 80 },
  { id: 'star-lamp',     name: 'Star Lamp',    emoji: '💡', category: 'decor',     unlockStars: 120 },
  { id: 'teddy-bear',    name: 'Teddy Bear',   emoji: '🧸', category: 'toy',       unlockStars: 60 },
  { id: 'plant-pot',     name: 'Plant',        emoji: '🌱', category: 'decor',     unlockStars: 40 },
  { id: 'rainbow-rug',   name: 'Rainbow Rug',  emoji: '🌈', category: 'furniture', unlockStars: 200 },
  { id: 'bookshelf',     name: 'Bookshelf',    emoji: '📚', category: 'furniture', unlockStars: 150 },
];

export const getStickerById = (id) => STICKERS.find(s => s.id === id);
export const getOutfitItemById = (id) => OUTFIT_ITEMS.find(o => o.id === id);
