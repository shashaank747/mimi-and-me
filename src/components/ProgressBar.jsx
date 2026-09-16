// ============================================================
// MIMI & ME — ProgressBar Component
// ============================================================
import React from 'react';

export default function ProgressBar({ value = 0, max = 100, label = '', color = null }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>{label}</span>
          <span style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>{value}/{max}</span>
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: color || 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
          }}
        />
      </div>
    </div>
  );
}
