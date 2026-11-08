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
  Key,
  CheckCircle2,
  Users,
  Feather,
  Share2,
} from 'lucide-react';
import { PrivateJournalEntry } from '@/types/sanctuary';
import { RoomShell } from '@/components/sanctuary/RoomShell';
import { useSanctuaryRealtime } from '@/hooks/useSanctuaryRealtime';

interface SharedEntry {
  id: string;
  author: 'emman' | 'lei';
  title: string;
  content: string;
  moodTag?: string;
  createdAt: string;
}

export default function PrivateJournalPage() {
  const [activeTab, setActiveTab] = useState<'lei' | 'shared'>('lei');
  const [hasPin, setHasPin] = useState<boolean>(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Private journal entries
  const [entries, setEntries] = useState<PrivateJournalEntry[]>([]);
  // Shared journal entries
  const [sharedEntries, setSharedEntries] = useState<SharedEntry[]>([]);

  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState('Peaceful');
  const [sharedAuthor, setSharedAuthor] = useState<'emman' | 'lei'>('lei');

  const checkUnlockStatus = async (user: 'emman' | 'lei') => {
    try {
      const res = await fetch(`/api/auth/journal?user=${user}`);
      const data = await res.json();
      setHasPin(Boolean(data.hasPin));
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

  const fetchEntries = async (user: 'emman' | 'lei') => {
    try {
      const res = await fetch(`/api/journal?user=${user}`);
      const data = await res.json();
      if (data.entries) setEntries(data.entries);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSharedEntries = async () => {
    try {
      const res = await fetch('/api/journal?type=shared');
      const data = await res.json();
      if (data.entries) setSharedEntries(data.entries);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === 'shared') {
      fetchSharedEntries();
    } else {
      setPinInput('');
      setConfirmPinInput('');
      setErrorMsg(null);
      setSuccessMsg(null);
      checkUnlockStatus(activeTab);
    }
  }, [activeTab]);

  // Realtime updates for Shared Journal
  useSanctuaryRealtime({
    table: 'shared_journals',
    onChange: () => {
      if (activeTab === 'shared') fetchSharedEntries();
    },
  });

  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'shared') return;
    if (!pinInput.trim()) return;

    if (pinInput.trim().length < 4) {
      setErrorMsg('PIN must be at least 4 digits.');
      return;
    }

    if (pinInput.trim() !== confirmPinInput.trim()) {
      setErrorMsg('PINs do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: activeTab, pin: pinInput.trim(), action: 'setup' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setHasPin(true);
        setIsUnlocked(true);
        setPinInput('');
        setConfirmPinInput('');
        setSuccessMsg(`Your personal passkey has been sealed.`);
        fetchEntries(activeTab);
      } else {
        setErrorMsg(data.error || 'Failed to seal your passkey.');
      }
    } catch {
      setErrorMsg('Celestial connection disruption. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'shared') return;
    if (!pinInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: activeTab, pin: pinInput.trim(), action: 'verify' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocked(true);
        setPinInput('');
        fetchEntries(activeTab);
      } else {
        setErrorMsg(data.error || 'Invalid personal passkey.');
      }
    } catch {
      setErrorMsg('Verification failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleLockJournal = async () => {
    if (activeTab === 'shared') return;
    try {
      await fetch('/api/auth/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: activeTab, action: 'lock' }),
      });
      setIsUnlocked(false);
      setEntries([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      if (activeTab === 'shared') {
        const res = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'shared',
            user: sharedAuthor,
            title: newTitle.trim(),
            content: newContent.trim(),
            moodTag: newMood,
          }),
        });
        if (res.ok) {
          setIsAddOpen(false);
          setNewTitle('');
          setNewContent('');
          fetchSharedEntries();
        }
      } else {
        const res = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: activeTab,
            title: newTitle.trim(),
            content: newContent.trim(),
            moodTag: newMood,
          }),
        });
        if (res.ok) {
          setIsAddOpen(false);
          setNewTitle('');
          setNewContent('');
          fetchEntries(activeTab);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareToShared = async (entry: PrivateJournalEntry) => {
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'shared',
          user: activeTab,
          title: entry.title,
          content: entry.content,
          moodTag: entry.moodTag || 'Shared Memory',
        }),
      });
      if (res.ok) {
        alert('This reflection has been shared to Our Shared Chronicles!');
        fetchSharedEntries();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (activeTab === 'shared') return;
    if (!confirm('Are you sure you want to permanently erase this personal reflection?')) return;
    try {
      const res = await fetch(`/api/journal?id=${id}&user=${activeTab}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchEntries(activeTab);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <RoomShell>
      <div className="px-4 py-8 md:px-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
                Room 07 &bull; Private Journal
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-indigo-300">Personal &amp; Shared Archives</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-white">
              Lei&rsquo;s Sacred Reflections &amp; Shared Chronicles
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Your private journal is secured by your individual passkey. The Shared Journal is an open space for both of you to write together.
            </p>
          </div>

          {/* Tab Switcher: Lei / Shared */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('lei')}
              className={`px-3.5 py-2 rounded-xl text-xs font-serif tracking-wider transition-all cursor-pointer ${
                activeTab === 'lei'
                  ? 'bg-sanctuary-rose text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lei&rsquo;s Private
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shared')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif tracking-wider transition-all cursor-pointer ${
                activeTab === 'shared'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-indigo-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Shared Journal</span>
            </button>
          </div>
        </div>

        {/* SHARED JOURNAL VIEW */}
        {activeTab === 'shared' ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-900/30">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 className="text-lg font-serif text-white">Our Shared Chronicles</h2>
                  <p className="text-xs text-slate-400">Joint memories, mutual reflections &amp; travels</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-serif hover:bg-indigo-500 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Write Shared Entry</span>
              </button>
            </div>

            {sharedEntries.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <BookLock className="w-12 h-12 mx-auto mb-3 opacity-40 text-indigo-400" />
                <p className="font-serif text-sm">No shared entries yet. Write our first shared reflection together!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sharedEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-3xl celestial-panel border border-indigo-500/30 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-serif uppercase tracking-widest text-indigo-300 font-semibold">
                          Penned by {entry.author === 'emman' ? 'Emman' : 'Lei'}
                        </span>
                        {entry.moodTag && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-serif border border-indigo-500/40 bg-indigo-950/60 text-indigo-200">
                            {entry.moodTag}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white mb-2">{entry.title}</h3>
                      <p className="text-xs font-display text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                        {entry.content}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-800 text-[10px] text-slate-500 font-serif">
                      Written {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* PRIVATE JOURNAL VIEW (STRICT PIN ISOLATION) */
          <div>
            {!isUnlocked ? (
              <div className="max-w-md mx-auto my-8 p-8 rounded-3xl celestial-panel border border-indigo-500/30 text-center shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Lock className="w-7 h-7 text-indigo-300" />
                </div>

                <h2 className="text-xl font-serif text-white mb-1">
                  Lei&apos;s Private Chamber
                </h2>
                <p className="text-xs text-slate-400 mb-6">
                  {hasPin
                    ? 'Enter your private passkey to access your sacred pages.'
                    : 'Seal your private journal with a personal PIN to start writing.'}
                </p>

                {errorMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {hasPin ? (
                  <form onSubmit={handleUnlockJournal} className="space-y-4">
                    <input
                      type="password"
                      inputMode="numeric"
                      required
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Enter Your Personal Passkey"
                      className="w-full text-center tracking-[0.4em] text-lg font-serif py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-400"
                    />
                    <button
                      type="submit"
                      disabled={loading || !pinInput.trim()}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-serif text-xs font-semibold tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {loading ? 'Unlocking Vault...' : 'Unlock Sacred Pages'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSetupPin} className="space-y-4">
                    <input
                      type="password"
                      inputMode="numeric"
                      required
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Create 4+ Digit Personal Passkey"
                      className="w-full text-center tracking-[0.3em] text-sm py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-400"
                    />
                    <input
                      type="password"
                      inputMode="numeric"
                      required
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="Confirm Your Passkey"
                      className="w-full text-center tracking-[0.3em] text-sm py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-400"
                    />
                    <button
                      type="submit"
                      disabled={loading || !pinInput.trim()}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-serif text-xs font-semibold tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {loading ? 'Sealing...' : 'Seal Private Passkey'}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* UNLOCKED PRIVATE ENTRIES */
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-900/30">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h2 className="text-lg font-serif text-white">
                        Lei&rsquo;s Private Journal
                      </h2>
                      <p className="text-xs text-emerald-400/80">Vault Active &bull; Zero-Knowledge Isolation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-serif hover:bg-indigo-500 transition-all shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write Reflection</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLockJournal}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lock</span>
                    </button>
                  </div>
                </div>

                {entries.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <Feather className="w-12 h-12 mx-auto mb-3 opacity-40 text-indigo-400" />
                    <p className="font-serif text-sm">Your private pages are waiting for your first words.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {entries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-3xl celestial-panel border border-indigo-500/30 shadow-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-serif uppercase tracking-widest text-indigo-300 font-semibold">
                              Personal Entry
                            </span>
                            {entry.moodTag && (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-serif border border-indigo-500/40 bg-indigo-950/60 text-indigo-200">
                                {entry.moodTag}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-serif font-bold text-white mb-2">{entry.title}</h3>
                          <p className="text-xs font-display text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                            {entry.content}
                          </p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-serif">
                          <span>Penned {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleShareToShared(entry)}
                              className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 transition-colors p-1"
                              title="Share this reflection with Our Shared Chronicles"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Share</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Write Entry Modal (Works for Private or Shared) */}
        <AnimatePresence>
          {isAddOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl celestial-panel border border-indigo-500/40 shadow-2xl"
              >
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-serif text-white mb-1">
                  {activeTab === 'shared' ? 'Record Shared Memory' : 'Pen Private Reflection'}
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  {activeTab === 'shared'
                    ? 'This entry will be visible in Our Shared Chronicles for both of you.'
                    : 'This entry is visible ONLY to you in your private vault.'}
                </p>

                <form onSubmit={handleAddEntry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-serif text-indigo-300 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Title of this reflection"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-indigo-300 mb-1">Mood Tag</label>
                    <input
                      type="text"
                      value={newMood}
                      onChange={(e) => setNewMood(e.target.value)}
                      placeholder="e.g. Peaceful, Grateful, Nostalgic, Loving"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-indigo-300 mb-1">Reflection</label>
                    <textarea
                      required
                      rows={5}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Write freely from the heart..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-indigo-400 resize-none leading-relaxed"
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
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-serif text-xs font-semibold shadow-md cursor-pointer"
                    >
                      Preserve Entry
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </RoomShell>
  );
}
