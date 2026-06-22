/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Chinese (Mandarin) language profile for Pinyin training.
 * Defines the full phoneme inventory (initials, finals, tones),
 * keypad layout, Pinyin parser, and Pinyin-specific judge logic.
 */

import type {
  Difficulty,
  LanguageProfile,
  PhonemeDef,
  TrainingItem,
} from '../types';
import { parsePinyin, parsePinyinSyllables, syllablesToString } from '../utils/pinyinParser';
import { phonemeJudge } from '../utils/judge';
import { zhWordBank } from '../data/zhWordBank';

// ── Phoneme inventory ───────────────────────────────────────────

const ZH_INITIALS: PhonemeDef[] = [
  { symbol: 'b', category: 'initial', label: '玻' },
  { symbol: 'p', category: 'initial', label: '坡' },
  { symbol: 'm', category: 'initial', label: '摸' },
  { symbol: 'f', category: 'initial', label: '佛' },
  { symbol: 'd', category: 'initial', label: '得' },
  { symbol: 't', category: 'initial', label: '特' },
  { symbol: 'n', category: 'initial', label: '讷' },
  { symbol: 'l', category: 'initial', label: '勒' },
  { symbol: 'g', category: 'initial', label: '哥' },
  { symbol: 'k', category: 'initial', label: '科' },
  { symbol: 'h', category: 'initial', label: '喝' },
  { symbol: 'j', category: 'initial', label: '基' },
  { symbol: 'q', category: 'initial', label: '欺' },
  { symbol: 'x', category: 'initial', label: '希' },
  { symbol: 'zh', category: 'initial', label: '知' },
  { symbol: 'ch', category: 'initial', label: '蚩' },
  { symbol: 'sh', category: 'initial', label: '诗' },
  { symbol: 'r', category: 'initial', label: '日' },
  { symbol: 'z', category: 'initial', label: '资' },
  { symbol: 'c', category: 'initial', label: '雌' },
  { symbol: 's', category: 'initial', label: '思' },
];

const ZH_FINALS: PhonemeDef[] = [
  // Single vowels
  { symbol: 'a', category: 'final', label: '啊' },
  { symbol: 'o', category: 'final', label: '喔' },
  { symbol: 'e', category: 'final', label: '鹅' },
  { symbol: 'i', category: 'final', label: '衣' },
  { symbol: 'u', category: 'final', label: '乌' },
  { symbol: 'v', category: 'final', label: '迂 (ü)' },
  // Compound finals
  { symbol: 'ai', category: 'final', label: '哀' },
  { symbol: 'ei', category: 'final', label: '诶' },
  { symbol: 'ao', category: 'final', label: '熬' },
  { symbol: 'ou', category: 'final', label: '欧' },
  { symbol: 'an', category: 'final', label: '安' },
  { symbol: 'en', category: 'final', label: '恩' },
  { symbol: 'ang', category: 'final', label: '昂' },
  { symbol: 'eng', category: 'final', label: '鞥' },
  { symbol: 'ong', category: 'final', label: '翁' },
  // i-line finals
  { symbol: 'ia', category: 'final', label: '呀' },
  { symbol: 'ie', category: 'final', label: '耶' },
  { symbol: 'iao', category: 'final', label: '腰' },
  { symbol: 'iu', category: 'final', label: '优' },
  { symbol: 'ian', category: 'final', label: '烟' },
  { symbol: 'in', category: 'final', label: '因' },
  { symbol: 'iang', category: 'final', label: '央' },
  { symbol: 'ing', category: 'final', label: '英' },
  { symbol: 'iong', category: 'final', label: '雍' },
  // u-line finals
  { symbol: 'ua', category: 'final', label: '蛙' },
  { symbol: 'uo', category: 'final', label: '窝' },
  { symbol: 'uai', category: 'final', label: '歪' },
  { symbol: 'ui', category: 'final', label: '威' },
  { symbol: 'uan', category: 'final', label: '弯' },
  { symbol: 'un', category: 'final', label: '温' },
  { symbol: 'uang', category: 'final', label: '汪' },
  // ü-line finals
  { symbol: 've', category: 'final', label: '约' },
  { symbol: 'van', category: 'final', label: '冤' },
  { symbol: 'vn', category: 'final', label: '晕' },
  // Special
  { symbol: 'er', category: 'final', label: '儿' },
];

const ZH_TONES: PhonemeDef[] = [
  { symbol: '1', category: 'tone', label: '一声 ˉ' },
  { symbol: '2', category: 'tone', label: '二声 ˊ' },
  { symbol: '3', category: 'tone', label: '三声 ˇ' },
  { symbol: '4', category: 'tone', label: '四声 ˋ' },
  { symbol: '0', category: 'tone', label: '轻声' },
];

const ALL_ZH_PHONEMES: PhonemeDef[] = [
  ...ZH_INITIALS,
  ...ZH_FINALS,
  ...ZH_TONES,
];

// ── Keypad layout ───────────────────────────────────────────────

const ZH_KEYPAD = [
  {
    category: '声母 Initials',
    phonemes: ZH_INITIALS.map(p => p.symbol),
  },
  {
    category: '韵母 Finals',
    phonemes: ZH_FINALS.map(p => p.symbol),
  },
  {
    category: '声调 Tones',
    phonemes: ZH_TONES.map(p => p.symbol),
  },
];

// ── Pinyin judge ────────────────────────────────────────────────

/**
 * Pinyin-specific judge that normalizes both input and target to
 * tone-number form before phoneme-level comparison.
 *
 * This allows users to type "ni3 hao3" and match against the
 * canonical "ni3 hao3" in the word bank. Diacritics like "nǐ" are
 * also accepted (converted internally).
 */
function zhJudge(input: string, target: string) {
  // Strip slashes and trim
  const cleanInput = input.trim().replace(/^\/|\/$/g, '');
  const cleanTarget = target.trim().replace(/^\/|\/$/g, '');

  // Parse both to phoneme arrays via parsePinyin
  // (which handles both diacritic and tone-number forms)
  const inputPhonemes = parsePinyin(cleanInput);
  const targetPhonemes = parsePinyin(cleanTarget);

  // Also try a simpler approach: normalize both to tone-number string
  // and do string comparison as a fast path
  const inputSyllables = parsePinyinSyllables(cleanInput);
  const targetSyllables = parsePinyinSyllables(cleanTarget);
  const inputStr = syllablesToString(inputSyllables);
  const targetStr = syllablesToString(targetSyllables);

  if (inputStr === targetStr) {
    return { correct: true, nearMatch: false, diffs: [] };
  }

  // Fall back to phoneme-level comparison
  return phonemeJudge(cleanInput, cleanTarget, parsePinyin);
}

// ── Profile ─────────────────────────────────────────────────────

export const chineseProfile: LanguageProfile = {
  code: 'zh',
  displayName: '中文',
  notationName: 'Pinyin',
  phonemes: ALL_ZH_PHONEMES,
  keypadLayout: ZH_KEYPAD,
  ttsLang: 'zh-CN',
  parseNotation: parsePinyin,
  judge: zhJudge,
  soundFeatures: ['tone', 'neutral_tone', 'tone_sandhi', 'retroflex', 'erhua'],
  wordBank: zhWordBank,
};
