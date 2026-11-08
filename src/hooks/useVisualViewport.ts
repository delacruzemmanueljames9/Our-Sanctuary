'use client';

import { useEffect, useState } from 'react';

/**
 * useVisualViewport — tracks the actual visible height of the screen.
 *
 * On iOS Safari and Android Chrome, when the virtual keyboard opens the
 * window height does NOT change — but window.visualViewport.height does.
 * We use this to calculate exactly how much space the keyboard is taking,
 * then apply it as an inline height so the chat layout always fits above it.
 *
 * Returns:
 *   viewportHeight — the visible screen height in px (excludes keyboard)
 *   keyboardHeight — the keyboard height in px (0 when keyboard is closed)
 */
export function useVisualViewport() {
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | null;
    if (!vv) return;

    const update = () => {
      const visibleHeight = vv.height;
      const kbHeight = Math.max(0, window.innerHeight - visibleHeight - vv.offsetTop);
      setViewportHeight(visibleHeight);
      setKeyboardHeight(kbHeight);
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);

    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return { viewportHeight, keyboardHeight };
}
