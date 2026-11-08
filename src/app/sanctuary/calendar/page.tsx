'use client';

import { RoomShell } from '@/components/sanctuary/RoomShell';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Heart,
  Sparkles,
  MapPin,
  X,
  Cake,
  PartyPopper,
} from 'lucide-react';
import { CalendarEvent } from '@/types/sanctuary';

export default function SanctuaryCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [category, setCategory] = useState<'anniversary' | 'date_night' | 'special_trip' | 'milestone'>('date_night');
  const [isRecurring, setIsRecurring] = useState(false);
  const [createdBy, setCreatedBy] = useState<'emman' | 'lei'>('emman');
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;

    setLoading(true);
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: desc.trim(),
          eventDate: new Date(eventDate).toISOString(),
          category,
          isRecurringAnnually: isRecurring,
          createdBy,
        }),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setTitle('');
        setDesc('');
        setEventDate('');
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'anniversary':
        return { label: 'Anniversary', icon: Heart, color: 'text-rose-300 border-rose-500/40 bg-rose-950/40' };
      case 'date_night':
        return { label: 'Date Night', icon: Sparkles, color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' };
      case 'special_trip':
        return { label: 'Special Trip', icon: MapPin, color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' };
      default:
        return { label: 'Milestone', icon: PartyPopper, color: 'text-purple-300 border-purple-500/40 bg-purple-950/40' };
    }
  };

  return (
    <RoomShell><div className="px-4 py-8 md:px-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
              Room 09 &bull; Calendar
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-purple-300">Milestones & Upcoming Dates</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white">
            The Celestial Calendar of Us
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Never forget a promise, an anniversary, or an anticipated evening under the stars.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 text-white font-serif text-xs font-semibold tracking-wider hover:bg-purple-500 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sanctuary Event</span>
        </button>
      </div>

      {/* Events Timeline List */}
      <div className="space-y-4">
        {events.map((ev) => {
          const badge = getCategoryBadge(ev.category);
          const Icon = badge.icon;
          const evDate = new Date(ev.eventDate);
          const isUpcoming = evDate.getTime() > Date.now();

          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl celestial-panel border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-serif text-purple-300">
                    {evDate.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-serif font-bold text-white">
                    {evDate.getDate()}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-serif border flex items-center gap-1 ${badge.color}`}>
                      <Icon className="w-3 h-3" />
                      {badge.label}
                    </span>
                    {ev.isRecurringAnnually && (
                      <span className="text-[10px] text-slate-500 font-sans">Annual Celebration</span>
                    )}
                  </div>
                  <h3 className="text-base font-serif font-medium text-white">{ev.title}</h3>
                  {ev.description && (
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed italic">
                      &ldquo;{ev.description}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="text-left md:text-right shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-sans">
                  {evDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-xs font-serif text-sanctuary-gold mt-0.5 block">
                  {isUpcoming ? 'Approaching Soon ✨' : 'Cherished Memory'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md p-6 rounded-3xl celestial-panel border border-purple-500/40 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white">Add Sanctuary Event</h3>
                  <p className="text-xs text-slate-400">Save a milestone or date night</p>
                </div>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif text-purple-300 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Starlight Candlelight Dinner"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-purple-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-400"
                  >
                    <option value="date_night">Date Night</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="special_trip">Special Trip / Vacation</option>
                    <option value="milestone">Personal Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif text-purple-300 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-purple-300 mb-1">
                    Notes & Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Plans, location, or ideas for this event..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded border-slate-700 text-purple-500 focus:ring-0"
                  />
                  <label htmlFor="recurring" className="text-xs text-slate-300 cursor-pointer">
                    Repeat annually (e.g. birthday or anniversary)
                  </label>
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
                    disabled={loading || !title.trim() || !eventDate}
                    className="px-5 py-2 rounded-xl bg-purple-600 text-white font-serif text-xs font-semibold hover:bg-purple-500 transition-all shadow-md disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Event'}
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
