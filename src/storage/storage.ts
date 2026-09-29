import { BirthDateInput } from '../types';

const STORAGE_KEYS = {
  BIRTHDAY: 'weirdage_saved_birthday',
  IS_PRO: 'weirdage_is_pro_unlocked',
  AUDIO_MUTED: 'weirdage_audio_muted',
};

export function getSavedBirthday(): BirthDateInput | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BIRTHDAY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.year && parsed.month && parsed.day) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to read saved birthday', e);
  }
  return null;
}

export function saveBirthday(input: BirthDateInput): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BIRTHDAY, JSON.stringify(input));
  } catch (e) {
    console.warn('Failed to save birthday', e);
  }
}

export function clearSavedData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.BIRTHDAY);
    // Keep PRO status intact during data wipe unless requested
  } catch (e) {
    console.warn('Failed to clear data', e);
  }
}

export function getProStatus(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.IS_PRO) === 'true';
  } catch (e) {
    return false;
  }
}

export function setProStatus(isPro: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_PRO, isPro ? 'true' : 'false');
  } catch (e) {
    console.warn('Failed to save pro status', e);
  }
}

export function getAudioMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUDIO_MUTED) === 'true';
  } catch (e) {
    return false;
  }
}

export function setAudioMuted(muted: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIO_MUTED, muted ? 'true' : 'false');
  } catch (e) {
    console.warn('Failed to save audio mute setting', e);
  }
}
