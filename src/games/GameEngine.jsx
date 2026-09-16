// ============================================================
// MIMI & ME — GameEngine (data-driven level renderer)
// Comprehensive Phase 2 Gameplay Modes:
// - Learn (interactive flashcard)
// - Trace (ages 3–5 waypoint SVG tracing)
// - Practice (Recognition, Matching, Picture, Missing)
// - Play (Letter Hunt, Letter Sequence)
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getLevelById } from '../data/levels.js';
import { LETTERS, getLetterData, getLetterDistractors } from '../data/letters.js';
import { calculateScore, isPersonalBest } from '../utils/scoring.js';
import { shuffle, pickRandom } from '../utils/random.js';
import { AudioManager } from '../systems/AudioManager.js';
import Mimi from '../components/Mimi.jsx';
import Button from '../components/Button.jsx';
import GraffitiCelebration from '../components/GraffitiCelebration.jsx';
import './GameEngine.css';

export default function GameEngine({ levelId, profile, onComplete }) {
  const level = getLevelById(levelId);
  if (!level) return <div className="game-error">Level not found: {levelId}</div>;

  switch (level.type) {
    case 'learn':
      return <LearnMode level={level} profile={profile} onComplete={onComplete} />;
    case 'trace':
      return <TracingMode level={level} profile={profile} onComplete={onComplete} />;
    case 'practice-recognition':
      return <PracticeRecognition level={level} profile={profile} onComplete={onComplete} />;
    case 'practice-matching':
      return <PracticeMatching level={level} profile={profile} onComplete={onComplete} />;
    case 'practice-picture':
      return <PracticePicture level={level} profile={profile} onComplete={onComplete} />;
    case 'practice-missing':
      return <PracticeMissing level={level} profile={profile} onComplete={onComplete} />;
    case 'play-hunt':
      return <PlayHunt level={level} profile={profile} onComplete={onComplete} />;
    case 'play-sequence':
      return <PlaySequence level={level} profile={profile} onComplete={onComplete} />;
    default:
      return <PracticeRecognition level={level} profile={profile} onComplete={onComplete} />;
  }
}

// ────────────────────────────────────────────────────────────
// 1. LEARN MODE — Interactive flashcard
// ────────────────────────────────────────────────────────────
function LearnMode({ level, profile, onComplete }) {
  const letterData = getLetterData(level.target || 'A');
  const [interactions, setInteractions] = useState(0);
  const [emojiWobble, setEmojiWobble] = useState(false);
  const [letterBounce, setLetterBounce] = useState(false);
  const [mimiExpr, setMimiExpr] = useState('happy');

  useEffect(() => {
    if (letterData) {
      AudioManager.speakLetter(letterData.letter, letterData.word);
    }
  }, [level.target]);

  const handleEmojiTap = () => {
    setEmojiWobble(true);
    setInteractions(c => c + 1);
    setMimiExpr('excited');
    AudioManager.playCorrect();
    AudioManager.speak(letterData.word);
    setTimeout(() => setEmojiWobble(false), 600);
  };

  const handleLetterTap = () => {
    setLetterBounce(true);
    setInteractions(c => c + 1);
    setMimiExpr('celebrating');
    AudioManager.playCorrect();
    AudioManager.speak(`Letter ${letterData.letter}! Sound: ${letterData.phonics}`);
    setTimeout(() => setLetterBounce(false), 600);
  };

  const handleListen = () => {
    AudioManager.playClick();
    setMimiExpr('listening');
    AudioManager.speakLetter(letterData.letter, letterData.word);
  };

  const handleNext = () => {
    // If child is age 3-5, proceed to tracing, else practice
    const age = profile?.age || 5;
    const nextType = age <= 5 ? `trace-${(level.target || 'A').toLowerCase()}` : `practice-${(level.target || 'A').toLowerCase()}-recognition`;
    onComplete({ stars: 3, xp: 20, accuracy: 100, levelId: level.id, nextSuggestion: nextType });
  };

  if (!letterData) return null;

  return (
    <div className="game-scene animate-fadeInUp">
      <div className="learn-card">
        <button
          className={`learn-emoji-btn ${emojiWobble ? 'animate-wiggle' : ''}`}
          onClick={handleEmojiTap}
          aria-label={`Tap the ${letterData.word}`}
        >
          <span className="learn-emoji">{letterData.emoji}</span>
        </button>

        <button
          className={`learn-letter-btn ${letterBounce ? 'learn-letter-btn--tapped animate-pop' : ''}`}
          onClick={handleLetterTap}
          style={{ color: letterData.color }}
          aria-label={`Letter ${letterData.letter}`}
        >
          {letterData.letter}
        </button>

        <p className="learn-word-label">
          <strong>{letterData.letter}</strong> is for <strong>{letterData.word}</strong>
        </p>

        <div className="learn-phonics-tag">
          Sound: <strong>/{letterData.phonics}/</strong>
        </div>

        <button className="learn-listen-btn" onClick={handleListen} aria-label="Listen">
          🔊 Pronounce
        </button>
      </div>

      <div className="game-mimi-row">
        <Mimi expression={mimiExpr} size={90} animated />
        <div className="mimi-bubble">
          {interactions > 0
            ? `${letterData.letter} is for ${letterData.word}! Tap Next to continue!`
            : `Hi! Tap the ${letterData.emoji} or ${letterData.letter}!`}
        </div>
      </div>

      <Button
        id={`learn-next-${level.id}`}
        variant="primary"
        size="xl"
        fullWidth
        onClick={handleNext}
        className="mt-4"
      >
        {interactions >= 1 ? 'NEXT →' : 'EXPLORE MORE →'}
      </Button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 2. TRACING MODE (Interactive Waypoint SVG Tracing)
// ────────────────────────────────────────────────────────────
function TracingMode({ level, profile, onComplete }) {
  const letterData = getLetterData(level.target || 'A');
  const [tracedPoints, setTracedPoints] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [mimiExpr, setMimiExpr] = useState('curious');
  const svgRef = useRef(null);

  const waypoints = letterData?.waypoints || [
    { x: 30, y: 90 }, { x: 60, y: 20 }, { x: 90, y: 90 }, { x: 45, y: 65 }, { x: 75, y: 65 }
  ];

  const handlePointerMove = (e) => {
    if (completed || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Scale to viewBox 0 0 120 120
    const x = ((clientX - rect.left) / rect.width) * 120;
    const y = ((clientY - rect.top) / rect.height) * 120;

    // Check collision with next required waypoint
    const nextIndex = tracedPoints.length;
    if (nextIndex < waypoints.length) {
      const targetWp = waypoints[nextIndex];
      const dist = Math.hypot(x - targetWp.x, y - targetWp.y);
      if (dist < 18) { // waypoint hit radius
        const updated = [...tracedPoints, targetWp];
        setTracedPoints(updated);
        AudioManager.playClick();
        if (updated.length === waypoints.length) {
          setCompleted(true);
          setMimiExpr('celebrating');
          AudioManager.playCorrect();
          AudioManager.speak(`Great job tracing letter ${letterData.letter}!`);
        }
      }
    }
  };

  const handleFinish = () => {
    onComplete({ stars: 3, xp: 25, accuracy: 100, levelId: level.id });
  };

  const handleSkip = () => {
    AudioManager.playClick();
    onComplete({ stars: 2, xp: 15, accuracy: 90, levelId: level.id });
  };

  if (!letterData) return null;

  return (
    <div className="game-scene animate-fadeInUp">
      <div className="tracing-card">
        <div className="tracing-header">
          <span className="tracing-title">Trace the Letter <strong>{letterData.letter}</strong></span>
          <button className="tracing-skip-btn" onClick={handleSkip}>Skip ⏭</button>
        </div>

        <div
          className="tracing-canvas-area"
          ref={svgRef}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
        >
          <svg viewBox="0 0 120 120" className="tracing-svg" role="img" aria-label={`Trace letter ${letterData.letter}`}>
            {/* Background letter guide */}
            <path
              d={letterData.tracingPath}
              className="tracing-guide-path"
              stroke="#E2E8F0"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Dotted target centerline */}
            <path
              d={letterData.tracingPath}
              className="tracing-dotted-path"
              stroke="#CBD5E1"
              strokeWidth="3"
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Traced strokes connected */}
            {tracedPoints.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="8"
                fill={letterData.color}
                className="animate-pop"
              />
            ))}

            {/* Active target beacon */}
            {!completed && tracedPoints.length < waypoints.length && (
              <circle
                cx={waypoints[tracedPoints.length].x}
                cy={waypoints[tracedPoints.length].y}
                r="10"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="3"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>

        <p className="tracing-instructions">
          {completed ? '🎉 Beautiful! You traced it perfectly!' : 'Touch and follow the dotted lines!'}
        </p>
      </div>

      <div className="game-mimi-row">
        <Mimi expression={mimiExpr} size={90} animated />
        <div className="mimi-bubble">
          {completed ? `Yay! Let's practice ${letterData.letter} now!` : `Follow the glowing circles!`}
        </div>
      </div>

      {completed && (
        <Button
          id="trace-next-btn"
          variant="primary"
          size="xl"
          fullWidth
          onClick={handleFinish}
          className="mt-4 animate-bounceIn"
        >
          CONTINUE TO PRACTICE →
        </Button>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 3. PRACTICE — Recognition ("Which one is A?")
// ────────────────────────────────────────────────────────────
function PracticeRecognition({ level, profile, onComplete }) {
  const target = level.target || 'A';
  const letterData = getLetterData(target);
  const [selected, setSelected] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [mimiExpr, setMimiExpr] = useState('thinking');
  const [showCelebration, setShowCelebration] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  const distractors = getLetterDistractors(target, 2).map(d => d.letter);
  const [choices] = useState(() => shuffle([target, ...distractors]));

  useEffect(() => {
    AudioManager.speak(`Which one is letter ${target}?`);
  }, [target]);

  const handleChoice = (choice) => {
    setSelected(choice);
    if (choice === target) {
      AudioManager.playCorrect();
      setMimiExpr('happy');
      AudioManager.speak(`Yes! That is ${target}!`);
      const accuracy = wrongAttempts === 0 ? 100 : 75;
      const score = calculateScore({ accuracy, attempts: wrongAttempts + 1, levelId: level.id });
      setScoreData({ ...score, levelId: level.id });
      setTimeout(() => setShowCelebration(true), 600);
    } else {
      AudioManager.playWrong();
      setMimiExpr('confused');
      AudioManager.speak("Hmm, let's try again!");
      setWrongAttempts(w => w + 1);
      setTimeout(() => setSelected(null), 700);
    }
  };

  if (showCelebration && scoreData) {
    return (
      <GraffitiCelebration
        stars={scoreData.stars}
        message={`SUPER ${target}!`}
        badge={`Letter ${target} Found!`}
        animation="bounce"
        onNext={() => onComplete(scoreData)}
        isPersonalBest={false}
      />
    );
  }

  return (
    <div className="game-scene animate-fadeInUp">
      <div className="game-question-header">
        <span className="game-q-num">Letter Recognition</span>
      </div>

      <div className="game-mimi-row">
        <Mimi expression={mimiExpr} size={90} animated />
        <div className="mimi-bubble">
          Can you find the letter <strong>{target}</strong>?
        </div>
      </div>

      <div className="practice-choices">
        {choices.map((choice) => {
          const isTarget = choice === target;
          const isSelected = selected === choice;
          let btnClass = 'choice-btn';
          if (isSelected && isTarget) btnClass += ' choice-btn--correct';
          if (isSelected && !isTarget) btnClass += ' choice-btn--wrong animate-shake';

          return (
            <button
              key={choice}
              id={`choice-${choice}`}
              className={btnClass}
              onClick={() => !selected && handleChoice(choice)}
              disabled={selected !== null}
              aria-label={`Letter ${choice}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      <button
        className="hint-btn"
        onClick={() => {
          AudioManager.playClick();
          AudioManager.speakLetter(target, letterData?.word);
        }}
      >
        💡 Hear Sound
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 4. PRACTICE — Capital ↔ Lowercase Matching
// ────────────────────────────────────────────────────────────
function PracticeMatching({ level, profile, onComplete }) {
  const target = level.target || 'A';
  const distractors = getLetterDistractors(target, 2);
  const letterGroup = [getLetterData(target), ...distractors].filter(Boolean);

  const [capitals] = useState(() => shuffle(letterGroup.map(l => l.letter)));
  const [lowers] = useState(() => shuffle(letterGroup.map(l => l.lowercase)));

  const [selectedCap, setSelectedCap] = useState(null);
  const [selectedLow, setSelectedLow] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [mimiExpr, setMimiExpr] = useState('curious');
  const [showCelebration, setShowCelebration] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    AudioManager.speak("Match the big letters with the small letters!");
  }, []);

  const handleSelectCap = (cap) => {
    if (matchedPairs.has(cap)) return;
    AudioManager.playClick();
    setSelectedCap(cap);
    checkMatch(cap, selectedLow);
  };

  const handleSelectLow = (low) => {
    const capEquiv = low.toUpperCase();
    if (matchedPairs.has(capEquiv)) return;
    AudioManager.playClick();
    setSelectedLow(low);
    checkMatch(selectedCap, low);
  };

  const checkMatch = (cap, low) => {
    if (!cap || !low) return;
    if (cap.toLowerCase() === low.toLowerCase()) {
      AudioManager.playCorrect();
      const updated = new Set(matchedPairs).add(cap);
      setMatchedPairs(updated);
      setSelectedCap(null);
      setSelectedLow(null);
      setMimiExpr('happy');
      AudioManager.speak(`Match! Big ${cap} and small ${low}!`);

      if (updated.size === letterGroup.length) {
        const score = calculateScore({ accuracy: 100, attempts: 1, levelId: level.id });
        setScoreData({ ...score, levelId: level.id });
        setTimeout(() => setShowCelebration(true), 600);
      }
    } else {
      AudioManager.playWrong();
      setMimiExpr('confused');
      setTimeout(() => {
        setSelectedCap(null);
        setSelectedLow(null);
      }, 600);
    }
  };

  if (showCelebration && scoreData) {
    return (
      <GraffitiCelebration
        stars={scoreData.stars}
        message="MATCH MASTER!"
        badge="Letters Matched!"
        animation="confetti"
        onNext={() => onComplete(scoreData)}
        isPersonalBest={false}
      />
    );
  }

  return (
    <div className="game-scene animate-fadeInUp">
      <div className="game-question-header">
        <span className="game-q-num">Letter Matching</span>
      </div>

      <div className="game-mimi-row">
        <Mimi expression={mimiExpr} size={90} animated />
        <div className="mimi-bubble">
          Match each big letter with its small letter partner!
        </div>
      </div>

      <div className="matching-board">
        {/* Capitals Column */}
        <div className="matching-column">
          <span className="matching-col-header">Big Letters</span>
          {capitals.map((cap) => {
            const isMatched = matchedPairs.has(cap);
            const isSelected = selectedCap === cap;
            return (
              <button
                key={cap}
                className={`matching-tile ${isMatched ? 'matching-tile--matched' : ''} ${isSelected ? 'matching-tile--selected' : ''}`}
                onClick={() => handleSelectCap(cap)}
                disabled={isMatched}
              >
                {cap}
              </button>
            );
          })}
        </div>

        {/* Lowercase Column */}
        <div className="matching-column">
          <span className="matching-col-header">Small Letters</span>
          {lowers.map((low) => {
            const isMatched = matchedPairs.has(low.toUpperCase());
            const isSelected = selectedLow === low;
            return (
              <button
                key={low}
                className={`matching-tile ${isMatched ? 'matching-tile--matched' : ''} ${isSelected ? 'matching-tile--selected' : ''}`}
                onClick={() => handleSelectLow(low)}
                disabled={isMatched}
              >
                {low}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 5. PRACTICE — Picture Association ("Which starts with 🍎?")
// ────────────────────────────────────────────────────────────
function PracticePicture({ level, profile, onComplete }) {
  const target = level.target || 'A';
  const letterData = getLetterData(target);
  const [selected, setSelected] = useState(null);
  const [mimiExpr, setMimiExpr] = useState('thinking');
  const [showCelebration, setShowCelebration] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  const distractors = getLetterDistractors(target, 2).map(d => d.letter);
  const [choices] = useState(() => shuffle([target, ...distractors]));

  useEffect(() => {
    AudioManager.speak(`Which letter starts with ${letterData?.word}?`);
  }, [target, letterData]);

  const handleChoice = (choice) => {
    setSelected(choice);
    if (choice === target) {
      AudioManager.playCorrect();
      setMimiExpr('happy');
      AudioManager.speak(`Correct! ${target} is for ${letterData?.word}!`);
      const score = calculateScore({ accuracy: 100, attempts: 1, levelId: level.id });
      setScoreData({ ...score, levelId: level.id });
      setTimeout(() => setShowCelebration(true), 600);
    } else {
      AudioManager.playWrong();
      setMimiExpr('confused');
      AudioManager.speak("Let's try again!");
      setTimeout(() => setSelected(null), 700);
    }
  };

  if (showCelebration && scoreData) {
    return (
      <GraffitiCelebration
        stars={scoreData.stars}
        message="PICTURE PERFECT!"
        badge={`${letterData?.word} Hero!`}
        animation="spray"
        onNext={() => onComplete(scoreData)}
        isPersonalBest={false}
      />
    );
  }

  return (
    <div className="game-scene animate-fadeInUp">
      <div className="game-question-header">
        <span className="game-q-num">Picture Clue</span>
      </div>

      <div className="picture-clue-card">
        <span className="picture-clue-emoji">{letterData?.emoji}</span>
        <span className="picture-clue-word">{letterData?.word}</span>
      </div>

      <div className="game-mimi-row">
        <Mimi expression={mimiExpr} size={90} animated />
        <div className="mimi-bubble">
          Which letter starts with <strong>{letterData?.word}</strong>?
        </div>
      </div>

      <div className="practice-choices">
        {choices.map((choice) => {
          const isTarget = choice === target;
          const isSelected = selected === choice;
          let btnClass = 'choice-btn';
          if (isSelected && isTarget) btnClass += ' choice-btn--correct';
          if (isSelected && !isTarget) btnClass += ' choice-btn--wrong animate-shake';

          return (
            <button
              key={choice}
              className={btnClass}
              onClick={() => !selected && handleChoice(choice)}
              disabled={selected !== null}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 6. PRACTICE — Missing Letter ("A B _ D")
// ────────────────────────────────────────────────────────────
function PracticeMissing({ level, profile, onComplete }) {
  const target = level.target || 'C';
  const targetIdx = LETTERS.findIndex(l => l.letter === target);
  const startIdx = Math.max(0, Math.min(LETTERS.length - 4, targetIdx - 1));
  const sequenceLetters = LETTERS.slice(startIdx, startIdx + 4).map(l => l.letter);

  const [selected, setSelected] = useState(null);
  const [mimiExpr, setMimiExpr] = useState('curious');
  const [showCelebration, setShowCelebration] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  const distractors = getLetterDistractors(target, 2).map(d => d.letter);
  const [choices] = useState(() => shuffle([target, ...distractors]));

  useEffect(() => {
    AudioManager.speak(`Find the missing letter!`);
  }, []);

  const handleChoice = (choice) => {
    setSelected(choice);
    if (choice === target) {
      AudioManager.playCorrect();
      setMimiExpr('celebrating');
      AudioManager.speak(`Awesome! ${target} completes the sequence!`);
      const score = calculateScore({ accuracy: 100, attempts: 1, levelId: level.id });
      setScoreData({ ...score, levelId: level.id });
      setTimeout(() => setShowCelebration(true), 600);
    } else {
      AudioManager.playWrong();
      setMimiExpr('confused');
      setTimeout(() => setSelected(null), 700);
    }
  };

  if (showCelebration && scoreData) {
    return (
      <GraffitiCelebration
        stars={scoreData.stars}
        message="SEQUENCE HERO!"
        badge="Alphabet Ordered!"
        animation="rotate"
        onNext={() => onComplete(scoreData)}
        isPersonalBest={false}
      />
    );
  }

  return (
    <div className="game-scene animate-fadeInUp">
      <div className="game-question-header">
        <span className="game-q-num">Missing Letter</span>
      </div>

      <div className="missing-sequence-row">
        {sequenceLetters.map((char, idx) => {
          const isMissing = char === target;
          return (
            <div key={idx} className={`sequence-slot ${isMissing ? 'sequence-slot--missing' : ''}`}>
              {isMissing ? (selected === target ? target : '?') : char}
            </div>
          );
        })}
      </div>

      <div className="game-mimi-row">
        <Mimi expression={mimiExpr} size={90} animated />
        <div className="mimi-bubble">
          What letter comes in the empty spot?
        </div>
      </div>

      <div className="practice-choices">
        {choices.map((choice) => {
          const isTarget = choice === target;
          const isSelected = selected === choice;
          let btnClass = 'choice-btn';
          if (isSelected && isTarget) btnClass += ' choice-btn--correct';
          if (isSelected && !isTarget) btnClass += ' choice-btn--wrong animate-shake';

          return (
            <button
              key={choice}
              className={btnClass}
              onClick={() => !selected && handleChoice(choice)}
              disabled={selected !== null}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 7. PLAY MODE — Letter Hunt Game
// ────────────────────────────────────────────────────────────
function PlayHunt({ level, profile, onComplete }) {
  const target = level.target || 'A';
  const letterData = getLetterData(target);
  const targetCount = level.targetCount || 3;
  const itemCount = level.itemCount || 8;

  const [gridItems, setGridItems] = useState(() => {
    const distractors = getLetterDistractors(target, 4).map(d => d.letter);
    const items = [];
    for (let i = 0; i < targetCount; i++) items.push({ id: `target-${i}`, char: target, isTarget: true, found: false });
    for (let i = 0; i < itemCount - targetCount; i++) {
      items.push({ id: `dist-${i}`, char: pickRandom(distractors), isTarget: false, found: false });
    }
    return shuffle(items);
  });

  const [foundCount, setFoundCount] = useState(0);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [mimiExpr, setMimiExpr] = useState('excited');
  const [showCelebration, setShowCelebration] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    AudioManager.speak(`Find all the letter ${target}s!`);
  }, [target]);

  const handleTap = (item) => {
    if (item.found) return;

    if (item.isTarget) {
      AudioManager.playCorrect();
      setMimiExpr('happy');
      const newFound = foundCount + 1;
      setFoundCount(newFound);
      setGridItems(prev => prev.map(i => i.id === item.id ? { ...i, found: true } : i));

      if (newFound >= targetCount) {
        AudioManager.playLevelComplete();
        const accuracy = Math.max(50, Math.round((targetCount / (targetCount + wrongTaps)) * 100));
        const score = calculateScore({ accuracy, attempts: 1, levelId: level.id });
        setScoreData({ ...score, levelId: level.id });
        setTimeout(() => setShowCelebration(true), 500);
      }
    } else {
      AudioManager.playWrong();
      setMimiExpr('confused');
      setWrongTaps(w => w + 1);
    }
  };

  if (showCelebration && scoreData) {
    return (
      <GraffitiCelebration
        stars={scoreData.stars}
        message="HUNT COMPLETE!"
        badge={`All ${target}s Found!`}
        animation="confetti"
        onNext={() => onComplete(scoreData)}
        isPersonalBest={false}
      />
    );
  }

  return (
    <div className="game-scene animate-fadeInUp">
      <div className="hunt-hint-emoji">
        {letterData?.emoji} Find all <strong>{target}</strong>s! ({foundCount}/{targetCount})
      </div>

      <div className="hunt-grid">
        {gridItems.map((item) => (
          <button
            key={item.id}
            className={`hunt-letter ${item.found ? 'hunt-letter--found' : ''}`}
            onClick={() => handleTap(item)}
            disabled={item.found}
            aria-label={`Letter ${item.char}`}
          >
            {item.found ? '✓' : item.char}
          </button>
        ))}
      </div>

      <div className="game-mimi-row">
        <Mimi expression={mimiExpr} size={85} animated />
        <div className="mimi-bubble">
          {foundCount === 0
            ? `Can you spot the ${target}s hidden in the forest?`
            : `${foundCount} found! Keep going!`}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 8. PLAY MODE — Letter Sequence Game (Tap in A→B→C order)
// ────────────────────────────────────────────────────────────
function PlaySequence({ level, profile, onComplete }) {
  const sequence = level.letters || ['A', 'B', 'C', 'D', 'E'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledLetters] = useState(() => shuffle(sequence.map((char, i) => ({ id: `seq-${char}-${i}`, char }))));
  const [tappedIds, setTappedIds] = useState(new Set());
  const [mimiExpr, setMimiExpr] = useState('excited');
  const [showCelebration, setShowCelebration] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    AudioManager.speak(`Tap the letters in alphabetical order!`);
  }, []);

  const handleTap = (item) => {
    if (tappedIds.has(item.id)) return;
    const expectedChar = sequence[currentIndex];

    if (item.char === expectedChar) {
      AudioManager.playCorrect();
      setTappedIds(prev => new Set(prev).add(item.id));
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setMimiExpr('happy');
      AudioManager.speak(item.char);

      if (nextIndex >= sequence.length) {
        AudioManager.playLevelComplete();
        const score = calculateScore({ accuracy: 100, attempts: 1, levelId: level.id });
        setScoreData({ ...score, levelId: level.id });
        setTimeout(() => setShowCelebration(true), 500);
      }
    } else {
      AudioManager.playWrong();
      setMimiExpr('confused');
      AudioManager.speak(`Look for letter ${expectedChar}!`);
    }
  };

  if (showCelebration && scoreData) {
    return (
      <GraffitiCelebration
        stars={scoreData.stars}
        message="ALPHABET MASTER!"
        badge="Sequence Complete!"
        animation="bounce"
        onNext={() => onComplete(scoreData)}
        isPersonalBest={false}
      />
    );
  }

  return (
    <div className="game-scene animate-fadeInUp">
      <div className="game-question-header">
        <span className="game-q-num">Alphabet Sequence</span>
      </div>

      <div className="sequence-target-indicator">
        Next: <strong className="animate-pulse">{sequence[currentIndex]}</strong>
      </div>

      <div className="hunt-grid">
        {shuffledLetters.map((item) => {
          const isDone = tappedIds.has(item.id);
          return (
            <button
              key={item.id}
              className={`hunt-letter ${isDone ? 'hunt-letter--found' : ''}`}
              onClick={() => handleTap(item)}
              disabled={isDone}
            >
              {isDone ? '✓' : item.char}
            </button>
          );
        })}
      </div>

      <div className="game-mimi-row">
        <Mimi expression={mimiExpr} size={85} animated />
        <div className="mimi-bubble">
          Tap in order: {sequence.join(' → ')}
        </div>
      </div>
    </div>
  );
}
