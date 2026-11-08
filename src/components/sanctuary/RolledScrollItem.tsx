'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Letter } from '@/types/sanctuary';
import { Heart, Sparkles, Feather, Sparkle } from 'lucide-react';

interface RolledScrollItemProps {
  letter: Letter;
  index: number;
  onClick: () => void;
}

export function RolledScrollItem({ letter, index, onClick }: RolledScrollItemProps) {
  const getWaxSealDetails = (seal: string) => {
    switch (seal) {
      case 'golden_heart':
        return {
          name: 'Golden Heart',
          bg: 'from-amber-600 via-yellow-500 to-amber-700',
          border: 'border-yellow-300/90',
          ring: 'ring-yellow-500/40',
          icon: Heart,
          ribbon: 'from-amber-900 via-red-800 to-amber-950',
          label: 'Wax Sealed in Love',
        };
      case 'celestial_rose':
        return {
          name: 'Celestial Rose',
          bg: 'from-rose-600 via-pink-500 to-rose-700',
          border: 'border-rose-300/90',
          ring: 'ring-rose-500/40',
          icon: Heart,
          ribbon: 'from-rose-950 via-pink-900 to-rose-950',
          label: 'Wax Sealed in Devotion',
        };
      case 'starlight':
        return {
          name: 'Starlight',
          bg: 'from-cyan-600 via-sky-400 to-blue-700',
          border: 'border-cyan-300/90',
          ring: 'ring-cyan-500/40',
          icon: Sparkles,
          ribbon: 'from-indigo-950 via-blue-900 to-indigo-950',
          label: 'Wax Sealed in Starlight',
        };
      default:
        return {
          name: 'Angel Wing',
          bg: 'from-slate-400 via-white to-slate-500',
          border: 'border-slate-200/90',
          ring: 'ring-slate-400/40',
          icon: Feather,
          ribbon: 'from-amber-950 via-yellow-900 to-amber-950',
          label: 'Wax Sealed by Guardian',
        };
    }
  };

  const seal = getWaxSealDetails(letter.waxSeal);
  const SealIcon = seal.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative cursor-pointer select-none py-6 px-3 flex flex-col items-center"
    >
      {/* Golden Aura Glow on Hover */}
      <div className="absolute inset-x-4 inset-y-2 rounded-3xl bg-amber-500/0 group-hover:bg-amber-400/15 blur-2xl transition-all duration-500 pointer-events-none" />

      {/* COMPLETELY CLOSED BLANK PARCHMENT SCROLL */}
      <div className="relative w-full max-w-sm flex flex-col items-center">
        {/* Top Wooden Rod End */}
        <div className="relative w-full h-5 flex items-center justify-between z-10 px-1">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-md border border-amber-300/60" />
          <div className="flex-1 h-3.5 -mx-1 rounded-full bg-gradient-to-r from-[#2c1806] via-[#6d3e14] to-[#2c1806] shadow-inner border-y border-amber-500/40" />
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-md border border-amber-300/60" />
        </div>

        {/* Blank Rolled Cylinder — No message preview or text */}
        <div
          className="relative w-[88%] h-24 my-[-2px] rounded-sm shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.25)]"
          style={{
            background: `
              linear-gradient(180deg, 
                #a8804b 0%, 
                #f3e5c0 20%, 
                #fdf8ec 50%, 
                #eedbb2 80%, 
                #a47942 100%
              )
            `,
            boxShadow: `
              inset 0 8px 14px rgba(90,50,15,0.4),
              inset 0 -8px 14px rgba(90,50,15,0.4),
              0 8px 20px rgba(0,0,0,0.6)
            `,
          }}
        >
          {/* Subtle parchment grain lines */}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(80,45,10,0.6) 17px)',
            }}
          />

          {/* Wrapped Velvet Ribbon */}
          <div
            className={`absolute inset-y-0 w-12 bg-gradient-to-r ${seal.ribbon} shadow-lg border-x border-amber-400/40 flex items-center justify-center`}
          >
            <div className="absolute inset-y-0 left-1 w-px bg-amber-300/30" />
            <div className="absolute inset-y-0 right-1 w-px bg-amber-300/30" />
          </div>

          {/* 3D Wax Seal Stamp Medallion */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.12, rotate: 6 }}
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${seal.bg} border-2 ${seal.border} ring-4 ${seal.ring} shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center justify-center group-hover:shadow-[0_0_24px_rgba(212,175,55,0.8)] transition-all`}
            >
              <div className="w-9 h-9 rounded-full border border-black/25 flex items-center justify-center shadow-inner">
                <SealIcon className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Wooden Rod End */}
        <div className="relative w-full h-5 flex items-center justify-between z-10 px-1">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-md border border-amber-300/60" />
          <div className="flex-1 h-3.5 -mx-1 rounded-full bg-gradient-to-r from-[#2c1806] via-[#6d3e14] to-[#2c1806] shadow-inner border-y border-amber-500/40" />
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-md border border-amber-300/60" />
        </div>

        {/* Discreet Scroll Tag Below — Only seal type & unroll prompt, ZERO message preview */}
        <div className="text-center mt-3">
          <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-amber-300/80 group-hover:text-amber-200 transition-colors block">
            Scroll #{index + 1} &bull; {seal.name}
          </span>
          <span className="text-[11px] font-serif text-slate-400 group-hover:text-sanctuary-gold transition-colors inline-flex items-center gap-1 mt-0.5">
            <Sparkle className="w-2.5 h-2.5 text-sanctuary-gold animate-pulse" />
            <span>Click to Unroll</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
