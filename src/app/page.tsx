'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasContainer } from '@/components/3d/CanvasContainer';
import { GateScene } from '@/components/3d/GateScene';
import { GateFallback } from '@/components/gate/GateFallback';
import { PinPad } from '@/components/gate/PinPad';
import { Shield, Sparkles, Volume2, VolumeX, ArrowRight } from 'lucide-react';

export default function GatePage() {
  const router = useRouter();
  const [gateState, setGateState] = useState<'approaching' | 'greeting' | 'authenticating' | 'granted' | 'denied'>('approaching');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [knightSpeech, setKnightSpeech] = useState<string>('Approaching the sanctuary perimeter...');
  const [isAlreadyAuthenticated, setIsAlreadyAuthenticated] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Initial entrance sequence timing
    const approachTimer = setTimeout(() => {
      setGateState('greeting');
      setKnightSpeech(
        'Greetings, traveler. You stand before Our Sanctuary — the sacred haven crafted for Emman & Lei. Whisper the harmonic six runes to open the gates.'
      );
    }, 1800);

    // Check if session is already active
    fetch('/api/auth/gate')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAlreadyAuthenticated(true);
        }
      })
      .catch(() => {});

    return () => clearTimeout(approachTimer);
  }, []);

  const handleSuccess = () => {
    setGateState('granted');
    setKnightSpeech(
      'The heart emblem blazes with pure light. Welcome home, beloved souls. Enter and be at peace.'
    );
  };

  const handleFailed = () => {
    setGateState('denied');
    setKnightSpeech('The ancient runes remain still. Only the true key of harmony unlocks these gates.');
    setTimeout(() => {
      setGateState('greeting');
    }, 2500);
  };

  const handleEntranceComplete = () => {
    // Navigate to the 3D Sanctuary Hub!
    router.push('/sanctuary');
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#05070f]">
      {/* 3D Canvas Scene */}
      <CanvasContainer
        camera={{ position: [0, 2.0, 12], fov: 45 }}
        onMouseMove={setMousePos}
        fallback={<GateFallback gateState={gateState} />}
      >
        <GateScene
          gateState={gateState}
          mousePos={mousePos}
          onEntranceComplete={handleEntranceComplete}
        />
      </CanvasContainer>

      {/* Atmospheric Vignette & Gradients */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05070f] via-transparent to-[#05070f]/60" />
      <div className="absolute inset-0 pointer-events-none radial-vignette" />

      {/* Top Banner Navigation */}
      <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-sanctuary-gold/40 bg-slate-900/60 backdrop-blur-md flex items-center justify-center shadow-celestial-sm">
            <Shield className="w-5 h-5 text-sanctuary-gold" />
          </div>
          <div>
            <h1 className="text-sm font-serif tracking-widest text-sanctuary-gold uppercase">
              Our Sanctuary
            </h1>
            <p className="text-[10px] tracking-wider text-slate-400">EMMAN & LEI</p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3">
          {isAlreadyAuthenticated && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => router.push('/sanctuary')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-sanctuary-gold/20 border border-sanctuary-gold/60 text-sanctuary-gold-light text-xs font-serif tracking-wider hover:bg-sanctuary-gold/30 transition-all shadow-celestial-sm"
            >
              <span>Return Inside</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          )}

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-sanctuary-gold transition-colors"
            title={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sanctuary-gold" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Knight Speech Balloon Subtitle */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 max-w-lg w-[90%] z-20 pointer-events-none text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={knightSpeech}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-6 py-3 rounded-2xl bg-slate-950/70 border border-sanctuary-gold/30 backdrop-blur-md shadow-2xl"
          >
            <p className="text-xs md:text-sm font-serif tracking-wide text-sanctuary-starlight/90 italic">
              &ldquo;{knightSpeech}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <Sparkles className="w-3 h-3 text-sanctuary-gold" />
              <span className="text-[10px] tracking-widest uppercase text-sanctuary-gold font-sans font-semibold">
                Angel Heart Knight
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating 6-digit PIN Keypad */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center px-4">
        <AnimatePresence>
          {gateState !== 'approaching' && gateState !== 'granted' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-sm"
            >
              <PinPad
                onSuccess={handleSuccess}
                onAttemptStart={() => setGateState('authenticating')}
                onAttemptFailed={handleFailed}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Whiteout / Golden Flash Transition on Granted */}
      <AnimatePresence>
        {gateState === 'granted' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 1] }}
            transition={{ duration: 2.5, times: [0, 0.6, 1] }}
            className="absolute inset-0 bg-[#fff5db] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </main>
  );
}
