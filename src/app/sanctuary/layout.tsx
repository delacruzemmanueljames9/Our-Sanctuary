'use client';

import React from 'react';

export default function SanctuaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#05070f] text-[#eaf4ff] selection:bg-sanctuary-gold/30">
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
