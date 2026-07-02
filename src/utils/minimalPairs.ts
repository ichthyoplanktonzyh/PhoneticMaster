/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Minimal-pair training utilities.
 */

import { minimalPairBank } from '../data/minimalPairBank';
import type {
  LanguageProfile,
  MinimalPairAnswer,
  MinimalPairOption,
  MinimalPairQuestion,
  MinimalPairResult,
  MinimalPairSession,
  MinimalPairSet,
} from '../types';

interface MinimalPairSessionConfig {
  profile: LanguageProfile;
  l1: string | null;
  topic: string | null;
  questionCount: number;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function getMinimalPairSets(
  profile: LanguageProfile,
  topic: string | null = null,
): MinimalPairSet[] {
  return minimalPairBank.filter(pair => (
    pair.l2 === profile.code
    && (!topic || pair.targetPhoneme === topic || pair.contrastPhoneme === topic)
  ));
}

export function hasMinimalPairs(profile: LanguageProfile, topic: string | null = null): boolean {
  return getMinimalPairSets(profile, topic).length > 0;
}

function questionFromPrompt(pair: MinimalPairSet, prompt: MinimalPairOption, cycle: number): MinimalPairQuestion {
  return {
    id: `${pair.id}:${prompt.id}:${cycle}`,
    pairSetId: pair.id,
    targetPhoneme: pair.targetPhoneme,
    contrastPhoneme: pair.contrastPhoneme,
    prompt,
    options: shuffle(pair.options),
  };
}

export function buildMinimalPairQuestions(
  pairs: MinimalPairSet[],
  count: number,
): MinimalPairQuestion[] {
  if (pairs.length === 0 || count <= 0) return [];

  const baseQuestions = pairs.flatMap(pair => (
    pair.options.map(option => questionFromPrompt(pair, option, 0))
  ));
  const questions: MinimalPairQuestion[] = [];
  let cycle = 0;

  while (questions.length < count) {
    const source = cycle === 0
      ? baseQuestions
      : pairs.flatMap(pair => pair.options.map(option => questionFromPrompt(pair, option, cycle)));

    for (const question of shuffle(source)) {
      if (questions.length >= count) break;
      questions.push(question);
    }
    cycle += 1;
  }

  return questions;
}

export function createMinimalPairSession(config: MinimalPairSessionConfig): MinimalPairSession {
  const createdAt = new Date().toISOString();
  const pairs = getMinimalPairSets(config.profile, config.topic);

  return {
    id: `minimal-pair-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    l1: config.l1 ?? undefined,
    l2: config.profile.code,
    topic: config.topic,
    questions: buildMinimalPairQuestions(pairs, config.questionCount),
    answers: [],
  };
}

export function createMinimalPairAnswer(
  question: MinimalPairQuestion,
  selectedOptionId: string,
): MinimalPairAnswer {
  return {
    questionId: question.id,
    question,
    selectedOptionId,
    correctOptionId: question.prompt.id,
    correct: selectedOptionId === question.prompt.id,
    submittedAt: new Date().toISOString(),
  };
}

export function appendMinimalPairAnswer(
  session: MinimalPairSession,
  answer: MinimalPairAnswer,
): MinimalPairSession {
  const answers = session.answers.filter(existing => existing.questionId !== answer.questionId);
  return {
    ...session,
    answers: [...answers, answer],
  };
}

export function completeMinimalPairSession(session: MinimalPairSession): MinimalPairSession {
  return {
    ...session,
    completedAt: new Date().toISOString(),
  };
}

export function buildMinimalPairResult(session: MinimalPairSession): MinimalPairResult {
  const completedAt = session.completedAt ?? new Date().toISOString();
  const correct = session.answers.filter(answer => answer.correct).length;
  const total = session.questions.length;

  return {
    id: `result-${session.id}`,
    sessionId: session.id,
    createdAt: session.createdAt,
    completedAt,
    l1: session.l1,
    l2: session.l2,
    topic: session.topic,
    total,
    correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    answers: session.answers,
    mistakes: session.answers.filter(answer => !answer.correct),
  };
}

export function getMinimalPairAudioText(option: MinimalPairOption): string {
  return option.audioText ?? option.display;
}
