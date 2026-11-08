'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CanvasContainer } from '@/components/3d/CanvasContainer';
import { SanctuaryIsland } from '@/components/3d/SanctuaryIsland';
import {
  Heart,
  Calendar,
  Sparkles,
  Scroll,
  Image as ImageIcon,
  Flower2,
  Compass,
  ArrowRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function SanctuaryHome() {
  const [data, setData] = useState<any>(null);
  const [daysCount, setDaysCount] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'3d' | 'overview'>('3d');

  useEffect(() => {
    fetch('/api/sanctuary')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        if (resData.settings?.relationshipStartDate) {
          const start = new Date(resData.settings.relationshipStartDate).getTime();
          const now = Date.now();
          const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
          setDaysCount(diffDays > 0 ? diffDays : 1380);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* 3D Floating Sanctuary World Canvas (Background) */}
      <div className="fixed inset-0 w-full h-full pointer-events-auto">
        <CanvasContainer camera={{ position: [0, 8, 16], fov: 42 }}>
          <SanctuaryIsland />
        </CanvasContainer>
      </div>

      {/* Atmospheric Overlays */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-[#05070f] via-transparent to-[#05070f]/50" />

      {/* Top Header */}
      <header className="relative z-20 max-w-7xl mx-auto p-6 md:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sanctuary-navy/80 border border-sanctuary-gold/40 flex items-center justify-center shadow-celestial-sm">
            <Heart className="w-6 h-6 text-sanctuary-rose animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif tracking-widest text-sanctuary-gold-light uppercase">
              Our Sanctuary
            </h1>
            <p className="text-xs text-slate-400 font-sans tracking-wide">
              EMMAN & LEI &bull; CELESTIAL HAVEN
            </p>
          </div>
        </div>

        {/* Relationship Counter Pill */}
        <div className="px-5 py-2 rounded-2xl celestial-panel border border-sanctuary-gold/30 flex items-center gap-3 shadow-celestial-sm">
          <Clock className="w-4 h-4 text-sanctuary-gold animate-spin-slow" />
          <div className="text-right">
            <span className="text-xs text-slate-400 block leading-tight">Days of Harmony</span>
            <span className="text-sm md:text-base font-serif font-bold text-sanctuary-gold-light">
              {daysCount} Days Together
            </span>
          </div>
        </div>
      </header>

      {/* Main Sanctuary Dashboard Cards & Quick Hub */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-8 mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Relationship Essence & Recent Memory */}
        <div className="space-y-6">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl celestial-panel border border-sanctuary-gold/30"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-serif uppercase tracking-widest text-sanctuary-gold">
                Room 01 &bull; Our Home
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Sanctuary Active
              </span>
            </div>
            <h2 className="text-lg font-serif text-white mb-2">
              Welcome back to our world, Emman & Lei.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every room here was crafted to protect our memories, our promises, and the quiet love that anchors us. The Angel Knight guards the gate, and the garden flourishes with every moment shared.
            </p>
          </motion.div>

          {/* Recent Memory Highlight */}
          {data?.recentMemories?.[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-3xl celestial-panel border border-sanctuary-gold/25 group overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-serif uppercase tracking-wider text-sanctuary-gold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  Featured Memory
                </span>
                <Link
                  href="/sanctuary/gallery"
                  className="text-[11px] text-slate-400 hover:text-sanctuary-gold flex items-center gap-1 transition-colors"
                >
                  Gallery <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="relative h-44 rounded-2xl overflow-hidden mb-3 border border-slate-700/60">
                <img
                  src={data.recentMemories[0].mediaUrl}
                  alt={data.recentMemories[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] text-amber-300 font-sans block">
                    {data.recentMemories[0].memoryDate}
                  </span>
                  <h3 className="font-serif text-sm text-white font-medium truncate">
                    {data.recentMemories[0].title}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 italic">
                &ldquo;{data.recentMemories[0].description}&rdquo;
              </p>
            </motion.div>
          )}
        </div>

        {/* Center Column: 3D Camera Focus Controls / Direct Portals */}
        <div className="flex flex-col justify-end">
          <div className="p-6 rounded-3xl celestial-panel border border-sanctuary-gold/30 text-center">
            <Compass className="w-8 h-8 text-sanctuary-gold mx-auto mb-3 animate-float-gentle" />
            <h3 className="text-sm font-serif text-sanctuary-gold-light uppercase tracking-wider mb-1">
              Interactive 3D Sanctuary Island
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Drag or swipe to orbit around our sanctuary house, glowing pond, and celestial crystals.
            </p>
            <div className="grid grid-cols-2 gap-2 text-left">
              <Link
                href="/sanctuary/garden"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all flex items-center gap-2.5"
              >
                <Flower2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-serif text-white block">Our Garden</span>
                  <span className="text-[10px] text-slate-400">{data?.totalPlants || 3} Blooming Flora</span>
                </div>
              </Link>
              <Link
                href="/sanctuary/letters"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-950/20 transition-all flex items-center gap-2.5"
              >
                <Scroll className="w-4 h-4 text-rose-300" />
                <div>
                  <span className="text-xs font-serif text-white block">Letter Room</span>
                  <span className="text-[10px] text-slate-400">Parchment & Seals</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Milestones & Letters */}
        <div className="space-y-6">
          {/* Calendar Milestones Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-3xl celestial-panel border border-sanctuary-gold/25"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-serif uppercase tracking-wider text-sanctuary-gold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-300" />
                Next Milestones
              </span>
              <Link
                href="/sanctuary/calendar"
                className="text-[11px] text-slate-400 hover:text-sanctuary-gold flex items-center gap-1 transition-colors"
              >
                Calendar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {(data?.upcomingEvents || []).map((ev: any) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-serif text-white font-medium">{ev.title}</h4>
                    <p className="text-[10px] text-slate-400">
                      {new Date(ev.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-800/60 text-purple-200">
                    {ev.category}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Latest Letter snippet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-3xl celestial-panel border border-sanctuary-gold/25"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-serif uppercase tracking-wider text-sanctuary-gold flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5 text-rose-300" />
                Latest Letter
              </span>
              <Link
                href="/sanctuary/letters"
                className="text-[11px] text-slate-400 hover:text-sanctuary-gold flex items-center gap-1 transition-colors"
              >
                Write <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-4 rounded-2xl parchment-panel text-slate-900">
              <span className="text-[10px] uppercase tracking-wider text-amber-900 font-serif block mb-1">
                From Emman to Lei &bull; Sealed with Golden Heart
              </span>
              <p className="text-xs font-display leading-relaxed italic line-clamp-3">
                &ldquo;When the world gets loud and demanding, you are the calm rhythm that centers my soul. Building this sanctuary for you isn’t just about code—it is my way of giving our love a physical home that will never fade...&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
