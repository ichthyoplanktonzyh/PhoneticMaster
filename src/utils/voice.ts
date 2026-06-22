/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Web Speech API voice management.
 * Now supports multiple languages: voice selection is driven by
 * the LanguageProfile.ttsLang rather than hardcoded 'en-US'.
 */

const STORAGE_KEY_PREFIX = 'ipa-spelling-voice-';

// High-quality voice keywords (sorted by priority)
const PREFERRED_NAMES = [
  'samantha',           // macOS — best American female
  'google us english',  // Chrome — high quality
  'alex',               // macOS — American male
  'daniel',             // macOS — British male (high quality)
  'karen',              // macOS — Australian female
  'microsoft zira',     // Windows — American female
  'microsoft david',    // Windows — American male
  'google uk english',  // Chrome — British
  'moira',              // macOS — Irish
  'fiona',              // macOS — Scottish
  'veena',              // macOS — Indian
];

export interface VoiceInfo {
  name: string;
  lang: string;
  voiceURI: string;
  localService: boolean;
}

function getStoredVoiceURI(lang: string): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_PREFIX + lang);
  } catch {
    return null;
  }
}

function storeVoiceURI(lang: string, uri: string) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + lang, uri);
  } catch {
    // localStorage unavailable
  }
}

function scoreVoice(voice: SpeechSynthesisVoice, lang: string): number {
  const name = voice.name.toLowerCase();
  const idx = PREFERRED_NAMES.findIndex(p => name.includes(p));
  if (idx >= 0) return PREFERRED_NAMES.length - idx; // earlier = higher score
  if (voice.lang === lang && voice.localService) return 2;
  if (voice.lang.startsWith(lang.split('-')[0]) && voice.localService) return 1;
  if (voice.lang === lang) return 0;
  return -1;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  const synth = window.speechSynthesis;
  if (!synth) return [];
  return synth.getVoices();
}

/**
 * Select the best default voice for a given BCP 47 language tag.
 */
export function selectBestVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // Check if user has a stored preference for this language
  const storedURI = getStoredVoiceURI(lang);
  if (storedURI) {
    const found = voices.find(v => v.voiceURI === storedURI);
    if (found) return found;
  }

  // Score and select by priority
  const langPrefix = lang.split('-')[0];
  const scored = voices
    .filter(v => v.lang.startsWith(langPrefix))
    .map(v => ({ voice: v, score: scoreVoice(v, lang) }))
    .sort((a, b) => b.score - a.score);

  return scored.length > 0 ? scored[0].voice : voices[0];
}

export function saveVoicePreference(voice: SpeechSynthesisVoice, lang: string) {
  storeVoiceURI(lang, voice.voiceURI);
}

/**
 * Get voice list for a specific language (for the voice selector).
 * Filters by BCP 47 prefix and sorts by quality score.
 */
export function getVoicesForLang(lang: string): SpeechSynthesisVoice[] {
  const langPrefix = lang.split('-')[0];
  return getAvailableVoices()
    .filter(v => v.lang.startsWith(langPrefix))
    .sort((a, b) => {
      const sa = scoreVoice(a, lang);
      const sb = scoreVoice(b, lang);
      if (sb !== sa) return sb - sa;
      return a.name.localeCompare(b.name);
    });
}
