/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { tokenizeIpa } from '../ipaParser';
import { phonemeJudge } from '../judge';

describe('IPA parser and phoneme judge smoke tests', () => {
  it('tokenizes multi-character IPA phonemes before single-character matches', () => {
    expect(tokenizeIpa('ˈtʃeɪn')).toEqual(['tʃ', 'eɪ', 'n']);
  });

  it('marks one same-length phoneme difference as a near match', () => {
    expect(phonemeJudge('s ɪ p', 'ʃ ɪ p', value => value.split(/\s+/))).toEqual({
      correct: false,
      nearMatch: true,
      diffs: [{ position: 0, expected: 'ʃ', actual: 's' }],
    });
  });
});
