/**
 * Web Speech API 语音管理
 * 智能优选高质量语音 + 用户选择 + localStorage 持久化
 */

const STORAGE_KEY = 'ipa-spelling-voice';

// 高质量语音关键词（按优先级排序）
const PREFERRED_NAMES = [
  'samantha',           // macOS — 最佳美式女声
  'google us english',  // Chrome — 高质量
  'alex',               // macOS — 美式男声
  'daniel',             // macOS — 英式男声（质量高）
  'karen',              // macOS — 澳式女声
  'microsoft zira',     // Windows — 美式女声
  'microsoft david',    // Windows — 美式男声
  'google uk english',  // Chrome — 英式
  'moira',              // macOS — 爱尔兰
  'fiona',              // macOS — 苏格兰
  'veena',              // macOS — 印度
];

export interface VoiceInfo {
  name: string;
  lang: string;
  voiceURI: string;
  localService: boolean;
}

function getStoredVoiceURI(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeVoiceURI(uri: string) {
  try {
    localStorage.setItem(STORAGE_KEY, uri);
  } catch {
    // localStorage 不可用
  }
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  const idx = PREFERRED_NAMES.findIndex(p => name.includes(p));
  if (idx >= 0) return PREFERRED_NAMES.length - idx; // 越靠前分越高
  if (voice.lang === 'en-US' && voice.localService) return 2;
  if (voice.lang.startsWith('en-') && voice.localService) return 1;
  if (voice.lang === 'en-US') return 0;
  return -1;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  const synth = window.speechSynthesis;
  if (!synth) return [];
  return synth.getVoices();
}

/** 从可用语音中选出最佳默认语音 */
export function selectBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // 先查 localStorage 中是否有之前选过的
  const storedURI = getStoredVoiceURI();
  if (storedURI) {
    const found = voices.find(v => v.voiceURI === storedURI);
    if (found) return found;
  }

  // 按优先级打分选出最佳
  const scored = voices
    .filter(v => v.lang.startsWith('en-'))
    .map(v => ({ voice: v, score: scoreVoice(v) }))
    .sort((a, b) => b.score - a.score);

  return scored.length > 0 ? scored[0].voice : voices[0];
}

export function saveVoicePreference(voice: SpeechSynthesisVoice) {
  storeVoiceURI(voice.voiceURI);
}

/** 获取 en-US 语音列表（用于选择器） */
export function getEnglishVoices(): SpeechSynthesisVoice[] {
  return getAvailableVoices()
    .filter(v => v.lang.startsWith('en-'))
    .sort((a, b) => {
      const sa = scoreVoice(a);
      const sb = scoreVoice(b);
      if (sb !== sa) return sb - sa;
      return a.name.localeCompare(b.name);
    });
}
