// ============================================================
// MIMI & ME — GraffitiCelebration Component
// Global reusable level-complete celebration
// Props API is FINAL — animations are stubs in Phase 1, filled in Phase 6
// ============================================================
import React, { useEffect, useState } from 'react';
import Button from './Button.jsx';
import './GraffitiCelebration.css';

const STAR_EMOJIS = ['⭐', '⭐', '⭐'];

export default function GraffitiCelebration({
  stars = 3,               // 1 | 2 | 3
  message = 'WOW, MIMI!', // dynamic message
  badge = null,            // achievement label or null
  animation = 'slide',     // slide | bounce | sticker-slap | spray | confetti | rotate | character
  onNext,                  // callback to proceed
  isPersonalBest = false,  // triggers special celebration variant
  reward = null,           // { emoji, name } — reward earned
  xp = 0,                  // XP earned to display
}) {
  const [visible, setVisible] = useState(false);
  const [starsVisible, setStarsVisible] = useState([false, false, false]);

  useEffect(() => {
    // Slide in
    const t1 = setTimeout(() => setVisible(true), 50);
    // Stars appear one by one
    const t2 = setTimeout(() => setStarsVisible(v => [true, v[1], v[2]]), 400);
    const t3 = setTimeout(() => setStarsVisible(v => [v[0], true, v[2]]), 600);
    const t4 = setTimeout(() => setStarsVisible(v => [v[0], v[1], true]), 800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const animClass = visible ? `graffiti--${animation}` : 'graffiti--hidden';

  return (
    <div className="graffiti-overlay" role="dialog" aria-label="Level complete">
      <div className={`graffiti-card ${animClass} ${isPersonalBest ? 'graffiti--personal-best' : ''}`}>

        {/* Header emoji */}
        <div className="graffiti-emoji">🎨</div>

        {/* Personal best banner */}
        {isPersonalBest && (
          <div className="graffiti-pb-banner animate-fadeInDown">
            📈 New Personal Best!
          </div>
        )}

        {/* Message */}
        <h2 className="graffiti-message">{message}</h2>

        {/* Stars */}
        <div className="graffiti-stars" aria-label={`${stars} out of 3 stars`}>
          {STAR_EMOJIS.map((star, i) => (
            <span
              key={i}
              className={`graffiti-star ${starsVisible[i] ? 'graffiti-star--visible' : ''} ${i >= stars ? 'graffiti-star--empty' : ''}`}
              aria-hidden="true"
            >
              {i < stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>

        {/* XP */}
        {xp > 0 && (
          <div className="graffiti-xp animate-fadeIn">+{xp} ⭐</div>
        )}

        {/* Badge */}
        {badge && (
          <div className="graffiti-badge animate-scaleIn">
            🏆 {badge}
          </div>
        )}

        {/* Reward */}
        {reward && (
          <div className="graffiti-reward animate-bounceIn">
            <span className="graffiti-reward-emoji">{reward.emoji}</span>
            <span className="graffiti-reward-name">{reward.name} unlocked!</span>
          </div>
        )}

        {/* Next button */}
        <Button
          id="graffiti-next-btn"
          variant="primary"
          size="xl"
          fullWidth
          onClick={onNext}
          className="graffiti-next-btn"
        >
          Keep Going! ▶
        </Button>
      </div>
    </div>
  );
}
