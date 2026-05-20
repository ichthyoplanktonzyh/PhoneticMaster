/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const VOWELS = ['i', 'ɪ', 'eɪ', 'ɛ', 'æ', 'ɑ', 'ɔ', 'oʊ', 'ʊ', 'u', 'ʌ', 'ɚ', 'ə', 'aɪ', 'aʊ', 'ɔɪ'];
const CONSONANTS = [
  'p', 'b', 't', 'd', 'k', 'ɡ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 
  'm', 'n', 'ŋ', 'l', 'r', 'j', 'w', 'tʃ', 'dʒ'
];
const MARKS = ['ˈ', 'ˌ', '.', ' '];

interface IPAKeypadProps {
  onInsert: (char: string) => void;
}

export const IPAKeypad: React.FC<IPAKeypadProps> = ({ onInsert }) => {
  return (
    <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-slate-100 space-y-6">
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Vowels</h3>
        <div className="grid grid-cols-8 gap-2">
          {VOWELS.map(char => (
            <button
              key={char}
              onClick={() => onInsert(char)}
              className="h-12 w-full flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all font-serif text-xl shadow-sm cursor-pointer"
            >
              {char}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Consonants</h3>
        <div className="grid grid-cols-8 gap-2">
          {CONSONANTS.map(char => (
            <button
              key={char}
              onClick={() => onInsert(char)}
              className="h-12 w-full flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all font-serif text-xl shadow-sm cursor-pointer"
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Marks & Stress</h3>
        <div className="flex gap-2">
          {MARKS.map(char => (
            <button
              key={char}
              onClick={() => onInsert(char)}
              className="h-12 w-14 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-all font-serif text-xl shadow-sm cursor-pointer"
            >
              {char === ' ' ? '␣' : char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
