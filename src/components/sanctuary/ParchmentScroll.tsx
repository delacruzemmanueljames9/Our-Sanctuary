'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart } from 'lucide-react';

interface ParchmentScrollProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sender: string;
  recipient: string;
  date: string;
  content: string;
  sealLabel: string;
  sealColor: string;
}

export function ParchmentScroll({
  isOpen,
  onClose,
  title,
  sender,
  recipient,
  date,
  content,
  sealLabel,
  sealColor,
}: ParchmentScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRollingUp, setIsRollingUp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRollingUp(false);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsRollingUp(true);
    setTimeout(() => {
      onClose();
      setIsRollingUp(false);
    }, 450);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={handleClose} />

          {/* 3D Scroll Container */}
          <motion.div
            className="relative z-10 w-full max-w-2xl flex flex-col items-center"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={
              isRollingUp
                ? { scale: 0.85, opacity: 0, y: 30 }
                : { scale: 1, opacity: 1, y: 0 }
            }
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* TOP WOODEN ROLLER ROD */}
            <div className="relative w-full flex items-center justify-between z-20 -mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-lg border border-amber-300/60" />
              <div className="flex-1 h-5 -mx-1 rounded-full bg-gradient-to-r from-[#2c1806] via-[#6d3e14] to-[#2c1806] shadow-xl border-y border-amber-500/40 relative flex items-center justify-center">
                <div className="absolute inset-x-8 h-1 top-1 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent rounded-full" />
                <span className="text-[9px] uppercase tracking-widest font-serif text-amber-200/50">
                  Sanctuary Archive Scroll
                </span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-lg border border-amber-300/60" />
            </div>

            {/* UNROLLING PARCHMENT SHEET */}
            <motion.div
              ref={scrollRef}
              initial={{ height: 40, opacity: 0.5 }}
              animate={
                isRollingUp
                  ? { height: 40, opacity: 0.5 }
                  : { height: 'auto', opacity: 1 }
              }
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[96%] overflow-y-auto max-h-[72vh] rounded-sm shadow-2xl"
              style={{
                background: `
                  radial-gradient(ellipse at 15% 15%, rgba(215, 175, 110, 0.18) 0%, transparent 60%),
                  radial-gradient(ellipse at 85% 85%, rgba(185, 135, 75, 0.15) 0%, transparent 60%),
                  linear-gradient(170deg, #f7ebd0 0%, #f0dec5 25%, #ebd7b5 50%, #f2e2be 75%, #f6e8c7 100%)
                `,
                boxShadow: `
                  inset 0 0 50px rgba(130, 85, 25, 0.18),
                  inset 0 0 3px rgba(120, 80, 20, 0.4),
                  0 20px 40px rgba(0, 0, 0, 0.7)
                `,
              }}
            >
              {/* Parchment texture fibers */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.08]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 24px,
                    rgba(90, 50, 10, 0.8) 24px,
                    rgba(90, 50, 10, 0.8) 25px
                  )`,
                }}
              />

              {/* Aged vignetted edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#b58348]/30 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#b58348]/30 to-transparent pointer-events-none" />

              {/* Actual Letter Content */}
              <div className="relative px-8 py-8 sm:px-14 sm:py-10">
                {/* Close / Roll Up Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/15 border border-amber-900/30 text-amber-950 text-xs font-serif hover:bg-amber-900/30 transition-all cursor-pointer"
                  title="Roll scroll back up"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold hidden sm:inline">Roll Back Up</span>
                </button>

                {/* Header with Wax Seal Badge */}
                <div className="text-center mb-6 pb-4 border-b border-amber-900/20">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-600/80" />
                    <span className={`text-[10px] font-serif uppercase tracking-widest px-3 py-0.5 rounded-full border ${sealColor} font-semibold`}>
                      {sealLabel}
                    </span>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-600/80" />
                  </div>

                  <span className="block text-[11px] font-serif uppercase tracking-widest text-amber-900/80 mb-2">
                    Penned by {sender} · Sealed for {recipient}
                  </span>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-amber-950 font-bold leading-snug">
                    {title}
                  </h2>

                  <span className="block text-xs text-amber-800/80 font-serif mt-2 italic">
                    Written with eternal intention on {date}
                  </span>
                </div>

                {/* Handcrafted Message Body */}
                <div className="text-sm sm:text-base md:text-lg font-display text-amber-950 leading-[2.0] whitespace-pre-wrap italic pl-2 border-l-2 border-amber-800/25 my-6">
                  {content}
                </div>

                {/* Footer Seal Stamp */}
                <div className="mt-8 pt-5 border-t border-amber-900/20 flex items-center justify-between text-xs text-amber-900 font-serif">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-amber-800 fill-amber-800/40" />
                    <span>Preserved in Celestial Vault</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="underline text-amber-950 hover:text-amber-700 font-semibold cursor-pointer"
                  >
                    Roll Scroll Back &amp; Close
                  </button>
                </div>
              </div>
            </motion.div>

            {/* BOTTOM WOODEN ROLLER ROD */}
            <div className="relative w-full flex items-center justify-between z-20 -mt-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-lg border border-amber-300/60" />
              <div className="flex-1 h-5 -mx-1 rounded-full bg-gradient-to-r from-[#2c1806] via-[#6d3e14] to-[#2c1806] shadow-xl border-y border-amber-500/40 relative flex items-center justify-center">
                <div className="absolute inset-x-8 h-1 bottom-1 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent rounded-full" />
                <span className="text-[9px] uppercase tracking-widest font-serif text-amber-200/50">
                  Emman &bull; Lei
                </span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-lg border border-amber-300/60" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
