'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmotionalSpaceRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sanctuary/conversation');
  }, [router]);

  return (
    <div className="w-screen h-screen bg-[#05070f] flex items-center justify-center text-slate-500 font-serif text-xs">
      Redirecting to Talk to Emman...
    </div>
  );
}
