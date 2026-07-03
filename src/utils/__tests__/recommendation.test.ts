/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import type {
  LanguageProfile,
  MasteryRecord,
  MinimalPairAnswer,
  MinimalPairQuestion,
  MinimalPairResult,
  SessionResult,
  TrainingAnswer,
  TrainingItem,
} from '../../types';
import {
  buildRecommendations,
  updateMasteryFromMinimalPairResult,
  updateMasteryFromSessionResult,
} from '../recommendation';

const completedAt = '2026-07-03T10:00:00.000Z';

const item = (display: string, pronunciation: string): TrainingItem => ({
  display,
  pronunciation,
  frequencyTier: 'basic',
});

const fixtureProfile: LanguageProfile = {
  code: 'en',
  displayName: 'Fixture English',
  notationName: 'IPA',
  phonemes: [
    { symbol: 'ɪ', category: 'vowel', label: 'ih' },
    { symbol: 'i', category: 'vowel', label: 'ee' },
    { symbol: 'v', category: 'consonant', label: 'v' },
    { symbol: 'w', category: 'consonant', label: 'w' },
    { symbol: 'θ', category: 'consonant', label: 'th' },
    { symbol: 'r', category: 'consonant', label: 'r' },
    { symbol: 'æ', category: 'vowel', label: 'a' },
    { symbol: 'l', category: 'consonant', label: 'l' },
    { symbol: 'ˈ', category: 'mark', label: 'stress' },
  ],
  keypadLayout: [],
  ttsLang: 'en-US',
  parseNotation: notation => notation.trim().split(/\s+/).filter(Boolean),
  judge: () => ({ correct: false, nearMatch: false, diffs: [] }),
  soundFeatures: [],
  wordBank: {
    basic: [
      item('bit', 'ɪ'),
      item('vine', 'v'),
      item('thin', 'θ'),
      item('right', 'r'),
      item('bad', 'æ'),
      item('light', 'l'),
    ],
    intermediate: [
      item('ship', 'ɪ θ'),
      item('very', 'v r'),
      item('will', 'w ɪ l'),
    ],
    advanced: [
      item('finish', 'ɪ θ'),
    ],
  },
};

function answer(
  display: string,
  expected: string,
  correct: boolean,
  nearMatch = false,
  diffs: TrainingAnswer['judgeResult']['diffs'] = [],
): TrainingAnswer {
  return {
    itemId: `${display}::${expected}`,
    item: item(display, expected),
    expected,
    actual: expected,
    judgeResult: { correct, nearMatch, diffs },
    submittedAt: completedAt,
  };
}

function sessionResult(
  answers: TrainingAnswer[],
  mode: SessionResult['config']['mode'] = 'spelling',
): SessionResult {
  return {
    id: 'result-session-1',
    sessionId: 'session-1',
    createdAt: '2026-07-03T09:50:00.000Z',
    completedAt,
    config: {
      l1: 'zh',
      l2: 'en',
      mode,
      difficulty: 'basic',
      topic: null,
      wordCount: answers.length,
    },
    total: answers.length,
    answered: answers.length,
    correct: answers.filter(entry => entry.judgeResult.correct).length,
    nearMatch: answers.filter(entry => entry.judgeResult.nearMatch).length,
    incorrect: answers.filter(entry => (
      !entry.judgeResult.correct && !entry.judgeResult.nearMatch
    )).length,
    accuracy: answers.length > 0 ? 0 : null,
    answers,
    mistakes: answers.filter(entry => !entry.judgeResult.correct),
  };
}

function findRecord(records: MasteryRecord[], phoneme?: string, topic = 'all'): MasteryRecord {
  const record = records.find(entry => entry.topic === topic && entry.phoneme === phoneme);
  if (!record) throw new Error(`Missing mastery record for ${topic}:${phoneme ?? 'topic'}`);
  return record;
}

function question(
  id: string,
  targetPhoneme: string,
  contrastPhoneme: string,
): MinimalPairQuestion {
  const prompt = { id: `${id}-target`, display: id, pronunciation: targetPhoneme };
  return {
    id,
    pairSetId: `${id}-pair`,
    targetPhoneme,
    contrastPhoneme,
    prompt,
    options: [
      prompt,
      { id: `${id}-contrast`, display: `${id} contrast`, pronunciation: contrastPhoneme },
    ],
  };
}

function minimalAnswer(
  id: string,
  targetPhoneme: string,
  contrastPhoneme: string,
  correct: boolean,
): MinimalPairAnswer {
  const minimalQuestion = question(id, targetPhoneme, contrastPhoneme);
  return {
    questionId: minimalQuestion.id,
    question: minimalQuestion,
    selectedOptionId: correct ? minimalQuestion.prompt.id : minimalQuestion.options[1].id,
    correctOptionId: minimalQuestion.prompt.id,
    correct,
    submittedAt: completedAt,
  };
}

function minimalPairResult(answers: MinimalPairAnswer[]): MinimalPairResult {
  return {
    id: 'result-minimal-1',
    sessionId: 'minimal-1',
    createdAt: '2026-07-03T09:45:00.000Z',
    completedAt,
    l1: 'zh',
    l2: 'en',
    topic: null,
    total: answers.length,
    correct: answers.filter(entry => entry.correct).length,
    accuracy: 50,
    answers,
    mistakes: answers.filter(entry => !entry.correct),
  };
}

describe('updateMasteryFromSessionResult', () => {
  it('updates topic and phoneme mastery from spelling session results', () => {
    const records = updateMasteryFromSessionResult(
      [],
      sessionResult([
        answer('bit', 'ɪ v', true),
        answer('thin', 'θ r', false, true, [
          { position: 0, expected: 'θ', actual: 's' },
        ]),
        answer('bad', 'æ l', false, false, [
          { position: 0, expected: 'æ', actual: 'ɑ' },
          { position: 2, expected: '', actual: 'z' },
        ]),
      ]),
      fixtureProfile,
    );

    expect(findRecord(records)).toMatchObject({
      l1: 'zh',
      l2: 'en',
      topic: 'all',
      attempts: 3,
      correct: 1,
      accuracy: 33,
      source: 'local',
    });
    expect(findRecord(records, 'ɪ')).toMatchObject({ attempts: 1, correct: 1, accuracy: 100 });
    expect(findRecord(records, 'v')).toMatchObject({ attempts: 1, correct: 1, accuracy: 100 });
  });

  it('attributes nearMatch and incorrect answers by missed expected phoneme', () => {
    const records = updateMasteryFromSessionResult(
      [],
      sessionResult([
        answer('thin', 'θ r', false, true, [
          { position: 0, expected: 'θ', actual: 's' },
        ]),
        answer('bad', 'æ l', false, false, [
          { position: 0, expected: 'æ', actual: 'ɑ' },
          { position: 2, expected: '', actual: 'z' },
        ]),
      ]),
      fixtureProfile,
    );

    expect(findRecord(records, 'θ')).toMatchObject({ attempts: 1, correct: 0, accuracy: 0 });
    expect(findRecord(records, 'r')).toMatchObject({ attempts: 1, correct: 1, accuracy: 100 });
    expect(findRecord(records, 'æ')).toMatchObject({ attempts: 1, correct: 0, accuracy: 0 });
    expect(findRecord(records, 'l')).toMatchObject({ attempts: 1, correct: 1, accuracy: 100 });
  });

  it('does not update mastery for listen-and-review training mode', () => {
    const existing: MasteryRecord[] = [
      {
        l2: 'en',
        topic: 'all',
        phoneme: 'ɪ',
        attempts: 2,
        correct: 1,
        accuracy: 50,
        lastPracticedAt: completedAt,
        source: 'local',
      },
    ];

    expect(updateMasteryFromSessionResult(
      existing,
      sessionResult([answer('bit', 'ɪ', true)], 'training'),
      fixtureProfile,
    )).toBe(existing);
  });
});

describe('updateMasteryFromMinimalPairResult', () => {
  it('updates target and contrast phoneme mastery from minimal-pair results', () => {
    const records = updateMasteryFromMinimalPairResult(
      [],
      minimalPairResult([
        minimalAnswer('q1', 'ɪ', 'i', true),
        minimalAnswer('q2', 'v', 'w', false),
      ]),
    );

    expect(findRecord(records, undefined, 'minimal-pair')).toMatchObject({
      attempts: 2,
      correct: 1,
      accuracy: 50,
    });
    expect(findRecord(records, 'ɪ', 'minimal-pair')).toMatchObject({ attempts: 1, correct: 1 });
    expect(findRecord(records, 'i', 'minimal-pair')).toMatchObject({ attempts: 1, correct: 1 });
    expect(findRecord(records, 'v', 'minimal-pair')).toMatchObject({ attempts: 1, correct: 0 });
    expect(findRecord(records, 'w', 'minimal-pair')).toMatchObject({ attempts: 1, correct: 0 });
  });
});

describe('buildRecommendations', () => {
  it('falls back to word-bank coverage without L1 or history', () => {
    const recommendations = buildRecommendations({
      profile: fixtureProfile,
      l1: null,
      masteryRecords: [],
      limit: 3,
    });

    expect(recommendations).toHaveLength(3);
    expect(recommendations[0]).toMatchObject({
      phoneme: 'ɪ',
      source: 'fallback',
      wordCount: 4,
    });
    expect(recommendations[0].reasons).toEqual([
      { kind: 'fallback', text: '词库覆盖较多，适合作为起点' },
    ]);
  });

  it('uses L1 difficulty when L1 exists but history does not', () => {
    const recommendations = buildRecommendations({
      profile: fixtureProfile,
      l1: 'zh',
      masteryRecords: [],
      limit: 3,
    });

    expect(recommendations[0]).toMatchObject({
      phoneme: 'ɪ',
      source: 'l1',
      l1Level: 5,
    });
    expect(recommendations.slice(1).map(entry => entry.l1Level)).toEqual([4, 4]);
  });

  it('sorts by weak history when history exists without L1', () => {
    const recommendations = buildRecommendations({
      profile: fixtureProfile,
      l1: null,
      masteryRecords: [
        mastery('en', 'all', 'r', 4, 1),
        mastery('en', 'all', 'ɪ', 10, 9),
      ],
      limit: 2,
    });

    expect(recommendations[0]).toMatchObject({
      phoneme: 'r',
      source: 'history',
      attempts: 4,
      accuracy: 25,
    });
  });

  it('combines weak history with L1 difficulty for personalized ranking', () => {
    const recommendations = buildRecommendations({
      profile: fixtureProfile,
      l1: 'zh',
      masteryRecords: [
        mastery('en', 'all', 'v', 2, 0),
        mastery('en', 'all', 'ɪ', 8, 8),
      ],
      limit: 2,
    });

    expect(recommendations[0]).toMatchObject({
      phoneme: 'v',
      source: 'personalized',
      attempts: 2,
      accuracy: 0,
      l1Level: 4,
    });
    expect(recommendations[0].reasons.map(reason => reason.kind)).toEqual(['history', 'l1']);
  });
});

function mastery(
  l2: string,
  topic: string,
  phoneme: string,
  attempts: number,
  correct: number,
): MasteryRecord {
  return {
    l2,
    topic,
    phoneme,
    attempts,
    correct,
    accuracy: Math.round((correct / attempts) * 100),
    lastPracticedAt: completedAt,
    source: 'local',
  };
}
