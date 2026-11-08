'use client';

import { RoomShell } from '@/components/sanctuary/RoomShell';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Calendar,
  MapPin,
  Heart,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { MemoryItem, Album } from '@/types/sanctuary';
import { useSanctuaryRealtime } from '@/hooks/useSanctuaryRealtime';

function MemoryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="relative w-full h-full bg-[#070914] flex items-center justify-center overflow-hidden">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm z-10">
          <Sparkles className="w-5 h-5 text-purple-300 animate-spin" />
        </div>
      )}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-gradient-to-b from-purple-950/30 via-slate-950 to-slate-950 w-full h-full">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center mb-2 shadow-inner">
            <ImageIcon className="w-6 h-6 text-purple-300" />
          </div>
          <span className="text-xs font-serif text-purple-200">Cherished Moment</span>
          <span className="text-[10px] text-slate-500 mt-1">Photo Memory &bull; Click to view</span>
        </div>
      )}
    </div>
  );
}

export default function MemoryGalleryPage() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  useSanctuaryRealtime({
    table: 'memories',
    onChange: () => {
      fetchGallery();
    },
  });

  const filteredMemories = memories.filter((m) => {
    if (activeAlbum === 'all') return true;
    if (activeAlbum === 'favorites') return m.isFavorite;
    return m.albumId === activeAlbum;
  });

  const selectedMemory = selectedIndex !== null ? filteredMemories[selectedIndex] : null;

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < filteredMemories.length - 1 ? prev + 1 : 0));
  }, [selectedIndex, filteredMemories.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredMemories.length - 1));
  }, [selectedIndex, filteredMemories.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  return (
    <RoomShell>
      <div className="px-4 py-8 md:px-12 max-w-7xl mx-auto">
        {/* Header — Personalized for Lei */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
                Room 02 &bull; Memory Gallery
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-purple-300">
                {memories.length} Original Memories for Lei
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif text-white tracking-wide">
              The Gallery of Cherished Memories
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-2xl font-light leading-relaxed">
              Every precious milestone, gentle glance, and sacred promise preserved in exact chronological order.
            </p>
          </div>
        </div>

        {/* Album Filters Navigation */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveAlbum('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-serif tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeAlbum === 'all'
                ? 'bg-purple-950/60 text-purple-200 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Memories ({memories.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveAlbum('favorites')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-serif tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeAlbum === 'favorites'
                ? 'bg-rose-950/50 text-rose-300 border border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-rose-300'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-sanctuary-rose fill-sanctuary-rose" />
            <span>Sacred Favorites</span>
          </button>

          {albums.map((album) => (
            <button
              key={album.id}
              type="button"
              onClick={() => setActiveAlbum(album.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-serif tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeAlbum === album.id
                  ? 'bg-sanctuary-gold/20 text-sanctuary-gold-light border border-sanctuary-gold/50 shadow-celestial-sm'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {album.title}
            </button>
          ))}
        </div>

        {/* 16 Memories Photo Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMemories.map((mem, idx) => (
            <motion.div
              key={mem.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
              onClick={() => setSelectedIndex(idx)}
              className="group relative rounded-3xl overflow-hidden celestial-panel border border-purple-500/20 hover:border-purple-400/60 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-300 flex flex-col bg-slate-950/80 hover:scale-[1.02]"
            >
              {/* Image Frame */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                <MemoryImage
                  src={mem.mediaUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-60 transition-opacity pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-serif font-bold tracking-widest px-2.5 py-1 rounded-full bg-slate-950/80 border border-purple-500/40 text-purple-200 backdrop-blur-md shadow-sm">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                  {mem.isFavorite && (
                    <div className="p-1.5 rounded-full bg-rose-950/80 border border-rose-500/50 backdrop-blur-md shadow-sm">
                      <Heart className="w-3.5 h-3.5 text-sanctuary-rose fill-sanctuary-rose" />
                    </div>
                  )}
                </div>

                {/* Bottom Overlay Info on Frame */}
                <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                  <div className="flex items-center gap-2 text-[10px] text-amber-200/90 mb-1 font-serif">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-sanctuary-gold" />
                      {mem.memoryDate}
                    </span>
                    {mem.location && (
                      <span className="flex items-center gap-1 text-slate-300">
                        &bull;
                        <MapPin className="w-3 h-3 text-purple-300" />
                        {mem.location}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-white group-hover:text-purple-200 transition-colors truncate">
                    {mem.title}
                  </h3>
                </div>
              </div>

              {/* Exact Caption Card Foot */}
              <div className="p-4 bg-slate-950/90 flex-1 flex flex-col justify-between border-t border-purple-900/20">
                <p className="text-xs text-purple-100/90 font-serif italic leading-relaxed line-clamp-3">
                  &ldquo;{mem.description}&rdquo;
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-serif">
                  <span>Preserved by Emman</span>
                  <span className="text-purple-400 group-hover:text-purple-200 transition-colors flex items-center gap-1">
                    <span>View photo</span>
                    <Maximize2 className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <div className="text-center py-20 celestial-panel rounded-3xl border border-slate-800">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-serif text-slate-400">No memories found in this collection.</h3>
            <p className="text-xs text-slate-500 mt-1">Select &ldquo;All Memories&rdquo; to browse all 16 moments.</p>
          </div>
        )}

        {/* Fullscreen Lightbox Viewer with Original Photo & Caption */}
        <AnimatePresence>
          {selectedMemory && selectedIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl celestial-panel border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col lg:flex-row overflow-hidden bg-[#070914]"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:border-purple-400 transition-all cursor-pointer shadow-lg"
                  title="Close viewer (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left/Right Navigation Floating Buttons */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/80 border border-slate-700/80 text-white hover:text-purple-300 hover:border-purple-500 transition-all cursor-pointer shadow-xl"
                  title="Previous memory (Left Arrow)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 lg:right-[calc(40%+12px)] p-2.5 rounded-full bg-slate-950/80 border border-slate-700/80 text-white hover:text-purple-300 hover:border-purple-500 transition-all cursor-pointer shadow-xl"
                  title="Next memory (Right Arrow)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Photo Viewer Frame */}
                <div className="w-full lg:w-3/5 bg-black flex items-center justify-center min-h-[320px] max-h-[50vh] lg:max-h-full p-2">
                  <img
                    src={selectedMemory.mediaUrl}
                    alt={selectedMemory.title}
                    className="max-w-full max-h-[48vh] lg:max-h-[85vh] object-contain rounded-2xl"
                    onError={(e) => {
                      // Graceful visual fallback without altering the original URL
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.img-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'img-fallback flex flex-col items-center justify-center p-8 text-center text-purple-200';
                        fallback.innerHTML = `
                          <div class="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center mb-3">
                            <span class="text-3xl">💜</span>
                          </div>
                          <p class="font-serif text-sm font-semibold">Cherished Photo Memory</p>
                          <p class="text-xs text-slate-400 mt-1 max-w-xs">Preserved forever in our sanctuary archives.</p>
                        `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>

                {/* Details & Exact Caption Panel */}
                <div className="w-full lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-slate-950/95 overflow-y-auto border-t lg:border-t-0 lg:border-l border-purple-900/30">
                  <div>
                    {/* Counter & Category */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif font-bold text-purple-300 tracking-widest px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40">
                          {String(selectedIndex + 1).padStart(2, '0')} / {String(filteredMemories.length).padStart(2, '0')}
                        </span>
                        <span className="text-xs text-slate-500">&bull;</span>
                        <span className="text-xs font-serif text-sanctuary-gold">Our Sanctuary Archive</span>
                      </div>
                      {selectedMemory.isFavorite && (
                        <span className="text-xs text-rose-300 font-serif flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                          <span>Sacred Favorite</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-serif text-white mb-3 tracking-wide">
                      {selectedMemory.title}
                    </h2>

                    {/* Date & Location */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-6 font-serif">
                      <span className="flex items-center gap-1.5 text-amber-200">
                        <Calendar className="w-3.5 h-3.5 text-sanctuary-gold" />
                        {selectedMemory.memoryDate}
                      </span>
                      {selectedMemory.location && (
                        <span className="flex items-center gap-1.5 text-purple-300">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" />
                          {selectedMemory.location}
                        </span>
                      )}
                    </div>

                    {/* Original Caption Highlight */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-purple-950/20 border border-purple-500/30 shadow-inner mb-6">
                      <span className="text-[10px] font-serif uppercase tracking-widest text-purple-300 block mb-2">
                        Original Caption
                      </span>
                      <p className="text-sm sm:text-base text-purple-50 font-serif italic leading-relaxed whitespace-pre-wrap">
                        &ldquo;{selectedMemory.description}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Foot Navigation / Metadata */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-serif">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="text-purple-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    <span className="text-[11px] text-slate-500">
                      Use &larr; &rarr; to browse
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="text-purple-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </RoomShell>
  );
}
