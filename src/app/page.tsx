'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasContainer } from '@/components/3d/CanvasContainer';
import { GateScene } from '@/components/3d/GateScene';
import { GateFallback } from '@/components/gate/GateFallback';
import { PinPad } from '@/components/gate/PinPad';
import { Volume2, VolumeX, Sparkles, ArrowRight, X } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [gateState, setGateState] = useState<'approaching' | 'greeting' | 'authenticating' | 'granted' | 'denied'>('approaching');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAlreadyAuthenticated, setIsAlreadyAuthenticated] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Gentle approach camera movement
    const approachTimer = setTimeout(() => {
      setGateState('greeting');
    }, 1500);

    // Check if session is already active
    fetch('/api/auth/gate')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAlreadyAuthenticated(true);
        }
      })
      .catch(() => {});

    return () => clearTimeout(approachTimer);
  }, []);

  const handleEnterClick = () => {
    if (isAlreadyAuthenticated) {
      // Direct cinematic entrance if already authenticated
      setGateState('granted');
    } else {
      // Reveal the elegant translucent PIN pad
      setShowPinModal(true);
    }
  };

  const handleSuccess = () => {
    setShowPinModal(false);
    setGateState('granted');
  };

  const handleFailed = () => {
    setGateState('denied');
    setTimeout(() => {
      setGateState('greeting');
    }, 2000);
  };

  const handleEntranceComplete = () => {
    // Navigate into the main sanctuary world
    router.push('/sanctuary');
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#05070f]">
      {/* 3D Canvas Scene — Main Visual Focus */}
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

      {/* Atmospheric Vignette (Soft & subtle to let 3D world shine) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05070f]/35 via-transparent to-[#05070f]/35" />

      {/* Minimal Top Controls (Ambient Sound) */}
      <header className="absolute top-0 right-0 p-6 z-30">
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-10 h-10 rounded-full border border-slate-700/50 bg-slate-950/40 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-sanctuary-gold hover:border-sanctuary-gold/40 transition-colors"
          title={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-sanctuary-gold" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Minimalist Centered Welcome Layout */}
      <AnimatePresence>
        {!showPinModal && gateState !== 'granted' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            {/* Elegant Welcome Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.2em] uppercase gold-gradient-text drop-shadow-[0_4px_24px_rgba(212,175,55,0.35)] mb-4"
            >
              Welcome to Our Sanctuary
            </motion.h1>

            {/* One Short Introductory Sentence */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="text-sm md:text-base font-sans text-sanctuary-starlight/80 tracking-widest max-w-xl mx-auto mb-10 font-light"
            >
              A peaceful celestial haven handcrafted for Emman & Lei.
            </motion.p>

            {/* One Prominent Button: "Enter Our Sanctuary" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="pointer-events-auto"
            >
              <button
                type="button"
                onClick={handleEnterClick}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 md:px-10 md:py-4 rounded-full bg-gradient-to-r from-[#d4af37]/90 via-[#f5e6a3] to-[#d4af37]/90 hover:from-[#f5e6a3] hover:to-[#ffd700] text-slate-950 font-serif text-xs md:text-sm font-semibold tracking-[0.2em] uppercase shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Enter Our Sanctuary</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Translucent PIN Pad Modal (Revealed seamlessly on "Enter Our Sanctuary") */}
      <AnimatePresence>
        {showPinModal && gateState !== 'granted' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative w-full max-w-sm"
            >
              {/* Back to View Button */}
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/60 border border-slate-700/60 text-[11px] font-serif text-slate-300 hover:text-sanctuary-gold hover:border-sanctuary-gold/40 transition-colors shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
                <span>Return to View</span>
              </button>

              <PinPad
                onSuccess={handleSuccess}
                onAttemptStart={() => setGateState('authenticating')}
                onAttemptFailed={handleFailed}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cinematic Whiteout / Golden Flash Transition on Entrance */}
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
