/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Structured Mandarin Pinyin input: initial -> final -> tone.
 */

import React, { useMemo, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import type { LanguageProfile } from '../types';
import { buildPinyinSyllable } from '../utils/pinyinBuilder';

interface StructuredPinyinInputProps {
  profile: LanguageProfile;
  disabled: boolean;
  onCommitSyllable: (syllable: string) => void;
}

function getSection(profile: LanguageProfile, keyword: string): string[] {
  return profile.keypadLayout.find(section => (
    section.category.toLowerCase().includes(keyword)
  ))?.phonemes ?? [];
}

function formatToneLabel(tone: string): string {
  if (tone === '0') return '5';
  return tone;
}

function formatFinalLabel(final: string): string {
  if (final === 'v') return 'ü';
  if (final.startsWith('v')) return `ü${final.slice(1)}`;
  return final;
}

export const StructuredPinyinInput: React.FC<StructuredPinyinInputProps> = ({
  profile,
  disabled,
  onCommitSyllable,
}) => {
  const initials = useMemo(() => getSection(profile, 'initial'), [profile]);
  const finals = useMemo(() => getSection(profile, 'final'), [profile]);
  const tones = useMemo(() => getSection(profile, 'tone'), [profile]);
  const [initial, setInitial] = useState<string>('');
  const [final, setFinal] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null);

  const preview = final && tone ? buildPinyinSyllable(initial, final, tone) : '';
  const canCommit = Boolean(final && tone) && !disabled;

  const reset = () => {
    setInitial('');
    setFinal(null);
    setTone(null);
  };

  const commit = () => {
    if (!preview || disabled) return;
    onCommitSyllable(preview);
    reset();
  };

  return (
    <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-slate-100 space-y-5">
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          声母 Initial
        </h3>
        <div className="grid grid-cols-8 gap-2">
          <button
            onClick={() => setInitial('')}
            disabled={disabled}
            className={`h-12 rounded-lg border bg-white text-sm font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
              initial === '' ? 'border-indigo-500 text-indigo-600' : 'border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            Ø
          </button>
          {initials.map(symbol => (
            <button
              key={symbol}
              onClick={() => setInitial(symbol)}
              disabled={disabled}
              className={`h-12 rounded-lg border bg-white text-lg font-medium shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                initial === symbol ? 'border-indigo-500 text-indigo-600' : 'border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          韵母 Final
        </h3>
        <div className="grid grid-cols-8 gap-2">
          {finals.map(symbol => (
            <button
              key={symbol}
              onClick={() => setFinal(symbol)}
              disabled={disabled}
              className={`h-12 rounded-lg border bg-white text-base font-medium shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                final === symbol ? 'border-indigo-500 text-indigo-600' : 'border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {formatFinalLabel(symbol)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          声调 Tone
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {tones.map(symbol => (
            <button
              key={symbol}
              onClick={() => setTone(symbol)}
              disabled={disabled}
              className={`h-12 w-14 rounded-lg border bg-white text-xl font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                tone === symbol ? 'border-indigo-500 text-indigo-600' : 'border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {formatToneLabel(symbol)}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <div className="min-w-24 rounded-lg border border-slate-100 bg-white px-4 py-3 text-center text-lg font-bold text-slate-700">
              {preview || '-'}
            </div>
            <button
              onClick={reset}
              disabled={disabled}
              title="重置当前音节"
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-slate-300 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={commit}
              disabled={!canCommit}
              title="添加拼音音节"
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
