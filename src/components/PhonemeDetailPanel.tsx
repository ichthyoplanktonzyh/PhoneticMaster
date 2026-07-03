/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phoneme detail drawer with profile metadata, L1-aware explanation,
 * examples, and minimal-pair practice entry points.
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Ear,
  GraduationCap,
  Pencil,
  Star,
  Target,
  X,
} from 'lucide-react';
import type {
  LanguageProfile,
  MinimalPairOption,
  MinimalPairSet,
  PhonemeDetail,
  TrainingItem,
} from '../types';

interface PhonemeDetailPanelProps {
  detail: PhonemeDetail | null;
  profile: LanguageProfile;
  l1Label: string | null;
  onClose: () => void;
  onStartSpelling: (phoneme: string) => void;
  onStartMinimalPairs: (phoneme: string) => void;
}

function formatSymbol(profile: LanguageProfile, symbol: string): string {
  return profile.notationName === 'Pinyin' ? symbol : `/${symbol}/`;
}

function formatItemNotation(profile: LanguageProfile, item: TrainingItem): string {
  if (profile.notationName === 'Pinyin') return item.pronunciationAlt ?? item.pronunciation;
  return `/${item.pronunciation}/`;
}

function formatOptionNotation(profile: LanguageProfile, option: MinimalPairOption): string {
  if (profile.notationName === 'Pinyin') return option.pronunciationAlt ?? option.pronunciation;
  return `/${option.pronunciation}/`;
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${index < level ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </span>
  );
}

function PairPreview({
  pair,
  profile,
}: {
  pair: MinimalPairSet;
  profile: LanguageProfile;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {formatSymbol(profile, pair.targetPhoneme)} vs {formatSymbol(profile, pair.contrastPhoneme)}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
          {pair.difficulty}
        </p>
      </div>
      <div className="mt-3 grid gap-2">
        {pair.options.map(option => (
          <div key={option.id} className="flex items-center justify-between gap-4 text-sm">
            <span className="font-bold text-slate-800">{option.display}</span>
            <span className={`${profile.notationName === 'Pinyin' ? '' : 'ipa-text'} text-xs font-semibold text-slate-400`}>
              {formatOptionNotation(profile, option)}
            </span>
          </div>
        ))}
      </div>
      {pair.note && (
        <p className="mt-3 text-xs leading-5 text-slate-400">{pair.note}</p>
      )}
    </div>
  );
}

export const PhonemeDetailPanel: React.FC<PhonemeDetailPanelProps> = ({
  detail,
  profile,
  l1Label,
  onClose,
  onStartSpelling,
  onStartMinimalPairs,
}) => {
  if (!detail) return null;

  const isIpa = profile.notationName !== 'Pinyin';
  const unitLabel = profile.notationName === 'Pinyin' ? '拼音单元' : '音素';
  const hasMinimalPairs = detail.minimalPairs.length > 0;
  const mappedPairs = detail.difficulty?.minimalPairs ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/25">
      <button
        type="button"
        aria-label="Close phoneme detail"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <motion.aside
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-6 border-b border-slate-100 px-8 py-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
              {profile.displayName} {unitLabel}
            </p>
            <div className="mt-4 flex items-end gap-4">
              <h2 className={`${isIpa ? 'ipa-text' : ''} text-5xl font-black tracking-tight text-slate-900`}>
                {formatSymbol(profile, detail.symbol)}
              </h2>
              <div className="pb-1">
                <p className="text-sm font-bold text-slate-700">{detail.label}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  {detail.category}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="关闭"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-8 py-7">
          <section className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                L1 Insight
              </h3>
            </div>

            {detail.difficulty ? (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <DifficultyStars level={detail.difficulty.level} />
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-600">
                    Level {detail.difficulty.level}
                  </span>
                  {l1Label && (
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {l1Label} → {profile.displayName}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-6 text-slate-700">{detail.difficulty.reason}</p>
                {detail.difficulty.l1Equivalence && (
                  <p className="text-xs font-semibold text-slate-400">
                    Closest L1 category: <span className="text-slate-700">{detail.difficulty.l1Equivalence}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                暂无当前 L1 组合的专门难点说明。仍可基于词库例词和最小对立体材料练习这个{unitLabel}。
              </p>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Examples
                </h3>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                {detail.exampleCount} words
              </p>
            </div>

            {detail.examples.length === 0 ? (
              <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm font-medium text-slate-400">
                No word-bank examples yet.
              </div>
            ) : (
              <div className="grid gap-2">
                {detail.examples.map(item => (
                  <div
                    key={`${item.display}-${item.pronunciation}`}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{item.display}</p>
                      {item.definition && (
                        <p className="mt-0.5 truncate text-xs font-medium text-slate-400">{item.definition}</p>
                      )}
                    </div>
                    <p className={`${isIpa ? 'ipa-text' : ''} text-right text-xs font-semibold text-slate-400`}>
                      {formatItemNotation(profile, item)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {(mappedPairs.length > 0 || hasMinimalPairs) && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Minimal Pairs
                  </h3>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  {detail.minimalPairs.length} curated
                </p>
              </div>

              {mappedPairs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {mappedPairs.slice(0, 6).map(pair => (
                    <span
                      key={pair}
                      className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-700"
                    >
                      {pair}
                    </span>
                  ))}
                </div>
              )}

              {hasMinimalPairs && (
                <div className="grid gap-3">
                  {detail.minimalPairs.slice(0, 4).map(pair => (
                    <React.Fragment key={pair.id}>
                      <PairPreview pair={pair} profile={profile} />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <footer className="grid gap-3 border-t border-slate-100 bg-white px-8 py-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onStartSpelling(detail.symbol)}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-colors hover:bg-indigo-700 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
            Practice
          </button>
          <button
            type="button"
            onClick={() => onStartMinimalPairs(detail.symbol)}
            disabled={!hasMinimalPairs}
            title={hasMinimalPairs ? '进入最小对立体听辨' : '暂无最小对立体材料'}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <Ear className="h-4 w-4" />
            Listen
          </button>
        </footer>
      </motion.aside>
    </div>
  );
};
