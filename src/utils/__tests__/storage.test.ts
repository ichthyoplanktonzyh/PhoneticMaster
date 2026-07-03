/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { beforeEach, describe, expect, it } from 'vitest';
import type { MasteryRecord, SessionResult } from '../../types';
import {
  clearMasteryRecords,
  clearSessionResults,
  loadMasteryRecords,
  loadSessionResults,
  saveMasteryRecords,
  saveSessionResult,
} from '../storage';

const SESSION_HISTORY_KEY = 'phonetic-master-sessions';
const MASTERY_KEY = 'phonetic-master-mastery';

class FakeLocalStorage {
  readonly store = new Map<string, string>();
  failGet = false;
  failSet = false;
  failRemove = false;

  getItem(key: string): string | null {
    if (this.failGet) throw new Error('get failed');
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.failSet) throw new Error('set failed');
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    if (this.failRemove) throw new Error('remove failed');
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

let storage: FakeLocalStorage;

beforeEach(() => {
  storage = new FakeLocalStorage();
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
  });
});

describe('session result storage', () => {
  it('saves, loads, and clears session results', () => {
    const result = sessionResult('result-1');

    expect(saveSessionResult(result)).toBe(true);
    expect(loadSessionResults()).toEqual([result]);

    expect(clearSessionResults()).toBe(true);
    expect(loadSessionResults()).toEqual([]);
  });

  it('silently degrades on read, write, and clear failures', () => {
    storage.failGet = true;
    expect(loadSessionResults()).toEqual([]);

    storage.failGet = false;
    storage.failSet = true;
    expect(saveSessionResult(sessionResult('result-1'))).toBe(false);

    storage.failSet = false;
    storage.failRemove = true;
    expect(clearSessionResults()).toBe(false);
  });

  it('returns an empty list for malformed JSON and filters malformed entries', () => {
    storage.store.set(SESSION_HISTORY_KEY, '{not-json');
    expect(loadSessionResults()).toEqual([]);

    const valid = sessionResult('result-valid');
    storage.store.set(SESSION_HISTORY_KEY, JSON.stringify([
      { id: 'bad-result' },
      valid,
      null,
    ]));
    expect(loadSessionResults()).toEqual([valid]);
  });

  it('keeps only the most recent 12 session results', () => {
    for (let index = 1; index <= 13; index += 1) {
      saveSessionResult(sessionResult(`result-${index}`));
    }

    const results = loadSessionResults();
    expect(results).toHaveLength(12);
    expect(results[0].id).toBe('result-13');
    expect(results.map(result => result.id)).not.toContain('result-1');
  });
});

describe('mastery storage', () => {
  it('saves, loads, and clears mastery records', () => {
    const records = [mastery('ɪ'), mastery('v')];

    expect(saveMasteryRecords(records)).toBe(true);
    expect(loadMasteryRecords()).toEqual(records);

    expect(clearMasteryRecords()).toBe(true);
    expect(loadMasteryRecords()).toEqual([]);
  });

  it('silently degrades on mastery read, write, and clear failures', () => {
    storage.failGet = true;
    expect(loadMasteryRecords()).toEqual([]);

    storage.failGet = false;
    storage.failSet = true;
    expect(saveMasteryRecords([mastery('ɪ')])).toBe(false);

    storage.failSet = false;
    storage.failRemove = true;
    expect(clearMasteryRecords()).toBe(false);
  });

  it('returns an empty list for malformed JSON and filters malformed records', () => {
    storage.store.set(MASTERY_KEY, '{not-json');
    expect(loadMasteryRecords()).toEqual([]);

    const valid = mastery('ɪ');
    storage.store.set(MASTERY_KEY, JSON.stringify([
      valid,
      { ...valid, source: 'remote' },
      { ...valid, attempts: '1' },
    ]));
    expect(loadMasteryRecords()).toEqual([valid]);
  });
});

function sessionResult(id: string): SessionResult {
  return {
    id,
    sessionId: `session-${id}`,
    createdAt: '2026-07-03T09:00:00.000Z',
    completedAt: '2026-07-03T09:05:00.000Z',
    config: {
      l2: 'en',
      mode: 'spelling',
      difficulty: 'basic',
      topic: null,
      wordCount: 1,
    },
    total: 1,
    answered: 1,
    correct: 1,
    nearMatch: 0,
    incorrect: 0,
    accuracy: 100,
    answers: [],
    mistakes: [],
  };
}

function mastery(phoneme: string): MasteryRecord {
  return {
    l2: 'en',
    topic: 'all',
    phoneme,
    attempts: 2,
    correct: 1,
    accuracy: 50,
    lastPracticedAt: '2026-07-03T09:05:00.000Z',
    source: 'local',
  };
}
