/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Minimal-pair A/B listening practice view.
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  Ear,
  RefreshCw,
  RotateCcw,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';
import type {
  LanguageProfile,
  MinimalPairOption,
  MinimalPairResult,
  MinimalPairSession,
} from '../types';

interface MinimalPairViewProps {
  session: MinimalPairSession | null;
  result: MinimalPairResult | null;
  currentIndex: number;
  selectedOptionId: string | null;
  profile: LanguageProfile;
  isPlaying: boolean;
  onPlayPrompt: (option: MinimalPairOption) => void;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onNewSet: () => void;
  onClearTopic: () => void;
  onInspectPhoneme?: (phoneme: string) => void;
}

function formatNotation(profile: LanguageProfile, option: MinimalPairOption): string {
  if (profile.notationName === 'Pinyin') {
    return option.pronunciationAlt ?? option.pronunciation;
  }
  return `/${option.pronunciation}/`;
}

function formatTopic(profile: LanguageProfile, topic: string | null): string {
  if (!topic) return 'All pairs';
  return profile.notationName === 'Pinyin' ? topic : `/${topic}/`;
}

function PhonemeChip({
  profile,
  phoneme,
  onInspectPhoneme,
}: {
  profile: LanguageProfile;
  phoneme: string;
  onInspectPhoneme?: (phoneme: string) => void;
}) {
  const label = formatTopic(profile, phoneme);
  const className = `${profile.notationName === 'Pinyin' ? '' : 'ipa-text'} rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700`;

  if (!onInspectPhoneme) {
    return <span className={className}>{label}</span>;
  }

  return (
    <button
      type="button"
      onClick={() => onInspectPhoneme(phoneme)}
      title="查看详情"
      className={`${className} transition-colors hover:border-indigo-200 hover:bg-white cursor-pointer`}
    >
      {label}
    </button>
  );
}

function findOption(session: MinimalPairSession, optionId: string): MinimalPairOption | undefined {
  for (const question of session.questions) {
    const option = question.options.find(item => item.id === optionId);
    if (option) return option;
  }
  return undefined;
}

export const MinimalPairView: React.FC<MinimalPairViewProps> = ({
  session,
  result,
  currentIndex,
  selectedOptionId,
  profile,
  isPlaying,
  onPlayPrompt,
  onSelectOption,
  onNext,
  onNewSet,
  onClearTopic,
  onInspectPhoneme,
}) => {
  if (!session || session.questions.length === 0) {
    return (
      <div className="w-full max-w-3xl rounded-[40px] border border-slate-100 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
          <Ear className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-slate-800">
          当前主题没有最小对立体材料
        </h2>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={onClearTopic}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-colors hover:bg-indigo-700 cursor-pointer"
          >
            All Pair Topics
          </button>
          <button
            onClick={onNewSet}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-200 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            New Set
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    const isIpa = profile.notationName !== 'Pinyin';

    return (
      <div className="w-full max-w-5xl space-y-8">
        <section className="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-indigo-600">
                <Trophy className="h-7 w-7" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em]">
                  Minimal Pair Complete
                </p>
              </div>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                {result.correct}/{result.total} correct
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-400">
                {profile.displayName} - {formatTopic(profile, result.topic)}
              </p>
              {result.topic && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <PhonemeChip
                    profile={profile}
                    phoneme={result.topic}
                    onInspectPhoneme={onInspectPhoneme}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onNewSet}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-colors hover:bg-indigo-700 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Practice Again
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Accuracy</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{result.accuracy}%</p>
            </div>
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-500">Correct</p>
              <p className="mt-2 text-3xl font-bold text-green-700">{result.correct}</p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Missed</p>
              <p className="mt-2 text-3xl font-bold text-red-700">{result.mistakes.length}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Review
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              {result.mistakes.length} to revisit
            </p>
          </div>

          {result.mistakes.length === 0 ? (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-sm font-medium text-green-800">
              Every choice was correct.
            </div>
          ) : (
            <div className="grid gap-4">
              {result.mistakes.map(answer => {
                const selected = findOption(session, answer.selectedOptionId);
                const expected = findOption(session, answer.correctOptionId);

                return (
                  <article
                    key={`${answer.questionId}-${answer.submittedAt}`}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                          Heard
                        </p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          {answer.question.prompt.display}
                        </p>
                        <p className={`${isIpa ? 'ipa-text' : ''} mt-1 text-sm font-bold text-slate-400`}>
                          {formatNotation(profile, answer.question.prompt)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <PhonemeChip
                            profile={profile}
                            phoneme={answer.question.targetPhoneme}
                            onInspectPhoneme={onInspectPhoneme}
                          />
                          <PhonemeChip
                            profile={profile}
                            phoneme={answer.question.contrastPhoneme}
                            onInspectPhoneme={onInspectPhoneme}
                          />
                        </div>
                      </div>
                      <div className="grid gap-3 text-right text-xs">
                        <div>
                          <span className="font-bold uppercase tracking-widest text-slate-300">Selected</span>
                          <p className="mt-1 font-bold text-red-600">
                            {selected?.display ?? 'missing'}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold uppercase tracking-widest text-slate-300">Expected</span>
                          <p className="mt-1 font-bold text-green-700">
                            {expected?.display ?? answer.question.prompt.display}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  const question = session.questions[currentIndex];
  const answered = selectedOptionId !== null;
  const selectedCorrect = selectedOptionId === question.prompt.id;

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div className="overflow-hidden rounded-[40px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-10 p-12">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
              {profile.displayName} - {formatTopic(profile, session.topic)}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Minimal Pair Listening
            </h2>
            <div className="mt-4 flex justify-center gap-2">
              <PhonemeChip
                profile={profile}
                phoneme={question.targetPhoneme}
                onInspectPhoneme={onInspectPhoneme}
              />
              <PhonemeChip
                profile={profile}
                phoneme={question.contrastPhoneme}
                onInspectPhoneme={onInspectPhoneme}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPlayPrompt(question.prompt)}
            disabled={isPlaying}
            title="播放目标发音"
            className={`flex h-28 w-28 items-center justify-center rounded-full transition-all cursor-pointer ${
              isPlaying
                ? 'bg-indigo-100 text-indigo-600'
                : 'border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm hover:bg-white'
            }`}
          >
            {isPlaying ? (
              <div className="flex h-8 items-end gap-1.5">
                {[1, 2, 3, 2, 1].map((height, index) => (
                  <motion.div
                    key={`${height}-${index}`}
                    className="w-1.5 rounded-full bg-indigo-600"
                    animate={{ height: ['20%', '100%', '20%'] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: index * 0.1 }}
                  />
                ))}
              </div>
            ) : (
              <Volume2 className="h-12 w-12" />
            )}
          </motion.button>

          <div className="grid w-full gap-4 md:grid-cols-2">
            {question.options.map(option => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = answered && option.id === question.prompt.id;
              const isWrongSelection = answered && isSelected && !isCorrect;

              return (
                <button
                  key={option.id}
                  onClick={() => onSelectOption(option.id)}
                  disabled={answered}
                  className={`min-h-32 rounded-2xl border p-6 text-left transition-all cursor-pointer disabled:cursor-default ${
                    isCorrect
                      ? 'border-green-200 bg-green-50 text-green-800'
                      : isWrongSelection
                        ? 'border-red-200 bg-red-50 text-red-800'
                        : isSelected
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
                          : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-100 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-3xl font-bold tracking-tight">{option.display}</p>
                      <p className={`${profile.notationName === 'Pinyin' ? '' : 'ipa-text'} mt-3 text-lg font-medium text-slate-400`}>
                        {formatNotation(profile, option)}
                      </p>
                    </div>
                    {isCorrect && <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />}
                    {isWrongSelection && <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest ${
              selectedCorrect
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {selectedCorrect ? 'Correct' : 'Missed'}
            </div>
          )}
        </div>

        <footer className="flex h-24 items-center justify-between border-t border-slate-100 bg-white px-12">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {currentIndex + 1} / {session.questions.length}
          </span>
          <button
            onClick={onNext}
            disabled={!answered}
            className="flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none cursor-pointer"
          >
            {currentIndex < session.questions.length - 1 ? 'Next Pair' : 'Complete Session'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </footer>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNewSet}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-indigo-400 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          New Pair Set
        </button>
      </div>
    </div>
  );
};
