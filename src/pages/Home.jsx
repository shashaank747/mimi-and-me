// ============================================================
// MIMI & ME — Home Page (Adventure Dashboard)
// ============================================================
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileManager } from '../systems/ProfileManager.js';
import { ProgressManager } from '../systems/ProgressManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { getWorldById } from '../data/worlds.js';
import Header from '../components/Header.jsx';
import Mimi from '../components/Mimi.jsx';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const profile = ProfileManager.getActive();

  useEffect(() => {
    AudioManager.resumeContext();
    if (!profile) navigate('/profile-select');
  }, [profile, navigate]);

  if (!profile) return null;

  const nextLevel = ProgressManager.getNextLevelForProfile(profile);
  const currentWorld = getWorldById(profile.currentWorldId || 'letter-forest');
  const levelLabel = nextLevel
    ? `${currentWorld?.name || 'Letter Forest'} — Level ${nextLevel.target || nextLevel.difficulty || '1'}`
    : 'Letter Forest — Level 4';

  const handleContinueAdventure = () => {
    AudioManager.playClick();
    navigate('/adventure');
  };

  const handleNavigate = (path) => {
    AudioManager.playClick();
    navigate(path);
  };

  return (
    <div className="home-dashboard-scene">
      {/* Dynamic landscape background */}
      <div className="home-bg-layer" />

      {/* Floating sparkles/clouds atmosphere */}
      <div className="home-sparkles-overlay">
        <span className="sparkle s1">✨</span>
        <span className="sparkle s2">✨</span>
        <span className="sparkle s3">🌸</span>
      </div>

      <div className="home-main-container">
        {/* Top bar with 3D logo and stats pill */}
        <Header profile={profile} isHome={true} />

        <div className="home-interactive-stage">
          {/* ── LEFT HERO: Mimi + Adventure CTA ── */}
          <div className="home-left-hero">
            {/* 3D Mimi Character with integrated 'Ready for adventure?' speech bubble & podium */}
            <div
              className="mimi-hero-sprite animate-float"
              onClick={() => AudioManager.playLetterSound('A')}
              title="Click Mimi!"
            >
              <img
                src="/images/Mimi Bunny’s Adventure Begins.png"
                alt="Mimi Bunny - Ready for Adventure"
                className="mimi-adventure-3d-img"
                draggable={false}
              />
            </div>

            {/* Wooden Board CTA */}
            <div className="wooden-cta-board animate-fadeInUp">
              <button
                id="continue-adventure-btn"
                className="adventure-play-btn"
                onClick={handleContinueAdventure}
                aria-label="Continue Adventure"
              >
                <span className="play-icon-triangle">▶</span>
                <span className="play-text">Continue Adventure</span>
              </button>

              <div className="cta-level-plank">
                <span className="level-plank-text">{levelLabel}</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT SECTION: Floating Islands & Pods ── */}
          <div className="home-right-hubs">
            {/* Top Row: 3 Floating Subject Islands */}
            <div className="islands-top-row">
              {/* Letters Island */}
              <button
                id="island-letters-btn"
                className="floating-island-card island--letters animate-float"
                onClick={() => handleNavigate('/letters')}
                aria-label="Letters: Explore A to Z"
              >
                <img
                  src="/images/island/abc.png"
                  alt="Letters A–Z"
                  className="island-hero-img"
                  draggable={false}
                />
              </button>

              {/* Numbers Island */}
              <button
                id="island-numbers-btn"
                className="floating-island-card island--numbers animate-float delay-1"
                onClick={() => handleNavigate('/numbers')}
                aria-label="Numbers: Count and Learn"
              >
                <img
                  src="/images/island/Numbers.png"
                  alt="Numbers 1–20"
                  className="island-hero-img"
                  draggable={false}
                />
              </button>

              {/* Math Island */}
              <button
                id="island-math-btn"
                className="floating-island-card island--math animate-float delay-2"
                onClick={() => handleNavigate('/math')}
                aria-label="Math: Add and Subtract"
              >
                <img
                  src="/images/island/math.png"
                  alt="Math Operations"
                  className="island-hero-img"
                  draggable={false}
                />
              </button>
            </div>

            {/* Bottom Row: 3 Mini Pods */}
            <div className="pods-bottom-row">
              {/* Achievements Pod */}
              <button
                id="pod-achievements-btn"
                className="mini-garden-pod pod--achievements animate-float delay-1"
                onClick={() => handleNavigate('/achievements')}
                aria-label="Achievements"
              >
                <img
                  src="/images/island/achivements.png"
                  alt="Achievements"
                  className="pod-hero-img"
                  draggable={false}
                  onError={(e) => {
                    // graceful fallback to icon if image fails
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="pod-fallback-content" style={{ display: 'none' }}>
                  <div className="pod-mound">
                    <span className="pod-3d-icon trophy-glow">🏆</span>
                  </div>
                  <div className="pod-pill-label">
                    <span>Achievements</span>
                  </div>
                </div>
              </button>

              {/* Rewards Pod */}
              <button
                id="pod-rewards-btn"
                className="mini-garden-pod pod--rewards animate-float delay-2"
                onClick={() => handleNavigate('/rewards')}
                aria-label="Rewards"
              >
                <img
                  src="/images/island/reward.png"
                  alt="Rewards"
                  className="pod-hero-img"
                  draggable={false}
                  onError={(e) => {
                    // graceful fallback to icon if image fails
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="pod-fallback-content" style={{ display: 'none' }}>
                  <div className="pod-mound">
                    <span className="pod-3d-icon chest-glow">🎁</span>
                  </div>
                  <div className="pod-pill-label">
                    <span>Rewards</span>
                  </div>
                </div>
              </button>

              {/* Settings Pod */}
              <button
                id="pod-settings-btn"
                className="mini-garden-pod pod--settings animate-float delay-3"
                onClick={() => handleNavigate('/settings')}
                aria-label="Settings"
              >
                <img
                  src="/images/island/settings.png"
                  alt="Settings"
                  className="pod-hero-img"
                  draggable={false}
                  onError={(e) => {
                    // graceful fallback to icon if image fails
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="pod-fallback-content" style={{ display: 'none' }}>
                  <div className="pod-mound">
                    <span className="pod-3d-icon gear-spin">⚙️</span>
                  </div>
                  <div className="pod-pill-label">
                    <span>Settings</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Rustic Signpost in Bottom Right */}
        <div className="corner-wooden-signpost">
          <div className="signpost-pole" />
          <div className="signpost-plank p1">
            <span>small steps 💖</span>
          </div>
          <div className="signpost-plank p2">
            <span>big</span>
          </div>
          <div className="signpost-plank p3">
            <span>dreams 💖</span>
          </div>
        </div>
      </div>
    </div>
  );
}
