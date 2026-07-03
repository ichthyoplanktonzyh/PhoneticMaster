/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Local personalization and recommendation utilities.
 * Turns completed practice results into local mastery records, then ranks
 * next practice topics by combining learner history with optional L1 difficulty.
 */

import type {
  LanguageProfile,
  MasteryRecord,
  MinimalPairResult,
  Recommendation,
  RecommendationReason,
  SessionResult,
} from '../types';
import { getRecommendedPhonemes } from '../l1/difficultyMap';
import { getPhonemeStats } from './phonemeGroups';

const ALL_TOPIC = 'all';
const MINIMAL_PAIR_TOPIC = 'minimal-pair';
const KEY_SEPARATOR = '::';

interface MasteryUpdate {
  l1?: string;
  l2: string;
  topic: string;
  phoneme?: string;
  attempts: number;
  correct: number;
  practicedAt: string;
}

interface MasterySummary {
  attempts: number;
  correct: number;
  accuracy: number;
  lastPracticedAt?: string;
}

interface BuildRecommendationsConfig {
  profile: LanguageProfile;
  l1: string | null;
  masteryRecords: MasteryRecord[];
  limit?: number;
}

function masteryKey(l2: string, topic: string, phoneme?: string): string {
  return [l2, topic, phoneme ?? ''].join(KEY_SEPARATOR);
}

function getAccuracy(correct: number, attempts: number): number {
  if (attempts <= 0) return 0;
  return Math.round((correct / attempts) * 100);
}

function normalizeRecord(record: MasteryRecord): MasteryRecord {
  const attempts = Math.max(0, Math.round(record.attempts));
  const correct = Math.max(0, Math.min(attempts, Math.round(record.correct)));

  return {
    ...record,
    attempts,
    correct,
    accuracy: getAccuracy(correct, attempts),
    source: 'local',
  };
}

function seedMasteryMap(records: MasteryRecord[]): Map<string, MasteryRecord> {
  const map = new Map<string, MasteryRecord>();

  for (const record of records) {
    const normalized = normalizeRecord(record);
    map.set(masteryKey(normalized.l2, normalized.topic, normalized.phoneme), normalized);
  }

  return map;
}

function applyMasteryUpdate(map: Map<string, MasteryRecord>, update: MasteryUpdate): void {
  if (update.attempts <= 0) return;

  const key = masteryKey(update.l2, update.topic, update.phoneme);
  const existing = map.get(key);
  const attempts = (existing?.attempts ?? 0) + update.attempts;
  const correct = (existing?.correct ?? 0) + update.correct;
  const lastPracticedAt = existing && existing.lastPracticedAt > update.practicedAt
    ? existing.lastPracticedAt
    : update.practicedAt;

  map.set(key, {
    l1: update.l1 ?? existing?.l1,
    l2: update.l2,
    topic: update.topic,
    phoneme: update.phoneme,
    attempts,
    correct,
    accuracy: getAccuracy(correct, attempts),
    lastPracticedAt,
    source: 'local',
  });
}

function sortMasteryRecords(records: MasteryRecord[]): MasteryRecord[] {
  return [...records].sort((a, b) => (
    a.l2.localeCompare(b.l2)
    || a.topic.localeCompare(b.topic)
    || (a.phoneme ?? '').localeCompare(b.phoneme ?? '')
  ));
}

function getTrackablePhonemes(profile: LanguageProfile): Set<string> {
  return new Set(
    profile.phonemes
      .filter(phoneme => phoneme.category !== 'mark')
      .map(phoneme => phoneme.symbol),
  );
}

function uniqueTrackablePhonemes(
  profile: LanguageProfile,
  notation: string,
  trackable: Set<string>,
): string[] {
  return [...new Set(profile.parseNotation(notation))]
    .filter(phoneme => trackable.has(phoneme));
}

function addTopicUpdate(
  map: Map<string, MasteryRecord>,
  result: Pick<SessionResult, 'config' | 'completedAt'>,
  topic: string,
  correct: boolean,
): void {
  applyMasteryUpdate(map, {
    l1: result.config.l1,
    l2: result.config.l2,
    topic,
    attempts: 1,
    correct: correct ? 1 : 0,
    practicedAt: result.completedAt,
  });
}

export function updateMasteryFromSessionResult(
  records: MasteryRecord[],
  result: SessionResult,
  profile: LanguageProfile,
): MasteryRecord[] {
  if (result.config.mode !== 'spelling' || result.answers.length === 0) {
    return records;
  }

  const map = seedMasteryMap(records);
  const topic = result.config.topic ?? ALL_TOPIC;
  const trackable = getTrackablePhonemes(profile);

  for (const answer of result.answers) {
    addTopicUpdate(map, result, topic, answer.judgeResult.correct);

    const expectedPhonemes = uniqueTrackablePhonemes(profile, answer.expected, trackable);
    const missedExpected = new Set(
      answer.judgeResult.diffs
        .map(diff => diff.expected)
        .filter(phoneme => trackable.has(phoneme)),
    );

    for (const phoneme of expectedPhonemes) {
      applyMasteryUpdate(map, {
        l1: result.config.l1,
        l2: result.config.l2,
        topic,
        phoneme,
        attempts: 1,
        correct: answer.judgeResult.correct || !missedExpected.has(phoneme) ? 1 : 0,
        practicedAt: result.completedAt,
      });
    }
  }

  return sortMasteryRecords([...map.values()]);
}

export function updateMasteryFromMinimalPairResult(
  records: MasteryRecord[],
  result: MinimalPairResult,
): MasteryRecord[] {
  if (result.answers.length === 0) return records;

  const map = seedMasteryMap(records);
  const topic = result.topic ?? MINIMAL_PAIR_TOPIC;

  for (const answer of result.answers) {
    applyMasteryUpdate(map, {
      l1: result.l1,
      l2: result.l2,
      topic,
      attempts: 1,
      correct: answer.correct ? 1 : 0,
      practicedAt: result.completedAt,
    });

    const phonemes = [...new Set([
      answer.question.targetPhoneme,
      answer.question.contrastPhoneme,
    ])];

    for (const phoneme of phonemes) {
      applyMasteryUpdate(map, {
        l1: result.l1,
        l2: result.l2,
        topic,
        phoneme,
        attempts: 1,
        correct: answer.correct ? 1 : 0,
        practicedAt: result.completedAt,
      });
    }
  }

  return sortMasteryRecords([...map.values()]);
}

function summarizeMastery(records: MasteryRecord[], l2: string, phoneme: string): MasterySummary {
  const matching = records.filter(record => (
    record.l2 === l2
    && record.phoneme === phoneme
    && record.attempts > 0
  ));

  const attempts = matching.reduce((sum, record) => sum + record.attempts, 0);
  const correct = matching.reduce((sum, record) => sum + record.correct, 0);
  const lastPracticedAt = matching
    .map(record => record.lastPracticedAt)
    .sort()
    .at(-1);

  return {
    attempts,
    correct,
    accuracy: getAccuracy(correct, attempts),
    lastPracticedAt,
  };
}

function buildReasons(
  summary: MasterySummary,
  l1Level: number,
  hasAnyHistory: boolean,
): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];

  if (summary.attempts > 0) {
    const tone = summary.accuracy >= 85
      ? '历史正确率稳定'
      : summary.accuracy >= 65
        ? '历史正确率还可提升'
        : '历史正确率偏低';

    reasons.push({
      kind: 'history',
      text: `${tone}: ${summary.accuracy}% (${summary.attempts} 次)`,
    });
  }

  if (l1Level > 0) {
    reasons.push({
      kind: 'l1',
      text: `L1 难度 ${l1Level}/5`,
    });
  }

  if (reasons.length === 0) {
    reasons.push({
      kind: 'fallback',
      text: hasAnyHistory ? '尚未充分练习，可补齐覆盖' : '词库覆盖较多，适合作为起点',
    });
  }

  return reasons;
}

function getRecommendationSource(
  hasHistory: boolean,
  hasL1Signal: boolean,
): Recommendation['source'] {
  if (hasHistory && hasL1Signal) return 'personalized';
  if (hasHistory) return 'history';
  if (hasL1Signal) return 'l1';
  return 'fallback';
}

export function buildRecommendations({
  profile,
  l1,
  masteryRecords,
  limit = 6,
}: BuildRecommendationsConfig): Recommendation[] {
  const trackable = getTrackablePhonemes(profile);
  const stats = getPhonemeStats(profile).filter(item => trackable.has(item.phoneme));
  const statsByPhoneme = new Map(stats.map(item => [item.phoneme, item.count]));
  const maxWordCount = Math.max(1, ...stats.map(item => item.count));
  const l1ByPhoneme = new Map(
    getRecommendedPhonemes(l1, profile.code, profile)
      .map(item => [item.phoneme, item.level]),
  );
  const hasAnyHistory = masteryRecords.some(record => (
    record.l2 === profile.code
    && Boolean(record.phoneme)
    && record.attempts > 0
  ));

  return profile.phonemes
    .filter(phoneme => trackable.has(phoneme.symbol))
    .map(phoneme => {
      const wordCount = statsByPhoneme.get(phoneme.symbol) ?? 0;
      const summary = summarizeMastery(masteryRecords, profile.code, phoneme.symbol);
      const hasHistory = summary.attempts > 0;
      const l1Level = l1ByPhoneme.get(phoneme.symbol) ?? 0;
      const hasL1Signal = l1Level > 0;
      const historyNeed = hasHistory ? (100 - summary.accuracy) / 100 : 0;
      const lowEvidenceBoost = hasHistory
        ? Math.max(0, (3 - summary.attempts) / 3) * 0.08
        : 0;
      const l1Need = l1Level / 5;
      const fallbackNeed = (wordCount / maxWordCount) * (hasAnyHistory ? 0.05 : 0.2);
      const score = hasHistory && hasL1Signal
        ? (historyNeed * 0.65) + (l1Need * 0.35) + lowEvidenceBoost
        : hasHistory
          ? historyNeed + lowEvidenceBoost
          : hasL1Signal
            ? l1Need
            : fallbackNeed;

      return {
        phoneme: phoneme.symbol,
        label: phoneme.label,
        category: phoneme.category,
        score,
        source: getRecommendationSource(hasHistory, hasL1Signal),
        attempts: hasHistory ? summary.attempts : undefined,
        accuracy: hasHistory ? summary.accuracy : undefined,
        lastPracticedAt: summary.lastPracticedAt,
        l1Level: hasL1Signal ? l1Level : undefined,
        wordCount,
        reasons: buildReasons(summary, l1Level, hasAnyHistory),
      };
    })
    .filter(item => item.wordCount > 0 || item.source !== 'fallback')
    .sort((a, b) => (
      b.score - a.score
      || (b.l1Level ?? 0) - (a.l1Level ?? 0)
      || (a.accuracy ?? 101) - (b.accuracy ?? 101)
      || b.wordCount - a.wordCount
      || a.phoneme.localeCompare(b.phoneme)
    ))
    .slice(0, limit);
}
