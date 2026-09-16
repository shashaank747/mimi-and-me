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
  // Files loaded from /sounds/ directory when world is entered
  async playVoice(path) {
    if (!voiceEnabled) return;
    const fullPath = path.startsWith('/') ? path : `/sounds/${path}`;
    try {
      if (!AUDIO_CACHE[fullPath]) {
        const response = await fetch(fullPath);
        if (!response.ok) return; // file not found — silent fallback
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
      // Silent fallback — audio is enhancement, not required
    }
  },

  // ── Voice & Speech (Web Speech API + lazy files) ──
  speak(text) {
    if (!voiceEnabled || !text) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // cancel any prior speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;  // child-friendly pacing
        utterance.pitch = 1.2; // warm, friendly tone
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
      this.speak(`Letter ${letter}`);
    }
  },

  // ── Resume after user interaction ──
  resumeContext() {
    try { getAudioContext(); } catch { /* ignore */ }
  },
};

