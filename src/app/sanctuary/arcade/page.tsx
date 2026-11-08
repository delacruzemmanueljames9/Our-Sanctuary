'use client';

import { RoomShell } from '@/components/sanctuary/RoomShell';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Heart,
  CheckCircle2,
  XCircle,
  Dice5,
  Gift,
} from 'lucide-react';
import { QuizQuestion } from '@/types/sanctuary';

const DATE_SURPRISES = [
  'Candlelit Starlight Dinner on the balcony with handwritten menu 🍷',
  'Midnight warm matcha and bakery run in our comfiest pajamas 🍵',
  'Blanket fort movie marathon with our favorite studio films 🍿',
  'DIY pottery or painting evening with classical jazz in the background 🎨',
  'Sunset ocean drive listening to our favorite road trip playlist 🌅',
  'Cooking a brand new gourmet recipe from scratch together 🍝',
];

export default function LittleArcadePage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [activeGame, setActiveGame] = useState<'quiz' | 'surprise_wheel'>('quiz');

  // Scratch / Surprise Wheel state
  const [scratchResult, setScratchResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/arcade');
      const data = await res.json();
      if (data.questions) setQuestions(data.questions);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Already answered
    setSelectedOption(idx);

    const currentQ = questions[currentQIndex];
    if (idx === currentQ.correctOptionIndex) {
      setScore((prev) => prev + 100);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  const spinSurprise = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setScratchResult(null);

    setTimeout(() => {
      const randomPick = DATE_SURPRISES[Math.floor(Math.random() * DATE_SURPRISES.length)];
      setScratchResult(randomPick);
      setIsSpinning(false);
    }, 1200);
  };

  const currentQ = questions[currentQIndex];

  return (
    <RoomShell><div className="px-4 py-8 md:px-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
              Room 08 &bull; Little Arcade
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-amber-300">Sanctuary Play Haven</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white">
            The Starlight Games of Us
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Test your knowledge of our journey, laugh together, and unlock whimsical date night adventures.
          </p>
        </div>

        {/* Game Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveGame('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif tracking-wider transition-all ${
              activeGame === 'quiz'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Trivia Quiz</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveGame('surprise_wheel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif tracking-wider transition-all ${
              activeGame === 'surprise_wheel'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Date Night Generator</span>
          </button>
        </div>
      </div>

      {activeGame === 'quiz' ? (
        /* Couple Trivia Quiz Game */
        <div className="p-6 md:p-8 rounded-3xl celestial-panel border border-amber-500/30 shadow-2xl">
          {!quizFinished && currentQ ? (
            <div>
              {/* Quiz Status Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <span className="text-xs font-serif text-amber-300">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-2 text-xs text-sanctuary-gold font-serif">
                  <Trophy className="w-4 h-4" />
                  <span>Score: {score} pts</span>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-lg md:text-xl font-serif text-white mb-6 leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctOptionIndex;
                  const showResult = selectedOption !== null;

                  let btnStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-amber-500/50 hover:bg-slate-900';

                  if (showResult) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'border-red-500 bg-red-950/40 text-red-200';
                    } else {
                      btnStyle = 'border-slate-800/40 bg-slate-950/40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="text-xs text-amber-200">
                    <span className="font-semibold block font-serif">Memory Lore:</span>
                    <span className="text-slate-300">{currentQ.explanation}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-semibold hover:bg-sanctuary-gold-light transition-all shadow-sm shrink-0"
                  >
                    {currentQIndex + 1 < questions.length ? 'Next Question &rarr;' : 'Finish Quiz &rarr;'}
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-sanctuary-gold mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-serif text-white mb-2">Quiz Finished!</h2>
              <p className="text-sm text-slate-300 mb-6">
                You achieved a total of <span className="text-sanctuary-gold font-bold">{score} pts</span>!
              </p>
              <button
                type="button"
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-semibold hover:bg-sanctuary-gold-light transition-all shadow-celestial-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Date Night Surprise Generator */
        <div className="p-8 md:p-12 rounded-3xl celestial-panel border border-amber-500/30 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Gift className="w-8 h-8 text-amber-300 animate-pulse" />
          </div>

          <h2 className="text-xl font-serif text-white mb-2">
            The Starlight Date Night Capsule
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-8">
            Can&rsquo;t decide what to do for date night? Let the sanctuary constellation choose an unforgettable adventure for Emman and Lei!
          </p>

          <AnimatePresence mode="wait">
            {scratchResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-3xl bg-amber-950/40 border-2 border-sanctuary-gold max-w-lg mx-auto mb-8 shadow-celestial-md"
              >
                <Sparkles className="w-6 h-6 text-sanctuary-gold mx-auto mb-2" />
                <h3 className="font-serif text-lg text-white font-medium mb-1">
                  Tonight&rsquo;s Celestial Invitation:
                </h3>
                <p className="text-sm text-amber-200 font-display italic mt-2 leading-relaxed">
                  &ldquo;{scratchResult}&rdquo;
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            disabled={isSpinning}
            onClick={spinSurprise}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-sanctuary-gold text-slate-950 font-serif text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-celestial-sm active:scale-95 disabled:opacity-50"
          >
            <Dice5 className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Summoning Starlight Idea...' : 'Draw Date Idea'}</span>
          </button>
        </div>
      )}
    </div>
    </RoomShell>
  );
}
