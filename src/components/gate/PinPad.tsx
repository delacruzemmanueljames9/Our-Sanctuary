'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, KeyRound, Lock, AlertCircle, Heart } from 'lucide-react';

interface PinPadProps {
  onSuccess: () => void;
  onAttemptStart?: () => void;
  onAttemptFailed?: () => void;
  disabled?: boolean;
}

export function PinPad({ onSuccess, onAttemptStart, onAttemptFailed, disabled = false }: PinPadProps) {
  const [pin, setPin] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShake, setIsShake] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 6 || isVerifying || disabled) return;
    setErrorMsg(null);
    const newPin = pin + digit;
    setPin(newPin);

    // Auto-submit on 6th digit
    if (newPin.length === 6) {
      verifyPin(newPin);
    }
  };

  const handleClear = () => {
    if (isVerifying || disabled) return;
    setPin('');
    setErrorMsg(null);
  };

  const handleDelete = () => {
    if (isVerifying || disabled) return;
    setPin(prev => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const verifyPin = async (inputPin: string) => {
    setIsVerifying(true);
    if (onAttemptStart) onAttemptStart();

    try {
      const res = await fetch('/api/auth/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: inputPin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setErrorMsg(null);
        onSuccess();
      } else {
        setIsShake(true);
        setErrorMsg(data.error || 'The gate runes remain still. Try again.');
        if (onAttemptFailed) onAttemptFailed();
        setTimeout(() => setIsShake(false), 600);
        setPin('');
      }
    } catch {
      setIsShake(true);
      setErrorMsg('Celestial connection disruption. Please retry.');
      if (onAttemptFailed) onAttemptFailed();
      setTimeout(() => setIsShake(false), 600);
      setPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-3xl celestial-panel relative z-20 backdrop-blur-xl border border-sanctuary-gold/30 shadow-2xl">
      {/* Header Emblem */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sanctuary-navy/80 border border-sanctuary-gold/40 mb-3 shadow-celestial-sm">
          <Heart className="w-7 h-7 text-sanctuary-rose animate-pulse" />
        </div>
        <h2 className="text-xl font-serif tracking-widest text-sanctuary-gold-light uppercase">
          The Sanctuary Gate
        </h2>
        <p className="text-xs text-sanctuary-starlight/70 mt-1">
          Enter the six-digit harmony key to open the sanctuary
        </p>
      </div>

      {/* 6 Digit Rune Slots */}
      <motion.div
        animate={isShake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="flex justify-center gap-3 mb-6"
      >
        {Array.from({ length: 6 }).map((_, index) => {
          const isFilled = index < pin.length;
          return (
            <div
              key={index}
              className={`w-10 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                isFilled
                  ? 'border-sanctuary-gold bg-sanctuary-gold/15 shadow-celestial-sm text-sanctuary-gold'
                  : 'border-slate-700/60 bg-slate-900/40 text-slate-600'
              }`}
            >
              {isFilled ? (
                <Sparkles className="w-4 h-4 animate-spin-slow text-sanctuary-gold" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Error / Status Notice */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-2.5 mb-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keypad Grid (1-9, Clear, 0, Backspace) */}
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={isVerifying || disabled}
            onClick={() => handleDigit(digit)}
            className="h-12 rounded-xl bg-sanctuary-navy/70 border border-sanctuary-gold/20 hover:border-sanctuary-gold/60 hover:bg-sanctuary-navy text-sanctuary-starlight font-serif text-lg font-medium shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          disabled={isVerifying || disabled || pin.length === 0}
          onClick={handleClear}
          className="h-12 rounded-xl bg-slate-900/60 border border-slate-700/40 hover:border-red-500/40 hover:bg-red-950/20 text-slate-400 hover:text-red-300 text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 disabled:opacity-40"
        >
          Clear
        </button>

        {/* 0 Button */}
        <button
          type="button"
          disabled={isVerifying || disabled}
          onClick={() => handleDigit('0')}
          className="h-12 rounded-xl bg-sanctuary-navy/70 border border-sanctuary-gold/20 hover:border-sanctuary-gold/60 hover:bg-sanctuary-navy text-sanctuary-starlight font-serif text-lg font-medium shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          disabled={isVerifying || disabled || pin.length === 0}
          onClick={handleDelete}
          className="h-12 rounded-xl bg-slate-900/60 border border-slate-700/40 hover:border-sanctuary-gold/40 hover:bg-sanctuary-navy/40 text-slate-300 text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 disabled:opacity-40"
        >
          Delete
        </button>
      </div>

      {/* Verification Spinner */}
      {isVerifying && (
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-sanctuary-gold">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>The Angel Knight is reading your runes...</span>
        </div>
      )}

      {/* Discreet hint for initial development */}
      <div className="mt-4 text-center">
        <span className="text-[10px] text-slate-500 tracking-wider">
          SHARED CELESTIAL GATE
        </span>
      </div>
    </div>
  );
}
