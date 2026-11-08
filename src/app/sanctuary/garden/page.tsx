'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flower2,
  Droplets,
  Plus,
  Sparkles,
  Heart,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import { GardenPlant } from '@/types/sanctuary';

export default function OurGardenPage() {
  const [plants, setPlants] = useState<GardenPlant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(null);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [wateringId, setWateringId] = useState<string | null>(null);

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

  const getGrowthBadge = (stage: number) => {
    switch (stage) {
      case 1:
        return { label: 'Tender Sprout', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
      case 2:
        return { label: 'Budding Flower', color: 'text-amber-300 bg-amber-950/60 border-amber-800' };
      case 3:
        return { label: 'Full Blossom', color: 'text-rose-300 bg-rose-950/60 border-rose-800' };
      default:
        return { label: 'Radiant Celestial Bloom', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-800' };
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-8 md:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
              Room 04 &bull; Our Garden
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-emerald-400">{plants.length} Celestial Flora</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white">
            The Living Garden of Milestones
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Each blossom is dedicated to a moment in our lives, thriving through care and genuine intention.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPlantModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-serif text-xs font-semibold tracking-wider hover:bg-emerald-400 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Plant New Blossom</span>
        </button>
      </div>

      {/* Garden Flora Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => {
          const badge = getGrowthBadge(plant.growthStage);
          const isWatering = wateringId === plant.id;

          return (
            <motion.div
              key={plant.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl celestial-panel border border-emerald-500/25 hover:border-emerald-500/60 transition-all shadow-lg flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-serif border ${badge.color}`}>
                    Stage {plant.growthStage} &bull; {badge.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-serif">
                    Planted by {plant.plantedBy === 'lei' ? 'Lei' : 'Emman'}
                  </span>
                </div>

                {/* Animated Flower Emblem */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mx-auto my-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Flower2 className={`w-8 h-8 ${plant.plantType === 'eternal_rose' ? 'text-rose-400' : 'text-emerald-400'} ${isWatering ? 'animate-bounce' : 'animate-pulse'}`} />
                </div>

                <h3 className="text-base font-serif font-semibold text-white text-center mb-1">
                  {plant.name}
                </h3>

                {plant.dedication && (
                  <p className="text-xs text-slate-300 text-center italic mb-4 line-clamp-2">
                    &ldquo;{plant.dedication}&rdquo;
                  </p>
                )}
              </div>

              {/* Garden Actions / Watering */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-slate-400 text-[11px]">
                  <span>Nurtured {plant.waterCount} times</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleWater(plant.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  <Droplets className={`w-3.5 h-3.5 ${isWatering ? 'text-blue-400 animate-spin' : ''}`} />
                  <span>{isWatering ? 'Nurturing...' : 'Water Flower'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
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
                    <option value="celestial_lily">Celestial Lily (Pure White & Gold)</option>
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
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-serif text-xs font-semibold hover:bg-emerald-400 transition-all"
                    >
                      {loading ? 'Planting...' : 'Plant in Garden'}
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
