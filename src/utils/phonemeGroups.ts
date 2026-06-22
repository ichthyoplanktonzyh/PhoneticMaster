/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phoneme grouping utility — profile-driven version.
 * Groups training items by phoneme using LanguageProfile.parseNotation,
 * so it works for any language (English IPA, Chinese Pinyin, etc.)
 * instead of being hardcoded to English.
 */

import type { LanguageProfile, TrainingItem, Difficulty } from '../types';

/** Cache keyed by profile code to avoid recomputation. */
const GROUP_CACHE = new Map<string, Record<string, TrainingItem[]>>();

/**
 * Build a phoneme → TrainingItem[] mapping for a given profile.
 * Results are cached by profile code.
 */
export function buildPhonemeGroups(profile: LanguageProfile): Record<string, TrainingItem[]> {
  const cached = GROUP_CACHE.get(profile.code);
  if (cached) return cached;

  const allItems = [
    ...profile.wordBank.basic,
    ...profile.wordBank.intermediate,
    ...profile.wordBank.advanced,
  ];

  const groups: Record<string, TrainingItem[]> = {};
  for (const ph of profile.phonemes) {
    groups[ph.symbol] = [];
  }

  for (const item of allItems) {
    // Use parseNotation to extract phoneme symbols from the pronunciation
    const phonemes = [...new Set(profile.parseNotation(item.pronunciation))];
    for (const ph of phonemes) {
      if (groups[ph]) {
        groups[ph].push(item);
      }
    }
  }

  GROUP_CACHE.set(profile.code, groups);
  return groups;
}

/**
 * Get all training items containing a specified phoneme,
 * optionally filtered by difficulty tier.
 */
export function getItemsByPhoneme(
  phoneme: string,
  profile: LanguageProfile,
  difficulty?: Difficulty,
): TrainingItem[] {
  const groups = buildPhonemeGroups(profile);
  let items = groups[phoneme] || [];

  if (difficulty) {
    const poolSet = new Set(profile.wordBank[difficulty].map(w => w.display));
    items = items.filter(w => poolSet.has(w.display));
  }

  return items;
}

/**
 * Get phoneme word-count statistics, sorted by count descending.
 * Uses the profile's phoneme inventory and word bank.
 */
export function getPhonemeStats(profile: LanguageProfile): { phoneme: string; count: number }[] {
  const groups = buildPhonemeGroups(profile);
  return profile.phonemes
    .map(p => ({ phoneme: p.symbol, count: groups[p.symbol]?.length || 0 }))
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count);
}
