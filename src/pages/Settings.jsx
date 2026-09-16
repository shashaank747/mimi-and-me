// ============================================================
// MIMI & ME — Settings Page + Parent Zone
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileManager } from '../systems/ProfileManager.js';
import { ProgressManager } from '../systems/ProgressManager.js';
import { getSettings, saveSettings } from '../utils/storage.js';
import { AudioManager } from '../systems/AudioManager.js';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';
import './Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(ProfileManager.getActive());
  const [settings, setSettings] = useState(getSettings());
  const [showParentZone, setShowParentZone] = useState(false);

  useEffect(() => {
    const current = ProfileManager.getActive();
    if (!current) {
      navigate('/profile-select');
    } else {
      setProfile(current);
    }
  }, [navigate]);

  if (!profile) return null;

  const handleToggle = (key) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveSettings(next);
    if (key === 'voiceEnabled') AudioManager.setVoice(next.voiceEnabled);
    if (key === 'musicEnabled') AudioManager.setMusic(next.musicEnabled);
    if (key === 'sfxEnabled')   AudioManager.setSfx(next.sfxEnabled);
    AudioManager.playClick();
  };

  if (showParentZone) {
    return (
      <ParentZone
        activeProfile={profile}
        onProfileChanged={(newProfile) => {
          if (!newProfile) {
            navigate('/profile-select');
          } else {
            setProfile(newProfile);
          }
        }}
        onBack={() => setShowParentZone(false)}
      />
    );
  }

  return (
    <div className="page settings-page">
      <Header profile={profile} showBack title="Settings" />

      <div className="settings-list animate-fadeInUp card">
        <SettingToggle
          id="voice-toggle"
          label="🔊 Voice"
          description="Mimi speaks instructions"
          checked={settings.voiceEnabled}
          onChange={() => handleToggle('voiceEnabled')}
        />
        <SettingToggle
          id="music-toggle"
          label="🎵 Music"
          description="Background music"
          checked={settings.musicEnabled}
          onChange={() => handleToggle('musicEnabled')}
        />
        <SettingToggle
          id="sfx-toggle"
          label="🔔 Sound Effects"
          description="Clicks, correct, wrong"
          checked={settings.sfxEnabled}
          onChange={() => handleToggle('sfxEnabled')}
        />

        <div className="divider" />

        <div className="settings-item">
          <div className="settings-item-text">
            <span className="settings-label">👤 Switch Profile</span>
          </div>
          <Button id="switch-profile-btn" variant="ghost" size="sm" onClick={() => navigate('/profile-select')}>Switch</Button>
        </div>

        <div className="divider" />

        {/* Parent Zone — hold for 3 seconds */}
        <HoldButton onComplete={() => setShowParentZone(true)} />
      </div>
    </div>
  );
}

// ── Toggle Component ──
function SettingToggle({ id, label, description, checked, onChange }) {
  return (
    <div className="settings-item">
      <div className="settings-item-text">
        <span className="settings-label">{label}</span>
        <span className="settings-desc">{description}</span>
      </div>
      <button
        id={id}
        className={`toggle-btn ${checked ? 'toggle-btn--on' : ''}`}
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span className="toggle-knob" />
      </button>
    </div>
  );
}

// ── Hold-for-3s Parent Gate ──
function HoldButton({ onComplete }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const startRef = useRef(null);

  const startHold = () => {
    setHolding(true);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / 3000) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalRef.current);
        setHolding(false);
        setProgress(0);
        onComplete();
      }
    }, 50);
  };

  const stopHold = () => {
    clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(0);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="parent-gate-section">
      <div className="parent-gate-label">⚙️ Parent Zone</div>
      <button
        id="parent-zone-hold-btn"
        className={`parent-gate-btn ${holding ? 'parent-gate-btn--holding' : ''}`}
        onPointerDown={startHold}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        aria-label="Hold for 3 seconds to enter Parent Zone"
      >
        {holding ? (
          <>
            <svg className="hold-ring" viewBox="0 0 100 100" width="60" height="60">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#eee" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.05s linear' }}
              />
            </svg>
            <span className="hold-text">Hold...</span>
          </>
        ) : (
          <>
            🔒
            <span className="hold-text">Hold for 3 seconds</span>
          </>
        )}
      </button>
    </div>
  );
}

// ── Parent Zone Dashboard ──
function ParentZone({ activeProfile, onProfileChanged, onBack }) {
  const [profiles, setProfiles] = useState(ProfileManager.getAll());
  const [targetToDelete, setTargetToDelete] = useState(null);
  const stats = ProgressManager.getParentStats(activeProfile);

  const handleDeleteConfirmed = (profileId) => {
    ProfileManager.delete(profileId);
    AudioManager.playWrong(); // audio cue
    const remaining = ProfileManager.getAll();
    setProfiles(remaining);
    setTargetToDelete(null);

    if (remaining.length === 0) {
      onProfileChanged(null);
    } else if (activeProfile.id === profileId) {
      // Switched to first remaining profile
      ProfileManager.setActive(remaining[0].id);
      onProfileChanged(remaining[0]);
    }
  };

  return (
    <div className="page settings-page">
      <Header profile={null} showBack title="Parent Zone" />
      <button className="back-link" onClick={onBack}>◀ Back to Settings</button>

      {/* Progress overview */}
      <div className="parent-zone card animate-fadeInUp">
        <div className="parent-zone-title">📊 {activeProfile.name}'s Learning Progress</div>

        <div className="parent-stats-grid">
          <StatBox label="🔤 Letters" value={`${stats.lettersLearned} / 26`} />
          <StatBox label="🔢 Numbers" value={`${stats.numbersLearned} / 20`} />
          {stats.additionAccuracy !== null && (
            <StatBox label="➕ Addition" value={`${stats.additionAccuracy}%`} />
          )}
          {stats.subtractionAccuracy !== null && (
            <StatBox label="➖ Subtraction" value={`${stats.subtractionAccuracy}%`} />
          )}
          <StatBox label="⏱️ Avg Session" value={stats.avgSessionMinutes > 0 ? `${stats.avgSessionMinutes} min` : 'N/A'} />
          <StatBox label="🏆 Achievements" value={`${stats.achievementCount}`} />
        </div>

        <div className="parent-note">
          Progress is saved on this device only.
        </div>
      </div>

      {/* ── Parent Controls: Manage & Delete Profiles ── */}
      <div className="parent-zone card parent-danger-card animate-fadeInUp mt-4">
        <div className="parent-section-header">
          <span className="parent-section-icon">🛡️</span>
          <div>
            <h3 className="parent-section-heading">Parent Control: Manage Profiles</h3>
            <p className="parent-section-sub">Delete child profiles or reset learning data (Parent verification required)</p>
          </div>
        </div>

        <div className="parent-profiles-list">
          {profiles.map((p) => (
            <div key={p.id} className="parent-profile-row">
              <div className="parent-profile-info">
                <span className="parent-profile-avatar">{p.avatarEmoji || '🐰'}</span>
                <div>
                  <div className="parent-profile-name">
                    {p.name} {p.id === activeProfile.id && <span className="active-badge">Active</span>}
                  </div>
                  <div className="parent-profile-meta">
                    Age {p.age || '—'} • ⭐ {p.stars || 0} stars {p.parentName ? `• Parent: ${p.parentName}` : ''}
                  </div>
                </div>
              </div>

              <button
                className="delete-profile-btn"
                onClick={() => {
                  AudioManager.playClick();
                  setTargetToDelete(p);
                }}
                aria-label={`Delete profile for ${p.name}`}
              >
                🗑️ Delete Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Parent Verification Modal for Deletion */}
      {targetToDelete && (
        <ParentDeleteModal
          profile={targetToDelete}
          onConfirm={() => handleDeleteConfirmed(targetToDelete.id)}
          onCancel={() => setTargetToDelete(null)}
        />
      )}
    </div>
  );
}

// ── Parent Verification & Math Security Modal ──
function ParentDeleteModal({ profile, onConfirm, onCancel }) {
  // Generate random math challenge for adult verification
  const [num1] = useState(() => Math.floor(Math.random() * 6) + 6); // 6 to 11
  const [num2] = useState(() => Math.floor(Math.random() * 5) + 4); // 4 to 8
  const correctAnswer = num1 * num2;
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  const handleVerifyAndDelete = (e) => {
    e.preventDefault();
    if (parseInt(userAnswer.trim(), 10) !== correctAnswer) {
      setError(`Incorrect answer. Please solve ${num1} × ${num2} to prove you are a parent.`);
      AudioManager.playWrong();
      return;
    }
    onConfirm();
  };

  return (
    <div className="parent-modal-overlay">
      <div className="parent-modal-card animate-scaleUp">
        <div className="parent-modal-badge">⚠️ Parent Verification</div>
        <h2 className="parent-modal-title">Delete "{profile.name}"?</h2>
        <p className="parent-modal-warning">
          This will <strong>permanently erase</strong> all stars, completed levels, achievements, and statistics for <strong>{profile.name}</strong>. This action cannot be undone.
        </p>

        <form onSubmit={handleVerifyAndDelete} className="parent-verify-form">
          <label className="parent-math-prompt">
            <span>🔒 Adult Verification: What is <strong>{num1} × {num2}</strong>?</span>
            <input
              type="number"
              placeholder="Answer"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              className="parent-math-input"
            />
          </label>

          {error && <div className="parent-verify-error">{error}</div>}

          <div className="parent-modal-actions">
            <button type="button" className="parent-cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="parent-confirm-delete-btn"
              disabled={!userAnswer.trim()}
            >
              Confirm &amp; Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="stat-box">
      <div className="stat-box-label">{label}</div>
      <div className="stat-box-value">{value}</div>
    </div>
  );
}
