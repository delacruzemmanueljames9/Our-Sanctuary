'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type CatMood = 'idle' | 'thinking' | 'speaking' | 'happy';

interface MochiCatAvatarProps {
  mood?: CatMood;
  size?: number;
  className?: string;
}

export function MochiCatAvatar({ mood = 'idle', size = 80, className = '' }: MochiCatAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Celestial Aura Ring */}
      <motion.div
        animate={{
          scale: mood === 'thinking' ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: mood === 'speaking' ? [0.6, 0.9, 0.6] : [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/25 via-sanctuary-gold/20 to-pink-500/20 blur-md pointer-events-none"
      />

      {/* SVG Cat Avatar */}
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <radialGradient id="catBodyGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f7f3ea" />
            <stop offset="100%" stopColor="#ecdcb9" />
          </radialGradient>
          <linearGradient id="goldTip" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5e6a3" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
          <radialGradient id="eyeGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0e7490" />
          </radialGradient>
          <linearGradient id="innerEar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>

        {/* SWAYING TAIL */}
        <motion.path
          d="M 35,90 Q 15,85 10,70 Q 5,55 18,52 Q 22,58 20,68 Q 23,80 38,85 Z"
          fill="url(#catBodyGrad)"
          stroke="#d4af37"
          strokeWidth="0.8"
          animate={
            mood === 'thinking'
              ? { rotate: [-10, 15, -10], originX: '35px', originY: '90px' }
              : mood === 'happy'
              ? { rotate: [-15, 20, -15], originX: '35px', originY: '90px' }
              : { rotate: [-4, 6, -4], originX: '35px', originY: '90px' }
          }
          transition={{ duration: mood === 'happy' ? 0.6 : 2.0, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* BODY */}
        <motion.ellipse
          cx="60"
          cy="85"
          rx="32"
          ry="25"
          fill="url(#catBodyGrad)"
          stroke="#d4af37"
          strokeWidth="0.8"
          animate={{ ry: [25, 26, 25] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* FRONT PAWS */}
        <ellipse cx="48" cy="98" rx="8" ry="6" fill="#ffffff" stroke="#ecdcb9" strokeWidth="0.8" />
        <ellipse cx="72" cy="98" rx="8" ry="6" fill="#ffffff" stroke="#ecdcb9" strokeWidth="0.8" />

        {/* LEFT EAR */}
        <motion.polygon
          points="32,45 20,18 48,32"
          fill="url(#catBodyGrad)"
          stroke="#d4af37"
          strokeWidth="0.8"
          animate={mood === 'thinking' ? { rotate: [-3, 4, -3], originX: '35px', originY: '40px' } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <polygon points="32,40 25,23 44,32" fill="url(#innerEar)" opacity="0.75" />
        <polygon points="20,18 26,20 22,26" fill="url(#goldTip)" />

        {/* RIGHT EAR */}
        <motion.polygon
          points="88,45 100,18 72,32"
          fill="url(#catBodyGrad)"
          stroke="#d4af37"
          strokeWidth="0.8"
          animate={mood === 'thinking' ? { rotate: [3, -4, 3], originX: '85px', originY: '40px' } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <polygon points="88,40 95,23 76,32" fill="url(#innerEar)" opacity="0.75" />
        <polygon points="100,18 94,20 98,26" fill="url(#goldTip)" />

        {/* HEAD */}
        <motion.ellipse
          cx="60"
          cy="52"
          rx="33"
          ry="28"
          fill="url(#catBodyGrad)"
          stroke="#d4af37"
          strokeWidth="0.8"
          animate={
            mood === 'speaking'
              ? { cy: [52, 50, 52] }
              : mood === 'thinking'
              ? { rotate: [-2, 2, -2], originX: '60px', originY: '52px' }
              : {}
          }
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* CELESTIAL FOREHEAD STAR EMBLEM */}
        <path
          d="M 60,32 L 61.5,36 L 66,37.5 L 61.5,39 L 60,43 L 58.5,39 L 54,37.5 L 58.5,36 Z"
          fill="#d4af37"
        />

        {/* EYES */}
        {mood === 'happy' ? (
          // Joyful smiling eyes ^ ^
          <>
            <path d="M 40,54 Q 48,46 54,54" fill="none" stroke="#0e7490" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 66,54 Q 72,46 80,54" fill="none" stroke="#0e7490" strokeWidth="2.8" strokeLinecap="round" />
          </>
        ) : isBlinking ? (
          // Closed eyelid line
          <>
            <path d="M 40,52 Q 47,56 54,52" fill="none" stroke="#0e7490" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 66,52 Q 73,56 80,52" fill="none" stroke="#0e7490" strokeWidth="2.2" strokeLinecap="round" />
          </>
        ) : (
          // Open expressive celestial eyes
          <>
            {/* Left Eye */}
            <ellipse cx="47" cy="52" rx="7" ry="8.5" fill="url(#eyeGrad)" />
            <ellipse cx="46" cy="49" rx="2.5" ry="3.5" fill="#ffffff" />
            <circle cx="50" cy="54" r="1.2" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="73" cy="52" rx="7" ry="8.5" fill="url(#eyeGrad)" />
            <ellipse cx="72" cy="49" rx="2.5" ry="3.5" fill="#ffffff" />
            <circle cx="76" cy="54" r="1.2" fill="#ffffff" />
          </>
        )}

        {/* ROSY BLUSH CHEEKS */}
        <ellipse cx="36" cy="60" rx="4.5" ry="2.5" fill="#f472b6" opacity="0.45" />
        <ellipse cx="84" cy="60" rx="4.5" ry="2.5" fill="#f472b6" opacity="0.45" />

        {/* NOSE */}
        <polygon points="58,59 62,59 60,62" fill="#f472b6" />

        {/* MOUTH */}
        {mood === 'speaking' ? (
          <motion.ellipse
            cx="60"
            cy="65"
            rx="3.5"
            ry="4"
            fill="#e11d48"
            animate={{ ry: [2, 4.5, 2] }}
            transition={{ duration: 0.35, repeat: Infinity }}
          />
        ) : (
          <path
            d="M 56,62 Q 60,65 60,63 Q 60,65 64,62"
            fill="none"
            stroke="#b45309"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        )}

        {/* WHISKERS */}
        {/* Left Whiskers */}
        <line x1="32" y1="58" x2="16" y2="55" stroke="#d4af37" strokeWidth="0.8" opacity="0.75" />
        <line x1="32" y1="62" x2="14" y2="63" stroke="#d4af37" strokeWidth="0.8" opacity="0.75" />
        {/* Right Whiskers */}
        <line x1="88" y1="58" x2="104" y2="55" stroke="#d4af37" strokeWidth="0.8" opacity="0.75" />
        <line x1="88" y1="62" x2="106" y2="63" stroke="#d4af37" strokeWidth="0.8" opacity="0.75" />
      </svg>
    </div>
  );
}
