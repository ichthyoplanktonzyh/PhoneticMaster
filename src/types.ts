/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WordData {
  word: string;
  ipa: string; // American IPA
  phoneticDescription?: string;
}

export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface QuizState {
  currentWord: WordData | null;
  userInput: string;
  feedback: 'correct' | 'incorrect' | 'neutral';
  score: number;
  difficulty: Difficulty;
}
