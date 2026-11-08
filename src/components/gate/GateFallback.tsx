'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Heart } from 'lucide-react';

interface GateFallbackProps {
  gateState: 'approaching' | 'greeting' | 'authenticating' | 'granted' | 'denied';
}

export function GateFallback({ gateState }: GateFallbackProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden bg-gradient-to-b from-[#060914] via-[#0d1428] to-[#04060c]">
      {/* Background celestial nebula */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-sanctuary-gold/10 blur-[120px] pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-sanctuary-rose/10 blur-[100px] pointer-events-none translate-y-24" />

      {/* Stylized Arch Graphic */}
      <motion.div
        animate={
          gateState === 'granted'
            ? { scale: [1, 1.15, 1.4], opacity: [1, 0.8, 0] }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 1.8 }}
        className="relative flex flex-col items-center mb-8"
      >
        <div className="w-56 h-80 rounded-t-full border-4 border-sanctuary-gold/40 relative flex items-center justify-center bg-slate-950/60 shadow-celestial-lg">
          {/* Inner Heart Emblem */}
          <div className="w-24 h-24 rounded-full bg-sanctuary-navy border-2 border-sanctuary-gold flex items-center justify-center shadow-celestial-md">
            <Heart className={`w-12 h-12 ${gateState === 'granted' ? 'text-amber-300 scale-125' : 'text-sanctuary-rose'} transition-all duration-500`} />
          </div>

          {/* Knight Silhouette Emblem */}
          <div className="absolute -bottom-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-sanctuary-navy border border-sanctuary-gold/50 shadow-md">
            <Shield className="w-4 h-4 text-sanctuary-gold" />
            <span className="text-xs font-serif text-sanctuary-gold tracking-widest uppercase">
              Angel Heart Knight Guard
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
