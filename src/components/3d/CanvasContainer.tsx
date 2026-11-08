'use client';

import React, { useState, useEffect, ReactNode, useMemo } from 'react';
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

/** Detect device capability tier for adaptive 3D quality */
function useDeviceTier(): 'low' | 'mid' | 'high' {
  const [tier, setTier] = useState<'low' | 'mid' | 'high'>('mid');
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as any).deviceMemory ?? 4; // GB, Chrome only
    if (isMobile && (cores <= 4 || mem <= 2)) {
      setTier('low');
    } else if (isMobile) {
      setTier('mid');
    } else {
      setTier('high');
    }
  }, []);
  return tier;
}

export function CanvasContainer({
  children,
  fallback,
  camera = { position: [0, 2.2, 12], fov: 45 },
  onMouseMove,
}: CanvasContainerProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const tier = useDeviceTier();

  // Adaptive quality settings based on device capability
  const dpr = useMemo<[number, number]>(() => {
    if (tier === 'low') return [1, 1];
    if (tier === 'mid') return [1, 1.5];
    return [1, 2];
  }, [tier]);

  const glOptions = useMemo(() => ({
    antialias: tier !== 'low',
    alpha: true,
    powerPreference: tier === 'high' ? 'high-performance' : 'default' as WebGLPowerPreference,
    // Reduce precision on low-end devices
    precision: tier === 'low' ? 'mediump' : 'highp',
  }), [tier]);

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
        gl={glOptions}
        dpr={dpr}
        frameloop={tier === 'low' ? 'demand' : 'always'}
        performance={{ min: 0.5 }}
      >
        {children}
      </Canvas>
    </div>
  );
}
