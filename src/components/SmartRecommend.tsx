/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * L1-aware smart recommendation panel.
 * Shows the hardest phonemes and features for the learner's (L1, L2) pair,
 * based on perceptual assimilation research (PAM/SLM).
 */

import React from 'react';
import { Star, AlertTriangle, ArrowRight, Info, Target } from 'lucide-react';
import type { LanguageProfile, PhonemeDifficulty, FeatureDifficulty } from '../types';
import { getTopHardPhonemes, getHardFeatures, hasDifficultyMap } from '../l1/difficultyMap';
import { SUPPORTED_L1 } from '../profiles';

interface SmartRecommendProps {
  l1: string | null;
  l2: string;
  profile: LanguageProfile;
  /** Callback when user clicks a phoneme to start training. */
  onSelectPhoneme: (phoneme: string) => void;
  /** Callback when user opens the phoneme explanation drawer. */
  onInspectPhoneme?: (phoneme: string) => void;
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

export const SmartRecommend: React.FC<SmartRecommendProps> = ({
  l1,
  l2,
  profile,
  onSelectPhoneme,
  onInspectPhoneme,
}) => {
  const topPhonemes = getTopHardPhonemes(l1, l2, profile, 6);
  const hardFeatures = getHardFeatures(l1, l2).slice(0, 3);
  const trainingUnitLabel = getTrainingUnitLabel(profile);

  if (!l1 || l1 === l2) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 text-slate-400">
          <AlertTriangle className="w-4 h-4" />
          <p className="text-xs font-medium">
            选择你的母语以获取个性化训练推荐
          </p>
        </div>
      </div>
    );
  }

  if (!hasDifficultyMap(l1, l2)) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 text-slate-400">
          <AlertTriangle className="w-4 h-4" />
          <p className="text-xs font-medium">
            暂无 {L1_LABELS[l1] ?? l1} → {profile.displayName} 的难度映射数据
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-indigo-500" />
        <h3 className="text-sm font-bold text-slate-700">
          为你推荐（{L1_LABELS[l1] ?? l1}母语者学{profile.displayName}）
        </h3>
      </div>

      {/* Hard phonemes */}
      {topPhonemes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            你最容易混淆的{trainingUnitLabel}
          </h4>
          <div className="space-y-1.5">
            {topPhonemes.map(item => (
              <div
                key={item.phoneme}
                className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-indigo-50"
              >
                <button
                  type="button"
                  onClick={() => onSelectPhoneme(item.phoneme)}
                  className="group flex min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-1 text-left cursor-pointer"
                >
                  <DifficultyStars level={item.level} />
                  <span className="ipa-text text-sm font-medium text-slate-700 min-w-[3rem]">
                    {profile.notationName === 'Pinyin' ? item.phoneme : `/${item.phoneme}/`}
                  </span>
                  <span className="text-[11px] text-slate-400 flex-1 truncate">
                    {item.reason}
                  </span>
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
      )}

      {/* Hard features */}
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
