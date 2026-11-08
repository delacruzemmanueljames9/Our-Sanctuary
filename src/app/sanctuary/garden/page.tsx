'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flower2,
  Droplets,
  Sparkles,
  X,
  Info,
  Maximize2,
  Heart,
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
        Growing our 3D sanctuary garden…
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
  const [wateringId, setWateringId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

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
      setTimeout(() => setWateringId(null), 1400);
    }
  };

  const selectedStage = selectedPlant ? (GROWTH_STAGE_LABELS[selectedPlant.growthStage] ?? GROWTH_STAGE_LABELS[4]) : null;

  return (
    <RoomShell>
      <div className={`flex flex-col ${fullscreen ? 'fixed inset-0 z-50 bg-[#05070f]' : 'h-[calc(100vh-3.5rem)]'}`}>
        {/* Header strip — Personalized for Lei */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-900/30 bg-[#05070f]/80 backdrop-blur-sm flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
                Room 04 · Our Garden
              </span>
              <span className="text-[10px] text-emerald-400 font-serif">
                {plants.length} Living Blossoms for Lei
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-serif text-white tracking-wide">
              The Living Garden of Memories
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFullscreen((f) => !f)}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Toggle fullscreen garden view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Garden Canvas — Real 3D Environment with Water Particles */}
        <div className="relative flex-1 min-h-0">
          <Garden3DScene
            plants={plants}
            onSelectPlant={setSelectedPlant}
            selectedPlantId={selectedPlant?.id ?? null}
            wateringPlantId={wateringId}
          />

          {/* Empty state */}
          {plants.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-sm font-serif text-emerald-300/70 tracking-wider">
                The garden is preparing its sacred soil
              </p>
            </div>
          )}

          {/* Guidance hint */}
          {plants.length > 0 && !selectedPlant && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-800/40 text-emerald-300/80 text-[11px] font-serif shadow-lg">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Click any flower to view its dedicated memory &bull; Rotate to explore</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Plant Info Panel & Water Action */}
        <AnimatePresence>
          {selectedPlant && selectedStage && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-shrink-0 border-t border-emerald-900/30 bg-[#05070f]/95 backdrop-blur-md px-5 py-4 shadow-2xl"
            >
              <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-serif border ${selectedStage.color}`}>
                      Stage {selectedPlant.growthStage} &bull; {selectedStage.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-serif">
                      {PLANT_TYPE_LABELS[selectedPlant.plantType] ?? selectedPlant.plantType}
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-white truncate">{selectedPlant.name}</h3>
                  {selectedPlant.dedication && (
                    <p className="text-xs text-emerald-200/90 italic mt-0.5 leading-relaxed">
                      &ldquo;{selectedPlant.dedication}&rdquo;
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-1 font-serif">
                    Nurtured with affection {selectedPlant.waterCount} times
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleWater(selectedPlant.id)}
                    disabled={wateringId === selectedPlant.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-serif font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all text-xs shadow-md disabled:opacity-60 cursor-pointer active:scale-95"
                  >
                    <Droplets className={`w-4 h-4 ${wateringId === selectedPlant.id ? 'animate-bounce text-cyan-200' : ''}`} />
                    <span>{wateringId === selectedPlant.id ? 'Watering Flower...' : 'Water Flower'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlant(null)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RoomShell>
  );
}
