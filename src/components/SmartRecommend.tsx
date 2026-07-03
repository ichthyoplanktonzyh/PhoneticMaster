/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Optional coach panel.
 * Shows next practice recommendations from local mastery, optional L1-aware
 * difficulty, and fallback topic coverage.
 */

import React from 'react';
import { Star, AlertTriangle, ArrowRight, Info, Target, Trash2 } from 'lucide-react';
import type { LanguageProfile, Recommendation } from '../types';
import { getHardFeatures, hasDifficultyMap } from '../l1/difficultyMap';
import { SUPPORTED_L1 } from '../profiles';

interface SmartRecommendProps {
  l1: string | null;
  l2: string;
  profile: LanguageProfile;
  /** Callback when user clicks a phoneme to start training. */
  onSelectPhoneme: (phoneme: string) => void;
  /** Callback when user opens the phoneme explanation drawer. */
  onInspectPhoneme?: (phoneme: string) => void;
  recommendations: Recommendation[];
  masteryRecordCount: number;
  onClearPersonalization?: () => void;
}

const L1_LABELS: Record<string, string> = Object.fromEntries(
  SUPPORTED_L1.map(l => [l.code, l.label]),
);

function getTrainingUnitLabel(profile: LanguageProfile): string {
  return profile.notationName === 'Pinyin' ? '拼音单元' : '音素';
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < level ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </span>
  );
}

function formatSymbol(profile: LanguageProfile, phoneme: string): string {
  return profile.notationName === 'Pinyin' ? phoneme : `/${phoneme}/`;
}

function getSourceLabel(source: Recommendation['source']): string {
  if (source === 'personalized') return '历史 + L1';
  if (source === 'history') return '历史';
  if (source === 'l1') return 'L1';
  return '主题';
}

export const SmartRecommend: React.FC<SmartRecommendProps> = ({
  l1,
  l2,
  profile,
  onSelectPhoneme,
  onInspectPhoneme,
  recommendations,
  masteryRecordCount,
  onClearPersonalization,
}) => {
  const hardFeatures = getHardFeatures(l1, l2).slice(0, 3);
  const trainingUnitLabel = getTrainingUnitLabel(profile);
  const hasL1Map = Boolean(l1 && l1 !== l2 && hasDifficultyMap(l1, l2));
  const l1Label = l1 ? (L1_LABELS[l1] ?? l1) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-700">Coach</h3>
          </div>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            {l1Label && l1 !== l2
              ? `${l1Label} → ${profile.displayName}`
              : `${profile.displayName} 本地推荐`}
          </p>
        </div>

        {onClearPersonalization && masteryRecordCount > 0 && (
          <button
            type="button"
            onClick={onClearPersonalization}
            title="清除个性化数据"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {!hasL1Map && l1 && l1 !== l2 && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-amber-800">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
          <p className="text-[11px] font-medium leading-5">
            暂无该 L1 组合的难度映射，推荐会使用你的历史或普通主题。
          </p>
        </div>
      )}

      {recommendations.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            下一步{trainingUnitLabel}
          </h4>
          <div className="space-y-1.5">
            {recommendations.map(item => (
              <div
                key={item.phoneme}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-indigo-50"
              >
                <button
                  type="button"
                  onClick={() => onSelectPhoneme(item.phoneme)}
                  className="group flex min-w-0 flex-1 items-start gap-3 rounded-md px-1 py-1 text-left cursor-pointer"
                >
                  {item.l1Level ? (
                    <DifficultyStars level={item.l1Level} />
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      {getSourceLabel(item.source)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`${profile.notationName === 'Pinyin' ? '' : 'ipa-text'} text-sm font-medium text-slate-700 min-w-[2.5rem]`}>
                        {formatSymbol(profile, item.phoneme)}
                      </span>
                      <span className="truncate text-[11px] font-semibold text-slate-400">
                        {item.label}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[11px] text-slate-400">
                      {item.reasons.map(reason => reason.text).join(' · ')}
                    </p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                </button>
                {onInspectPhoneme && (
                  <button
                    type="button"
                    onClick={() => onInspectPhoneme(item.phoneme)}
                    title="查看详情"
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-white hover:text-indigo-500 cursor-pointer"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-[11px] font-medium leading-5 text-slate-400">
          完成一次拼写或听辨训练后，这里会按本地表现调整推荐顺序。
        </div>
      )}

      {hardFeatures.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            你最容易忽略的声音特征
          </h4>
          <div className="space-y-1.5">
            {hardFeatures.map(item => (
              <div key={item.feature} className="flex items-center gap-3 px-3 py-2">
                <DifficultyStars level={item.level} />
                <span className="text-[11px] text-slate-400 flex-1">
                  {item.reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
