'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';

interface RoomShellProps {
  children: React.ReactNode;
  className?: string;
}

export function RoomShell({ children, className = '' }: RoomShellProps) {
  const router = useRouter();
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  return (
    <div className={`relative min-h-screen bg-[#05070f] ${className}`}>
      {/* Fixed Top Bar: Back button (left) + Admin button (right) */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 pointer-events-none">
        <button
          type="button"
          onClick={() => router.push('/sanctuary?explore=true')}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700/60 text-xs text-slate-300 hover:text-sanctuary-gold hover:border-sanctuary-gold/40 backdrop-blur-sm transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-serif tracking-wide">Room Selection</span>
          <span className="sm:hidden font-serif tracking-wide">Back</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAdminAuthOpen(true)}
          className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-700/50 text-slate-500 hover:text-sanctuary-gold hover:border-sanctuary-gold/40 backdrop-blur-sm transition-all cursor-pointer"
          title="Admin Control Center (Emman Only)"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="text-[10px] font-serif hidden sm:inline">Admin</span>
        </button>
      </div>

      {/* Page content — padded below the fixed bar */}
      <div className="pt-14">
        {children}
      </div>

      <AdminAuthModal isOpen={isAdminAuthOpen} onClose={() => setIsAdminAuthOpen(false)} />
    </div>
  );
}
