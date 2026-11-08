'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Scroll container */}
          <motion.div
            className="relative z-10 w-full max-w-2xl"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{
              scaleY: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3 },
            }}
            style={{ transformOrigin: 'top center' }}
          >
            {/* Top scroll roller */}
            <div className="relative flex items-center justify-center h-6 mx-4">
              <div className="absolute inset-x-0 h-6 rounded-full bg-gradient-to-r from-[#3d2000] via-[#7a4a1a] to-[#3d2000] shadow-[0_4px_12px_rgba(0,0,0,0.6)]" />
              <div className="absolute inset-x-0 h-2 top-2 bg-gradient-to-r from-[#5a3010]/0 via-[#c8945a]/40 to-[#5a3010]/0 rounded-full" />
              {/* Left knob */}
              <div className="absolute left-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#8a5a20] to-[#3d2000] border border-[#c8945a]/40 shadow-md" />
              {/* Right knob */}
              <div className="absolute right-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#8a5a20] to-[#3d2000] border border-[#c8945a]/40 shadow-md" />
            </div>

            {/* Parchment body */}
            <motion.div
              ref={scrollRef}
              className="relative mx-4 overflow-y-auto max-h-[70vh]"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              style={{
                background: `
                  radial-gradient(ellipse at 20% 20%, rgba(210,170,100,0.12) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 80%, rgba(180,130,70,0.10) 0%, transparent 50%),
                  linear-gradient(160deg, #f5e8c0 0%, #eedba0 20%, #e8d090 50%, #edd9a0 80%, #f2e4b5 100%)
                `,
                boxShadow: `
                  inset 0 0 40px rgba(120,80,20,0.15),
                  inset 0 0 2px rgba(120,80,20,0.3),
                  0 8px 32px rgba(0,0,0,0.5)
                `,
              }}
            >
              {/* Parchment texture lines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.07]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 23px,
                    rgba(100,60,10,0.8) 23px,
                    rgba(100,60,10,0.8) 24px
                  )`,
                }}
              />

              {/* Torn/aged edge effects */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#c8975a]/25 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#c8975a]/25 to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative px-10 py-8 md:px-14 md:py-10">
                {/* Close button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-amber-900/15 text-amber-950 hover:bg-amber-900/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="text-center mb-6 pb-4 border-b border-amber-900/20">
                  <div className="inline-flex items-center gap-1.5 mb-3">
                    <div className={`w-2 h-2 rounded-full ${sealColor.includes('amber') ? 'bg-amber-600' : sealColor.includes('rose') ? 'bg-rose-600' : sealColor.includes('cyan') ? 'bg-cyan-600' : 'bg-slate-500'}`} />
                    <span className={`text-[10px] font-serif uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${sealColor}`}>
                      {sealLabel}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${sealColor.includes('amber') ? 'bg-amber-600' : sealColor.includes('rose') ? 'bg-rose-600' : sealColor.includes('cyan') ? 'bg-cyan-600' : 'bg-slate-500'}`} />
                  </div>

                  <span className="block text-[11px] font-serif uppercase tracking-widest text-amber-900/80 mb-2">
                    From {sender} · To {recipient}
                  </span>

                  <h2 className="text-xl md:text-2xl font-serif text-amber-950 font-bold leading-snug">
                    {title}
                  </h2>

                  <span className="block text-xs text-amber-800/70 font-serif mt-1.5 italic">
                    Penned on {date}
                  </span>
                </div>

                {/* Letter body */}
                <div className="text-sm md:text-base font-display text-amber-950 leading-[1.9] whitespace-pre-wrap italic">
                  {content}
                </div>

                {/* Footer seal */}
                <div className="mt-8 pt-5 border-t border-amber-900/20 flex items-center justify-between text-xs text-amber-900 font-serif">
                  <span>Sanctuary Seal of Harmony</span>
                  <span className="font-semibold uppercase tracking-wider text-amber-950">
                    Eternal Bond
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Bottom scroll roller */}
            <div className="relative flex items-center justify-center h-6 mx-4">
              <div className="absolute inset-x-0 h-6 rounded-full bg-gradient-to-r from-[#3d2000] via-[#7a4a1a] to-[#3d2000] shadow-[0_-4px_12px_rgba(0,0,0,0.6)]" />
              <div className="absolute inset-x-0 h-2 top-2 bg-gradient-to-r from-[#5a3010]/0 via-[#c8945a]/40 to-[#5a3010]/0 rounded-full" />
              <div className="absolute left-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#8a5a20] to-[#3d2000] border border-[#c8945a]/40 shadow-md" />
              <div className="absolute right-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#8a5a20] to-[#3d2000] border border-[#c8945a]/40 shadow-md" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
