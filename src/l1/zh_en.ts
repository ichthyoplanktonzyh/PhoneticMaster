/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * L1 × L2 difficulty mapping: Chinese native → English target.
 *
 * Based on:
 * - Best's Perceptual Assimilation Model (PAM): L2 phones are assimilated
 *   into L1 categories, determining which contrasts are hard to perceive.
 * - Flege's Speech Learning Model (SLM): "new" vs "similar" phones have
 *   different learning trajectories; similar phones are hardest because
 *   learners keep using their L1 category.
 * - Cutler et al.: L1 segmentation strategies transfer to L2.
 */

import type { L1L2Difficulty } from '../types';

export const zh_en: L1L2Difficulty = {
  l1: 'zh',
  l2: 'en',
  hardPhonemes: [
    {
      phoneme: 'ɪ',
      level: 5,
      reason: 'Mandarin has no lax/tense vowel contrast; /ɪ/ is assimilated to /i/ (衣)',
      l1Equivalence: 'i',
      minimalPairs: ['bit/beat', 'ship/sheep', 'fill/feel', 'hit/heat'],
    },
    {
      phoneme: 'v',
      level: 4,
      reason: 'Mandarin has no labiodental fricative; /v/ is assimilated to /w/ (乌) or /f/',
      l1Equivalence: 'w',
      minimalPairs: ['vine/wine', 'vest/west', 'vet/wet', 'veal/wheel'],
    },
    {
      phoneme: 'θ',
      level: 4,
      reason: 'Mandarin has no dental fricative; /θ/ is assimilated to /s/ (思)',
      l1Equivalence: 's',
      minimalPairs: ['think/sink', 'thin/sin', 'thick/sick', 'path/pass'],
    },
    {
      phoneme: 'ð',
      level: 4,
      reason: 'Mandarin has no dental fricative; /ð/ is assimilated to /z/ or /d/',
      l1Equivalence: 'z',
      minimalPairs: ['that/zat', 'thee/ze', 'breathe/breeze'],
    },
    {
      phoneme: 'r',
      level: 3,
      reason: 'English /r/ is very different from Mandarin r (日); learners substitute L1 /l/ or Mandarin r',
      l1Equivalence: 'l',
      minimalPairs: ['light/right', 'fly/fry', 'lead/read', 'climb/crime'],
    },
    {
      phoneme: 'l',
      level: 3,
      reason: 'English dark /l/ (coda) does not exist in Mandarin; often dropped or substituted',
      l1Equivalence: 'l',
      minimalPairs: ['ball/bow', 'fill/feel', 'milk/miwk'],
    },
    {
      phoneme: 'æ',
      level: 3,
      reason: 'Mandarin /a/ is central; English /æ/ falls between Mandarin a and e, hard to categorize',
      l1Equivalence: 'a',
      minimalPairs: ['cat/cut', 'bat/bet', 'man/men'],
    },
    {
      phoneme: 'ʊ',
      level: 3,
      reason: 'Mandarin has no lax /ʊ/; assimilated to /u/ (乌)',
      l1Equivalence: 'u',
      minimalPairs: ['full/fool', 'look/Luke', 'pull/pool'],
    },
    {
      phoneme: 'ɛ',
      level: 2,
      reason: 'Similar to Mandarin e (鹅) but with different tongue height',
      l1Equivalence: 'e',
      minimalPairs: ['bed/bad', 'pen/pan'],
    },
    {
      phoneme: 'ɑ',
      level: 2,
      reason: 'Similar to Mandarin a (啊) but often longer and lower',
      l1Equivalence: 'a',
      minimalPairs: ['cot/caught', 'hot/hurt'],
    },
    {
      phoneme: 'ə',
      level: 2,
      reason: 'Schwa exists but Mandarin speakers are not used to phonemic vowel reduction',
      l1Equivalence: 'e',
      minimalPairs: ['about/a-bout', 'sofa/sofa'],
    },
  ],
  hardFeatures: [
    {
      feature: 'weak_form',
      level: 5,
      reason: 'Mandarin has no phonemic vowel reduction; every syllable is fully articulated. English weak forms (schwa, reduced vowels) are systematically missed.',
    },
    {
      feature: 'vowel_reduction',
      level: 5,
      reason: 'Mandarin speakers expect every syllable to have a full vowel. Reduced vowels in function words and unstressed syllables are "repaired" to full vowels.',
    },
    {
      feature: 'linking',
      level: 4,
      reason: 'Mandarin syllables are discrete; English linking (consonant-to-vowel, r-linking) creates word boundaries that Mandarin speakers cannot parse.',
    },
    {
      feature: 'elision',
      level: 4,
      reason: 'Mandarin speakers expect all written sounds to be pronounced; elision (next→neks, mostly→mousli) makes words unrecognizable.',
    },
    {
      feature: 'stress',
      level: 3,
      reason: 'Mandarin is syllable-timed with no word-level stress; English stress patterns affect both perception and word identification.',
    },
    {
      feature: 'assimilation',
      level: 3,
      reason: 'Connected speech assimilation (did you→dijou) changes familiar sounds into unfamiliar ones.',
    },
  ],
};
