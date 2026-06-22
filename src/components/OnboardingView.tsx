/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Onboarding view for first-time users.
 * Collects L1 (native language) and L2 (target language) selections,
 * then starts the main training experience.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import type { LanguageProfile } from '../types';
import { getAllProfiles, SUPPORTED_L1 } from '../profiles';

interface OnboardingViewProps {
  /** Currently selected L2 profile (if any). */
  currentL2: string | null;
  /** Currently selected L1 code (if any). */
  currentL1: string | null;
  /** Callback when user confirms L1 and L2 selections. */
  onComplete: (l1: string, l2: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  currentL2,
  currentL1,
  onComplete,
}) => {
  const [selectedL1, setSelectedL1] = useState<string | null>(currentL1);
  const [selectedL2, setSelectedL2] = useState<string | null>(currentL2);

  const l2Profiles = getAllProfiles();

  const canStart = selectedL1 && selectedL2 && selectedL1 !== selectedL2;

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

        {/* L1 Selection: Your Native Language */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">你的母语</h2>
              <p className="text-[11px] text-slate-400">用于智能推荐你最容易混淆的音素</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {SUPPORTED_L1.map(l1 => (
              <button
                key={l1.code}
                onClick={() => setSelectedL1(l1.code)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  selectedL1 === l1.code
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {l1.label}
              </button>
            ))}
          </div>
        </div>

        {/* L2 Selection: Target Language */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">你想学习的语言</h2>
              <p className="text-[11px] text-slate-400">选择训练目标语言</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {l2Profiles.map(profile => (
              <button
                key={profile.code}
                onClick={() => setSelectedL2(profile.code)}
                className={`px-5 py-4 rounded-2xl text-left transition-all cursor-pointer ${
                  selectedL2 === profile.code
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className="font-bold text-lg mb-0.5">{profile.displayName}</div>
                <div className={`text-[11px] ${selectedL2 === profile.code ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {profile.notationName} 训练 • {profile.phonemes.length} 个音素
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Warning when L1 === L2 */}
        {selectedL1 && selectedL2 && selectedL1 === selectedL2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-amber-600 text-xs font-medium mb-4"
          >
            母语和目标语言不能相同，请重新选择
          </motion.div>
        )}

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (canStart && selectedL1 && selectedL2) {
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
