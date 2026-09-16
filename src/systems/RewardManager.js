// ============================================================
// MIMI & ME — Reward Manager
// ============================================================
import { STICKERS, OUTFIT_ITEMS, ROOM_ITEMS } from '../data/rewards.js';
import { ProfileManager } from './ProfileManager.js';

export const RewardManager = {
  getAllStickers: () => STICKERS,
  getAllOutfitItems: () => OUTFIT_ITEMS,
  getAllRoomItems: () => ROOM_ITEMS,

  getProfileStickers(profile) {
    const unlocked = new Set(profile?.stickers || []);
    return STICKERS.map(s => ({ ...s, unlocked: unlocked.has(s.id) }));
  },

  getProfileOutfitItems(profile) {
    const unlocked = new Set(profile?.outfitItems || []);
    const stars = profile?.stars || 0;
    return OUTFIT_ITEMS.map(item => ({
      ...item,
      unlocked: unlocked.has(item.id) || item.unlockStars <= stars,
    }));
  },

  equipItem(profileId, itemId, slot) {
    const profile = ProfileManager.getById(profileId);
    if (!profile) return;
    const equippedOutfit = { ...(profile.equippedOutfit || {}), [slot]: itemId };
    ProfileManager.update(profileId, { equippedOutfit });
  },

  unlockStickerForProfile(profileId, stickerId) {
    ProfileManager.unlockSticker(profileId, stickerId);
  },
};
