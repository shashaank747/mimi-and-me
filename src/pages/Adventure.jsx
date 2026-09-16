// ============================================================
// MIMI & ME — Adventure Page (World Map)
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WORLDS } from '../data/worlds.js';
import { ProfileManager } from '../systems/ProfileManager.js';
import { ProgressManager } from '../systems/ProgressManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import Header from '../components/Header.jsx';
import Mimi from '../components/Mimi.jsx';
import './Adventure.css';

export default function Adventure() {
  const navigate = useNavigate();
  const profile = ProfileManager.getActive();

  if (!profile) { navigate('/profile-select'); return null; }

  const handleWorldTap = (world, isUnlocked) => {
    if (!isUnlocked) return;
    AudioManager.playClick();
    // Navigate to the first incomplete level in this world
    navigate(`/play/${world.levels[0] || 'learn-a'}`);
  };

  return (
    <div className="page adventure-page">
      <Header profile={profile} showBack title="Adventure" />

      <div className="adventure-story-intro animate-fadeInDown">
        <div className="story-banner">
          <Mimi expression="excited" size={60} />
          <div className="story-bubble">
            <em>"Glitch scattered the world! Let's explore and fix it together!"</em>
          </div>
        </div>
      </div>

      <div className="world-map animate-fadeInUp">
        {WORLDS.map((world, idx) => {
          const isUnlocked = ProgressManager.isWorldUnlocked(profile, world.id);
          const completion = ProgressManager.getWorldCompletion(profile, world.id);
          const isCurrent = profile.currentWorldId === world.id;
          const isCompleted = completion === 100;

          return (
            <div
              key={world.id}
              className={`world-node ${idx % 2 === 0 ? 'world-node--left' : 'world-node--right'}`}
            >
              <button
                id={`world-${world.id}`}
                className={`world-btn
                  ${isUnlocked ? 'world-btn--unlocked' : 'world-btn--locked'}
                  ${isCurrent ? 'world-btn--current' : ''}
                  ${isCompleted ? 'world-btn--completed' : ''}
                `}
                style={{ '--world-color': world.color }}
                onClick={() => handleWorldTap(world, isUnlocked)}
                disabled={!isUnlocked}
                aria-label={`${world.name}${isUnlocked ? '' : ', locked'}`}
              >
                <span className="world-btn-emoji">{isUnlocked ? world.emoji : '🔒'}</span>
                <span className="world-btn-name">{world.name}</span>
                {isUnlocked && completion > 0 && (
                  <span className="world-btn-progress">{completion}%</span>
                )}
                {isCompleted && <span className="world-btn-check">✓</span>}
              </button>
              {/* Path connector */}
              {idx < WORLDS.length - 1 && <div className={`world-path ${isUnlocked ? 'world-path--active' : ''}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
