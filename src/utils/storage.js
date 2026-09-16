// ============================================================
// MIMI & ME — Storage Abstraction (localStorage)
// Clean API so cloud sync can be added in V2 without touching components
// ============================================================

const STORAGE_KEY = 'mimi_and_me';

const defaults = {
  profiles: [],
  activeProfileId: null,
  settings: {
    voiceEnabled: true,
    musicEnabled: true,
    sfxEnabled: true,
  },
};

// ── Core read/write ──

export function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

export function writeStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    console.warn('[Storage] Could not write to localStorage');
    return false;
  }
}

// ── Settings ──

export function getSettings() {
  return readStore().settings || defaults.settings;
}

export function saveSettings(settings) {
  const store = readStore();
  writeStore({ ...store, settings: { ...store.settings, ...settings } });
}

// ── Profiles ──

export function getAllProfiles() {
  return readStore().profiles || [];
}

export function getProfileById(id) {
  return getAllProfiles().find(p => p.id === id) || null;
}

export function getActiveProfile() {
  const store = readStore();
  return getProfileById(store.activeProfileId);
}

export function setActiveProfile(id) {
  const store = readStore();
  writeStore({ ...store, activeProfileId: id });
}

export function saveProfile(profile) {
  const store = readStore();
  const profiles = store.profiles || [];
  const idx = profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) {
    profiles[idx] = profile;
  } else {
    profiles.push(profile);
  }
  writeStore({ ...store, profiles });
}

export function deleteProfile(id) {
  const store = readStore();
  const profiles = (store.profiles || []).filter(p => p.id !== id);
  const activeProfileId = store.activeProfileId === id ? null : store.activeProfileId;
  writeStore({ ...store, profiles, activeProfileId });
}

// ── Profile progress ──

export function updateProfileProgress(id, updates) {
  const profile = getProfileById(id);
  if (!profile) return;
  saveProfile({ ...profile, ...updates });
}
