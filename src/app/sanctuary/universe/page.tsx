'use client';

import { RoomShell } from '@/components/sanctuary/RoomShell';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  X,
  Star,
  MapPin,
  Trophy,
} from 'lucide-react';
import { UniverseDream } from '@/types/sanctuary';
import { useSanctuaryRealtime } from '@/hooks/useSanctuaryRealtime';

export default function OurUniversePage() {
  const [dreams, setDreams] = useState<UniverseDream[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'bucket_list' | 'milestone' | 'future_trip' | 'date_idea'>('bucket_list');
  const [targetDate, setTargetDate] = useState('');
  const [createdBy, setCreatedBy] = useState<'emman' | 'lei'>('emman');
  const [loading, setLoading] = useState(false);

  const fetchDreams = async () => {
    try {
      const res = await fetch('/api/universe');
      const data = await res.json();
      if (data.dreams) setDreams(data.dreams);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  useSanctuaryRealtime({
    table: 'universe_dreams',
    onChange: () => {
      fetchDreams();
    },
  });

  const handleToggleCompleted = async (id: string) => {
    try {
      const res = await fetch('/api/universe', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchDreams();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/universe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: desc.trim(),
          category,
          targetDate: targetDate || undefined,
          createdBy,
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setTitle('');
        setDesc('');
        setTargetDate('');
        fetchDreams();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDreams = dreams.filter((d) => {
    if (activeCategory === 'all') return true;
    return d.category === activeCategory;
  });

  const completedCount = dreams.filter((d) => d.completed).length;

  return (
    <RoomShell><div className="px-4 py-8 md:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
              Room 06 &bull; Our Universe
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-cyan-300">Celestial Starmap & Dreams</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white">
            The Constellation of Our Shared Dreams
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Every star in this observatory represents a goal, an upcoming voyage, or a dream we will manifest together.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-serif text-xs font-semibold tracking-wider hover:bg-cyan-400 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Ignite New Star</span>
        </button>
      </div>

      {/* Progress & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-4 rounded-3xl celestial-panel border border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <span className="text-xs font-serif text-white block">
              {completedCount} of {dreams.length} Stars Manifested
            </span>
            <div className="w-48 h-2 rounded-full bg-slate-800 mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-sanctuary-gold transition-all duration-500"
                style={{ width: `${dreams.length > 0 ? (completedCount / dreams.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: 'all', label: 'All Constellations' },
            { key: 'bucket_list', label: 'Bucket List' },
            { key: 'future_trip', label: 'Voyages & Trips' },
            { key: 'date_idea', label: 'Date Adventures' },
            { key: 'milestone', label: 'Milestones' },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dreams Constellation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDreams.map((dream) => (
          <motion.div
            key={dream.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-3xl celestial-panel border transition-all flex flex-col justify-between ${
              dream.completed
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : 'border-cyan-500/30 hover:border-cyan-500/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                  {dream.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-serif">
                  By {dream.createdBy === 'lei' ? 'Lei' : 'Emman'}
                </span>
              </div>

              <div className="flex items-start gap-3 my-2">
                <button
                  type="button"
                  onClick={() => handleToggleCompleted(dream.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {dream.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                <div>
                  <h3
                    className={`font-serif text-base font-medium ${
                      dream.completed ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {dream.title}
                  </h3>
                  {dream.description && (
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed italic">
                      &ldquo;{dream.description}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              {dream.targetDate ? (
                <span className="flex items-center gap-1 text-cyan-300">
                  <Calendar className="w-3.5 h-3.5" />
                  Target: {dream.targetDate}
                </span>
              ) : (
                <span>Eternal Star</span>
              )}
              {dream.completed && (
                <span className="text-emerald-400 font-serif font-medium">Achieved Together ✨</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Dream Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md p-6 rounded-3xl celestial-panel border border-cyan-500/40 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
                  <Star className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white">Ignite a Shared Star</h3>
                  <p className="text-xs text-slate-400">Place a new goal into our universe</p>
                </div>
              </div>

              <form onSubmit={handleAddDream} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif text-cyan-300 mb-1">
                    Dream Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Watch the sunrise from a hot air balloon"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-cyan-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option value="bucket_list">Bucket List Milestone</option>
                    <option value="future_trip">Future Voyage / Trip</option>
                    <option value="date_idea">Special Date Adventure</option>
                    <option value="milestone">Life Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif text-cyan-300 mb-1">
                    Target Date / Year (Optional)
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-cyan-300 mb-1">
                    Description & Details
                  </label>
                  <textarea
                    rows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Describe how we will experience this together..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCreatedBy('emman')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-serif ${
                        createdBy === 'emman'
                          ? 'bg-sanctuary-gold text-slate-950 font-semibold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Emman
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreatedBy('lei')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-serif ${
                        createdBy === 'lei'
                          ? 'bg-sanctuary-rose text-slate-950 font-semibold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Lei
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !title.trim()}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-serif text-xs font-semibold hover:bg-cyan-400 transition-all"
                    >
                      {loading ? 'Igniting...' : 'Ignite Star'}
                    </button>
                  </div>
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
