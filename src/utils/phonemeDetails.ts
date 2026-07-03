/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Builds phoneme detail read models from profile, L1 difficulty, examples,
 * and minimal-pair training materials.
 */

import type {
  Difficulty,
  LanguageProfile,
  PhonemeDetail,
  PhonemeDifficulty,
  TrainingItem,
} from '../types';
import { getDifficultyMap } from '../l1/difficultyMap';
import { getItemsByPhoneme } from './phonemeGroups';
import { getMinimalPairSets } from './minimalPairs';

interface PhonemeDetailConfig {
  profile: LanguageProfile;
  l1: string | null;
  phoneme: string;
  difficulty?: Difficulty;
  exampleLimit?: number;
}

function getDifficultyForPhoneme(
  profile: LanguageProfile,
  l1: string | null,
  phoneme: string,
): PhonemeDifficulty | undefined {
  if (!l1 || l1 === profile.code) return undefined;
  return getDifficultyMap(l1, profile.code)
    ?.hardPhonemes
    .find(item => item.phoneme === phoneme);
}

function getExamples(
  profile: LanguageProfile,
  phoneme: string,
  difficulty?: Difficulty,
  limit = 6,
): { examples: TrainingItem[]; exampleCount: number } {
  const allExamples = getItemsByPhoneme(phoneme, profile);
  const tierExamples = difficulty
    ? getItemsByPhoneme(phoneme, profile, difficulty)
    : allExamples;
  const source = tierExamples.length > 0 ? tierExamples : allExamples;

  return {
    examples: source.slice(0, limit),
    exampleCount: allExamples.length,
  };
}

export function buildPhonemeDetail({
  profile,
  l1,
  phoneme,
  difficulty,
  exampleLimit = 6,
}: PhonemeDetailConfig): PhonemeDetail | null {
  const definition = profile.phonemes.find(item => item.symbol === phoneme);
  if (!definition) return null;

  const { examples, exampleCount } = getExamples(profile, phoneme, difficulty, exampleLimit);

  return {
    symbol: definition.symbol,
    label: definition.label,
    category: definition.category,
    profileCode: profile.code,
    notationName: profile.notationName,
    difficulty: getDifficultyForPhoneme(profile, l1, phoneme),
    examples,
    exampleCount,
    minimalPairs: getMinimalPairSets(profile, phoneme),
  };
}
