// ============================================================
// MIMI & ME — GameCard Component
// ============================================================
import React from 'react';
import './GameCard.css';

export default function GameCard({
  emoji,
  title,
  subtitle,
  color = 'var(--color-primary)',
  locked = false,
  completed = false,
  onClick,
  id,
  progress = null, // 0-100
}) {
  return (
    <button
      id={id}
      className={`game-card ${locked ? 'game-card--locked' : ''} ${completed ? 'game-card--completed' : ''}`}
      style={{ '--card-color': color }}
      onClick={locked ? undefined : onClick}
      disabled={locked}
      aria-label={`${title}${locked ? ', locked' : ''}${completed ? ', completed' : ''}`}
    >
      <div className="game-card-emoji">{locked ? '🔒' : emoji}</div>
      <div className="game-card-title">{title}</div>
      {subtitle && <div className="game-card-subtitle">{subtitle}</div>}
      {progress !== null && !locked && (
        <div className="game-card-progress">
          <div className="game-card-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
      {completed && <div className="game-card-check">✓</div>}
    </button>
  );
}
