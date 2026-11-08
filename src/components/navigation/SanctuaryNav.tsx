'use client';

import React from 'react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Image as ImageIcon,
  Scroll,
  Flower2,
  HeartHandshake,
  Compass,
  BookLock,
  Gamepad2,
  Calendar,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const SANCTUARY_ROOMS = [
  { key: 'home', title: 'Our Home', path: '/sanctuary', icon: Home, color: 'text-amber-400' },
  { key: 'gallery', title: 'Memory Gallery', path: '/sanctuary/gallery', icon: ImageIcon, color: 'text-sky-400' },
  { key: 'letters', title: 'Letter Room', path: '/sanctuary/letters', icon: Scroll, color: 'text-rose-300' },
  { key: 'garden', title: 'Our Garden', path: '/sanctuary/garden', icon: Flower2, color: 'text-emerald-400' },
  { key: 'emotional', title: 'Emotional Space', path: '/sanctuary/emotional', icon: HeartHandshake, color: 'text-pink-400' },
  { key: 'universe', title: 'Our Universe', path: '/sanctuary/universe', icon: Compass, color: 'text-cyan-300' },
  { key: 'journal', title: 'Private Journal', path: '/sanctuary/journal', icon: BookLock, color: 'text-indigo-300' },
  { key: 'arcade', title: 'Little Arcade', path: '/sanctuary/arcade', icon: Gamepad2, color: 'text-orange-400' },
  { key: 'calendar', title: 'Calendar', path: '/sanctuary/calendar', icon: Calendar, color: 'text-purple-300' },
];

interface SanctuaryNavProps {
  onOpenMochi?: () => void;
  onOpenAdminAuth?: () => void;
}

export function SanctuaryNav({ onOpenMochi, onOpenAdminAuth }: SanctuaryNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-full px-4">
      <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-950/85 border border-sanctuary-gold/30 backdrop-blur-xl shadow-2xl">
        {SANCTUARY_ROOMS.map((room) => {
          const isActive = pathname === room.path;
          const Icon = room.icon;

          return (
            <button
              key={room.key}
              type="button"
              onClick={() => router.push(room.path)}
              className={`relative px-3 py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all duration-200 group ${
                isActive
                  ? 'bg-sanctuary-gold/15 text-sanctuary-gold-light shadow-celestial-sm border border-sanctuary-gold/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-sanctuary-gold' : room.color}`} />
              <span className="text-[10px] font-serif tracking-wider whitespace-nowrap hidden md:inline-block">
                {room.title}
              </span>

              {/* Active Golden Glow Underline */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-sanctuary-gold shadow-celestial-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="w-[1px] h-7 bg-slate-800 mx-1" />

        {/* Mochi AI Companion Trigger */}
        <button
          type="button"
          onClick={onOpenMochi}
          className="relative px-3 py-2.5 rounded-xl flex flex-col items-center gap-1 text-sanctuary-ether hover:bg-sanctuary-ether/10 border border-sanctuary-ether/30 transition-all group"
          title="Speak with Mochi"
        >
          <Sparkles className="w-4 h-4 text-sanctuary-ether group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-serif tracking-wider text-sanctuary-ether hidden md:inline-block">
            Mochi
          </span>
        </button>

        {/* Discreet Super Admin Button (Emman Only) */}
        <button
          type="button"
          onClick={onOpenAdminAuth}
          className="p-2 rounded-xl text-slate-500 hover:text-sanctuary-gold hover:bg-slate-900/70 transition-colors"
          title="Admin Control Center (Emman Only)"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
