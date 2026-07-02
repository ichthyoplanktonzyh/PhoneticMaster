/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Onboarding view for first-time users.
 * L2 (target language) is the minimum required selection.
 * L1 (native language) is optional — it enables smart recommendations
 * but is NOT required to start training.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { getAllProfiles, SUPPORTED_L1 } from '../profiles';
import type { LanguageProfile } from '../types';

interface OnboardingViewProps {
  /** Currently selected L2 code (if any). */
  currentL2: string | null;
  /** Currently selected L1 code (if any). */
  currentL1: string | null;
  /** Callback when user confirms selection and enters training.
   *  l1 may be null if the user skips it. */
  onComplete: (l1: string | null, l2: string) => void;
}

function getTrainingUnitLabel(profile: LanguageProfile): string {
  return profile.notationName === 'Pinyin' ? '拼音单元' : '音素';
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  currentL2,
  currentL1,
  onComplete,
}) => {
  const l2Profiles = getAllProfiles();
  const supportedL2Codes = new Set(l2Profiles.map(profile => profile.code));
  const supportedL1Codes = new Set(SUPPORTED_L1.map(l1 => l1.code));

  const initialL2 = currentL2 && supportedL2Codes.has(currentL2) ? currentL2 : null;
  const initialL1 = currentL1 && supportedL1Codes.has(currentL1) && currentL1 !== initialL2
    ? currentL1
    : null;

  const [selectedL1, setSelectedL1] = useState<string | null>(initialL1);
  const [selectedL2, setSelectedL2] = useState<string | null>(initialL2);

  // L2 is required; L1 is optional
  const canStart = !!selectedL2 && supportedL2Codes.has(selectedL2);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-sans tracking-tight p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 mx-auto mb-6">
            <span className="text-white font-bold text-2xl">/ə/</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">PhoneticMaster</h1>
          <p className="text-slate-400 text-sm">多语言语音训练平台</p>
        </div>

        {/* L2 Selection: Target Language (required) */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">你想学习的语言</h2>
              <p className="text-[11px] text-slate-400">选择训练目标语言</p>
            </div>
            <span className="ml-auto text-[10px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">必选</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {l2Profiles.map(profile => (
              <button
                key={profile.code}
                onClick={() => {
                  setSelectedL2(profile.code);
                  if (selectedL1 === profile.code) {
                    setSelectedL1(null);
                  }
                }}
                className={`px-5 py-4 rounded-2xl text-left transition-all cursor-pointer ${
                  selectedL2 === profile.code
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className="font-bold text-lg mb-0.5">{profile.displayName}</div>
                <div className={`text-[11px] ${selectedL2 === profile.code ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {profile.notationName} 训练 • {profile.phonemes.length} 个{getTrainingUnitLabel(profile)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* L1 Selection: Native Language (optional) */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">你的母语</h2>
              <p className="text-[11px] text-slate-400">用于智能推荐你最容易混淆的训练重点（可选）</p>
            </div>
            <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded">可选</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {SUPPORTED_L1.map(l1 => {
              const isDisabled = l1.code === selectedL2;
              return (
                <button
                  key={l1.code}
                  onClick={() => {
                    if (isDisabled) return;
                    setSelectedL1(prev => prev === l1.code ? null : l1.code);
                  }}
                  disabled={isDisabled}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isDisabled
                      ? 'bg-slate-50 text-slate-200 border border-slate-100 cursor-not-allowed'
                      : selectedL1 === l1.code
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {l1.label}
                </button>
              );
            })}
          </div>
          {selectedL1 && (
            <button
              onClick={() => setSelectedL1(null)}
              className="mt-4 text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              不选择母语，直接开始训练 →
            </button>
          )}
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (canStart && selectedL2) {
                onComplete(selectedL1, selectedL2);
              }
            }}
            disabled={!canStart}
            className={`px-16 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer ${
              canStart
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            开始训练
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
