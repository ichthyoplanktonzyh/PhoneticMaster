/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Curated minimal-pair listening materials.
 * Current prompts use Web Speech API text, while audioUrl is reserved
 * for future standard audio recordings.
 */

import type { MinimalPairSet } from '../types';

export const minimalPairBank: MinimalPairSet[] = [
  {
    id: 'en-ih-ee-ship-sheep',
    l2: 'en',
    targetPhoneme: 'ɪ',
    contrastPhoneme: 'i',
    difficulty: 'basic',
    source: 'curated',
    note: 'Short lax /ɪ/ versus tense /i/.',
    options: [
      { id: 'ship', display: 'ship', pronunciation: 'ʃɪp' },
      { id: 'sheep', display: 'sheep', pronunciation: 'ʃip' },
    ],
  },
  {
    id: 'en-ih-ee-bit-beat',
    l2: 'en',
    targetPhoneme: 'ɪ',
    contrastPhoneme: 'i',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'bit', display: 'bit', pronunciation: 'bɪt' },
      { id: 'beat', display: 'beat', pronunciation: 'bit' },
    ],
  },
  {
    id: 'en-v-w-vest-west',
    l2: 'en',
    targetPhoneme: 'v',
    contrastPhoneme: 'w',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'vest', display: 'vest', pronunciation: 'vɛst' },
      { id: 'west', display: 'west', pronunciation: 'wɛst' },
    ],
  },
  {
    id: 'en-theta-s-thin-sin',
    l2: 'en',
    targetPhoneme: 'θ',
    contrastPhoneme: 's',
    difficulty: 'intermediate',
    source: 'curated',
    options: [
      { id: 'thin', display: 'thin', pronunciation: 'θɪn' },
      { id: 'sin', display: 'sin', pronunciation: 'sɪn' },
    ],
  },
  {
    id: 'en-r-l-right-light',
    l2: 'en',
    targetPhoneme: 'r',
    contrastPhoneme: 'l',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'right', display: 'right', pronunciation: 'raɪt' },
      { id: 'light', display: 'light', pronunciation: 'laɪt' },
    ],
  },
  {
    id: 'en-ae-eh-bad-bed',
    l2: 'en',
    targetPhoneme: 'æ',
    contrastPhoneme: 'ɛ',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'bad', display: 'bad', pronunciation: 'bæd' },
      { id: 'bed', display: 'bed', pronunciation: 'bɛd' },
    ],
  },
  {
    id: 'en-u-uh-full-fool',
    l2: 'en',
    targetPhoneme: 'ʊ',
    contrastPhoneme: 'u',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'full', display: 'full', pronunciation: 'fʊl' },
      { id: 'fool', display: 'fool', pronunciation: 'ful' },
    ],
  },
  {
    id: 'en-ae-uh-cat-cut',
    l2: 'en',
    targetPhoneme: 'æ',
    contrastPhoneme: 'ʌ',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'cat', display: 'cat', pronunciation: 'kæt' },
      { id: 'cut', display: 'cut', pronunciation: 'kʌt' },
    ],
  },
  {
    id: 'zh-tone-3-1-ma',
    l2: 'zh',
    targetPhoneme: '3',
    contrastPhoneme: '1',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'ma3', display: '马', pronunciation: 'ma3', pronunciationAlt: 'mǎ' },
      { id: 'ma1', display: '妈', pronunciation: 'ma1', pronunciationAlt: 'mā' },
    ],
  },
  {
    id: 'zh-tone-2-4-ma',
    l2: 'zh',
    targetPhoneme: '2',
    contrastPhoneme: '4',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'ma2', display: '麻', pronunciation: 'ma2', pronunciationAlt: 'má' },
      { id: 'ma4', display: '骂', pronunciation: 'ma4', pronunciationAlt: 'mà' },
    ],
  },
  {
    id: 'zh-v-u-nv-nu',
    l2: 'zh',
    targetPhoneme: 'v',
    contrastPhoneme: 'u',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'nv3', display: '女', pronunciation: 'nv3', pronunciationAlt: 'nǚ' },
      { id: 'nu3', display: '努', pronunciation: 'nu3', pronunciationAlt: 'nǔ' },
    ],
  },
  {
    id: 'zh-q-ch-qi-chi',
    l2: 'zh',
    targetPhoneme: 'q',
    contrastPhoneme: 'ch',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'qi1', display: '七', pronunciation: 'qi1', pronunciationAlt: 'qī' },
      { id: 'chi1', display: '吃', pronunciation: 'chi1', pronunciationAlt: 'chī' },
    ],
  },
  {
    id: 'zh-x-sh-xi-shi',
    l2: 'zh',
    targetPhoneme: 'x',
    contrastPhoneme: 'sh',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'xi1', display: '西', pronunciation: 'xi1', pronunciationAlt: 'xī' },
      { id: 'shi1', display: '师', pronunciation: 'shi1', pronunciationAlt: 'shī' },
    ],
  },
  {
    id: 'zh-zh-z-zhi-zi',
    l2: 'zh',
    targetPhoneme: 'zh',
    contrastPhoneme: 'z',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'zhi3', display: '只', pronunciation: 'zhi3', pronunciationAlt: 'zhǐ' },
      { id: 'zi3', display: '子', pronunciation: 'zi3', pronunciationAlt: 'zǐ' },
    ],
  },
  {
    id: 'zh-sh-s-shi-si',
    l2: 'zh',
    targetPhoneme: 'sh',
    contrastPhoneme: 's',
    difficulty: 'basic',
    source: 'curated',
    options: [
      { id: 'shi4', display: '是', pronunciation: 'shi4', pronunciationAlt: 'shì' },
      { id: 'si4', display: '四', pronunciation: 'si4', pronunciationAlt: 'sì' },
    ],
  },
];
