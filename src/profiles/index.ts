/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Language profile registry.
 * Each supported target language (L2) registers its profile here.
 * Adding a new language only requires: (1) creating a profile file,
 * (2) importing it here, (3) adding it to SUPPORTED_L2.
 */

import type { LanguageProfile } from '../types';
import { englishProfile } from './en';
import { chineseProfile } from './zh';

/** All supported target languages (L2), in display order. */
const SUPPORTED_L2: LanguageProfile[] = [
  englishProfile,
  chineseProfile,
];

/** Map from language code to profile, for O(1) lookup. */
const PROFILE_MAP = new Map<string, LanguageProfile>(
  SUPPORTED_L2.map(p => [p.code, p]),
);

/**
 * Look up a language profile by code.
 * Returns undefined if the language is not supported.
 */
export function getProfile(code: string): LanguageProfile | undefined {
  return PROFILE_MAP.get(code);
}

/** Get all supported L2 language codes. */
export function getSupportedL2Codes(): string[] {
  return SUPPORTED_L2.map(p => p.code);
}

/** Get all supported L2 profiles (for rendering language selectors). */
export function getAllProfiles(): LanguageProfile[] {
  return SUPPORTED_L2;
}

/** All supported native languages (L1), for the L1 selector. */
export const SUPPORTED_L1 = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ko', label: '한국어' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'ar', label: 'العربية' },
] as const;

export type L1Code = (typeof SUPPORTED_L1)[number]['code'];
