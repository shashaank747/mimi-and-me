// ============================================================
// MIMI & ME — Header Component
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ profile, showBack = false, title = null, isHome = false }) {
  const navigate = useNavigate();
  const stars = profile?.stars ?? 250;
  const achievements = (profile?.achievements || []).length || 1;
  const hearts = profile?.hearts ?? 5;
  const streak = profile?.stats?.streak || 3;
  const name = profile?.name || 'Explorer';

  return (
    <header className={`game-header ${isHome ? 'game-header--home' : ''}`} role="banner">
      {showBack ? (
        <button
          className="header-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ◀
        </button>
      ) : isHome ? (
        /* Top Left 3D App Logo */
        <div className="header-logo-group" onClick={() => navigate('/home')} title="Mimi & Me Home">
          <img
            src="/images/icon.png"
            alt="Mimi & Me"
            className="header-app-logo-img animate-pop"
            draggable={false}
          />
        </div>
      ) : null}

      {title && !isHome && <h1 className="header-title">{title}</h1>}

      {/* Right Stats & Profile Container */}
      <div className="header-right-group">
        <div className="header-stats-pill">
          <div className="header-stat-item" title="Stars earned">
            <span className="stat-icon">⭐</span>
            <span className="stat-val">{stars}</span>
          </div>
          <div className="header-stat-item" title="Achievements unlocked">
            <span className="stat-icon">🏆</span>
            <span className="stat-val">{achievements}</span>
          </div>
          <div className="header-stat-item" title="Hearts / Lives">
            <span className="stat-icon">❤️</span>
            <span className="stat-val">{hearts}</span>
          </div>
          <div className="header-stat-item header-stat-streak" title="Daily Streak">
            <span className="stat-icon">🔥</span>
            <span className="stat-val">{streak} Day Streak</span>
          </div>
        </div>

        {/* Profile Pill */}
        <button
          className="header-profile-pill"
          onClick={() => navigate('/profile-select')}
          aria-label="Profile selector"
          title={`Active profile: ${name}`}
        >
          <span className="profile-avatar-bubble">
            {profile?.avatarEmoji || '🐰'}
          </span>
          <span className="profile-name-text">Hi, {name}!</span>
          <span className="profile-arrow">⌵</span>
        </button>
      </div>
    </header>
  );
}

