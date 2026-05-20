/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, CheckCircle2, XCircle, RefreshCw, Trophy, Keyboard, ArrowRight } from 'lucide-react';
import { WordData } from './types';
import { IPAKeypad } from './components/IPAKeypad';

export default function App() {
  const [words, setWords] = useState<WordData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'neutral'>('neutral');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showKeypad, setShowKeypad] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const fetchWords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/words');
      const data = await res.json();
      if (Array.isArray(data)) {
        setWords(data);
      } else {
        console.error('Received non-array data:', data);
        setWords([]);
      }
      setCurrentIndex(0);
      setScore(0);
      setFeedback('neutral');
      setUserInput('');
    } catch (err) {
      console.error('Failed to fetch words', err);
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const currentWord = words[currentIndex];

  const playAudio = async () => {
    if (!currentWord || isPlaying) return;
    setIsPlaying(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentWord.word }),
      });
      const { audio } = await res.json();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        Uint8Array.from(atob(audio), c => c.charCodeAt(0)).buffer
      );
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
    } catch (err) {
      console.error('Audio playback failed', err);
      setIsPlaying(false);
    }
  };

  const handleCharInsert = (char: string) => {
    if (feedback !== 'neutral') return;
    setUserInput(prev => prev + char);
  };

  const handleDelete = () => {
    if (feedback !== 'neutral') return;
    setUserInput(prev => prev.slice(0, -1));
  };

  const checkAnswer = () => {
    if (!currentWord || feedback !== 'neutral') return;
    
    const normalizedInput = userInput.trim().replace(/^\/|\/$/g, '');
    const normalizedTarget = currentWord.ipa.trim().replace(/^\/|\/$/g, '');
    
    if (normalizedInput === normalizedTarget) {
      setFeedback('correct');
      setScore(prev => prev + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setFeedback('neutral');
    } else {
      // End of quiz
      alert(`Quiz Finished! Your score: ${score}/${words.length}`);
      fetchWords();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-sans tracking-tight">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <p className="text-slate-400 font-medium uppercase text-xs tracking-widest">Preparing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-12 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <span className="text-white font-bold text-lg">/ə/</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">PhoneticMaster</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">American IPA Training</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase mb-1.5">Progress</span>
            <div className="flex gap-1">
              {Array.isArray(words) && words.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-5 h-1.5 rounded-full transition-colors ${i <= currentIndex ? 'bg-indigo-600' : 'bg-indigo-100'}`}
                />
              ))}
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100"></div>
          <div className="text-right">
            <div className="text-sm font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Score: {score}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Accuracy: {words.length > 0 ? Math.round((score / (currentIndex || 1)) * 100) : 0}%</div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-3xl space-y-10">
          
          {/* Challenge Card */}
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-12 flex flex-col items-center gap-10">
              
              {/* Audio Prompt */}
              <div className="flex flex-col items-center text-center space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={playAudio}
                  disabled={isPlaying}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isPlaying ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-50 text-indigo-600 hover:bg-white shadow-sm border border-indigo-100'
                  }`}
                >
                  {isPlaying ? (
                    <div className="flex gap-1 items-end h-8">
                      {[1, 2, 3, 2, 1].map((h, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-indigo-600 rounded-full"
                          animate={{ height: ['20%', '100%', '20%'] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Volume2 className="w-10 h-10" />
                  )}
                </motion.button>
                <div>
                  <h2 className="text-2xl font-light text-slate-400">Click to hear the word</h2>
                  {feedback === 'incorrect' && (
                    <p className="mt-2 text-slate-800 font-mono text-lg">
                      Actual Word: <span className="font-bold underline decoration-indigo-200 uppercase tracking-widest">{currentWord?.word}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Transcription Input */}
              <div className="w-full relative px-12">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter IPA symbols..."
                  className={`w-full text-center text-5xl font-light py-8 border-b-2 focus:outline-none transition-colors placeholder:text-slate-100 ${
                    feedback === 'correct' ? 'border-green-500 text-green-600' :
                    feedback === 'incorrect' ? 'border-red-500 text-red-600' :
                    'border-slate-200 focus:border-indigo-600 text-slate-800'
                  }`}
                  disabled={feedback !== 'neutral'}
                />
                
                <AnimatePresence>
                  {feedback !== 'neutral' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-10 left-0 right-0 flex justify-center"
                    >
                      {feedback === 'correct' ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-5 py-2 rounded-full text-xs font-bold border border-green-100 uppercase tracking-widest">
                          <CheckCircle2 className="w-4 h-4" /> That's Correct
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-5 py-2 rounded-full text-xs font-bold border border-red-100 uppercase tracking-widest">
                          <XCircle className="w-4 h-4" /> Correct: /{currentWord?.ipa}/
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Lower Controls */}
              <div className="w-full max-w-lg">
                <AnimatePresence>
                  {showKeypad && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4"
                    >
                      <IPAKeypad onInsert={handleCharInsert} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Footer Action Bar */}
            <footer className="h-24 bg-white border-t border-slate-100 px-12 flex items-center justify-between shrink-0">
              <button 
                onClick={() => setShowKeypad(!showKeypad)}
                className={`flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors`}
              >
                <Keyboard className="w-5 h-5 flex-shrink-0" />
                {showKeypad ? 'Hide Keypad' : 'Show Keypad'}
              </button>
              
              <div className="flex gap-4">
                {feedback === 'neutral' ? (
                  <>
                    <button
                      onClick={handleDelete}
                      className="px-8 py-3 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={checkAnswer}
                      disabled={!userInput.trim()}
                      className="px-12 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:shadow-none uppercase text-xs tracking-widest"
                    >
                      Check Answer
                    </button>
                  </>
                ) : (
                  <button
                    onClick={nextWord}
                    className="px-12 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                  >
                    {currentIndex < words.length - 1 ? 'Next Challenge' : 'Complete Session'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </footer>
          </div>

          <div className="flex justify-between items-center px-4">
             <button 
              onClick={() => fetchWords()}
              className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Word Set
            </button>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
              IPA Practice • {currentIndex + 1} / {words.length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
