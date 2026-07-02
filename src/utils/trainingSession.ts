/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Training session utilities.
 * Extracts word-picking and session-reset logic from App.tsx
 * so the top-level component stays focused on state orchestration.
 */

import type { TrainingItem, Difficulty, LanguageProfile } from '../types';
import { getItemsByPhoneme } from './phonemeGroups';

// ── Training session config ────────────────────────────────────────

/** Configuration for a training session. */
export interface TrainingConfig {
  /** Target language profile. */
  profile: LanguageProfile;
  /** Difficulty tier. */
  difficulty: Difficulty;
  /** Selected phoneme filter (null = all phonemes). */
  phoneme: string | null;
  /** Number of items in this session. */
  wordCount: number;
  /** Training mode: 'spelling' = input + judge, 'training' = browse + listen. */
  mode: 'spelling' | 'training';
}

/** State snapshot of an in-progress training session. */
export interface SessionState {
  items: TrainingItem[];
  currentIndex: number;
  score: number;
  userInput: string;
  feedback: 'correct' | 'incorrect' | 'neutral';
}

/** Create a fresh session state. */
export function createFreshSession(items: TrainingItem[]): SessionState {
  return {
    items,
    currentIndex: 0,
    score: 0,
    userInput: '',
    feedback: 'neutral',
  };
}

// ── Word picking ───────────────────────────────────────────────────

/**
 * Pick training items for a session based on config.
 *
 * If a phoneme filter is active, only items containing that phoneme
 * (within the chosen difficulty) are included. Items are shuffled
 * randomly.
 */
export function pickItems(
  profile: LanguageProfile,
  difficulty: Difficulty,
  phoneme: string | null,
  count: number,
): TrainingItem[] {
  if (phoneme) {
    const pool = getItemsByPhoneme(phoneme, profile, difficulty);
    if (pool.length === 0) return [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, pool.length));
  }
  const bank = profile.wordBank[difficulty];
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, bank.length));
}

/**
 * Re-pick items with updated config, returning a fresh SessionState.
 */
export function refreshSession(config: TrainingConfig): SessionState {
  const items = pickItems(config.profile, config.difficulty, config.phoneme, config.wordCount);
  return createFreshSession(items);
}
