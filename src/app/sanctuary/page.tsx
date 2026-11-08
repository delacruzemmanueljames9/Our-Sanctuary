'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasContainer } from '@/components/3d/CanvasContainer';
import { SanctuaryIsland } from '@/components/3d/SanctuaryIsland';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  Scroll,
  Flower2,
  HeartHandshake,
  BookLock,
  Gamepad2,
  Calendar,
  X,
  Bot,
  ShieldAlert,
} from 'lucide-react';
import { MochiChatModal } from '@/components/mochi/MochiChatModal';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';

const SANCTUARY_ROOMS_CATALOG = [
  {
    key: 'gallery',
    title: 'Memory Gallery',
    tagline: 'Archived photos, albums, and cherished adventures',
    path: '/sanctuary/gallery',
    icon: ImageIcon,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/30 hover:border-sky-500/60',
    bgColor: 'bg-sky-950/20',
  },
  {
    key: 'letters',
    title: 'Letter Room',
    tagline: 'Handcrafted parchment, wax seals, and time capsules',
    path: '/sanctuary/letters',
    icon: Scroll,
    color: 'text-rose-300',
    borderColor: 'border-rose-500/30 hover:border-rose-500/60',
    bgColor: 'bg-rose-950/20',
  },
  {
    key: 'garden',
    title: 'Our Garden',
    tagline: 'Living flora dedicated to our milestones and care',
    path: '/sanctuary/garden',
    icon: Flower2,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    bgColor: 'bg-emerald-950/20',
  },
  {
    key: 'emotional',
    title: 'Emotional Space',
    tagline: 'Safe check-ins, mood reflections, and gentle comfort',
    path: '/sanctuary/emotional',
    icon: HeartHandshake,
    color: 'text-pink-400',
    borderColor: 'border-pink-500/30 hover:border-pink-500/60',
    bgColor: 'bg-pink-950/20',
  },
  {
    key: 'universe',
    title: 'Our Universe',
    tagline: 'Constellations of shared dreams, bucket lists & voyages',
    path: '/sanctuary/universe',
    icon: Compass,
    color: 'text-cyan-300',
    borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
    bgColor: 'bg-cyan-950/20',
  },
  {
    key: 'journal',
    title: 'Private Journal',
    tagline: 'Strict zero-knowledge personal passkeys for each soul',
    path: '/sanctuary/journal',
    icon: BookLock,
    color: 'text-indigo-300',
    borderColor: 'border-indigo-500/30 hover:border-indigo-500/60',
    bgColor: 'bg-indigo-950/20',
  },
  {
    key: 'arcade',
    title: 'Little Arcade',
    tagline: 'Couple trivia quizzes, scoring & date night generators',
    path: '/sanctuary/arcade',
    icon: Gamepad2,
    color: 'text-amber-300',
    borderColor: 'border-amber-500/30 hover:border-amber-500/60',
    bgColor: 'bg-amber-950/20',
  },
  {
    key: 'calendar',
    title: 'Calendar',
    tagline: 'Milestones, countdowns, and recurring anniversaries',
    path: '/sanctuary/calendar',
    icon: Calendar,
    color: 'text-purple-300',
    borderColor: 'border-purple-500/30 hover:border-purple-500/60',
    bgColor: 'bg-purple-950/20',
  },
];

export default function MainSanctuaryPage() {
  const router = useRouter();
  const [showRoomSelection, setShowRoomSelection] = useState<boolean>(false);
  const [isMochiOpen, setIsMochiOpen] = useState<boolean>(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#05070f]">
      {/* 3D Floating Sanctuary Island (Existing Environment Unchanged) */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <CanvasContainer camera={{ position: [0, 8, 16], fov: 42 }}>
          <SanctuaryIsland />
        </CanvasContainer>
      </div>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05070f]/35 via-transparent to-[#05070f]/35" />

      {/* Simplified Main Sanctuary Welcome Screen (No bottom nav, no widgets, no cards) */}
      <AnimatePresence>
        {!showRoomSelection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            {/* Short, Sweet, Personal Welcome Message */}
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

            {/* One Elegant Centered Button: "Explore Our Sanctuary" */}
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

      {/* Room Selection Interface (Accessible ONLY after clicking the welcome button) */}
      <AnimatePresence>
        {showRoomSelection && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative w-full max-w-4xl p-6 sm:p-8 rounded-3xl celestial-panel border border-sanctuary-gold/40 shadow-2xl my-auto"
            >
              {/* Header & Close Button */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-sanctuary-gold/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-sanctuary-gold/15 border border-sanctuary-gold/40 flex items-center justify-center shadow-celestial-sm">
                    <Compass className="w-5 h-5 text-sanctuary-gold" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-serif tracking-widest text-sanctuary-gold-light uppercase">
                      Sanctuary Room Selection
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Choose a chamber to enter
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRoomSelection(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 text-xs text-slate-300 hover:text-sanctuary-gold hover:border-sanctuary-gold/40 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Return to Island</span>
                </button>
              </div>

              {/* Grid of All Sanctuary Rooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
                {SANCTUARY_ROOMS_CATALOG.map((room) => {
                  const Icon = room.icon;
                  return (
                    <button
                      key={room.key}
                      type="button"
                      onClick={() => router.push(room.path)}
                      className={`p-4 rounded-2xl border ${room.borderColor} ${room.bgColor} text-left transition-all duration-200 hover:scale-[1.02] active:scale-95 flex flex-col justify-between h-36 group cursor-pointer shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center group-hover:border-sanctuary-gold/50 transition-colors">
                          <Icon className={`w-4 h-4 ${room.color} group-hover:scale-110 transition-transform`} />
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sanctuary-gold group-hover:translate-x-1 transition-all" />
                      </div>

                      <div>
                        <h3 className="font-serif text-sm text-white font-medium group-hover:text-sanctuary-gold-light transition-colors">
                          {room.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {room.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Quick Triggers: Mochi AI & Super Admin */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
                {/* Mochi AI Familiar */}
                <button
                  type="button"
                  onClick={() => setIsMochiOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <Bot className="w-4 h-4" />
                  <span className="font-serif tracking-wider">Mochi AI Companion</span>
                </button>

                {/* Super Admin Control Center (Emman Only) */}
                <button
                  type="button"
                  onClick={() => setIsAdminAuthOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-sanctuary-gold hover:bg-slate-900/60 transition-colors cursor-pointer"
                  title="Admin Control Center (Emman Only)"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[11px] font-serif">Admin Control</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mochi AI Companion Modal */}
      <MochiChatModal
        isOpen={isMochiOpen}
        onClose={() => setIsMochiOpen(false)}
      />

      {/* Admin Authentication Modal (Emman Super Admin only) */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
      />
    </div>
  );
}
