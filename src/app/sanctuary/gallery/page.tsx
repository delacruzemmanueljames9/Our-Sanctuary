'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  FolderPlus,
  Plus,
  Calendar,
  MapPin,
  Heart,
  X,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';
import { MemoryItem, Album } from '@/types/sanctuary';

export default function MemoryGalleryPage() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<string>('all');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isNewAlbumModalOpen, setIsNewAlbumModalOpen] = useState<boolean>(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newAuthor, setNewAuthor] = useState<'emman' | 'lei'>('emman');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumCover, setNewAlbumCover] = useState('');

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/memories');
      const data = await res.json();
      if (data.memories) setMemories(data.memories);
      if (data.albums) setAlbums(data.albums);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMediaUrl.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim(),
          mediaUrl: newMediaUrl.trim(),
          memoryDate: newDate || new Date().toISOString().split('T')[0],
          location: newLoc.trim(),
          albumId: activeAlbum !== 'all' ? activeAlbum : undefined,
          uploadedBy: newAuthor,
          isFavorite,
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewDesc('');
        setNewMediaUrl('');
        setNewDate('');
        setNewLoc('');
        fetchGallery();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemories = memories.filter((m) => {
    if (activeAlbum === 'all') return true;
    if (activeAlbum === 'favorites') return m.isFavorite;
    return m.albumId === activeAlbum;
  });

  return (
    <div className="relative min-h-screen px-4 py-8 md:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
              Room 02 &bull; Memory Gallery
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-sky-400">{memories.length} Preserved Moments</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white">
            The Hall of Cherished Moments
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            A timeless sanctuary of our shared adventures, quiet smiles, and sacred memories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-semibold tracking-wider hover:bg-sanctuary-gold-light transition-all shadow-celestial-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Preserve Memory</span>
          </button>
        </div>
      </div>

      {/* Album Filters Navigation */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveAlbum('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-serif tracking-wider transition-all whitespace-nowrap ${
            activeAlbum === 'all'
              ? 'bg-sanctuary-gold/20 text-sanctuary-gold-light border border-sanctuary-gold/50 shadow-celestial-sm'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Memories ({memories.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveAlbum('favorites')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-serif tracking-wider transition-all whitespace-nowrap ${
            activeAlbum === 'favorites'
              ? 'bg-rose-950/40 text-rose-300 border border-rose-500/50 shadow-rose-glow'
              : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-rose-300'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-sanctuary-rose" />
          <span>Sacred Favorites</span>
        </button>

        {albums.map((album) => (
          <button
            key={album.id}
            type="button"
            onClick={() => setActiveAlbum(album.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-serif tracking-wider transition-all whitespace-nowrap ${
              activeAlbum === album.id
                ? 'bg-sanctuary-gold/20 text-sanctuary-gold-light border border-sanctuary-gold/50 shadow-celestial-sm'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {album.title}
          </button>
        ))}
      </div>

      {/* Masonry / Photo Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((mem) => (
          <motion.div
            key={mem.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            onClick={() => setSelectedMemory(mem)}
            className="group relative rounded-3xl overflow-hidden celestial-panel border border-sanctuary-gold/20 hover:border-sanctuary-gold/60 cursor-pointer shadow-lg hover:shadow-celestial-md transition-all duration-300 flex flex-col"
          >
            {/* Image Frame */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-900">
              <img
                src={mem.mediaUrl}
                alt={mem.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Badges on image */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {mem.isFavorite && (
                  <div className="p-1.5 rounded-full bg-rose-950/80 border border-rose-500/50 backdrop-blur-md">
                    <Heart className="w-3.5 h-3.5 text-sanctuary-rose fill-sanctuary-rose" />
                  </div>
                )}
                <span className="text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/70 border border-slate-700/60 text-slate-300 backdrop-blur-md">
                  By {mem.uploadedBy === 'lei' ? 'Lei' : 'Emman'}
                </span>
              </div>

              {/* Bottom Info on Frame */}
              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex items-center gap-3 text-[11px] text-amber-200 mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {mem.memoryDate}
                  </span>
                  {mem.location && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-sanctuary-gold" />
                      {mem.location}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-base text-white font-medium group-hover:text-sanctuary-gold-light transition-colors truncate">
                  {mem.title}
                </h3>
              </div>
            </div>

            {/* Description Card Foot */}
            <div className="p-4 bg-slate-950/80 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-300 line-clamp-2 italic leading-relaxed">
                &ldquo;{mem.description}&rdquo;
              </p>
              {mem.tags && mem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {mem.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <div className="text-center py-20 celestial-panel rounded-3xl border border-slate-800">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-serif text-slate-400">No memories found in this collection.</h3>
          <p className="text-xs text-slate-500 mt-1">Preserve our first moment in this album above.</p>
        </div>
      )}

      {/* Memory Lightbox Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl celestial-panel border border-sanctuary-gold/40 shadow-2xl flex flex-col md:flex-row overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-3/5 bg-black flex items-center justify-center max-h-[60vh] md:max-h-full">
                <img
                  src={selectedMemory.mediaUrl}
                  alt={selectedMemory.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="w-full md:w-2/5 p-6 flex flex-col justify-between bg-slate-950/90 overflow-y-auto">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-sanctuary-gold">
                      Preserved by {selectedMemory.uploadedBy === 'lei' ? 'Lei' : 'Emman'}
                    </span>
                    {selectedMemory.isFavorite && (
                      <span className="text-[10px] text-rose-400 font-sans flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-rose-400" /> Sacred
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-serif text-white mb-2">{selectedMemory.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 pb-4 border-b border-slate-800">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sanctuary-gold" />
                      {selectedMemory.memoryDate}
                    </span>
                    {selectedMemory.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sanctuary-gold" />
                        {selectedMemory.location}
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed italic whitespace-pre-wrap">
                    &ldquo;{selectedMemory.description}&rdquo;
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Sanctuary Archival Record</span>
                  <span className="text-sanctuary-gold font-serif">Eternal</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Memory Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg p-6 rounded-3xl celestial-panel border border-sanctuary-gold/40 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-sanctuary-gold/40 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-sanctuary-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white">Preserve a Shared Memory</h3>
                  <p className="text-xs text-slate-400">Add a cherished photo to our sanctuary</p>
                </div>
              </div>

              <form onSubmit={handleAddMemory} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif text-sanctuary-gold-light mb-1">
                    Memory Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Sunset by the Harbor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-sanctuary-gold-light mb-1">
                    Photo URL or Supabase Media Link
                  </label>
                  <input
                    type="url"
                    required
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-sanctuary-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif text-sanctuary-gold-light mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-sanctuary-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif text-sanctuary-gold-light mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newLoc}
                      onChange={(e) => setNewLoc(e.target.value)}
                      placeholder="e.g. Cloud Mountain"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-sanctuary-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-serif text-sanctuary-gold-light mb-1">
                    The Story Behind This Moment
                  </label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What made this moment special to us?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-sanctuary-gold resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={isFavorite}
                        onChange={(e) => setIsFavorite(e.target.checked)}
                        className="rounded border-slate-700 text-sanctuary-rose focus:ring-0"
                      />
                      <span>Mark as Sacred Favorite</span>
                    </label>
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
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-semibold hover:bg-sanctuary-gold-light transition-all"
                    >
                      {loading ? 'Preserving...' : 'Preserve Memory'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
