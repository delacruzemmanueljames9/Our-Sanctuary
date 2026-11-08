'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Letter } from '@/types/sanctuary';
import { Heart, Sparkles, Feather, Clock } from 'lucide-react';

interface RolledScrollItemProps {
  letter: Letter;
  onClick: () => void;
}

export function RolledScrollItem({ letter, onClick }: RolledScrollItemProps) {
  const getWaxSealDetails = (seal: string) => {
    switch (seal) {
      case 'golden_heart':
        return {
          name: 'Golden Heart',
          bg: 'from-amber-600 via-yellow-500 to-amber-700',
          border: 'border-yellow-300/80',
          ring: 'ring-yellow-500/40',
          icon: Heart,
          ribbon: 'from-red-800 via-rose-700 to-red-900',
        };
      case 'celestial_rose':
        return {
          name: 'Celestial Rose',
          bg: 'from-rose-600 via-pink-500 to-rose-700',
          border: 'border-rose-300/80',
          ring: 'ring-rose-500/40',
          icon: Heart,
          ribbon: 'from-rose-900 via-pink-800 to-rose-950',
        };
      case 'starlight':
        return {
          name: 'Starlight',
          bg: 'from-cyan-600 via-sky-400 to-blue-700',
          border: 'border-cyan-300/80',
          ring: 'ring-cyan-500/40',
          icon: Sparkles,
          ribbon: 'from-indigo-900 via-blue-800 to-indigo-950',
        };
      default:
        return {
          name: 'Angel Wing',
          bg: 'from-slate-400 via-white to-slate-500',
          border: 'border-slate-200/80',
          ring: 'ring-slate-400/40',
          icon: Feather,
          ribbon: 'from-amber-900 via-yellow-800 to-amber-950',
        };
    }
  };

  const seal = getWaxSealDetails(letter.waxSeal);
  const SealIcon = seal.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative cursor-pointer select-none py-4 px-2"
    >
      {/* Outer ambient glow on hover */}
      <div className="absolute inset-0 rounded-3xl bg-amber-500/0 group-hover:bg-amber-500/10 blur-xl transition-all duration-500 pointer-events-none" />

      {/* ROLLED SCROLL CYLINDER */}
      <div className="relative mx-auto w-full max-w-md rounded-2xl p-4 transition-all duration-300">
        {/* Top Wooden Rod End */}
        <div className="relative h-4 mx-2 flex items-center justify-between">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-md border border-amber-300/50" />
          <div className="flex-1 h-3 -mx-1 rounded-full bg-gradient-to-r from-[#2c1806] via-[#6d3e14] to-[#2c1806] shadow-inner border-y border-amber-500/30" />
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-md border border-amber-300/50" />
        </div>

        {/* Rolled Parchment Body (3D Cylinder Appearance) */}
        <div
          className="relative mx-5 py-5 px-6 rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            background: `
              linear-gradient(180deg, 
                #b8905b 0%, 
                #f4e7c5 18%, 
                #fdf9ee 48%, 
                #eeddb4 78%, 
                #b48952 100%
              )
            `,
            boxShadow: `
              inset 0 6px 12px rgba(100,60,20,0.35),
              inset 0 -6px 12px rgba(100,60,20,0.35),
              0 12px 24px -4px rgba(0,0,0,0.7)
            `,
          }}
        >
          {/* Subtle parchment texture lines */}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(90,50,15,0.7) 19px)',
            }}
          />

          {/* Satin Ribbon Band wrapped around center */}
          <div
            className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r ${seal.ribbon} shadow-lg border-x border-amber-400/40 flex items-center justify-center`}
          >
            {/* Golden ribbon stitching lines */}
            <div className="absolute inset-y-0 left-1 w-px bg-amber-300/40" />
            <div className="absolute inset-y-0 right-1 w-px bg-amber-300/40" />
          </div>

          {/* 3D Wax Seal Medallion */}
          <div className="relative z-10 flex items-center justify-center my-1">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${seal.bg} border-2 ${seal.border} ring-4 ${seal.ring} shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(212,175,55,0.7)] transition-all`}
            >
              {/* Embossed Inner Ring */}
              <div className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center shadow-inner">
                <SealIcon className="w-5 h-5 text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" />
              </div>
            </motion.div>
          </div>

          {/* Letter Info Calligraphy Plate */}
          <div className="relative z-10 text-center mt-3 pt-2 border-t border-amber-900/15">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[10px] font-serif uppercase tracking-widest text-amber-900 font-semibold">
                From {letter.sender === 'emman' ? 'Emman' : 'Lei'} · To {letter.recipient === 'emman' ? 'Emman' : 'Lei'}
              </span>
            </div>
            <h3 className="font-serif text-sm md:text-base font-bold text-amber-950 group-hover:text-amber-800 transition-colors truncate">
              {letter.title}
            </h3>
            <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-amber-900/70 font-serif">
              <Clock className="w-3 h-3" />
              <span>
                Penned {new Date(letter.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>·</span>
              <span className="text-amber-950 font-semibold group-hover:underline">Click to Unroll Scroll &rarr;</span>
            </div>
          </div>
        </div>

        {/* Bottom Wooden Rod End */}
        <div className="relative h-4 mx-2 flex items-center justify-between">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-md border border-amber-300/50" />
          <div className="flex-1 h-3 -mx-1 rounded-full bg-gradient-to-r from-[#2c1806] via-[#6d3e14] to-[#2c1806] shadow-inner border-y border-amber-500/30" />
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-950 shadow-md border border-amber-300/50" />
        </div>
      </div>
    </motion.div>
  );
}
