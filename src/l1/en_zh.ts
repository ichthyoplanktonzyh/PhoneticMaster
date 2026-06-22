/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * L1 × L2 difficulty mapping: English native → Chinese (Mandarin) target.
 *
 * Key insight: English speakers learning Mandarin face difficulties
 * that are the *mirror image* of Mandarin speakers learning English.
 * The hardest things are what English LACKS: lexical tone, retroflex
 * series, and the ü vowel.
 */

import type { L1L2Difficulty } from '../types';

export const en_zh: L1L2Difficulty = {
  l1: 'en',
  l2: 'zh',
  hardPhonemes: [
    {
      phoneme: '3',
      level: 5,
      reason: 'English has no lexical tone; T3 (dipping) is hardest to perceive and produce. T2/T3 confusion is the most common tone error for English speakers.',
      l1Equivalence: '(none — intonation only)',
      minimalPairs: ['妈mā/马mǎ', '买mǎi/卖mài', '几jǐ/记jì'],
    },
    {
      phoneme: '2',
      level: 4,
      reason: 'English rising intonation (questions) is different from Mandarin T2 (lexical rising). T2 is often confused with T3.',
      l1Equivalence: '(question intonation)',
      minimalPairs: ['麻má/马mǎ', '人rén/认rèn', '十shí/是shì'],
    },
    {
      phoneme: '0',
      level: 4,
      reason: 'English weak syllables do not change word meaning; Mandarin neutral tone (轻声) can change meaning (e.g. 东西 dōng xi vs dōng xī)',
      l1Equivalence: '(unstressed syllable)',
      minimalPairs: ['东西dōng xi (thing) / 东西dōng xī (east west)', '大意dà yi (careless) / 大意dà yì (main idea)'],
    },
    {
      phoneme: 'v',
      level: 3,
      reason: 'Mandarin ü (v in tone-number form) has no English equivalent; often assimilated to /u/',
      l1Equivalence: 'u',
      minimalPairs: ['女nǚ/努nǔ', '绿lǜ/路lù', '去qù/口kǒu'],
    },
    {
      phoneme: 'q',
      level: 3,
      reason: 'Mandarin q [tɕʰ] has no English equivalent; often confused with English ch [tʃ]',
      l1Equivalence: 'ch',
      minimalPairs: ['七qī/吃chī', '桥qiáo/朝cháo'],
    },
    {
      phoneme: 'x',
      level: 3,
      reason: 'Mandarin x [ɕ] has no English equivalent; often confused with English sh [ʃ]',
      l1Equivalence: 'sh',
      minimalPairs: ['西xī/师shī', '小xiǎo/少shǎo'],
    },
    {
      phoneme: 'zh',
      level: 3,
      reason: 'Mandarin retroflex zh [tʂ] differs from English j [dʒ]; tongue curls back more',
      l1Equivalence: 'j',
      minimalPairs: ['知zhī/机jī', '中zhōng/宗zōng'],
    },
    {
      phoneme: 'ch',
      level: 3,
      reason: 'Mandarin retroflex ch [tʂʰ] differs from English ch [tʃ]; more retroflexed',
      l1Equivalence: 'ch',
      minimalPairs: ['吃chī/七qī', '出chū/粗cū'],
    },
    {
      phoneme: 'sh',
      level: 3,
      reason: 'Mandarin retroflex sh [ʂ] differs from English sh [ʃ]; tongue curls back more',
      l1Equivalence: 'sh',
      minimalPairs: ['是shì/四sì', '山shān/三sān'],
    },
    {
      phoneme: 'r',
      level: 3,
      reason: 'Mandarin r [ʐ/ɻ] is very different from English /r/; often produced as English /r/ or /l/',
      l1Equivalence: 'r',
      minimalPairs: ['人rén/门mén', '热rè/乐lè'],
    },
    {
      phoneme: 'c',
      level: 2,
      reason: 'Mandarin c [tsʰ] (aspirated alveolar affricate) is similar to but distinct from English ts',
      l1Equivalence: 'ts',
      minimalPairs: ['次cì/四sì', '草cǎo/早zǎo'],
    },
    {
      phoneme: 'z',
      level: 2,
      reason: 'Mandarin z [ts] differs from English /z/; it is unaspirated alveolar affricate, not a fricative',
      l1Equivalence: 'z',
      minimalPairs: ['子zǐ/只zhǐ', '做zuò/住zhù'],
    },
  ],
  hardFeatures: [
    {
      feature: 'tone',
      level: 5,
      reason: 'English has no lexical tone; tones change word meaning in Mandarin but English speakers initially process them as intonation.',
    },
    {
      feature: 'neutral_tone',
      level: 4,
      reason: 'Neutral tone changes meaning in Mandarin (东西=thing vs east-west); English speakers miss this because English unstressed syllables are meaningless.',
    },
    {
      feature: 'tone_sandhi',
      level: 4,
      reason: 'T3+T3 → T2+T3 rule is non-obvious; English speakers expect surface forms to match underlying forms.',
    },
    {
      feature: 'retroflex',
      level: 3,
      reason: 'Mandarin retroflex series (zh/ch/sh/r) has no English equivalent; English speakers use palato-alveolar approximations.',
    },
  ],
};
