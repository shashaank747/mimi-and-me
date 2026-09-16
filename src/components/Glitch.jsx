// ============================================================
// MIMI & ME — Glitch Character Component
//
// MASTER VISUAL REFERENCE (design locked — do not alter):
//   public/images/characters/glitch/glitch-reference.png
//
// ASSET LOADING STRATEGY
//   1. Tries to load individual expression/pose .webp from /images/characters/glitch/
//   2. If the individual .webp asset does not exist yet, gracefully falls back to the clean SVG placeholder.
//   3. Reference sheets (glitch-reference.png, etc.) are kept in public/images/characters/glitch/
//      as canonical master references for artists, and are NOT displayed as in-game sprites.
//   4. The application NEVER crashes because an individual asset is missing.
//
// WHEN INDIVIDUAL ASSETS ARE SUPPLIED
//   Drop glitch-{expression}.webp or glitch-{pose}.webp into public/images/characters/glitch/
//   The component automatically resolves and displays them — no code changes needed.
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  GLITCH_EXPRESSIONS,
  GLITCH_POSES,
  getGlitchExpressionPath,
  getGlitchPosePath,
} from '../data/glitchAssets.js';

// ── Animation class map ──
const EXPRESSION_ANIM = {
  mischievous: 'animate-wiggle',
  sneaky:      'animate-float',
  laughing:    'animate-bounce',
  surprised:   'animate-pop',
  confused:    'animate-wiggle',
  defeated:    'animate-shake',
  angry:       'animate-shake',
  happy:       'animate-bounce',
  celebrating: 'animate-bounce',
  idle:        'animate-float',
};

const POSE_ANIM = {
  standing:   '',
  floating:   'animate-float',
  sneaking:   'animate-float',
  running:    'animate-wiggle',
  scrambling: 'animate-shake',
  hiding:     '',
  casting:    'animate-pulse',
  cheering:   'animate-bounce',
};

// ── SVG Placeholder (shown until individual artwork assets are supplied) ──
function GlitchSVGPlaceholder({ size, expression }) {
  const eyeChar = expression === 'defeated' ? '×'
    : expression === 'laughing' ? '^'
    : expression === 'surprised' ? '⊙'
    : expression === 'angry' ? '▼'
    : '✦';

  const mouthChar = expression === 'defeated' ? '﹏'
    : expression === 'laughing' ? '▽'
    : expression === 'angry' ? '皿'
    : expression === 'surprised' ? 'o'
    : '‿';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Glitch (placeholder)"
    >
      <defs>
        <radialGradient id="glitchGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#581C87" />
        </radialGradient>
        <filter id="glitchGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Left Horn/Antenna */}
      <path d="M 40 45 Q 30 20 22 26 Q 32 38 42 50 Z" fill="#7E22CE" />
      <circle cx="22" cy="24" r="5" fill="#C084FC" filter="url(#glitchGlow)" />

      {/* Right Horn/Antenna */}
      <path d="M 80 45 Q 90 20 98 26 Q 88 38 78 50 Z" fill="#7E22CE" />
      <circle cx="98" cy="24" r="5" fill="#C084FC" filter="url(#glitchGlow)" />

      {/* Main Body */}
      <rect x="30" y="38" width="60" height="58" rx="20" fill="url(#glitchGrad)" />

      {/* Glitch Pixels / Digital Artifacts */}
      <rect x="24" y="60" width="8" height="6" rx="1" fill="#A855F7" opacity="0.8" />
      <rect x="88" y="48" width="7" height="7" rx="1" fill="#C084FC" opacity="0.7" />
      <rect x="36" y="88" width="9" height="5" rx="1" fill="#6B21A8" opacity="0.9" />

      {/* Eyes Screen / Visor */}
      <rect x="38" y="50" width="44" height="22" rx="7" fill="#1E1B4B" />

      {/* Eyes */}
      <text x="50" y="66" fontSize="13" textAnchor="middle" fill="#F43F5E" fontWeight="bold">
        {eyeChar}
      </text>
      <text x="70" y="66" fontSize="13" textAnchor="middle" fill="#F43F5E" fontWeight="bold">
        {eyeChar}
      </text>

      {/* Mouth */}
      <text x="60" y="85" fontSize="12" textAnchor="middle" fill="#E9D5FF">
        {mouthChar}
      </text>

      {/* Sparkles / Electric Sparks */}
      <path d="M 28 42 L 32 44 L 28 46 L 26 44 Z" fill="#F472B6" />
      <path d="M 92 78 L 96 80 L 92 82 L 90 80 Z" fill="#38BDF8" />
    </svg>
  );
}

// ── Main Glitch Component ──
export default function Glitch({
  expression = 'mischievous', // see GLITCH_EXPRESSIONS in glitchAssets.js
  pose = null,                // see GLITCH_POSES in glitchAssets.js (optional)
  size = 120,
  animated = true,
  className = '',
  style = {},
}) {
  // Resolve individual asset path to try
  const targetPath = pose
    ? getGlitchPosePath(pose)
    : getGlitchExpressionPath(expression);

  // Track if individual image asset is available
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
    ? (pose ? (POSE_ANIM[pose] || '') : (EXPRESSION_ANIM[expression] || 'animate-wiggle'))
    : '';

  const safeExpression = GLITCH_EXPRESSIONS.includes(expression) ? expression : 'mischievous';

  return (
    <div
      className={`glitch-wrapper ${animClass} ${className}`}
      style={{ width: size, height: size, display: 'inline-block', flexShrink: 0, ...style }}
    >
      {imgFailed || !targetPath ? (
        // Clean placeholder — shown until individual webp assets are supplied
        <GlitchSVGPlaceholder size={size} expression={safeExpression} />
      ) : (
        <img
          src={targetPath}
          alt={`Glitch — ${pose || expression}`}
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
