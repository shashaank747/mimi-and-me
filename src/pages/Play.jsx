// ============================================================
// MIMI & ME — Play Page (routes to GameEngine for any level)
// This is the vertical-slice page: Learn → Practice → Play
// ============================================================
import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfileManager } from '../systems/ProfileManager.js';
import { ProgressManager } from '../systems/ProgressManager.js';
import { AchievementManager } from '../systems/AchievementManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { getLetterData } from '../data/letters.js';
import { getLevelById } from '../data/levels.js';
import { getWorldById } from '../data/worlds.js';
import GameEngine from '../games/GameEngine.jsx';
import AchievementPopup from '../components/AchievementPopup.jsx';
import Header from '../components/Header.jsx';
import { useState } from 'react';
import './Play.css';

export default function Play() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const profile = ProfileManager.getActive();
  const [achievementQueue, setAchievementQueue] = useState([]);

  if (!profile) { navigate('/profile-select'); return null; }

  const level = getLevelById(levelId);
  if (!level) {
    return (
      <div className="page">
        <Header profile={profile} showBack />
        <p style={{ textAlign: 'center', marginTop: '4rem' }}>Level not found. <button onClick={() => navigate('/adventure')}>Back</button></p>
      </div>
    );
  }

  const world = getWorldById(level.world || 'sunny-meadow');
  const worldBg = world?.background || (level.world === 'sunny-meadow' ? '/images/worlds/sunny-meadow.webp' : null);

  const handleLevelComplete = useCallback((scoreData) => {
    AudioManager.playLevelComplete();

    // Mark letter learned / mastered if applicable
    if (level.subject === 'letters' && level.target) {
      if (scoreData.accuracy >= 90 && (level.type.startsWith('practice') || level.type.startsWith('play'))) {
        ProfileManager.markLetterMastered(profile.id, level.target);
      } else {
        ProfileManager.markLetterLearned(profile.id, level.target);
      }
    }

    // Save progress
    const { next } = ProgressManager.completeLevel(profile.id, scoreData.levelId, scoreData);

    // Re-fetch updated profile and check achievements
    const updatedProfile = ProfileManager.getById(profile.id);
    const unlocked = AchievementManager.check(updatedProfile);

    if (unlocked.length > 0) {
      AudioManager.playAchievement();
      setAchievementQueue(unlocked);
    }

    // Navigate to next level after achievement popups
    const afterAchievements = () => {
      if (scoreData.nextSuggestion) {
        navigate(`/play/${scoreData.nextSuggestion}`);
      } else if (next) {
        navigate(`/play/${next.id}`);
      } else {
        navigate('/letters');
      }
    };

    if (unlocked.length === 0) {
      afterAchievements();
    } else {
      setTimeout(afterAchievements, 4000);
    }
  }, [level, profile.id, navigate]);

  return (
    <div className={`play-screen-wrapper ${worldBg ? 'has-world-bg' : ''}`}>
      {/* Standalone world background layer */}
      {worldBg && (
        <div
          className="play-world-bg-layer"
          style={{ backgroundImage: `url("${worldBg}")` }}
          aria-hidden="true"
        />
      )}

      {/* Foreground Interactive Content Layer */}
      <div className="page play-page">
        <Header profile={profile} showBack title={level.target ? `Letter ${level.target}` : 'Play'} />

        {/* Story before */}
        {level.storyBefore && (
          <div className="play-story-intro animate-fadeInDown">
            🐰 <em>"{level.storyBefore}"</em>
          </div>
        )}

        <div className="play-content">
          <GameEngine
            levelId={levelId}
            profile={profile}
            onComplete={handleLevelComplete}
          />
        </div>

        {/* Achievement popups */}
        {achievementQueue.length > 0 && (
          <AchievementPopup
            achievementId={achievementQueue[0]}
            onClose={() => setAchievementQueue(q => q.slice(1))}
          />
        )}
      </div>
    </div>
  );
}
