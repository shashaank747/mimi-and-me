// ============================================================
// MIMI & ME — Numbers Page (stub for Phase 3)
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NUMBERS } from '../data/numbers.js';
import { ProfileManager } from '../systems/ProfileManager.js';
import Header from '../components/Header.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import './Numbers.css';

export default function Numbers() {
  const navigate = useNavigate();
  const profile = ProfileManager.getActive();
  if (!profile) { navigate('/profile-select'); return null; }
  const learned = new Set(profile.numbersLearned || []);

  return (
    <div className="page numbers-page">
      <Header profile={profile} showBack title="Numbers" />
      <ProgressBar value={learned.size} max={20} label="1–20 Progress" />
      <div className="numbers-grid">
        {NUMBERS.map((n) => {
          const isLearned = learned.has(n.number);
          return (
            <button
              key={n.number}
              className={`number-tile ${isLearned ? 'number-tile--learned' : ''}`}
              style={{ '--number-color': n.color }}
              aria-label={`Number ${n.number}, ${n.word}`}
            >
              <span className="number-tile-val">{n.number}</span>
              <span className="number-tile-emoji">{n.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
