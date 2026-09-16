// ============================================================
// MIMI & ME — Math Page (stub for Phase 4)
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MATH_OPERATIONS } from '../data/math.js';
import { ProfileManager } from '../systems/ProfileManager.js';
import Header from '../components/Header.jsx';
import './Math.css';

export default function Math() {
  const navigate = useNavigate();
  const profile = ProfileManager.getActive();
  if (!profile) { navigate('/profile-select'); return null; }
  const mathAcc = profile?.stats?.mathAccuracy || {};

  return (
    <div className="page math-page">
      <Header profile={profile} showBack title="Math" />
      <div className="math-grid">
        {MATH_OPERATIONS.map((op, idx) => {
          const prevAcc = idx === 0 ? 100 : (mathAcc[MATH_OPERATIONS[idx-1].id] ?? null);
          const isUnlocked = idx === 0 || (prevAcc !== null && prevAcc >= op.unlockAfterAccuracy);
          return (
            <button
              key={op.id}
              disabled={!isUnlocked}
              className={`math-op-card ${!isUnlocked ? 'math-op-card--locked' : ''}`}
              style={{ '--op-color': op.color }}
              aria-label={`${op.label}${!isUnlocked ? ', locked' : ''}`}
            >
              <span className="math-op-emoji">{isUnlocked ? op.emoji : '🔒'}</span>
              <div className="math-op-info">
                <div className="math-op-label">{op.label}</div>
                {!isUnlocked && <div className="math-op-locked-msg">Unlock at {op.unlockAfterAccuracy}% accuracy</div>}
                {isUnlocked && mathAcc[op.id] && <div className="math-op-accuracy">Accuracy: {mathAcc[op.id]}%</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
