/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Build canonical tone-number Pinyin from structured initial/final/tone input.
 */

const ZERO_INITIAL_FINALS: Record<string, string> = {
  i: 'yi',
  ia: 'ya',
  ie: 'ye',
  iao: 'yao',
  iu: 'you',
  ian: 'yan',
  in: 'yin',
  iang: 'yang',
  ing: 'ying',
  iong: 'yong',
  u: 'wu',
  ua: 'wa',
  uo: 'wo',
  uai: 'wai',
  ui: 'wei',
  uan: 'wan',
  un: 'wen',
  uang: 'wang',
  ong: 'weng',
  v: 'yu',
  ve: 'yue',
  van: 'yuan',
  vn: 'yun',
};

const JQX_UMLAUT_FINALS: Record<string, string> = {
  v: 'u',
  ve: 'ue',
  van: 'uan',
  vn: 'un',
};

export function getPinyinToneNumber(tone: string): string {
  return tone === '0' ? '5' : tone;
}

export function getPinyinFinalForOrthography(initial: string, final: string): string {
  if (['j', 'q', 'x'].includes(initial) && JQX_UMLAUT_FINALS[final]) {
    return JQX_UMLAUT_FINALS[final];
  }
  return final;
}

export function buildPinyinSyllable(initial: string, final: string, tone: string): string {
  const toneNumber = getPinyinToneNumber(tone);

  if (!initial) {
    const body = ZERO_INITIAL_FINALS[final] ?? final;
    return `${body}${toneNumber}`;
  }

  return `${initial}${getPinyinFinalForOrthography(initial, final)}${toneNumber}`;
}

export function appendPinyinSyllable(input: string, syllable: string): string {
  const trimmed = input.trimEnd();
  if (!trimmed) return syllable;
  return `${trimmed} ${syllable}`;
}
