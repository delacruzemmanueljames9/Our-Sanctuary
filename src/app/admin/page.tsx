'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Sliders,
  Palette,
  Layers,
  Download,
  Scroll,
  Image as ImageIcon,
  Heart,
  Sparkles,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
  Plus,
  Trash2,
  Eye,
  Flower2,
  Compass,
  Calendar,
  Radio,
  X,
  Droplets,
} from 'lucide-react';
import { SanctuarySettings, AdminAuditLog, MemoryItem, Letter, GardenPlant, UniverseDream, CalendarEvent } from '@/types/sanctuary';

export default function AdminControlCenter() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<SanctuarySettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'rooms' | 'modules' | 'theme' | 'backup' | 'logs'>('rooms');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Room Content Management State
  const [activeRoomTab, setActiveRoomTab] = useState<'memories' | 'letters' | 'garden' | 'universe' | 'calendar'>('memories');
  const [roomMemories, setRoomMemories] = useState<MemoryItem[]>([]);
  const [roomLetters, setRoomLetters] = useState<Letter[]>([]);
  const [roomPlants, setRoomPlants] = useState<GardenPlant[]>([]);
  const [roomDreams, setRoomDreams] = useState<UniverseDream[]>([]);
  const [roomEvents, setRoomEvents] = useState<CalendarEvent[]>([]);

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<{ title: string; content: string; type: string } | null>(null);

  // New Content Forms inside Admin
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [memTitle, setMemTitle] = useState('');
  const [memDesc, setMemDesc] = useState('');
  const [memUrl, setMemUrl] = useState('');

  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [plantDed, setPlantDed] = useState('');
  const [plantType, setPlantType] = useState('eternal_rose');

  useEffect(() => {
    // Verify admin privileges server-side
    fetch('/api/auth/admin')
      .then((res) => res.json())
      .then((data) => {
        if (data.isAdmin) {
          setIsAdmin(true);
          fetchAdminData();
          fetchRoomData();
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => setIsAdmin(false));
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRoomData = async () => {
    try {
      const res = await fetch('/api/admin/settings?action=rooms');
      const data = await res.json();
      if (data.memories) setRoomMemories(data.memories);
      if (data.letters) setRoomLetters(data.letters);
      if (data.plants) setRoomPlants(data.plants);
      if (data.dreams) setRoomDreams(data.dreams);
      if (data.events) setRoomEvents(data.events);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleModule = async (moduleKey: keyof SanctuarySettings['activeModules']) => {
    if (!settings) return;
    const updatedModules = {
      ...settings.activeModules,
      [moduleKey]: !settings.activeModules[moduleKey],
    };

    const newSettings = { ...settings, activeModules: updatedModules };
    setSettings(newSettings);

    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeModules: updatedModules }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleThemeChange = async (theme: 'gold' | 'celestial_blue' | 'rose_quartz' | 'emerald') => {
    if (!settings) return;
    const newSettings = { ...settings, themeAccent: theme };
    setSettings(newSettings);

    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeAccent: theme }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await fetch('/api/admin/settings?action=backup');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.backup, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sanctuary_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteItem = async (endpoint: string, id: string, refreshFn: () => void) => {
    if (!confirm('Are you sure you want to permanently delete this content item?')) return;
    try {
      const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        refreshFn();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memTitle || !memUrl) return;
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: memTitle,
          description: memDesc,
          mediaUrl: memUrl,
          uploadedBy: 'emman',
        }),
      });
      if (res.ok) {
        setIsAddMemoryOpen(false);
        setMemTitle('');
        setMemDesc('');
        setMemUrl('');
        fetchRoomData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName) return;
    try {
      const res = await fetch('/api/garden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: plantName,
          dedication: plantDed,
          plantType,
          plantedBy: 'emman',
        }),
      });
      if (res.ok) {
        setIsAddPlantOpen(false);
        setPlantName('');
        setPlantDed('');
        fetchRoomData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/admin', { method: 'DELETE' });
    router.push('/sanctuary');
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070f] text-sanctuary-gold">
        <Sparkles className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#05070f]">
        <div className="max-w-md w-full p-8 rounded-3xl celestial-panel border border-red-500/40 text-center shadow-2xl">
          <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-white mb-2">Restricted Sanctuary Core</h2>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            This realm is strictly reserved for Super Administrator Emman. Lei and visitors are prohibited from administrative mutations.
          </p>
          <button
            type="button"
            onClick={() => router.push('/sanctuary')}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
          >
            Return to Sanctuary Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-12 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-sanctuary-gold/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/50 border border-sanctuary-gold/40 flex items-center justify-center shadow-celestial-sm">
            <ShieldAlert className="w-6 h-6 text-sanctuary-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-serif text-white">
                Sanctuary Master Control Center
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-sanctuary-gold/60 text-sanctuary-gold font-sans font-semibold">
                Super Admin: Emman
              </span>
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-sans">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                <span>Supabase Live</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Full control over all sanctuary rooms, real-time sync, modules, celestial aura, and backups.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Realtime Synced</span>
            </motion.div>
          )}

          <button
            type="button"
            onClick={() => router.push('/sanctuary')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Return Inside
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 hover:bg-red-900/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Control</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {[
          { key: 'rooms', label: 'Room Content Control', icon: Sliders },
          { key: 'modules', label: 'Sanctuary Modules', icon: Layers },
          { key: 'theme', label: 'Celestial Themes', icon: Palette },
          { key: 'backup', label: 'Database Backup & Export', icon: Download },
          { key: 'logs', label: 'Audit Log Ledger', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-serif tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-sanctuary-gold text-slate-950 font-semibold shadow-celestial-sm'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ROOM CONTENT CONTROL */}
      {activeTab === 'rooms' && (
        <div>
          {/* Room Sub-Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 overflow-x-auto scrollbar-none">
            {[
              { key: 'memories', label: '📸 Memory Gallery', count: roomMemories.length },
              { key: 'letters', label: '📜 Letter Room', count: roomLetters.length },
              { key: 'garden', label: '🌸 Our Garden', count: roomPlants.length },
              { key: 'universe', label: '✨ Our Universe', count: roomDreams.length },
              { key: 'calendar', label: '📅 Calendar', count: roomEvents.length },
            ].map((sub) => (
              <button
                key={sub.key}
                type="button"
                onClick={() => setActiveRoomTab(sub.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition-all cursor-pointer whitespace-nowrap ${
                  activeRoomTab === sub.key
                    ? 'bg-sanctuary-gold text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{sub.label}</span>
                <span className="text-[10px] opacity-75">({sub.count})</span>
              </button>
            ))}
          </div>

          {/* Sub-tab 1: Memories */}
          {activeRoomTab === 'memories' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400">Manage all archived photos and albums across the gallery.</p>
                <button
                  type="button"
                  onClick={() => setIsAddMemoryOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 text-slate-950 font-serif text-xs font-semibold hover:bg-sky-400 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Memory</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomMemories.map((mem) => (
                  <div key={mem.id} className="p-4 rounded-2xl celestial-panel border border-slate-800 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-white mb-1">{mem.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{mem.description}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewItem({ title: mem.title, content: mem.description || '', type: 'Memory Photo' })}
                        className="flex items-center gap-1 text-sky-400 hover:underline"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem('/api/memories', mem.id, fetchRoomData)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 2: Letters */}
          {activeRoomTab === 'letters' && (
            <div>
              <p className="text-xs text-slate-400 mb-4">View and curate all sealed letters in the sanctuary archive.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomLetters.map((letter) => (
                  <div key={letter.id} className="p-4 rounded-2xl celestial-panel border border-rose-500/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-serif text-rose-300">From {letter.sender} to {letter.recipient}</span>
                        <span className="text-[10px] text-slate-500">{letter.waxSeal}</span>
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-white mb-1">{letter.title}</h4>
                      <p className="text-xs text-slate-300 italic line-clamp-2">&ldquo;{letter.content}&rdquo;</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewItem({ title: letter.title, content: letter.content, type: 'Parchment Scroll' })}
                        className="flex items-center gap-1 text-amber-400 hover:underline"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview Scroll</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem('/api/letters', letter.id, fetchRoomData)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 3: Garden */}
          {activeRoomTab === 'garden' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400">Inspect and tend to all 3D living blossoms in Our Garden.</p>
                <button
                  type="button"
                  onClick={() => setIsAddPlantOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-serif text-xs font-semibold hover:bg-emerald-400 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Plant Blossom</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomPlants.map((plant) => (
                  <div key={plant.id} className="p-4 rounded-2xl celestial-panel border border-emerald-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-emerald-300 font-serif">Stage {plant.growthStage} &bull; {plant.plantType}</span>
                        <span className="text-[10px] text-slate-500">Watered {plant.waterCount}x</span>
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-white mb-1">{plant.name}</h4>
                      {plant.dedication && <p className="text-xs text-slate-300 italic line-clamp-2">&ldquo;{plant.dedication}&rdquo;</p>}
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch('/api/garden', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: plant.id }) });
                          fetchRoomData();
                        }}
                        className="flex items-center gap-1 text-cyan-300 hover:underline"
                      >
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        <span>Water Flower</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem('/api/garden', plant.id, fetchRoomData)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 4: Universe */}
          {activeRoomTab === 'universe' && (
            <div>
              <p className="text-xs text-slate-400 mb-4">Constellation dreams, travels, and future milestones.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomDreams.map((dream) => (
                  <div key={dream.id} className="p-4 rounded-2xl celestial-panel border border-cyan-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-serif text-cyan-300">{dream.category}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${dream.completed ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-400'}`}>
                          {dream.completed ? 'Completed' : 'Dreaming'}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-white mb-1">{dream.title}</h4>
                      {dream.description && <p className="text-xs text-slate-400">{dream.description}</p>}
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch('/api/universe', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: dream.id }) });
                          fetchRoomData();
                        }}
                        className="text-cyan-400 hover:underline"
                      >
                        Toggle Status
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem('/api/universe', dream.id, fetchRoomData)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 5: Calendar */}
          {activeRoomTab === 'calendar' && (
            <div>
              <p className="text-xs text-slate-400 mb-4">Milestone countdowns, recurring anniversaries, and reminders.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomEvents.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-2xl celestial-panel border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-white">{evt.title}</h4>
                      <p className="text-xs text-slate-400">{new Date(evt.eventDate).toLocaleDateString()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem('/api/calendar', evt.id, fetchRoomData)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SANCTUARY MODULES TOGGLE */}
      {activeTab === 'modules' && settings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.activeModules).map(([key, isEnabled]) => (
            <div
              key={key}
              className="p-5 rounded-3xl celestial-panel border border-slate-800 flex items-center justify-between"
            >
              <div>
                <h3 className="font-serif text-sm text-white capitalize">{key} Chamber</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEnabled ? 'Active in sanctuary room selection' : 'Temporarily suspended'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggleModule(key as any)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                  isEnabled ? 'bg-sanctuary-gold' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: THEME SETTINGS */}
      {activeTab === 'theme' && settings && (
        <div className="p-8 rounded-3xl celestial-panel border border-sanctuary-gold/30">
          <h2 className="text-lg font-serif text-white mb-2">Sanctuary Global Aura</h2>
          <p className="text-xs text-slate-400 mb-6">
            Choose the prevailing atmospheric accent color that guides the starlight and ambient lighting.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'gold', label: 'Celestial Gold', desc: 'Warm divine sunlight & brass accents', border: 'border-amber-500' },
              { key: 'celestial_blue', label: 'Ethereal Sapphire', desc: 'Deep starry nebula glow', border: 'border-cyan-500' },
              { key: 'rose_quartz', label: 'Rose Quartz', desc: 'Gentle blush of eternal affection', border: 'border-rose-400' },
              { key: 'emerald', label: 'Living Emerald', desc: 'Flourishing garden vitality', border: 'border-emerald-500' },
            ].map((theme) => {
              const isSelected = settings.themeAccent === theme.key;
              return (
                <button
                  key={theme.key}
                  type="button"
                  onClick={() => handleThemeChange(theme.key as any)}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 cursor-pointer ${
                    isSelected
                      ? `${theme.border} bg-slate-900/90 shadow-celestial-sm`
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="font-serif text-sm text-white font-medium">{theme.label}</h4>
                    <p className="text-xs text-slate-400 mt-1">{theme.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] text-sanctuary-gold font-serif uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Active Aura
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE BACKUP */}
      {activeTab === 'backup' && (
        <div className="p-8 rounded-3xl celestial-panel border border-sanctuary-gold/30">
          <h2 className="text-lg font-serif text-white mb-2">Preservation &amp; Export Vault</h2>
          <p className="text-xs text-slate-400 mb-6 max-w-xl leading-relaxed">
            Export a full JSON backup of memories, albums, letters, garden plants, dreams, and calendar milestones directly from Supabase. In accordance with zero-knowledge emotional privacy, personal journals are strictly redacted.
          </p>

          <button
            type="button"
            onClick={handleDownloadBackup}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-semibold tracking-wider hover:bg-yellow-400 transition-all shadow-celestial-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Sanctuary Backup (.JSON)</span>
          </button>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl celestial-panel border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-serif font-semibold text-sanctuary-gold uppercase tracking-wider block">
                  {log.action} &bull; {log.targetModule}
                </span>
                <span className="text-slate-400 mt-0.5 block">
                  {JSON.stringify(log.details)}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-sans shrink-0">
                {new Date(log.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg p-8 rounded-3xl celestial-panel border border-sanctuary-gold/40 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-serif uppercase tracking-widest text-sanctuary-gold block mb-1">
                Admin Content Preview &bull; {previewItem.type}
              </span>
              <h3 className="text-xl font-serif text-white font-bold mb-3">{previewItem.title}</h3>
              <p className="text-sm font-display text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                {previewItem.content}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD MEMORY MODAL */}
      <AnimatePresence>
        {isAddMemoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md p-6 rounded-3xl celestial-panel border border-sky-500/40 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsAddMemoryOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-serif text-lg text-white mb-4">Add Memory to Gallery</h3>
              <form onSubmit={handleCreateMemory} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif text-sky-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={memTitle}
                    onChange={(e) => setMemTitle(e.target.value)}
                    placeholder="Memory title"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif text-sky-300 mb-1">Media URL</label>
                  <input
                    type="url"
                    required
                    value={memUrl}
                    onChange={(e) => setMemUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif text-sky-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={memDesc}
                    onChange={(e) => setMemDesc(e.target.value)}
                    placeholder="Cherished reflection"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-sky-400 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMemoryOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-serif text-xs font-semibold"
                  >
                    Publish Memory
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD PLANT MODAL */}
      <AnimatePresence>
        {isAddPlantOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md p-6 rounded-3xl celestial-panel border border-emerald-500/40 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsAddPlantOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-serif text-lg text-white mb-4">Plant Garden Blossom</h3>
              <form onSubmit={handleCreatePlant} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif text-emerald-300 mb-1">Flower Species</label>
                  <select
                    value={plantType}
                    onChange={(e) => setPlantType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none"
                  >
                    <option value="eternal_rose">Rose of Eternal Love</option>
                    <option value="celestial_lily">Celestial Lily</option>
                    <option value="starlight_orchid">Starlight Orchid</option>
                    <option value="sunburst_flower">Sunburst Blossom</option>
                    <option value="moonlight_fern">Moonlight Fern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-serif text-emerald-300 mb-1">Blossom Name</label>
                  <input
                    type="text"
                    required
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="e.g. Blossom of Endless Nights"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif text-emerald-300 mb-1">Dedication Note</label>
                  <textarea
                    rows={3}
                    value={plantDed}
                    onChange={(e) => setPlantDed(e.target.value)}
                    placeholder="Dedication message"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddPlantOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-serif text-xs font-semibold"
                  >
                    Plant Blossom
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
