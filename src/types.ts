/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WordData {
  word: string;
  ipa_uk: string; // British IPA (RP)
  ipa_us: string; // American IPA (General American)
}

export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface QuizState {
  currentWord: WordData | null;
  userInput: string;
  feedback: 'correct' | 'incorrect' | 'neutral';
  score: number;
  difficulty: Difficulty;
}
