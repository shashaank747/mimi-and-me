// ============================================================
// MIMI & ME — Rewards Page (Stickers | Dress Mimi | Room)
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileManager } from '../systems/ProfileManager.js';
import { RewardManager } from '../systems/RewardManager.js';
import Header from '../components/Header.jsx';
import Mimi from '../components/Mimi.jsx';
import './Rewards.css';

const TABS = [
  { id: 'stickers',  label: '📖 Stickers' },
  { id: 'dress',     label: '👕 Dress Mimi' },
  { id: 'room',      label: '🏠 Room' },
];

export default function Rewards() {
  const navigate = useNavigate();
  const profile = ProfileManager.getActive();
  const [activeTab, setActiveTab] = useState('stickers');
  if (!profile) { navigate('/profile-select'); return null; }

  return (
    <div className="page rewards-page">
      <Header profile={profile} showBack title="Rewards" />

      {/* Tab bar */}
      <div className="rewards-tabs animate-fadeInDown">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`rewards-tab ${activeTab === tab.id ? 'rewards-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rewards-content animate-fadeInUp">
        {activeTab === 'stickers' && <StickerBook profile={profile} />}
        {activeTab === 'dress'    && <DressMimi profile={profile} />}
        {activeTab === 'room'     && <MimiRoom profile={profile} />}
      </div>
    </div>
  );
}

// ── Sticker Book ──
function StickerBook({ profile }) {
  const stickers = RewardManager.getProfileStickers(profile);
  const unlockedCount = stickers.filter(s => s.unlocked).length;
  return (
    <div>
      <div className="sticker-book-count">{unlockedCount} / {stickers.length} stickers collected</div>
      <div className="sticker-grid">
        {stickers.map(sticker => (
          <div
            key={sticker.id}
            className={`sticker-slot ${sticker.unlocked ? 'sticker-slot--unlocked' : ''}`}
            title={sticker.unlocked ? sticker.name : 'Locked'}
          >
            <span className="sticker-emoji">{sticker.unlocked ? sticker.emoji : '?'}</span>
            {sticker.unlocked && <span className="sticker-name">{sticker.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Dress Mimi ──
function DressMimi({ profile }) {
  const items = RewardManager.getProfileOutfitItems(profile);
  const equipped = profile.equippedOutfit || {};
  const slots = ['hat', 'glasses', 'bag', 'shoes', 'clothes'];

  const handleEquip = (item) => {
    if (!item.unlocked) return;
    const current = equipped[item.slot];
    RewardManager.equipItem(profile.id, current === item.id ? null : item.id, item.slot);
  };

  return (
    <div className="dress-mimi">
      <div className="dress-mimi-preview">
        <Mimi expression="happy" size={120} animated />
        <div className="dress-mimi-equipped">
          {slots.map(slot => equipped[slot] && (
            <span key={slot} className="equipped-item" title={slot}>
              {items.find(i => i.id === equipped[slot])?.emoji || ''}
            </span>
          ))}
        </div>
      </div>
      <div className="outfit-grid">
        {items.map(item => (
          <button
            key={item.id}
            className={`outfit-item ${item.unlocked ? 'outfit-item--unlocked' : 'outfit-item--locked'} ${equipped[item.slot] === item.id ? 'outfit-item--equipped' : ''}`}
            onClick={() => handleEquip(item)}
            disabled={!item.unlocked}
            aria-label={`${item.name}${!item.unlocked ? ', locked' : ''}`}
          >
            <span className="outfit-item-emoji">{item.unlocked ? item.emoji : '🔒'}</span>
            <span className="outfit-item-name">{item.name}</span>
            {!item.unlocked && <span className="outfit-item-cost">⭐ {item.unlockStars}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Mimi's Room ──
function MimiRoom({ profile }) {
  const items = RewardManager.getAllRoomItems();
  const stars = profile.stars || 0;
  const placed = new Set(profile.roomItems || []);

  return (
    <div>
      <div className="room-preview">
        <div className="room-scene">🏠 Mimi's Room</div>
      </div>
      <div className="room-items-grid">
        {items.map(item => {
          const isUnlocked = stars >= item.unlockStars;
          const isPlaced = placed.has(item.id);
          return (
            <div
              key={item.id}
              className={`room-item ${isUnlocked ? 'room-item--unlocked' : 'room-item--locked'} ${isPlaced ? 'room-item--placed' : ''}`}
            >
              <span className="room-item-emoji">{isUnlocked ? item.emoji : '🔒'}</span>
              <span className="room-item-name">{item.name}</span>
              {!isUnlocked && <span className="room-item-cost">⭐ {item.unlockStars}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
