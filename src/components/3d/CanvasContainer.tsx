'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';

interface CanvasContainerProps {
  children: ReactNode;
  fallback?: ReactNode;
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  onMouseMove?: (pos: { x: number; y: number }) => void;
}

export function CanvasContainer({
  children,
  fallback,
  camera = { position: [0, 2.2, 12], fov: 45 },
  onMouseMove,
}: CanvasContainerProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!onMouseMove) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    onMouseMove({ x, y });
  };

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#05070f]" />;
  }

  if (!hasWebGL) {
    return <>{fallback || <div className="absolute inset-0 bg-[#05070f]" />}</>;
  }

  return (
    <div className="absolute inset-0 w-full h-full" onPointerMove={handlePointerMove}>
      <Canvas
        camera={camera}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {children}
      </Canvas>
    </div>
  );
}
