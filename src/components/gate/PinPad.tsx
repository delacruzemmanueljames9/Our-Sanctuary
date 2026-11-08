'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, Heart } from 'lucide-react';

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
    setPin((prev) => prev.slice(0, -1));
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
    <div className="w-full p-5 sm:p-6 rounded-3xl bg-slate-950/35 backdrop-blur-md border border-sanctuary-gold/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-slate-900/50 border border-sanctuary-gold/40 mb-2 shadow-sm">
          <Heart className="w-5 h-5 text-sanctuary-rose animate-pulse" />
        </div>
        <h2 className="text-base sm:text-lg font-serif tracking-widest text-sanctuary-gold-light uppercase font-medium">
          The Sanctuary Gate
        </h2>
        <p className="text-[11px] text-sanctuary-starlight/75 mt-0.5 tracking-wide">
          Enter the six-digit harmony key
        </p>
      </div>

      {/* 6 Digit Rune Slots */}
      <motion.div
        animate={isShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="flex justify-center gap-2 mb-4"
      >
        {Array.from({ length: 6 }).map((_, index) => {
          const isFilled = index < pin.length;
          return (
            <div
              key={index}
              className={`w-9 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 backdrop-blur-sm ${
                isFilled
                  ? 'border-sanctuary-gold bg-sanctuary-gold/20 shadow-celestial-sm text-sanctuary-gold scale-105'
                  : 'border-slate-700/50 bg-slate-900/30 text-slate-600'
              }`}
            >
              {isFilled ? (
                <Sparkles className="w-4 h-4 animate-spin-slow text-sanctuary-gold" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
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
            className="flex items-center gap-2 p-2 mb-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs backdrop-blur-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="leading-tight">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keypad Grid (1-9, Clear, 0, Backspace) */}
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={isVerifying || disabled}
            onClick={() => handleDigit(digit)}
            className="h-11 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-sanctuary-gold/25 hover:border-sanctuary-gold/70 hover:bg-sanctuary-gold/15 text-sanctuary-starlight font-serif text-base font-medium shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          disabled={isVerifying || disabled || pin.length === 0}
          onClick={handleClear}
          className="h-11 rounded-xl bg-slate-950/40 backdrop-blur-sm border border-slate-700/40 hover:border-red-500/40 hover:bg-red-950/20 text-slate-400 hover:text-red-300 text-[10px] uppercase tracking-wider transition-all duration-150 active:scale-95 disabled:opacity-40 cursor-pointer"
        >
          Clear
        </button>

        {/* 0 Button */}
        <button
          type="button"
          disabled={isVerifying || disabled}
          onClick={() => handleDigit('0')}
          className="h-11 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-sanctuary-gold/25 hover:border-sanctuary-gold/70 hover:bg-sanctuary-gold/15 text-sanctuary-starlight font-serif text-base font-medium shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          disabled={isVerifying || disabled || pin.length === 0}
          onClick={handleDelete}
          className="h-11 rounded-xl bg-slate-950/40 backdrop-blur-sm border border-slate-700/40 hover:border-sanctuary-gold/40 hover:bg-sanctuary-gold/10 text-slate-300 text-[10px] uppercase tracking-wider transition-all duration-150 active:scale-95 disabled:opacity-40 cursor-pointer"
        >
          Delete
        </button>
      </div>

      {isVerifying && (
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-sanctuary-gold">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Verifying runes...</span>
        </div>
      )}
    </div>
  );
}
