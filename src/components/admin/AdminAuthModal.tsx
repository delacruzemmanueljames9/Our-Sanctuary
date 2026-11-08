'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, KeyRound, Sparkles, X, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminAuthModal({ isOpen, onClose }: AdminAuthModalProps) {
  const router = useRouter();
  const [secret, setSecret] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: secret.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onClose();
        router.push('/admin');
      } else {
        setErrorMsg(data.error || 'Access denied. Reserved strictly for Emman.');
      }
    } catch {
      setErrorMsg('Failed to verify admin authority.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md p-6 rounded-3xl celestial-panel border border-sanctuary-gold/40 shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/40 border border-sanctuary-gold/40 flex items-center justify-center shadow-celestial-sm">
            <ShieldAlert className="w-6 h-6 text-sanctuary-gold" />
          </div>
          <div>
            <h2 className="text-lg font-serif tracking-wider text-sanctuary-gold-light">
              Sanctuary Core Control
            </h2>
            <p className="text-xs text-slate-400">Emman Exclusive Super Administrator</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          This portal manages global sanctuary mechanics, themes, memory archives, and backup registries. Access is strictly bound to Emman&rsquo;s personal passkey.
        </p>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-serif tracking-wider text-sanctuary-gold-light mb-1.5 uppercase">
              Administrator Master Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter Super Admin Passphrase"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-sanctuary-gold text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !secret.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-semibold tracking-wider hover:bg-sanctuary-gold-light transition-all shadow-celestial-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Enter Control Center</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
