'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { SanctuarySettings, AdminAuditLog } from '@/types/sanctuary';

export default function AdminControlCenter() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<SanctuarySettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'modules' | 'theme' | 'backup' | 'logs'>('modules');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Verify admin privileges server-side
    fetch('/api/auth/admin')
      .then((res) => res.json())
      .then((data) => {
        if (data.isAdmin) {
          setIsAdmin(true);
          fetchAdminData();
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
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Full control over sanctuary modules, celestial themes, backups, and audit ledgers.
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
              <span>Settings Synchronized</span>
            </motion.div>
          )}

          <button
            type="button"
            onClick={() => router.push('/sanctuary')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
          >
            Return Inside
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 hover:bg-red-900/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Control Room</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {[
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-serif tracking-wider transition-all whitespace-nowrap ${
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

      {/* Tab 1: Module Controls */}
      {activeTab === 'modules' && settings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.activeModules).map(([key, isEnabled]) => (
            <div
              key={key}
              className="p-5 rounded-3xl celestial-panel border border-slate-800 flex items-center justify-between"
            >
              <div>
                <h3 className="font-serif text-sm text-white capitalize">{key} Room</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEnabled ? 'Active in sanctuary navigation' : 'Temporarily suspended'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggleModule(key as any)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
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

      {/* Tab 2: Theme Settings */}
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
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
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

      {/* Tab 3: Database Backup */}
      {activeTab === 'backup' && (
        <div className="p-8 rounded-3xl celestial-panel border border-sanctuary-gold/30">
          <h2 className="text-lg font-serif text-white mb-2">Preservation & Export Vault</h2>
          <p className="text-xs text-slate-400 mb-6 max-w-xl">
            Export a full JSON backup of memories, albums, letters, garden plants, dreams, and calendar milestones. In accordance with zero-knowledge emotional privacy, personal journals are redacted from export bundles.
          </p>

          <button
            type="button"
            onClick={handleDownloadBackup}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-sanctuary-gold text-slate-950 font-serif text-xs font-semibold tracking-wider hover:bg-sanctuary-gold-light transition-all shadow-celestial-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Sanctuary Backup (.JSON)</span>
          </button>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
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
    </div>
  );
}
