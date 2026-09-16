// ============================================================
// MIMI & ME — Audio Manager (lazy-loaded per world)
// All sounds load on demand — nothing loads at startup.
// ============================================================

const AUDIO_CACHE = {};
let audioCtx = null;
let voiceEnabled = true;
let musicEnabled = true;
let sfxEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ── Synthesized Sound Effects (no file needed) ──

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail — audio is not critical
  }
}

function playArpeggio(notes, interval = 0.1) {
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.25), i * interval * 1000);
  });
}

// ── Voice & Speech (Female / Girl Voice with Web Speech API) ──
let preferredFemaleVoice = null;

function loadFemaleVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;

  // List of high-quality female/girl voice keywords in priority order
  const femaleKeywords = [
    'zira',
    'jenny',
    'aria',
    'susan',
    'samantha',
    'victoria',
    'karen',
    'fiona',
    'moira',
    'tessa',
    'catherine',
    'eva',
    'female',
    'woman',
    'girl',
    'google uk english female',
    'google us english',
  ];

  // 1. Search for known female English voice
  for (const kw of femaleKeywords) {
    const match = voices.find(
      v => (v.name && v.name.toLowerCase().includes(kw)) ||
           (v.voiceURI && v.voiceURI.toLowerCase().includes(kw))
    );
    if (match) {
      preferredFemaleVoice = match;
      return;
    }
  }

  // 2. Filter for any English voice
  const englishVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  // Avoid known male names if possible (David, Mark, George, Richard)
  const nonMaleEnglish = englishVoices.find(
    v => !/(david|mark|george|richard|james|male)/i.test(v.name)
  );

  preferredFemaleVoice = nonMaleEnglish || englishVoices[0] || voices[0];
}

// Pre-load voices on startup & listen for async browser voice list changes
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadFemaleVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    loadFemaleVoice();
  };
}

export const AudioManager = {
  setVoice(enabled) { voiceEnabled = enabled; },
  setMusic(enabled) { musicEnabled = enabled; },
  setSfx(enabled)   { sfxEnabled = enabled; },

  // ── Sound Effects (synthesized) ──
  playCorrect() {
    // Rising arpeggio: C → E → G
    playArpeggio([523, 659, 784], 0.12);
  },

  playWrong() {
    // Soft low tone (not harsh)
    playTone(220, 0.3, 'sine', 0.2);
  },

  playStar() {
    // Sparkle
    playArpeggio([784, 988, 1175, 1319], 0.08);
  },

  playAchievement() {
    // Fanfare
    playArpeggio([523, 659, 784, 1047], 0.15);
  },

  playClick() {
    playTone(800, 0.05, 'sine', 0.15);
  },

  playLevelStart() {
    playArpeggio([440, 523, 659], 0.1);
  },

  playLevelComplete() {
    playArpeggio([523, 659, 784, 988, 1047], 0.1);
  },

  // ── Voice (lazy-loaded audio files) ──
  async playVoice(path) {
    if (!voiceEnabled) return;
    const fullPath = path.startsWith('/') ? path : `/sounds/${path}`;
    try {
      if (!AUDIO_CACHE[fullPath]) {
        const response = await fetch(fullPath);
        if (!response.ok) return;
        const buffer = await response.arrayBuffer();
        const ctx = getAudioContext();
        AUDIO_CACHE[fullPath] = await ctx.decodeAudioData(buffer);
      }
      const ctx = getAudioContext();
      const source = ctx.createBufferSource();
      source.buffer = AUDIO_CACHE[fullPath];
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // Silent fallback
    }
  },

  // ── Cheerful Girl Voice Speech Synthesis ──
  speak(text) {
    if (!voiceEnabled || !text) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // cancel any ongoing speech

        const utterance = new SpeechSynthesisUtterance(text);

        if (!preferredFemaleVoice) {
          loadFemaleVoice();
        }
        if (preferredFemaleVoice) {
          utterance.voice = preferredFemaleVoice;
        }

        // Tuned for a friendly, cheerful, clear youthful girl / female voice
        utterance.rate = 0.95;   // child-friendly natural pacing
        utterance.pitch = 1.35;  // bright, sweet, high girl pitch
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // fallback
    }
  },

  speakLetter(letter, word) {
    if (word) {
      this.speak(`${letter}... is for ${word}!`);
    } else {
      this.speak(`Letter ${letter}!`);
    }
  },

  playLetterSound(letter = 'A') {
    this.speak(`Hi explorer! Let's play and learn!`);
  },

  // ── Resume after user interaction ──
  resumeContext() {
    try { getAudioContext(); } catch { /* ignore */ }
    try { loadFemaleVoice(); } catch { /* ignore */ }
  },
};

