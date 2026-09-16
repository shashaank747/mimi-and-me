// ============================================================
// MIMI & ME — StarRating Component
// ============================================================
import React from 'react';

export default function StarRating({ stars = 0, max = 3, size = '2rem', animated = false }) {
  return (
    <div
      style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
      role="img"
      aria-label={`${stars} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            opacity: i < stars ? 1 : 0.25,
            filter: i < stars ? 'none' : 'grayscale(1)',
            display: 'inline-block',
            animation: animated && i < stars ? `starPop 0.4s ease ${i * 0.2}s both` : 'none',
            transition: 'opacity 0.3s ease',
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
