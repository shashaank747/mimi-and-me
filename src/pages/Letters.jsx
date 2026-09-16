// ============================================================
// MIMI & ME — Letters Screen (Complete A–Z Learning Hub)
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LETTERS } from '../data/letters.js';
import { ProfileManager } from '../systems/ProfileManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import Header from '../components/Header.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Mimi from '../components/Mimi.jsx';
import Button from '../components/Button.jsx';
import './Letters.css';

export default function Letters() {
  const navigate = useNavigate();
  const profile = ProfileManager.getActive();
  if (!profile) { navigate('/profile-select'); return null; }

  const learnedSet = new Set(profile.lettersLearned || []);
  const masteredSet = new Set(profile.lettersMastered || []);
  const [filter, setFilter] = useState('all'); // 'all', 'vowels', 'in_progress', 'mastered'
  const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredLetters = LETTERS.filter(l => {
    if (filter === 'vowels') return l.isVowel;
    if (filter === 'in_progress') return learnedSet.has(l.letter) && !masteredSet.has(l.letter);
    if (filter === 'mastered') return masteredSet.has(l.letter);
    return true;
  });

  const handleTileClick = (letterData) => {
    AudioManager.playClick();
    AudioManager.speakLetter(letterData.letter, letterData.word);
    setSelectedLetter(letterData);
  };

  const handleStartMode = (mode) => {
    if (!selectedLetter) return;
    AudioManager.playClick();
    const char = selectedLetter.letter.toLowerCase();
    navigate(`/play/${mode}-${char}`);
  };

  return (
    <div className="page letters-page">
      <Header profile={profile} showBack title="Letters A–Z" />

      {/* Progress overview */}
      <div className="letters-overview-card animate-fadeInDown">
        <div className="overview-stats">
          <span className="overview-count">
            <strong>{learnedSet.size}</strong> of 26 Learned
          </span>
          <span className="overview-mastered">
            ⭐ {masteredSet.size} Mastered
          </span>
        </div>
        <ProgressBar
          value={learnedSet.size}
          max={26}
          label="A–Z Mastery"
          className="mt-2"
        />
      </div>

      {/* Filter Tabs */}
      <div className="letters-filter-bar animate-fadeIn">
        <button
          className={`filter-chip ${filter === 'all' ? 'filter-chip--active' : ''}`}
          onClick={() => { AudioManager.playClick(); setFilter('all'); }}
        >
          All (26)
        </button>
        <button
          className={`filter-chip ${filter === 'vowels' ? 'filter-chip--active' : ''}`}
          onClick={() => { AudioManager.playClick(); setFilter('vowels'); }}
        >
          Vowels (5)
        </button>
        <button
          className={`filter-chip ${filter === 'in_progress' ? 'filter-chip--active' : ''}`}
          onClick={() => { AudioManager.playClick(); setFilter('in_progress'); }}
        >
          Learning ({learnedSet.size - masteredSet.size})
        </button>
        <button
          className={`filter-chip ${filter === 'mastered' ? 'filter-chip--active' : ''}`}
          onClick={() => { AudioManager.playClick(); setFilter('mastered'); }}
        >
          Mastered ({masteredSet.size})
        </button>
      </div>

      {/* A–Z Grid */}
      <div className="letters-grid animate-fadeInUp">
        {filteredLetters.map((letterData) => {
          const isLearned = learnedSet.has(letterData.letter);
          const isMastered = masteredSet.has(letterData.letter);
          const isSelected = selectedLetter?.letter === letterData.letter;

          return (
            <button
              key={letterData.letter}
              id={`letter-${letterData.letter}`}
              className={`letter-tile 
                ${isLearned ? 'letter-tile--learned' : ''} 
                ${isMastered ? 'letter-tile--mastered' : ''}
                ${isSelected ? 'letter-tile--selected' : ''}
              `}
              style={{ '--letter-color': letterData.color }}
              onClick={() => handleTileClick(letterData)}
              aria-label={`Letter ${letterData.letter}, ${letterData.word}`}
            >
              <span className="letter-tile-char">{letterData.letter}</span>
              <span className="letter-tile-lower">{letterData.lowercase}</span>
              <span className="letter-tile-emoji">{letterData.emoji}</span>
              {isMastered ? (
                <span className="letter-tile-badge badge-mastered">⭐</span>
              ) : isLearned ? (
                <span className="letter-tile-badge badge-learned">✓</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Selected Letter Action Modal / Drawer */}
      {selectedLetter && (
        <div className="letter-action-modal animate-scaleIn">
          <div className="modal-header">
            <div className="modal-letter-tag" style={{ background: selectedLetter.color }}>
              <span className="modal-letter-big">{selectedLetter.letter}</span>
              <span className="modal-letter-small">{selectedLetter.lowercase}</span>
            </div>
            <div className="modal-title-info">
              <h3 className="modal-word-title">{selectedLetter.word} {selectedLetter.emoji}</h3>
              <span className="modal-phonics">Sound: /{selectedLetter.phonics}/</span>
            </div>
            <button className="modal-close-btn" onClick={() => setSelectedLetter(null)}>✕</button>
          </div>

          <p className="modal-sentence">"{selectedLetter.sentence}"</p>

          <div className="modal-actions-grid">
            <button className="letter-mode-btn mode--learn" onClick={() => handleStartMode('learn')}>
              <span className="mode-icon">📖</span>
              <span className="mode-title">Learn &amp; Hear</span>
            </button>
            <button className="letter-mode-btn mode--trace" onClick={() => handleStartMode('trace')}>
              <span className="mode-icon">✍️</span>
              <span className="mode-title">Trace Letter</span>
            </button>
            <button className="letter-mode-btn mode--practice" onClick={() => handleStartMode('practice')}>
              <span className="mode-icon">🎯</span>
              <span className="mode-title">Practice Quiz</span>
            </button>
            <button className="letter-mode-btn mode--play" onClick={() => handleStartMode('play')}>
              <span className="mode-icon">🔍</span>
              <span className="mode-title">Letter Hunt</span>
            </button>
          </div>
        </div>
      )}

      {/* Sequence Mini-Games Banner */}
      <div className="alphabet-games-banner animate-fadeInUp">
        <div className="games-banner-text">
          <strong>Alphabet Challenges</strong>
          <span>Test your speed &amp; matching skills!</span>
        </div>
        <div className="games-banner-buttons">
          <Button
            id="play-sequence-btn"
            variant="secondary"
            size="md"
            onClick={() => navigate('/play/play-sequence-a-e')}
          >
            A–E Sequence 🏃
          </Button>
          <Button
            id="play-matching-btn"
            variant="purple"
            size="md"
            onClick={() => navigate('/play/practice-a-matching')}
          >
            Match Pairs 🧩
          </Button>
        </div>
      </div>
    </div>
  );
}
