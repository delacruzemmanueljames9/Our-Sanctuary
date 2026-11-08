'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasContainer } from '@/components/3d/CanvasContainer';
import { GateScene } from '@/components/3d/GateScene';
import { GateFallback } from '@/components/gate/GateFallback';
import { PinPad } from '@/components/gate/PinPad';
import { Volume2, VolumeX } from 'lucide-react';

export default function GatePage() {
  const router = useRouter();
  const [gateState, setGateState] = useState<'approaching' | 'greeting' | 'authenticating' | 'granted' | 'denied'>('approaching');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGateState('greeting');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSuccess = () => {
    // Triggers cinematic gate unlock sequence!
    setGateState('granted');
  };

  const handleFailed = () => {
    setGateState('denied');
    setTimeout(() => {
      setGateState('greeting');
    }, 2000);
  };

  const handleEntranceComplete = () => {
    // Navigate into the Main Sanctuary world after camera passes through gate
    router.push('/sanctuary');
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#05070f]">
      {/* 3D Gate Scene — Guardian & Gate Clearly Visible */}
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

      {/* Subtle Atmospheric Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05070f]/30 via-transparent to-[#05070f]/30" />

      {/* Ambient Audio Toggle */}
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

      {/* Centered Floating Glassmorphism Passcode Pad */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 pointer-events-none">
        <AnimatePresence>
          {gateState !== 'granted' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -20, transition: { duration: 0.5, ease: 'easeInOut' } }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="w-full max-w-[320px] md:max-w-[340px] pointer-events-auto"
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

      {/* Cinematic Golden Light Emerge Overlay on Unlock */}
      <AnimatePresence>
        {gateState === 'granted' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 1] }}
            transition={{ duration: 2.4, times: [0, 0.6, 1] }}
            className="absolute inset-0 bg-[#fff5db] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </main>
  );
}
