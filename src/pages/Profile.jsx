// ============================================================
// MIMI & ME — Profile Page (Select + Create)
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileManager } from '../systems/ProfileManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import Button from '../components/Button.jsx';
import Mimi from '../components/Mimi.jsx';
import './Profile.css';

const AGE_OPTIONS = [3, 4, 5, 6, 7, 8];
const MAX_PROFILES = 6;

// ── Main export: shows select or create depending on state ──
export default function ProfilePage() {
  const navigate = useNavigate();
  const profiles = ProfileManager.getAll();
  const [view, setView] = useState(profiles.length === 0 ? 'create' : 'select');

  const handleSelect = (profileId) => {
    AudioManager.resumeContext();
    AudioManager.playClick();
    ProfileManager.setActive(profileId);
    navigate('/home');
  };

  if (view === 'create') {
    return <CreateProfile onCreated={handleSelect} onBack={profiles.length > 0 ? () => setView('select') : null} />;
  }

  return <SelectProfile profiles={profiles} onSelect={handleSelect} onAdd={() => setView('create')} />;
}

// ── Profile Selector ──
function SelectProfile({ profiles, onSelect, onAdd }) {
  return (
    <div className="page profile-select-page">
      <div className="profile-select-header animate-fadeInDown">
        <Mimi expression="happy" size={100} animated />
        <h1 className="profile-select-title">Who is playing?</h1>
      </div>

      <div className="profile-grid animate-fadeInUp">
        {profiles.map((p) => (
          <button
            key={p.id}
            className="profile-card"
            onClick={() => onSelect(p.id)}
            id={`profile-${p.id}`}
            aria-label={`Play as ${p.name}`}
          >
            <span className="profile-card-avatar">{p.avatarEmoji || '🐰'}</span>
            <span className="profile-card-name">{p.name}</span>
            <span className="profile-card-stars">⭐ {p.stars || 0}</span>
            {p.age && <span className="profile-card-age">Age {p.age}</span>}
          </button>
        ))}

        {profiles.length < MAX_PROFILES && (
          <button className="profile-card profile-card--add" onClick={onAdd} id="add-profile-btn" aria-label="Add player">
            <span className="profile-card-avatar">＋</span>
            <span className="profile-card-name">Add Player</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Profile Creator ──
function CreateProfile({ onCreated, onBack }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(null);
  const [className, setClassName] = useState('');
  const [parentName, setParentName] = useState('');
  const [error, setError] = useState('');
  const [mimiExpr, setMimiExpr] = useState('happy');

  const canStart = name.trim() !== '' && age !== null;

  const handleStart = () => {
    if (!canStart) { setError('Please enter your name and age!'); return; }
    AudioManager.playLevelStart();
    const profile = ProfileManager.create({
      name: name.trim(),
      age,
      className: className.trim(),
      parentName: parentName.trim(),
    });
    onCreated(profile.id);
  };

  return (
    <div className="page create-profile-page">
      {onBack && (
        <button className="back-link" onClick={onBack} aria-label="Back to profile select">◀ Back</button>
      )}

      <div className="create-profile-header animate-fadeInDown">
        <Mimi expression={mimiExpr} size={100} animated />
        <h1 className="create-profile-title">Welcome to<br />Mimi &amp; Me!</h1>
      </div>

      <div className="create-profile-form animate-fadeInUp card">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="profile-name">What's your name? <span style={{color:'var(--color-primary)'}}>*</span></label>
          <input
            id="profile-name"
            type="text"
            placeholder="Your name"
            value={name}
            maxLength={20}
            onChange={(e) => { setName(e.target.value); setMimiExpr('excited'); }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {/* Age */}
        <div className="form-group">
          <label>How old are you? <span style={{color:'var(--color-primary)'}}>*</span></label>
          <div className="age-grid">
            {AGE_OPTIONS.map((a) => (
              <button
                key={a}
                id={`age-${a}`}
                className={`age-btn ${age === a ? 'age-btn--selected' : ''}`}
                onClick={() => { setAge(a); setMimiExpr('excited'); }}
                aria-label={`Age ${a}`}
                aria-pressed={age === a}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Class — hidden for age 3 */}
        {age !== 3 && (
          <div className="form-group">
            <label htmlFor="profile-class">
              Which class are you in?
              <span className="label-optional">(optional)</span>
            </label>
            <input
              id="profile-class"
              type="text"
              placeholder="e.g. Class 1, KG..."
              value={className}
              maxLength={20}
              onChange={(e) => setClassName(e.target.value)}
              autoComplete="off"
            />
          </div>
        )}

        {/* Parent name — optional in V1 */}
        <div className="form-group">
          <label htmlFor="profile-parent">
            Parent's Name
            <span className="label-optional">(optional)</span>
          </label>
          <input
            id="profile-parent"
            type="text"
            placeholder="Parent's name"
            value={parentName}
            maxLength={30}
            onChange={(e) => setParentName(e.target.value)}
            autoComplete="off"
          />
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <Button
          id="start-btn"
          variant="primary"
          size="xl"
          fullWidth
          disabled={!canStart}
          onClick={handleStart}
          className="mt-4"
        >
          ▶ START
        </Button>
      </div>
    </div>
  );
}
