// ============================================================
// MIMI & ME — Reusable Button Component
// ============================================================
import React from 'react';
import './Button.css';

export default function Button({
  children,
  onClick,
  variant = 'primary',  // primary | secondary | ghost | danger | icon
  size = 'md',          // sm | md | lg | xl
  disabled = false,
  fullWidth = false,
  id,
  className = '',
  style = {},
  type = 'button',
  ariaLabel,
}) {
  return (
    <button
      id={id}
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {children}
    </button>
  );
}
