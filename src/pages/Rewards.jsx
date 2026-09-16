// ============================================================
// MIMI & ME — Rewards Page (Interactive Sticker Album | Dress Mimi | Room Decor)
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileManager } from '../systems/ProfileManager.js';
import { RewardManager } from '../systems/RewardManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import Header from '../components/Header.jsx';
import Mimi from '../components/Mimi.jsx';
import './Rewards.css';

const TABS = [
  { id: 'stickers', label: '📖 Sticker Album' },
  { id: 'dress',    label: '👗 Dress Mimi' },
  { id: 'room',     label: '🏠 Mimi\'s Room' },
];

export default function Rewards() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(ProfileManager.getActive());
  const [activeTab, setActiveTab] = useState('stickers');

  if (!profile) {
    navigate('/profile-select');
    return null;
  }

  const handleProfileUpdate = () => {
    setProfile(ProfileManager.getActive());
  };

  return (
    <div className="page rewards-page">
      <Header profile={profile} showBack title="Rewards Center" />

      {/* Tab bar */}
      <div className="rewards-tabs animate-fadeInDown">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`rewards-tab ${activeTab === tab.id ? 'rewards-tab--active' : ''}`}
            onClick={() => {
              AudioManager.playClick();
              setActiveTab(tab.id);
            }}
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rewards-content animate-fadeInUp">
        {activeTab === 'stickers' && <InteractiveStickerAlbum profile={profile} />}
        {activeTab === 'dress'    && <DressMimiRoom profile={profile} onUpdated={handleProfileUpdate} />}
        {activeTab === 'room'     && <MimiRoomDecorator profile={profile} onUpdated={handleProfileUpdate} />}
      </div>
    </div>
  );
}

// ── 1. Interactive Sticker Album ──
function InteractiveStickerAlbum({ profile }) {
  const stickers = RewardManager.getProfileStickers(profile);
  const unlockedCount = stickers.filter(s => s.unlocked).length;
  
  // Placed stickers on the scenic canvas
  const [placedStickers, setPlacedStickers] = useState([
    { id: 'p1', emoji: '⭐', x: 20, y: 30, scale: 1.2 },
    { id: 'p2', emoji: '🍎', x: 75, y: 65, scale: 1.1 },
    { id: 'p3', emoji: '🌈', x: 50, y: 25, scale: 1.4 },
  ]);
  const [selectedSticker, setSelectedSticker] = useState(null);

  const handleAddStickerToBoard = (sticker) => {
    if (!sticker.unlocked) return;
    AudioManager.playStar();
    const newPlaced = {
      id: `placed-${Date.now()}`,
      emoji: sticker.emoji,
      x: Math.floor(Math.random() * 60) + 20,
      y: Math.floor(Math.random() * 50) + 30,
      scale: 1.2,
    };
    setPlacedStickers(prev => [...prev, newPlaced]);
  };

  const handleRemoveSticker = (id) => {
    AudioManager.playClick();
    setPlacedStickers(prev => prev.filter(s => s.id !== id));
  };

  const handleClearBoard = () => {
    AudioManager.playClick();
    setPlacedStickers([]);
  };

  return (
    <div className="sticker-album-container">
      {/* Top Album Stats */}
      <div className="sticker-book-header">
        <span className="sticker-count-badge">🌟 {unlockedCount} / {stickers.length} Stickers Collected</span>
        <span className="sticker-hint">Tap an unlocked sticker below to stamp it onto your scenic canvas!</span>
      </div>

      {/* Scenic Interactive Canvas */}
      <div className="sticker-canvas-scene">
        <div className="canvas-landscape">
          <div className="canvas-sun">☀️</div>
          <div className="canvas-clouds">☁️ ☁️</div>
          <div className="canvas-mimi-peek">🐰</div>
        </div>

        {/* Placed Stickers on Canvas */}
        {placedStickers.map(st => (
          <div
            key={st.id}
            className="canvas-placed-sticker animate-pop"
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              transform: `scale(${st.scale})`,
            }}
            onClick={() => handleRemoveSticker(st.id)}
            title="Tap to remove sticker"
          >
            <span>{st.emoji}</span>
          </div>
        ))}

        {placedStickers.length > 0 && (
          <button className="clear-stickers-btn" onClick={handleClearBoard} title="Clear board">
            🧹 Clear Canvas
          </button>
        )}
      </div>

      {/* Stickers Drawer */}
      <div className="sticker-drawer-card card mt-4">
        <h3 className="drawer-title">🎒 Your Sticker Collection</h3>
        <div className="sticker-grid">
          {stickers.map(sticker => (
            <button
              key={sticker.id}
              className={`sticker-slot ${sticker.unlocked ? 'sticker-slot--unlocked' : 'sticker-slot--locked'}`}
              onClick={() => handleAddStickerToBoard(sticker)}
              disabled={!sticker.unlocked}
              aria-label={sticker.unlocked ? `Place ${sticker.name} sticker` : 'Locked sticker'}
            >
              <span className="sticker-emoji">{sticker.unlocked ? sticker.emoji : '🔒'}</span>
              <span className="sticker-name">{sticker.name}</span>
              {sticker.unlocked && <span className="tap-stamp-tag">Tap to Stamp!</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 2. Dress Up Mimi ──
function DressMimiRoom({ profile, onUpdated }) {
  const items = RewardManager.getProfileOutfitItems(profile);
  const equipped = profile.equippedOutfit || {};
  const slots = ['hat', 'glasses', 'bag', 'shoes', 'clothes'];
  const [activeSlotFilter, setActiveSlotFilter] = useState('all');

  const handleEquip = (item) => {
    if (!item.unlocked) return;
    AudioManager.playStar();
    const current = equipped[item.slot];
    RewardManager.equipItem(profile.id, current === item.id ? null : item.id, item.slot);
    onUpdated();
  };

  const filteredItems = activeSlotFilter === 'all'
    ? items
    : items.filter(i => i.slot === activeSlotFilter);

  return (
    <div className="dress-mimi-stage">
      {/* Mimi Mannequin Preview */}
      <div className="dress-mimi-dressing-room card">
        <div className="mimi-runway-platform">
          <div className="runway-spotlight" />
          <div className="mimi-character-mannequin">
            <Mimi expression="happy" size={160} animated />

            {/* Overlaid Equipped Accessories */}
            <div className="overlaid-accessories">
              {equipped.hat && (
                <div className="acc-layer acc-hat animate-bounceIn">
                  {items.find(i => i.id === equipped.hat)?.emoji}
                </div>
              )}
              {equipped.glasses && (
                <div className="acc-layer acc-glasses animate-bounceIn">
                  {items.find(i => i.id === equipped.glasses)?.emoji}
                </div>
              )}
              {equipped.bag && (
                <div className="acc-layer acc-bag animate-bounceIn">
                  {items.find(i => i.id === equipped.bag)?.emoji}
                </div>
              )}
              {equipped.clothes && (
                <div className="acc-layer acc-clothes animate-bounceIn">
                  {items.find(i => i.id === equipped.clothes)?.emoji}
                </div>
              )}
            </div>
          </div>
          <div className="mimi-speech-outfit">Looking fabulous! ✨</div>
        </div>

        {/* Equipped Accessories Summary */}
        <div className="equipped-pills-row">
          {slots.map(slot => (
            <div key={slot} className={`equipped-slot-pill ${equipped[slot] ? 'is-active' : ''}`}>
              <span className="slot-name">{slot}:</span>
              <span className="slot-emoji">
                {equipped[slot] ? items.find(i => i.id === equipped[slot])?.emoji : 'none'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wardrobe Closet */}
      <div className="wardrobe-closet card">
        <div className="wardrobe-filter-tabs">
          {['all', 'hat', 'glasses', 'bag', 'clothes', 'shoes'].map(slot => (
            <button
              key={slot}
              className={`wardrobe-tab ${activeSlotFilter === slot ? 'is-active' : ''}`}
              onClick={() => setActiveSlotFilter(slot)}
            >
              {slot.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="outfit-grid">
          {filteredItems.map(item => {
            const isEquipped = equipped[item.slot] === item.id;
            return (
              <button
                key={item.id}
                className={`outfit-item ${item.unlocked ? 'outfit-item--unlocked' : 'outfit-item--locked'} ${isEquipped ? 'outfit-item--equipped' : ''}`}
                onClick={() => handleEquip(item)}
                disabled={!item.unlocked}
                aria-label={`${item.name}${!item.unlocked ? ', locked' : ''}`}
              >
                <span className="outfit-item-emoji">{item.unlocked ? item.emoji : '🔒'}</span>
                <span className="outfit-item-name">{item.name}</span>
                {isEquipped ? (
                  <span className="outfit-equipped-tag">Equipped ✓</span>
                ) : !item.unlocked ? (
                  <span className="outfit-item-cost">⭐ {item.unlockStars}</span>
                ) : (
                  <span className="outfit-wear-tag">Wear</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 3. Mimi's Cozy Room Decorator ──
function MimiRoomDecorator({ profile, onUpdated }) {
  const items = RewardManager.getAllRoomItems();
  const stars = profile.stars || 0;
  const [placedItems, setPlacedItems] = useState(new Set(profile.roomItems || ['abc-poster', 'teddy-bear']));

  const handleTogglePlace = (itemId, isUnlocked) => {
    if (!isUnlocked) return;
    AudioManager.playStar();
    const updated = new Set(placedItems);
    if (updated.has(itemId)) {
      updated.delete(itemId);
    } else {
      updated.add(itemId);
    }
    setPlacedItems(updated);
    ProfileManager.update(profile.id, { roomItems: Array.from(updated) });
    onUpdated();
  };

  return (
    <div className="mimi-room-stage">
      {/* Interactive 3D Room Canvas */}
      <div className="room-scene-canvas card">
        <div className="room-wall">
          <div className="room-window">🪟</div>
          {placedItems.has('abc-poster') && <div className="room-poster animate-fadeIn">🔤</div>}
          {placedItems.has('star-lamp') && <div className="room-lamp animate-fadeIn">💡</div>}
        </div>
        <div className="room-floor">
          {placedItems.has('rainbow-rug') && <div className="room-rug animate-fadeIn">🌈</div>}
          {placedItems.has('bookshelf') && <div className="room-bookshelf animate-fadeIn">📚</div>}
          {placedItems.has('teddy-bear') && <div className="room-toy animate-fadeIn">🧸</div>}
          {placedItems.has('plant-pot') && <div className="room-plant animate-fadeIn">🌱</div>}
          {placedItems.has('trophy-shelf') && <div className="room-trophy animate-fadeIn">🏆</div>}
          <div className="room-mimi-host">
            <Mimi expression="happy" size={100} animated />
          </div>
        </div>
      </div>

      {/* Room Decor Items Catalog */}
      <div className="room-catalog card mt-4">
        <h3 className="catalog-title">🛋️ Decorate Mimi's Room</h3>
        <p className="catalog-sub">Earn stars from adventures to unlock cozy furniture and decorations!</p>

        <div className="room-items-grid">
          {items.map(item => {
            const isUnlocked = stars >= item.unlockStars;
            const isPlaced = placedItems.has(item.id);
            return (
              <button
                key={item.id}
                className={`room-catalog-item ${isUnlocked ? 'is-unlocked' : 'is-locked'} ${isPlaced ? 'is-placed' : ''}`}
                onClick={() => handleTogglePlace(item.id, isUnlocked)}
                disabled={!isUnlocked}
              >
                <span className="room-item-emoji">{isUnlocked ? item.emoji : '🔒'}</span>
                <span className="room-item-name">{item.name}</span>
                {isPlaced ? (
                  <span className="room-placed-badge">Placed in Room ✓</span>
                ) : isUnlocked ? (
                  <span className="room-place-btn-tag">Place in Room</span>
                ) : (
                  <span className="room-item-cost">⭐ {item.unlockStars} stars</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
