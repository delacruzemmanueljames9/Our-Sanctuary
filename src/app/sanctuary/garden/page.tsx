'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flower2,
  Droplets,
  Plus,
  Sparkles,
  X,
  Info,
  Maximize2,
} from 'lucide-react';
import { GardenPlant } from '@/types/sanctuary';
import { RoomShell } from '@/components/sanctuary/RoomShell';
import { useSanctuaryRealtime } from '@/hooks/useSanctuaryRealtime';
import dynamic from 'next/dynamic';

// Dynamically load 3D scene (SSR off — Three.js requires browser)
const Garden3DScene = dynamic(
  () => import('@/components/3d/Garden3DScene').then((m) => ({ default: m.Garden3DScene })),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-emerald-400/60 font-serif text-sm animate-pulse tracking-widest">
        Growing the garden…
      </div>
    </div>
  )}
);

const PLANT_TYPE_LABELS: Record<string, string> = {
  eternal_rose: 'Rose of Eternal Love',
  celestial_lily: 'Celestial Lily',
  starlight_orchid: 'Starlight Orchid',
  sunburst_flower: 'Sunburst Blossom',
  moonlight_fern: 'Moonlight Fern',
};

const GROWTH_STAGE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Tender Sprout', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/60' },
  2: { label: 'Budding Flower', color: 'text-amber-300 border-amber-800 bg-amber-950/60' },
  3: { label: 'Full Blossom', color: 'text-rose-300 border-rose-800 bg-rose-950/60' },
  4: { label: 'Radiant Celestial Bloom', color: 'text-cyan-300 border-cyan-800 bg-cyan-950/60' },
};

export default function OurGardenPage() {
  const [plants, setPlants] = useState<GardenPlant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(null);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [wateringId, setWateringId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // New plant form
  const [plantType, setPlantType] = useState<
    'eternal_rose' | 'celestial_lily' | 'starlight_orchid' | 'moonlight_fern' | 'sunburst_flower'
  >('eternal_rose');
  const [name, setName] = useState('');
  const [dedication, setDedication] = useState('');
  const [plantedBy, setPlantedBy] = useState<'emman' | 'lei'>('emman');
  const [loading, setLoading] = useState(false);

  const fetchGarden = async () => {
    try {
      const res = await fetch('/api/garden');
      const data = await res.json();
      if (data.plants) setPlants(data.plants);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchGarden();
  }, []);

  useSanctuaryRealtime({
    table: 'garden_plants',
    onChange: () => {
      fetchGarden();
    },
  });

  const handleWater = async (id: string) => {
    setWateringId(id);
    try {
      const res = await fetch('/api/garden', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchGarden();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setWateringId(null), 800);
    }
  };

  const handlePlantFlower = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/garden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantType,
          name: name.trim(),
          dedication: dedication.trim(),
          plantedBy,
        }),
      });

      if (res.ok) {
        setIsPlantModalOpen(false);
        setName('');
        setDedication('');
        fetchGarden();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedStage = selectedPlant ? (GROWTH_STAGE_LABELS[selectedPlant.growthStage] ?? GROWTH_STAGE_LABELS[4]) : null;

  return (
    <RoomShell>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Header strip */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-900/30 bg-[#05070f]/80 backdrop-blur-sm flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
                Room 04 · Our Garden
              </span>
              <span className="text-[10px] text-emerald-400">{plants.length} Celestial Flora</span>
            </div>
            <h1 className="text-lg md:text-xl font-serif text-white">
              The Living Garden of Milestones
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFullscreen((f) => !f)}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-emerald-400 transition-colors"
              title="Toggle fullscreen garden"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlantModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-serif text-xs font-semibold tracking-wider hover:bg-emerald-400 transition-all shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plant Blossom</span>
              <span className="sm:hidden">Plant</span>
            </button>
          </div>
        </div>

        {/* 3D Garden Canvas — main area */}
        <div className="relative flex-1 min-h-0">
          <Garden3DScene
            plants={plants}
            onSelectPlant={setSelectedPlant}
            selectedPlantId={selectedPlant?.id ?? null}
          />

          {/* Empty state */}
          {plants.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-sm font-serif text-emerald-300/70 tracking-wider">
                Your garden awaits its first blossom
              </p>
              <p className="text-xs text-slate-500 mt-1">Plant a flower to commemorate a memory</p>
            </div>
          )}

          {/* Hint label */}
          {plants.length > 0 && !selectedPlant && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-emerald-900/40 text-emerald-300/70 text-[11px] font-serif">
                <Info className="w-3 h-3" />
                <span>Click a flower to view its memory</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Plant Info Panel */}
        <AnimatePresence>
          {selectedPlant && selectedStage && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-shrink-0 border-t border-emerald-900/30 bg-[#05070f]/90 backdrop-blur-sm px-5 py-4"
            >
              <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-serif border ${selectedStage.color}`}>
                      Stage {selectedPlant.growthStage} · {selectedStage.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-serif">
                      {PLANT_TYPE_LABELS[selectedPlant.plantType] ?? selectedPlant.plantType}
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-white truncate">{selectedPlant.name}</h3>
                  {selectedPlant.dedication && (
                    <p className="text-xs text-slate-300 italic mt-0.5 line-clamp-1">
                      &ldquo;{selectedPlant.dedication}&rdquo;
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1">
                    Planted by {selectedPlant.plantedBy === 'lei' ? 'Lei' : 'Emman'} · Nurtured {selectedPlant.waterCount} times
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleWater(selectedPlant.id)}
                    disabled={wateringId === selectedPlant.id}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition-all text-xs disabled:opacity-60"
                  >
                    <Droplets className={`w-3.5 h-3.5 ${wateringId === selectedPlant.id ? 'animate-bounce text-blue-400' : ''}`} />
                    <span>{wateringId === selectedPlant.id ? 'Nurturing…' : 'Water'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlant(null)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plant Flower Modal */}
      <AnimatePresence>
        {isPlantModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md p-6 rounded-3xl celestial-panel border border-emerald-500/40 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsPlantModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center">
                  <Flower2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white">Plant a Sanctuary Blossom</h3>
                  <p className="text-xs text-slate-400">Dedicate a flower to our love</p>
                </div>
              </div>

              <form onSubmit={handlePlantFlower} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif text-emerald-300 mb-1">
                    Flower Species
                  </label>
                  <select
                    value={plantType}
                    onChange={(e: any) => setPlantType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-400"
                  >
                    <option value="eternal_rose">Rose of Eternal Love (Crimson)</option>
                    <option value="celestial_lily">Celestial Lily (Pure White &amp; Gold)</option>
                    <option value="starlight_orchid">Starlight Orchid (Bioluminescent Cyan)</option>
                    <option value="sunburst_flower">Sunburst Blossom (Warm Amber)</option>
                    <option value="moonlight_fern">Moonlight Fern (Gentle Emerald)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif text-emerald-300 mb-1">
                    Blossom Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Blossom of Our First Road Trip"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-emerald-300 mb-1">
                    Dedication Note
                  </label>
                  <textarea
                    rows={3}
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value)}
                    placeholder="Why are you planting this today?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPlantedBy('emman')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-serif ${
                        plantedBy === 'emman'
                          ? 'bg-sanctuary-gold text-slate-950 font-semibold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      By Emman
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlantedBy('lei')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-serif ${
                        plantedBy === 'lei'
                          ? 'bg-sanctuary-rose text-slate-950 font-semibold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      By Lei
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlantModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !name.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-serif text-xs font-semibold hover:bg-emerald-400 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <><Sparkles className="w-3.5 h-3.5 animate-spin" /><span>Planting…</span></>
                      ) : (
                        <span>Plant in Garden</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </RoomShell>
  );
}
