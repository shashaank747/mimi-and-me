// ============================================================
// MIMI & ME — Achievements Page
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { ProfileManager } from '../systems/ProfileManager.js';
import Header from '../components/Header.jsx';
import './Achievements.css';

export default function Achievements() {
  const navigate = useNavigate();
  const profile = ProfileManager.getActive();
  if (!profile) { navigate('/profile-select'); return null; }

  const unlocked = new Set(profile.achievements || []);

  return (
    <div className="page achievements-page">
      <Header profile={profile} showBack title="Achievements" />

      <div className="achievements-count animate-fadeInDown">
        🏆 {unlocked.size} / {ACHIEVEMENTS.length} Unlocked
      </div>

      <div className="achievements-grid animate-fadeInUp">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.has(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`achievement-card ${isUnlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}
              role="article"
              aria-label={isUnlocked ? achievement.name : 'Locked achievement'}
            >
              <div className="achievement-card-icon">{isUnlocked ? achievement.icon : '❓'}</div>
              <div className="achievement-card-name">
                {isUnlocked ? achievement.name : '???'}
              </div>
              <div className="achievement-card-desc">
                {isUnlocked ? achievement.description : 'Keep playing to unlock!'}
              </div>
              {isUnlocked && achievement.reward?.stars && (
                <div className="achievement-card-reward">+{achievement.reward.stars} ⭐</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
