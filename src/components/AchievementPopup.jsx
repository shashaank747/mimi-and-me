// ============================================================
// MIMI & ME — AchievementPopup Component
// ============================================================
import React, { useEffect } from 'react';
import { ACHIEVEMENTS } from '../data/achievements.js';
import './AchievementPopup.css';

export default function AchievementPopup({ achievementId, onClose }) {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);

  useEffect(() => {
    const t = setTimeout(onClose, 4000); // auto-close after 4s
    return () => clearTimeout(t);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className="achievement-popup animate-achievementSlide" role="alert" aria-live="polite">
      <div className="achievement-popup-icon">{achievement.icon}</div>
      <div className="achievement-popup-body">
        <div className="achievement-popup-label">Achievement Unlocked!</div>
        <div className="achievement-popup-name">{achievement.name}</div>
        <div className="achievement-popup-desc">{achievement.description}</div>
      </div>
      <button className="achievement-popup-close" onClick={onClose} aria-label="Close">✕</button>
    </div>
  );
}
