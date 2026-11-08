'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookLock,
  Lock,
  Unlock,
  KeyRound,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { PrivateJournalEntry } from '@/types/sanctuary';

export default function PrivateJournalPage() {
  const [currentUser, setCurrentUser] = useState<'emman' | 'lei'>('emman');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [entries, setEntries] = useState<PrivateJournalEntry[]>([]);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState('Peaceful');

  const checkUnlockStatus = async (user: 'emman' | 'lei') => {
    try {
      const res = await fetch(`/api/auth/journal?user=${user}`);
      const data = await res.json();
      if (data.unlocked) {
        setIsUnlocked(true);
        fetchEntries(user);
      } else {
        setIsUnlocked(false);
        setEntries([]);
      }
    } catch {
      setIsUnlocked(false);
    }
  };

  useEffect(() => {
    checkUnlockStatus(currentUser);
  }, [currentUser]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, pin: pinInput.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocked(true);
        setPinInput('');
        fetchEntries(currentUser);
      } else {
        setErrorMsg(data.error || 'Incorrect personal passkey.');
      }
    } catch {
      setErrorMsg('Failed to unlock journal.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async (user: 'emman' | 'lei') => {
    try {
      const res = await fetch(`/api/journal?user=${user}`);
      const data = await res.json();
      if (data.entries) setEntries(data.entries);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: currentUser,
          title: newTitle.trim(),
          content: newContent.trim(),
          moodTag: newMood,
        }),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setNewTitle('');
        setNewContent('');
        fetchEntries(currentUser);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to permanently erase this personal reflection?')) return;
    try {
      const res = await fetch(`/api/journal?id=${id}&user=${currentUser}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchEntries(currentUser);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-8 md:px-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
              Room 07 &bull; Private Journal
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-indigo-300">Strict Personal Isolation</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white">
            Sacred Personal Archives
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Each person has their own isolated lock. Neither the gate key nor admin powers can peer into another&rsquo;s sacred pages.
          </p>
        </div>

        {/* Profile Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setCurrentUser('emman');
              setErrorMsg(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-serif tracking-wider transition-all ${
              currentUser === 'emman'
                ? 'bg-sanctuary-gold text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Emman&rsquo;s Journal
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentUser('lei');
              setErrorMsg(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-serif tracking-wider transition-all ${
              currentUser === 'lei'
                ? 'bg-sanctuary-rose text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lei&rsquo;s Journal
          </button>
        </div>
      </div>

      {!isUnlocked ? (
        /* Locked Vault Interface */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto p-8 rounded-3xl celestial-panel border border-indigo-500/30 text-center shadow-2xl mt-8"
        >
          <div className="w-16 h-16 rounded-3xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <BookLock className="w-8 h-8 text-indigo-300 animate-pulse" />
          </div>

          <h2 className="text-lg font-serif text-white mb-1">
            {currentUser === 'emman' ? 'Emman’s' : 'Lei’s'} Sealed Journal
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Please enter your private passkey to unseal your journal. This key is never shared or transmitted in client bundles.
          </p>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter personal PIN"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 focus:border-indigo-400 text-sm text-center text-white placeholder-slate-500 tracking-widest outline-none"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={loading || !pinInput.trim()}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-serif text-xs font-semibold tracking-wider transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{loading ? 'Unsealing...' : 'Unseal My Journal'}</span>
            </button>
          </form>

          <div className="mt-4 text-[10px] text-slate-500 tracking-wider">
            ZERO-KNOWLEDGE PERSONAL ISOLATION ACTIVE
          </div>
        </motion.div>
      ) : (
        /* Unlocked Journal Pages */
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Personal vault open for {currentUser === 'emman' ? 'Emman' : 'Lei'}.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-slate-950 font-serif text-xs font-semibold hover:bg-indigo-400 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Write Reflection</span>
            </button>
          </div>

          {/* Entries list */}
          <div className="space-y-4">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl celestial-panel border border-slate-800 shadow-md relative group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-indigo-300 font-serif">
                      {entry.moodTag || 'Reflection'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sanctuary-gold" />
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-serif text-white font-medium mb-2">
                  {entry.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                  {entry.content}
                </p>
              </motion.div>
            ))}

            {entries.length === 0 && (
              <div className="p-12 text-center rounded-3xl celestial-panel border border-slate-800 text-slate-400 text-xs">
                No entries penned yet. Click &ldquo;Write Reflection&rdquo; to begin your sacred journal.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Journal Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg p-6 rounded-3xl celestial-panel border border-indigo-500/40 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center">
                  <BookLock className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white">Write Private Reflection</h3>
                  <p className="text-xs text-slate-400">Strictly visible to you alone</p>
                </div>
              </div>

              <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif text-indigo-300 mb-1">
                    Entry Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Thoughts on our quiet morning together"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-indigo-300 mb-1">
                    Mood / Tag
                  </label>
                  <input
                    type="text"
                    value={newMood}
                    onChange={(e) => setNewMood(e.target.value)}
                    placeholder="e.g. Peaceful, Grateful, Deep in Thought"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-indigo-300 mb-1">
                    Journal Content
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write freely. Your private thoughts are safeguarded here..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-500 text-slate-950 font-serif text-xs font-semibold hover:bg-indigo-400 transition-all"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
