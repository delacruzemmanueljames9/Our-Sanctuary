'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartHandshake,
  Heart,
  MessageCircle,
  Sparkles,
  Calendar,
  Smile,
  Shield,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { EmotionalCheckin } from '@/types/sanctuary';

const MOODS = [
  { key: 'peaceful', label: 'Peaceful & Content', emoji: '✨', color: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-200' },
  { key: 'joyful', label: 'Joyful & Energized', emoji: '🌟', color: 'border-amber-500/50 bg-amber-950/40 text-amber-200' },
  { key: 'tired', label: 'Tired & Need Rest', emoji: '🌙', color: 'border-slate-500/50 bg-slate-900/60 text-slate-300' },
  { key: 'longing', label: 'Missing You / Longing', emoji: '🕊️', color: 'border-rose-500/50 bg-rose-950/40 text-rose-200' },
  { key: 'overwhelmed', label: 'Overwhelmed / Busy', emoji: '🍃', color: 'border-purple-500/50 bg-purple-950/40 text-purple-200' },
  { key: 'thoughtful', label: 'Thoughtful & Reflective', emoji: '🕯️', color: 'border-blue-500/50 bg-blue-950/40 text-blue-200' },
];

const SUPPORT_PREFERENCES = [
  { key: 'listen', label: 'Just listen without trying to fix anything' },
  { key: 'comfort', label: 'Give me a warm hug and hold my hand' },
  { key: 'give_space', label: 'Give me a quiet moment to recharge' },
  { key: 'talk_together', label: 'Let’s talk through it gently together' },
  { key: 'sweet_treat', label: 'Surprise me with a cozy snack or warm drink' },
];

export default function EmotionalSpacePage() {
  const [checkins, setCheckins] = useState<EmotionalCheckin[]>([]);
  const [author, setAuthor] = useState<'emman' | 'lei'>('emman');
  const [selectedMood, setSelectedMood] = useState<string>('peaceful');
  const [selectedSupport, setSelectedSupport] = useState<string>('listen');
  const [reflection, setReflection] = useState<string>('');
  const [isShared, setIsShared] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCheckins = async () => {
    try {
      const res = await fetch('/api/emotional');
      const data = await res.json();
      if (data.checkins) setCheckins(data.checkins);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCheckins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/emotional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author,
          mood: selectedMood,
          supportPreference: selectedSupport,
          reflection: reflection.trim(),
          isShared,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setReflection('');
        fetchCheckins();
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-8 md:px-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
            Room 05 &bull; Emotional Space
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-rose-300">Safe Emotional Harbor</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif text-white">
          A Gentle Haven for the Heart
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Check in with your feelings whenever you wish. No expectations, no pressure—only understanding and care.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Check-in Form */}
        <div className="lg:col-span-7">
          <div className="p-6 md:p-8 rounded-3xl celestial-panel border border-sanctuary-gold/30 shadow-xl relative">
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Your reflection has been recorded with love and care.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Check-in As */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-serif text-sanctuary-gold-light uppercase tracking-wider">
                  Checking In As:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthor('emman')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-all ${
                      author === 'emman'
                        ? 'bg-sanctuary-gold text-slate-950 font-semibold shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Emman
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthor('lei')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-all ${
                      author === 'lei'
                        ? 'bg-sanctuary-rose text-slate-950 font-semibold shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Lei
                  </button>
                </div>
              </div>

              {/* Mood Selection */}
              <div>
                <label className="block text-xs font-serif text-sanctuary-gold-light mb-2 uppercase tracking-wider">
                  How does your heart feel right now?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {MOODS.map((m) => {
                    const isSelected = selectedMood === m.key;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setSelectedMood(m.key)}
                        className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                          isSelected
                            ? 'border-sanctuary-gold bg-sanctuary-gold/15 shadow-celestial-sm text-white'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-lg">{m.emoji}</span>
                        <span className="text-xs font-serif font-medium">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Support Preference */}
              <div>
                <label className="block text-xs font-serif text-sanctuary-gold-light mb-2 uppercase tracking-wider">
                  What would feel best from your partner today?
                </label>
                <div className="space-y-2">
                  {SUPPORT_PREFERENCES.map((pref) => {
                    const isSelected = selectedSupport === pref.key;
                    return (
                      <button
                        key={pref.key}
                        type="button"
                        onClick={() => setSelectedSupport(pref.key)}
                        className={`w-full p-2.5 px-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-sanctuary-gold bg-sanctuary-gold/15 text-sanctuary-gold-light shadow-sm'
                            : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span>{pref.label}</span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-sanctuary-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reflection text */}
              <div>
                <label className="block text-xs font-serif text-sanctuary-gold-light mb-2 uppercase tracking-wider">
                  Personal Reflection (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Anything on your mind you want to share or release into the stars..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-sanctuary-gold resize-none"
                />
              </div>

              {/* Privacy and Submit */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={isShared}
                    onChange={(e) => setIsShared(e.target.checked)}
                    className="rounded border-slate-700 text-sanctuary-gold focus:ring-0"
                  />
                  <span>Share check-in on our sanctuary timeline</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-2xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-semibold tracking-wider hover:bg-sanctuary-gold-light transition-all shadow-celestial-sm disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Record Check-in'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Shared Reflections Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-sanctuary-rose" />
            <h3 className="font-serif text-sm text-sanctuary-gold-light uppercase tracking-wider">
              Recent Shared Reflections
            </h3>
          </div>

          <div className="space-y-3">
            {checkins.map((chk) => (
              <motion.div
                key={chk.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl celestial-panel border border-slate-800/80 shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-serif font-semibold text-white">
                    {chk.author === 'lei' ? 'Lei’s Reflection' : 'Emman’s Reflection'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(chk.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-amber-200">
                    Mood: {chk.mood}
                  </span>
                  {chk.supportPreference && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-rose-200">
                      Need: {chk.supportPreference}
                    </span>
                  )}
                </div>

                {chk.reflection && (
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{chk.reflection}&rdquo;
                  </p>
                )}
              </motion.div>
            ))}

            {checkins.length === 0 && (
              <div className="p-8 text-center rounded-2xl celestial-panel border border-slate-800 text-slate-400 text-xs">
                No check-ins recorded yet. Be the first to share today!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
