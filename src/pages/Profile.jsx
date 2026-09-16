// ============================================================
// MIMI & ME — Login / Onboarding & Profile Selection Page
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileManager } from '../systems/ProfileManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import './Profile.css';

const AGE_OPTIONS = [3, 4, 5, 6, 7, 8];

export default function ProfilePage() {
  const navigate = useNavigate();
  const profiles = ProfileManager.getAll();
  const [view, setView] = useState(profiles.length === 0 ? 'create' : 'create');

  const handleSelect = (profileId) => {
    AudioManager.resumeContext();
    AudioManager.playClick();
    ProfileManager.setActive(profileId);
    navigate('/home');
  };

  return (
    <div className="login-page-wrapper">
      {view === 'create' ? (
        <LoginForm
          onCreated={handleSelect}
          existingProfiles={profiles}
          onShowProfiles={() => setView('select')}
        />
      ) : (
        <SelectProfileModal
          profiles={profiles}
          onSelect={handleSelect}
          onAddNew={() => setView('create')}
        />
      )}
    </div>
  );
}

// ── Master Login / Onboarding View matching reference design ──
function LoginForm({ onCreated, existingProfiles, onShowProfiles }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(7); // default 7 as in reference
  const [className, setClassName] = useState('');
  const [parentName, setParentName] = useState('');
  const [error, setError] = useState('');

  const canStart = name.trim().length > 0 && age !== null;

  const handleStart = (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name!");
      return;
    }
    if (age === null) {
      setError("Please select your age!");
      return;
    }

    AudioManager.resumeContext();
    AudioManager.playLevelStart();

    const profile = ProfileManager.create({
      name: name.trim(),
      age,
      className: className.trim(),
      parentName: parentName.trim(),
      avatarEmoji: '🐰',
    });

    onCreated(profile.id);
  };

  return (
    <div className="login-scene-stage">
      {/* Existing Players Switcher pill (top right) */}
      {existingProfiles.length > 0 && (
        <button
          className="existing-profiles-badge"
          onClick={onShowProfiles}
          aria-label="Switch to existing player"
        >
          <span className="badge-icon">👥</span>
          <span>Existing Players ({existingProfiles.length})</span>
          <span className="badge-arrow">→</span>
        </button>
      )}

      {/* Floating Speech Bubble above Mimi on the left */}
      <div className="mimi-speech-bubble-overlay animate-fadeInDown">
        <div className="speech-content">
          <span className="speech-title">Hi there!</span>
          <span className="speech-sub">Let's start your adventure! 💖</span>
        </div>
        <div className="speech-tail" />
      </div>

      {/* ── Main Hover / Floating Form Card asking for info ── */}
      <div className="login-main-card animate-scaleUp">
        {/* Bunny Peeking Topper Badge */}
        <div className="card-top-bunny-badge">
          <div className="mini-bunny-ears">
            <span className="m-ear l" />
            <span className="m-ear r" />
          </div>
          <div className="mini-bunny-face">
            <div className="m-eyes">
              <span className="m-eye" />
              <span className="m-eye" />
            </div>
            <div className="m-nose" />
            <div className="m-cheeks">
              <span className="m-cheek" />
              <span className="m-cheek" />
            </div>
          </div>
        </div>

        {/* Card Header */}
        <div className="card-header-group">
          <div className="card-welcome-title">
            <span className="sparkle-ray-l">✨</span>
            <h2>Welcome to</h2>
            <span className="sparkle-ray-r">✨</span>
          </div>
          <h1 className="card-brand-title">
            <span className="brand-mimi">Mimi</span>
            <span className="brand-amp"> &amp; </span>
            <span className="brand-me">Me!</span>
          </h1>
          <div className="card-subtitle-divider">
            <span className="sub-dash">˗ˏˋ</span>
            <p>Tell us a little about yourself</p>
            <span className="sub-dash">ˎˊ˗</span>
          </div>
        </div>

        {/* The Form */}
        <form className="login-form-body" onSubmit={handleStart}>
          {/* Field 1: Name */}
          <div className="login-form-field">
            <label htmlFor="child-name">
              What's your name? <span className="field-required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="field-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748B">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </span>
              <input
                id="child-name"
                type="text"
                placeholder="Your name"
                value={name}
                maxLength={20}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>

          {/* Field 2: Age Buttons Grid */}
          <div className="login-form-field">
            <label>
              How old are you? <span className="field-required">*</span>
            </label>
            <div className="age-buttons-grid">
              {AGE_OPTIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  id={`age-btn-${a}`}
                  className={`age-choice-btn ${age === a ? 'is-selected' : ''}`}
                  onClick={() => {
                    AudioManager.playClick();
                    setAge(a);
                    if (error) setError('');
                  }}
                  aria-label={`Age ${a}`}
                  aria-pressed={age === a}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Field 3: Class (Optional) */}
          <div className="login-form-field">
            <label htmlFor="child-class">
              Which class are you in? <span className="field-optional">(optional)</span>
            </label>
            <div className="input-with-icon">
              <span className="field-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748B">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
              </span>
              <input
                id="child-class"
                type="text"
                placeholder="e.g. Class 1, KG..."
                value={className}
                maxLength={20}
                onChange={(e) => setClassName(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Field 4: Parent's Name (Optional) */}
          <div className="login-form-field">
            <label htmlFor="parent-name">
              Parent's Name <span className="field-optional">(optional)</span>
            </label>
            <div className="input-with-icon">
              <span className="field-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748B">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </span>
              <input
                id="parent-name"
                type="text"
                placeholder="Parent's name"
                value={parentName}
                maxLength={30}
                onChange={(e) => setParentName(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          {error && <div className="login-form-error">{error}</div>}

          {/* Big 3D START Button */}
          <button
            id="start-adventure-btn"
            type="submit"
            className={`login-start-btn ${canStart ? 'is-ready' : 'is-disabled'}`}
            aria-label="Start adventure"
          >
            <span className="btn-sparkle-burst-l">˗ˏˋ</span>
            <span className="btn-triangle-icon">▶</span>
            <span className="btn-label-text">START</span>
            <span className="btn-sparkle-burst-r">ˎˊ˗</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Modal / Switcher for Existing Profiles ──
function SelectProfileModal({ profiles, onSelect, onAddNew }) {
  return (
    <div className="profile-select-modal-overlay">
      <div className="profile-select-card card animate-scaleUp">
        <div className="profile-select-header">
          <div className="modal-bunny-icon">🐰</div>
          <h2>Choose Who is Playing</h2>
          <p>Select your explorer or create a new profile!</p>
        </div>

        <div className="profiles-select-grid">
          {profiles.map((p) => (
            <button
              key={p.id}
              className="player-select-card"
              onClick={() => onSelect(p.id)}
              id={`select-player-${p.id}`}
              aria-label={`Play as ${p.name}`}
            >
              <div className="player-avatar-circle">{p.avatarEmoji || '🐰'}</div>
              <div className="player-info-meta">
                <span className="player-name">{p.name}</span>
                <span className="player-age-tag">Age {p.age || 7}</span>
              </div>
              <div className="player-stars-pill">⭐ {p.stars || 0}</div>
            </button>
          ))}
        </div>

        <div className="modal-actions-bar">
          <button className="create-new-profile-btn" onClick={onAddNew}>
            ＋ Create New Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
