'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scroll,
  PenTool,
  Clock,
  Send,
  Heart,
  Sparkles,
  Inbox,
  SendHorizonal,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Letter } from '@/types/sanctuary';

export default function LetterRoomPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'compose'>('received');
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  // Compose form states
  const [author, setAuthor] = useState<'emman' | 'lei'>('emman');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [waxSeal, setWaxSeal] = useState<'golden_heart' | 'celestial_rose' | 'starlight' | 'angel_wing'>('golden_heart');
  const [scheduleDate, setScheduleDate] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

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

  const handleSendLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSending(true);
    try {
      const recipient = author === 'emman' ? 'lei' : 'emman';
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: author,
          recipient,
          title: title.trim(),
          content: content.trim(),
          waxSeal,
          scheduledFor: scheduleDate ? new Date(scheduleDate).toISOString() : null,
          isDraft: false,
        }),
      });

      if (res.ok) {
        setSentSuccess(true);
        setTitle('');
        setContent('');
        setScheduleDate('');
        fetchLetters();
        setTimeout(() => {
          setSentSuccess(false);
          setActiveTab('sent');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getWaxSealBadge = (seal: string) => {
    switch (seal) {
      case 'golden_heart':
        return { label: 'Golden Heart Seal', color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' };
      case 'celestial_rose':
        return { label: 'Celestial Rose Seal', color: 'text-rose-300 border-rose-500/40 bg-rose-950/40' };
      case 'starlight':
        return { label: 'Starlight Seal', color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' };
      default:
        return { label: 'Angel Wing Seal', color: 'text-slate-300 border-slate-500/40 bg-slate-900/60' };
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-8 md:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
              Room 03 &bull; Letter Room
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-rose-300">Sanctuary Writing Studio</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white">
            Letters Sealed in Starlight
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Where thoughts are penned with intention, sealed in wax, and kept safe for eternity.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-sanctuary-gold/30">
          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif tracking-wider transition-all ${
              activeTab === 'received'
                ? 'bg-sanctuary-gold text-slate-950 font-semibold shadow-celestial-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Letters Received</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif tracking-wider transition-all ${
              activeTab === 'compose'
                ? 'bg-sanctuary-gold text-slate-950 font-semibold shadow-celestial-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Write Letter</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif tracking-wider transition-all ${
              activeTab === 'sent'
                ? 'bg-sanctuary-gold text-slate-950 font-semibold shadow-celestial-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SendHorizonal className="w-3.5 h-3.5" />
            <span>Dispatched</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'compose' ? (
        /* Writing Studio / Parchment Composer */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-10 rounded-3xl parchment-panel shadow-2xl relative overflow-hidden"
        >
          {sentSuccess && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
              <h3 className="font-serif text-xl text-white">Your Letter Has Been Sealed</h3>
              <p className="text-xs text-slate-300 mt-1">
                Wax stamped and safely preserved in our sanctuary archives.
              </p>
            </div>
          )}

          <form onSubmit={handleSendLetter} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-900/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-serif uppercase tracking-wider text-amber-950">
                  Writing As:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthor('emman')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-all ${
                      author === 'emman'
                        ? 'bg-amber-900 text-amber-100 font-semibold shadow-sm'
                        : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    Emman (To Lei)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthor('lei')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-all ${
                      author === 'lei'
                        ? 'bg-rose-900 text-rose-100 font-semibold shadow-sm'
                        : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    Lei (To Emman)
                  </button>
                </div>
              </div>

              {/* Wax Seal Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif uppercase tracking-wider text-amber-950">
                  Wax Seal:
                </span>
                <select
                  value={waxSeal}
                  onChange={(e: any) => setWaxSeal(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-amber-100/90 border border-amber-900/30 text-xs font-serif text-amber-950 outline-none"
                >
                  <option value="golden_heart">Golden Heart Seal</option>
                  <option value="celestial_rose">Celestial Rose Seal</option>
                  <option value="starlight">Starlight Seal</option>
                  <option value="angel_wing">Angel Wing Seal</option>
                </select>
              </div>
            </div>

            <div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of this letter (e.g. For Quiet Evenings When You Miss Me)"
                className="w-full text-xl md:text-2xl font-serif text-amber-950 placeholder-amber-800/40 bg-transparent border-b border-amber-900/20 pb-2 outline-none focus:border-amber-900"
              />
            </div>

            <div>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write from the heart... What are you grateful for today? What do you wish for our future?"
                className="w-full text-sm md:text-base font-display text-amber-950 placeholder-amber-800/40 bg-transparent outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-amber-900/20">
              <div className="flex items-center gap-2 text-xs text-amber-950">
                <Clock className="w-4 h-4 text-amber-800" />
                <span>Time Capsule Date (Optional):</span>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-amber-100/80 border border-amber-900/30 text-xs text-amber-950 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending || !title.trim() || !content.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-950 text-amber-100 font-serif text-xs font-semibold tracking-wider hover:bg-black transition-all shadow-md disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Sealing Letter...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Seal & Dispatch Letter</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* Letters List / Archives */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {letters.map((letter) => {
            const sealBadge = getWaxSealBadge(letter.waxSeal);
            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedLetter(letter)}
                className="p-6 rounded-3xl parchment-panel cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-amber-900">
                      From {letter.sender === 'emman' ? 'Emman' : 'Lei'} &bull; To {letter.recipient === 'emman' ? 'Emman' : 'Lei'}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-serif border ${sealBadge.color}`}>
                      {sealBadge.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-semibold text-amber-950 mb-2 group-hover:text-amber-800 transition-colors">
                    {letter.title}
                  </h3>

                  <p className="text-xs font-display text-amber-900/80 leading-relaxed italic line-clamp-4 mb-4">
                    &ldquo;{letter.content}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-900/15 flex items-center justify-between text-[11px] text-amber-800/70 font-serif">
                  <span>
                    Written on {new Date(letter.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="underline group-hover:text-amber-950 transition-colors">Read Full Letter &rarr;</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Letter Reading Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl max-h-[85vh] p-8 md:p-12 rounded-3xl parchment-panel shadow-2xl flex flex-col overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-amber-900/10 text-amber-950 hover:bg-amber-900/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 pb-4 border-b border-amber-900/20">
                <span className="text-[11px] font-serif uppercase tracking-widest text-amber-900 block mb-1">
                  Letter from {selectedLetter.sender === 'emman' ? 'Emman' : 'Lei'} to {selectedLetter.recipient === 'emman' ? 'Emman' : 'Lei'}
                </span>
                <h2 className="text-2xl font-serif text-amber-950 font-bold">
                  {selectedLetter.title}
                </h2>
                <span className="text-xs text-amber-800/80 font-serif mt-1 block">
                  Penned on {new Date(selectedLetter.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex-1 text-sm md:text-base font-display text-amber-950 leading-relaxed whitespace-pre-wrap italic">
                {selectedLetter.content}
              </div>

              <div className="mt-8 pt-6 border-t border-amber-900/20 flex items-center justify-between text-xs text-amber-900 font-serif">
                <span>Sanctuary Seal of Harmony</span>
                <span className="font-semibold uppercase tracking-wider text-amber-950">Eternal Bond</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
