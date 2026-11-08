'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, Sparkles } from 'lucide-react';
import { Letter } from '@/types/sanctuary';
import { RoomShell } from '@/components/sanctuary/RoomShell';
import { ParchmentScroll } from '@/components/sanctuary/ParchmentScroll';
import { RolledScrollItem } from '@/components/sanctuary/RolledScrollItem';
import { useSanctuaryRealtime } from '@/hooks/useSanctuaryRealtime';

export default function LetterRoomPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const fetchLetters = async () => {
    try {
      const res = await fetch('/api/letters');
      const data = await res.json();
      if (data.letters) setLetters(data.letters);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  // Realtime synchronization for new sealed scrolls from Admin
  useSanctuaryRealtime({
    table: 'letters',
    onChange: () => {
      fetchLetters();
    },
  });

  return (
    <RoomShell>
      <div className="px-4 py-8 md:px-12 max-w-5xl mx-auto">
        {/* Header — Personalized for Lei */}
        <div className="text-center md:text-left mb-10 pb-6 border-b border-rose-900/20">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
            <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
              Room 03 &bull; Letter Room
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-rose-300">Handcrafted Vault for Lei</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif text-white tracking-wide">
            Parchment Scrolls Sealed for Lei
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
            Every scroll rests completely closed and sealed with authentic wax. Touch any scroll to break its seal, physically unroll the parchment, and read its words.
          </p>
        </div>

        {/* Rolled Parchment Shelf — Completely closed blank scrolls */}
        {letters.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Scroll className="w-14 h-14 mx-auto mb-3 opacity-30 text-amber-300" />
            <p className="font-serif text-sm">New sealed scrolls will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {letters.map((letter, idx) => (
              <RolledScrollItem
                key={letter.id}
                letter={letter}
                index={idx}
                onClick={() => setSelectedLetter(letter)}
              />
            ))}
          </div>
        )}

        {/* 3D Animated Parchment Scroll Unrolling Experience */}
        {selectedLetter && (() => {
          const sealMap: Record<string, { label: string; color: string }> = {
            golden_heart: { label: 'Golden Heart Seal', color: 'text-amber-800 border-amber-600 bg-amber-100' },
            celestial_rose: { label: 'Celestial Rose Seal', color: 'text-rose-800 border-rose-600 bg-rose-100' },
            starlight: { label: 'Starlight Seal', color: 'text-cyan-800 border-cyan-600 bg-cyan-100' },
            angel_wing: { label: 'Angel Wing Seal', color: 'text-slate-800 border-slate-600 bg-slate-100' },
          };
          const seal = sealMap[selectedLetter.waxSeal] ?? sealMap['golden_heart'];
          return (
            <ParchmentScroll
              isOpen={true}
              onClose={() => setSelectedLetter(null)}
              title={selectedLetter.title}
              sender={selectedLetter.sender === 'emman' ? 'Emman' : 'Lei'}
              recipient={selectedLetter.recipient === 'emman' ? 'Emman' : 'Lei'}
              date={new Date(selectedLetter.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              content={selectedLetter.content}
              sealLabel={seal.label}
              sealColor={seal.color}
            />
          );
        })()}
      </div>
    </RoomShell>
  );
}
