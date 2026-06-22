/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Generic phoneme-level judge logic.
 * Given a parse function that breaks notation into phoneme arrays,
 * compare user input against the target phoneme-by-phoneme and
 * produce a structured JudgeResult.
 */

import type { JudgeResult, PhonemeDiff } from '../types';

/**
 * Strip surrounding slashes, trim whitespace, and remove common
 * notation artifacts before parsing.
 */
function cleanNotation(raw: string): string {
  return raw.trim().replace(/^\/|\/$/g, '');
}

/**
 * Phoneme-level comparison judge.
 *
 * Both input and target are parsed into phoneme arrays using the
 * provided `parseFn`, then compared position-by-position.
 *
 * Stress marks (ˈ ˌ) and syllable separators (.) are stripped before
 * comparison so they don't cause false negatives.
 */
export function phonemeJudge(
  input: string,
  target: string,
  parseFn: (notation: string) => string[],
): JudgeResult {
  const inputPhonemes = parseFn(cleanNotation(input));
  const targetPhonemes = parseFn(cleanNotation(target));

  const maxLen = Math.max(inputPhonemes.length, targetPhonemes.length);
  const diffs: PhonemeDiff[] = [];

  for (let i = 0; i < maxLen; i++) {
    const expected = i < targetPhonemes.length ? targetPhonemes[i] : '';
    const actual = i < inputPhonemes.length ? inputPhonemes[i] : '';
    if (expected !== actual) {
      diffs.push({ position: i, expected, actual });
    }
  }

  const correct = diffs.length === 0;
  // Near match: at most 1 phoneme different, and same length
  const nearMatch = !correct && diffs.length <= 1 && inputPhonemes.length === targetPhonemes.length;

  return { correct, nearMatch, diffs };
}

/**
 * Simple string equality judge (legacy behavior).
 * Strips slashes and trims, then compares the raw strings.
 */
export function stringJudge(input: string, target: string): JudgeResult {
  const cleanInput = cleanNotation(input);
  const cleanTarget = cleanNotation(target);
  const correct = cleanInput === cleanTarget;

  return {
    correct,
    nearMatch: false,
    diffs: correct
      ? []
      : [{ position: 0, expected: cleanTarget, actual: cleanInput }],
  };
}
