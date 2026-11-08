'use client';

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
  Layers,
  Sparkle,
} from 'lucide-react';
import { QuizQuestion } from '@/types/sanctuary';
import { RoomShell } from '@/components/sanctuary/RoomShell';

const DATE_SURPRISES = [
  'Candlelit Starlight Dinner on the balcony with handwritten menu 🍷',
  'Midnight warm matcha and bakery run in our comfiest pajamas 🍵',
  'Blanket fort movie marathon with our favorite studio films 🍿',
  'DIY pottery or painting evening with classical jazz in the background 🎨',
  'Sunset ocean drive listening to our favorite road trip playlist 🌅',
  'Cooking a brand new gourmet recipe from scratch together 🍝',
  'Rooftop stargazing wrapped in a giant warm blanket with hot chocolate 🌌',
  'Late night bookstore stroll picking out books for each other 📚',
];

// Memory Matching Game Pairs
const CARD_ICONS = ['🌹', '✨', '💖', '🪽', '👑', '🦋'];

interface MemoryCard {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function LittleArcadePage() {
  const [activeGame, setActiveGame] = useState<'quiz' | 'wheel' | 'memory'>('quiz');

  // QUIZ STATE
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // DATE NIGHT CAPSULE STATE
  const [scratchResult, setScratchResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // MEMORY MATCHING GAME STATE
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchMoves, setMatchMoves] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);

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
    initMemoryGame();
  }, []);

  // Initialize Memory Match
  const initMemoryGame = () => {
    const deck = [...CARD_ICONS, ...CARD_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({
        id: idx,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setMatchMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (idx: number) => {
    if (cards[idx].isFlipped || cards[idx].isMatched || flippedIndices.length >= 2) return;

    const newDeck = [...cards];
    newDeck[idx].isFlipped = true;
    setCards(newDeck);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMatchMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (newDeck[first].icon === newDeck[second].icon) {
        newDeck[first].isMatched = true;
        newDeck[second].isMatched = true;
        setCards(newDeck);
        setFlippedIndices([]);
        if (newDeck.every((c) => c.isMatched)) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => {
          newDeck[first].isFlipped = false;
          newDeck[second].isFlipped = false;
          setCards([...newDeck]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
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
    <RoomShell>
      <div className="px-4 py-8 md:px-12 max-w-4xl mx-auto">
        {/* Header — Personalized for Lei */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
                Room 08 &bull; Little Arcade
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-amber-300">Sanctuary Games for Lei</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-white">
              The Starlight Arcade
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Play love trivia, match celestial cards, or spin for our next romantic date adventure.
            </p>
          </div>

          {/* Game Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveGame('quiz')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif tracking-wider transition-all cursor-pointer ${
                activeGame === 'quiz'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Trivia</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGame('memory')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif tracking-wider transition-all cursor-pointer ${
                activeGame === 'memory'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Card Match</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGame('wheel')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif tracking-wider transition-all cursor-pointer ${
                activeGame === 'wheel'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Date Capsule</span>
            </button>
          </div>
        </div>

        {/* GAME 1: TRIVIA QUIZ */}
        {activeGame === 'quiz' && (
          <div className="p-6 md:p-10 rounded-3xl celestial-panel border border-amber-500/30 shadow-2xl relative">
            {!quizFinished && currentQ ? (
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-900/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif uppercase tracking-widest text-amber-300">
                      Question {currentQIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sanctuary-gold text-xs font-serif">
                    <Trophy className="w-4 h-4" />
                    <span className="font-bold">{score} pts</span>
                  </div>
                </div>

                <h2 className="text-lg md:text-xl font-serif text-white mb-6 leading-snug">
                  {currentQ.question}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctOptionIndex;
                    const showResult = selectedOption !== null;

                    let btnStyle = 'bg-slate-900/70 border-slate-700/80 hover:border-amber-400 text-slate-200';
                    if (showResult) {
                      if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                      else if (isSelected && !isCorrect) btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                      else btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={showResult}
                        onClick={() => handleSelectOption(idx)}
                        className={`p-4 rounded-2xl border text-left text-xs md:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="text-xs text-amber-200">
                      <span className="font-semibold block font-serif">Memory Note:</span>
                      <span className="text-slate-300">{currentQ.explanation}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-serif text-xs font-semibold hover:bg-amber-400 transition-all shrink-0 cursor-pointer shadow-md"
                    >
                      {currentQIndex + 1 < questions.length ? 'Next Question &rarr;' : 'Finish Quiz &rarr;'}
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-sanctuary-gold mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-serif text-white mb-2">Quiz Finished!</h2>
                <p className="text-sm text-slate-300 mb-6 font-serif">
                  You earned <span className="text-sanctuary-gold font-bold">{score} pts</span>!
                </p>
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-semibold hover:bg-yellow-400 transition-all cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 2: MEMORY CARD MATCH */}
        {activeGame === 'memory' && (
          <div className="p-6 md:p-10 rounded-3xl celestial-panel border border-amber-500/30 shadow-2xl text-center">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-900/20">
              <span className="text-xs font-serif text-amber-300 uppercase tracking-widest">
                Starlight Memory Match
              </span>
              <span className="text-xs font-serif text-slate-400">
                Moves: <span className="text-white font-bold">{matchMoves}</span>
              </span>
            </div>

            {gameWon ? (
              <div className="py-10">
                <Sparkles className="w-16 h-16 text-sanctuary-gold mx-auto mb-4 animate-spin-slow" />
                <h3 className="text-2xl font-serif text-white mb-2">Constellation Matched!</h3>
                <p className="text-xs text-slate-300 mb-6 font-serif">
                  Every celestial pair found in {matchMoves} moves.
                </p>
                <button
                  type="button"
                  onClick={initMemoryGame}
                  className="px-6 py-2.5 rounded-2xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-bold uppercase tracking-wider hover:bg-yellow-400 transition-all cursor-pointer shadow-md"
                >
                  Play Another Round
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto">
                {cards.map((c, idx) => {
                  const isVisible = c.isFlipped || c.isMatched;
                  return (
                    <motion.button
                      key={c.id}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCardClick(idx)}
                      className={`h-20 sm:h-24 rounded-2xl border flex items-center justify-center text-3xl sm:text-4xl transition-all cursor-pointer select-none ${
                        c.isMatched
                          ? 'bg-emerald-950/70 border-emerald-500/80 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                          : isVisible
                          ? 'bg-amber-950/60 border-amber-400/80 shadow-md'
                          : 'bg-slate-900 border-slate-700/80 hover:border-amber-400/50'
                      }`}
                    >
                      {isVisible ? (
                        <span>{c.icon}</span>
                      ) : (
                        <Sparkle className="w-5 h-5 text-slate-600 group-hover:text-amber-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* GAME 3: DATE NIGHT CAPSULE */}
        {activeGame === 'wheel' && (
          <div className="p-8 md:p-12 rounded-3xl celestial-panel border border-amber-500/30 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Gift className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>

            <h2 className="text-xl font-serif text-white mb-2">
              The Starlight Date Night Capsule
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
              Wondering what to do for our next date? Draw from our celestial jar of cozy and romantic adventures.
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
                  <h3 className="font-serif text-sm uppercase tracking-widest text-amber-300 mb-1">
                    Tonight&rsquo;s Celestial Date:
                  </h3>
                  <p className="text-sm md:text-base text-amber-100 font-display italic mt-2 leading-relaxed">
                    &ldquo;{scratchResult}&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              disabled={isSpinning}
              onClick={spinSurprise}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-sanctuary-gold text-slate-950 font-serif text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-celestial-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Dice5 className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Summoning Adventure...' : 'Draw Date Idea'}</span>
            </button>
          </div>
        )}
      </div>
    </RoomShell>
  );
}
