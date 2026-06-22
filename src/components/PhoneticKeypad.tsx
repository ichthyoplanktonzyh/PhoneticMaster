/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Generic phonetic keypad driven by LanguageProfile.keypadLayout.
 * Replaces the old English-only IPAKeypad with a profile-driven
 * version that works for any language.
 */

import React from 'react';
import type { LanguageProfile } from '../types';

interface PhoneticKeypadProps {
  /** The language profile whose keypadLayout drives the keyboard. */
  profile: LanguageProfile;
  /** Callback when a phoneme symbol is clicked. */
  onInsert: (char: string) => void;
}

export const PhoneticKeypad: React.FC<PhoneticKeypadProps> = ({ profile, onInsert }) => {
  return (
    <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-slate-100 space-y-6">
      {profile.keypadLayout.map((section) => (
        <div key={section.category}>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            {section.category}
          </h3>
          {section.category.toLowerCase().includes('tone') ? (
            // Tones: horizontal layout, wider buttons
            <div className="flex gap-2">
              {section.phonemes.map(symbol => (
                <button
                  key={symbol}
                  onClick={() => onInsert(symbol === ' ' ? ' ' : symbol)}
                  className="h-12 w-14 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all text-xl shadow-sm cursor-pointer"
                >
                  {symbol === ' ' ? '␣' : symbol}
                </button>
              ))}
            </div>
          ) : (
            // Regular phonemes: grid layout
            <div className="grid grid-cols-8 gap-2">
              {section.phonemes.map(symbol => (
                <button
                  key={symbol}
                  onClick={() => onInsert(symbol === ' ' ? ' ' : symbol)}
                  className="h-12 w-full flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all ipa-text text-xl shadow-sm cursor-pointer"
                >
                  {symbol === ' ' ? '␣' : symbol}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
