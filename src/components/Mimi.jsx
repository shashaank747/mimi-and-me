// ============================================================
// MIMI & ME — Mimi Character Component
//
// MASTER VISUAL REFERENCES (design locked — do not alter):
//   public/images/characters/mimi/mimi-reference.png
//   public/images/characters/mimi/mimi-expressions-reference.png
//   public/images/characters/mimi/mimi-poses-reference.png
//
// ASSET LOADING STRATEGY
//   1. Tries to load individual expression/pose .webp from /images/characters/mimi/
//   2. If the individual .webp asset does not exist yet, gracefully falls back to the clean SVG placeholder.
//   3. Reference sheets (mimi-reference.png, etc.) are kept in public/images/characters/mimi/
//      as canonical master references for artists, and are NOT displayed as in-game sprites.
//   4. The application NEVER crashes because an individual asset is missing.
//
// WHEN INDIVIDUAL ASSETS ARE SUPPLIED
//   Drop mimi-{expression}.webp or mimi-{pose}.webp into public/images/characters/mimi/
//   The component automatically resolves and displays them — no code changes needed.
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  MIMI_EXPRESSIONS,
  MIMI_POSES,
  getMimiExpressionPath,
  getMimiPosePath,
} from '../data/mimiAssets.js';

// ── Animation class map ──
const EXPRESSION_ANIM = {
  happy:                  'mimi-anim--idle',
  excited:                'mimi-anim--bounce',
  curious:                'mimi-anim--idle',
  thinking:               'mimi-anim--sway',
  surprised:              'mimi-anim--pop',
  confused:               'mimi-anim--sway',
  celebrating:            'mimi-anim--celebrate',
  sleeping:               'mimi-anim--breathe',
  'gentle-disappointment':'mimi-anim--sway',
  listening:              'mimi-anim--idle',
};

const POSE_ANIM = {
  standing:  '',
  sitting:   '',
  jumping:   'mimi-anim--bounce',
  running:   'mimi-anim--run',
  waving:    'mimi-anim--wave',
  pointing:  '',
  walking:   'mimi-anim--walk',
  cheering:  'mimi-anim--celebrate',
};

// ── SVG Placeholder (shown until individual artwork assets are supplied) ──
function MimiSVGPlaceholder({ size, expression }) {
  const blush = ['happy', 'excited', 'celebrating'].includes(expression);
  const eyeChar = expression === 'sleeping' ? '─'
    : expression === 'surprised' ? '◉'
    : ['thinking', 'curious'].includes(expression) ? '◑'
    : '◕';
  const mouthChar = ['happy', 'excited', 'celebrating', 'listening'].includes(expression) ? '‿'
    : expression === 'sleeping' ? '·'
    : expression === 'surprised' ? '○'
    : '·';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mimi the bunny (placeholder)"
    >
      {/* Left ear */}
      <ellipse cx="38" cy="28" rx="12" ry="22" fill="#F8D7E3" />
      <ellipse cx="38" cy="28" rx="7"  ry="16" fill="#F4A0BD" />
      {/* Right ear */}
      <ellipse cx="82" cy="28" rx="12" ry="22" fill="#F8D7E3" />
      <ellipse cx="82" cy="28" rx="7"  ry="16" fill="#F4A0BD" />
      {/* Body */}
      <ellipse cx="60" cy="88" rx="28" ry="22" fill="#FAE8F0" />
      {/* Head */}
      <circle cx="60" cy="62" r="32" fill="#FDDDE6" />
      <circle cx="60" cy="62" r="32" fill="url(#headGrad)" />
      {/* Blush */}
      {blush && (
        <>
          <ellipse cx="43" cy="70" rx="8" ry="5" fill="#F9A8C9" opacity="0.6" />
          <ellipse cx="77" cy="70" rx="8" ry="5" fill="#F9A8C9" opacity="0.6" />
        </>
      )}
      {/* Eyes */}
      <text x="44" y="66" fontSize="14" textAnchor="middle" fill="#2D2D2D">{eyeChar}</text>
      <text x="76" y="66" fontSize="14" textAnchor="middle" fill="#2D2D2D">{eyeChar}</text>
      {/* Nose */}
      <ellipse cx="60" cy="71" rx="4" ry="3" fill="#F472B6" />
      {/* Mouth */}
      <text x="60" y="80" fontSize="11" textAnchor="middle" fill="#2D2D2D">{mouthChar}</text>
      {/* Backpack */}
      <rect x="78" y="78" width="14" height="16" rx="4" fill="#60A5FA" />
      <rect x="80" y="76" width="10" height="4"  rx="2" fill="#3B82F6" />
      <circle cx="85" cy="86" r="2" fill="#2563EB" />
      {/* Sleeping Zs */}
      {expression === 'sleeping' && (
        <>
          <text x="88" y="50" fontSize="10" fill="#9CA3AF" opacity="0.8">z</text>
          <text x="94" y="42" fontSize="14" fill="#9CA3AF" opacity="0.6">z</text>
        </>
      )}
      <defs>
        <radialGradient id="headGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F4B8CC" stopOpacity="0.1" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Main Mimi Component ──
export default function Mimi({
  expression = 'happy',  // see MIMI_EXPRESSIONS in mimiAssets.js
  pose = null,           // see MIMI_POSES in mimiAssets.js (optional; overrides expression asset)
  size = 120,
  animated = true,
  className = '',
  style = {},
}) {
  // Resolve individual asset path to try
  const targetPath = pose
    ? getMimiPosePath(pose)
    : getMimiExpressionPath(expression);

  // Track if the individual image asset is available
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [targetPath]);

  const handleImgError = () => {
    // Individual asset not present yet -> use SVG placeholder
    setImgFailed(true);
  };

  // Determine animation class
  const animClass = animated
    ? (pose ? (POSE_ANIM[pose] || '') : (EXPRESSION_ANIM[expression] || 'mimi-anim--idle'))
    : '';

  const safeExpression = MIMI_EXPRESSIONS.includes(expression) ? expression : 'happy';

  return (
    <div
      className={`mimi-wrapper ${animClass} ${className}`}
      style={{ width: size, height: size, display: 'inline-block', flexShrink: 0, ...style }}
    >
      {imgFailed || !targetPath ? (
        // Clean placeholder — shown until individual webp assets are supplied
        <MimiSVGPlaceholder size={size} expression={safeExpression} />
      ) : (
        <img
          src={targetPath}
          alt={`Mimi the bunny — ${pose || expression}`}
          width={size}
          height={size}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            display: 'block',
            imageRendering: 'auto',
          }}
          onError={handleImgError}
          draggable={false}
        />
      )}
    </div>
  );
}
