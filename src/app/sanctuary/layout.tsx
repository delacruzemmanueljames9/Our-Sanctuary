'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SanctuaryNav } from '@/components/navigation/SanctuaryNav';
import { MochiChatModal } from '@/components/mochi/MochiChatModal';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';

export default function SanctuaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMochiOpen, setIsMochiOpen] = useState<boolean>(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);

  // Bottom navigation is hidden on the simplified Main Sanctuary welcome screen,
  // and stays present inside the sub-rooms!
  const isMainWelcomeScreen = pathname === '/sanctuary';

  return (
    <div className="relative min-h-screen bg-[#05070f] text-[#eaf4ff] selection:bg-sanctuary-gold/30">
      {/* Page Content */}
      <main className={isMainWelcomeScreen ? 'min-h-screen' : 'pb-28'}>
        {children}
      </main>

      {/* Floating Bottom Navigation — Visible inside specific rooms */}
      {!isMainWelcomeScreen && (
        <SanctuaryNav
          onOpenMochi={() => setIsMochiOpen(true)}
          onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        />
      )}

      {/* Mochi AI Companion Modal */}
      <MochiChatModal
        isOpen={isMochiOpen}
        onClose={() => setIsMochiOpen(false)}
      />

      {/* Admin Authentication Modal (Emman Super Admin only) */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
      />
    </div>
  );
}
