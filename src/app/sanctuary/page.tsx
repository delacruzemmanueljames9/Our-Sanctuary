'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasContainer } from '@/components/3d/CanvasContainer';
import { SanctuaryIsland } from '@/components/3d/SanctuaryIsland';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bot,
  ShieldAlert,
} from 'lucide-react';
import { MochiChatModal } from '@/components/mochi/MochiChatModal';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';

const SANCTUARY_ROOMS_CATALOG = [
  {
    key: 'gallery',
    emoji: '📸',
    title: 'Memory Gallery',
    tagline: 'Photos, albums & cherished adventures',
    path: '/sanctuary/gallery',
    borderColor: 'border-sky-500/30 hover:border-sky-400/70',
    bgColor: 'bg-sky-950/20 hover:bg-sky-900/30',
    glowColor: 'hover:shadow-[0_0_22px_rgba(56,189,248,0.18)]',
    textColor: 'group-hover:text-sky-300',
  },
  {
    key: 'letters',
    emoji: '📜',
    title: 'Letter Room',
    tagline: 'Parchment scrolls sealed with wax',
    path: '/sanctuary/letters',
    borderColor: 'border-rose-500/30 hover:border-rose-400/70',
    bgColor: 'bg-rose-950/20 hover:bg-rose-900/30',
    glowColor: 'hover:shadow-[0_0_22px_rgba(251,113,133,0.18)]',
    textColor: 'group-hover:text-rose-300',
  },
  {
    key: 'garden',
    emoji: '🌸',
    title: 'Our Garden',
    tagline: 'Living flowers for every milestone',
    path: '/sanctuary/garden',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400/70',
    bgColor: 'bg-emerald-950/20 hover:bg-emerald-900/30',
    glowColor: 'hover:shadow-[0_0_22px_rgba(52,211,153,0.18)]',
    textColor: 'group-hover:text-emerald-300',
  },
  {
    key: 'emotional',
    emoji: '🫂',
    title: 'Emotional Space',
    tagline: 'Safe mood check-ins & gentle comfort',
    path: '/sanctuary/emotional',
    borderColor: 'border-pink-500/30 hover:border-pink-400/70',
    bgColor: 'bg-pink-950/20 hover:bg-pink-900/30',
    glowColor: 'hover:shadow-[0_0_22px_rgba(244,114,182,0.18)]',
    textColor: 'group-hover:text-pink-300',
  },
  {
    key: 'universe',
    emoji: '✨',
    title: 'Our Universe',
    tagline: 'Shared dreams, bucket lists & voyages',
    path: '/sanctuary/universe',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400/70',
    bgColor: 'bg-cyan-950/20 hover:bg-cyan-900/30',
    glowColor: 'hover:shadow-[0_0_22px_rgba(103,232,249,0.18)]',
    textColor: 'group-hover:text-cyan-300',
  },
  {
    key: 'journal',
    emoji: '📔',
    title: 'Private Journal',
    tagline: 'Passkey-protected personal sanctuary diary',
    path: '/sanctuary/journal',
    borderColor: 'border-indigo-500/30 hover:border-indigo-400/70',
    bgColor: 'bg-indigo-950/20 hover:bg-indigo-900/30',
    glowColor: 'hover:shadow-[0_0_22px_rgba(129,140,248,0.18)]',
    textColor: 'group-hover:text-indigo-300',
  },
  {
    key: 'arcade',
    emoji: '🎮',
    title: 'Little Arcade',
    tagline: 'Couple trivia, quizzes & date generators',
    path: '/sanctuary/arcade',
    borderColor: 'border-amber-500/30 hover:border-amber-400/70',
    bgColor: 'bg-amber-950/20 hover:bg-amber-900/30',
    glowColor: 'hover:shadow-[0_0_22px_rgba(252,211,77,0.18)]',
    textColor: 'group-hover:text-amber-300',
  },
  {
    key: 'calendar',
    emoji: '📅',
    title: 'Calendar',
    tagline: 'Milestones, countdowns & anniversaries',
    path: '/sanctuary/calendar',
    borderColor: 'border-purple-500/30 hover:border-purple-400/70',
    bgColor: 'bg-purple-950/20 hover:bg-purple-900/30',
    glowColor: 'hover:shadow-[0_0_22px_rgba(167,139,250,0.18)]',
    textColor: 'group-hover:text-purple-300',
  },
];

function SanctuaryPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRoomSelection, setShowRoomSelection] = useState<boolean>(false);
  const [isMochiOpen, setIsMochiOpen] = useState<boolean>(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);

  // Auto-open Room Selection when arriving back from a room (?explore=true)
  useEffect(() => {
    if (searchParams.get('explore') === 'true') {
      setShowRoomSelection(true);
    }
  }, [searchParams]);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#05070f]">
      {/* 3D Floating Sanctuary Island */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <CanvasContainer camera={{ position: [0, 8, 16], fov: 42 }}>
          <SanctuaryIsland />
        </CanvasContainer>
      </div>

      {/* Atmospheric overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05070f]/35 via-transparent to-[#05070f]/35" />

      {/* Global Admin Button — always top-right */}
      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsAdminAuthOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-700/50 text-slate-500 hover:text-sanctuary-gold hover:border-sanctuary-gold/40 backdrop-blur-sm transition-all cursor-pointer"
          title="Admin Control Center (Emman Only)"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="text-[10px] font-serif hidden sm:inline">Admin</span>
        </button>
      </div>

      {/* Welcome Screen */}
      <AnimatePresence>
        {!showRoomSelection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.18em] uppercase gold-gradient-text drop-shadow-[0_4px_24px_rgba(212,175,55,0.35)] mb-3"
            >
              Welcome Home, Emman & Lei
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.4 }}
              className="text-xs sm:text-sm md:text-base font-sans text-sanctuary-starlight/85 tracking-widest max-w-xl mx-auto mb-10 font-light"
            >
              A peaceful celestial haven handcrafted for our love, cherished memories, and future dreams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => setShowRoomSelection(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 md:px-10 md:py-4 rounded-full bg-gradient-to-r from-[#d4af37]/90 via-[#f5e6a3] to-[#d4af37]/90 hover:from-[#f5e6a3] hover:to-[#ffd700] text-slate-950 font-serif text-xs md:text-sm font-semibold tracking-[0.2em] uppercase shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
                <span>Explore Our Sanctuary</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Selection Interface */}
      <AnimatePresence>
        {showRoomSelection && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative w-full max-w-3xl p-5 sm:p-7 rounded-3xl celestial-panel border border-sanctuary-gold/40 shadow-2xl my-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-sanctuary-gold/20">
                <div>
                  <h2 className="text-base sm:text-lg font-serif tracking-widest text-sanctuary-gold-light uppercase">
                    Our Sanctuary
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-0.5 tracking-wider">
                    Choose a chamber to enter
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoomSelection(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 text-xs text-slate-300 hover:text-sanctuary-gold hover:border-sanctuary-gold/40 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-serif">Return to Island</span>
                </button>
              </div>

              {/* Room Grid — emoji + title + description */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {SANCTUARY_ROOMS_CATALOG.map((room, idx) => (
                  <motion.button
                    key={room.key}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    onClick={() => router.push(room.path)}
                    className={`p-3.5 rounded-2xl border ${room.borderColor} ${room.bgColor} ${room.glowColor} text-center transition-all duration-200 hover:scale-[1.04] active:scale-95 flex flex-col items-center gap-2 group cursor-pointer shadow-sm`}
                  >
                    <span className="text-2xl leading-none group-hover:scale-110 transition-transform duration-200 select-none">
                      {room.emoji}
                    </span>
                    <div>
                      <h3 className={`font-serif text-[11px] font-semibold text-white ${room.textColor} transition-colors leading-tight`}>
                        {room.title}
                      </h3>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight line-clamp-2">
                        {room.tagline}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer — Mochi AI + tagline */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsMochiOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs hover:bg-cyan-900/40 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <Bot className="w-4 h-4" />
                  <span className="font-serif tracking-wider">Mochi AI Companion</span>
                </button>
                <p className="text-[10px] text-slate-600 font-serif italic hidden sm:block">
                  A Celestial Sanctuary for Lei
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mochi AI Companion Modal */}
      <MochiChatModal isOpen={isMochiOpen} onClose={() => setIsMochiOpen(false)} />
      {/* Admin Authentication Modal */}
      <AdminAuthModal isOpen={isAdminAuthOpen} onClose={() => setIsAdminAuthOpen(false)} />
    </div>
  );
}

export default function MainSanctuaryPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-[#05070f]" />}>
      <SanctuaryPageInner />
    </Suspense>
  );
}
