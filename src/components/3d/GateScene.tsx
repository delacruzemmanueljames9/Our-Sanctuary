'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AngelHeartKnight } from './AngelHeartKnight';

interface GateSceneProps {
  gateState: 'approaching' | 'greeting' | 'authenticating' | 'granted' | 'denied';
  onEntranceComplete?: () => void;
  mousePos?: { x: number; y: number };
}

export function GateScene({ gateState, onEntranceComplete, mousePos = { x: 0, y: 0 } }: GateSceneProps) {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const portalGlowRef = useRef<THREE.PointLight>(null);
  const runeGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const entranceProgressRef = useRef(0);

  // Materials for the Castle Gate
  const gateMaterials = useMemo(() => {
    return {
      pearlStone: new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.7,
        metalness: 0.15,
      }),
      darkIron: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.35,
        metalness: 0.8,
      }),
      goldFiligree: new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.2,
        metalness: 0.9,
        emissive: '#45350b',
        emissiveIntensity: 0.3,
      }),
      runeGlow: new THREE.MeshStandardMaterial({
        color: '#64dfdf',
        emissive: '#64dfdf',
        emissiveIntensity: 1.0,
      }),
      portalCore: new THREE.MeshBasicMaterial({
        color: '#fff3d1',
        transparent: true,
        opacity: 0.0,
      }),
    };
  }, []);

  // Procedural Stardust Particles
  const [particlePositions, particleColors] = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const goldColor = new THREE.Color('#d4af37');
    const etherColor = new THREE.Color('#64dfdf');
    const roseColor = new THREE.Color('#ffb7c5');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = Math.random() * 12 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const pick = Math.random();
      const c = pick < 0.4 ? goldColor : pick < 0.7 ? etherColor : roseColor;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Gentle particle floating
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(t + positions[i]) * 0.008;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Gate Doors Opening Animation on Granted
    if (leftDoorRef.current && rightDoorRef.current) {
      if (gateState === 'granted') {
        leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
          leftDoorRef.current.rotation.y,
          -Math.PI / 2.2,
          delta * 1.5
        );
        rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
          rightDoorRef.current.rotation.y,
          Math.PI / 2.2,
          delta * 1.5
        );

        if (portalGlowRef.current) {
          portalGlowRef.current.intensity = THREE.MathUtils.lerp(
            portalGlowRef.current.intensity,
            40,
            delta * 2
          );
        }

        // Camera moves forward through the gate
        entranceProgressRef.current += delta * 0.6;
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, -3.0, delta * 1.8);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.2, delta * 1.8);

        if (camera.position.z < -1.5 && onEntranceComplete) {
          onEntranceComplete();
        }
      } else {
        // Doors stay securely shut
        leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(leftDoorRef.current.rotation.y, 0, delta * 3);
        rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(rightDoorRef.current.rotation.y, 0, delta * 3);

        if (gateState === 'approaching') {
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8.5, delta * 1.2);
        } else {
          // Subtle responsive camera drift
          const targetX = mousePos.x * 0.8;
          const targetY = 1.6 + mousePos.y * 0.4;
          camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.8, 0.05);
        }
      }
    }

    // Rune pulsing
    if (runeGroupRef.current) {
      if (gateState === 'granted') {
        gateMaterials.runeGlow.emissiveIntensity = 3.0 + Math.sin(t * 10) * 1.5;
        gateMaterials.runeGlow.emissive.set('#ffd700');
      } else if (gateState === 'denied') {
        gateMaterials.runeGlow.emissiveIntensity = 0.4;
        gateMaterials.runeGlow.emissive.set('#ff4d6d');
      } else {
        gateMaterials.runeGlow.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.4;
        gateMaterials.runeGlow.emissive.set('#64dfdf');
      }
    }
  });

  return (
    <>
      {/* --- ATMOSPHERIC LIGHTING --- */}
      <ambientLight intensity={0.4} color="#1b2447" />
      <directionalLight position={[6, 10, 8]} intensity={1.8} color="#fff1db" castShadow />
      <directionalLight position={[-6, 5, -4]} intensity={0.8} color="#48bfe3" />

      {/* Internal warm glow behind the gate doors */}
      <pointLight ref={portalGlowRef} position={[0, 2.5, -3]} color="#ffeed1" intensity={3} distance={20} />

      {/* --- THE ANGEL HEART KNIGHT --- */}
      <AngelHeartKnight gateState={gateState} mousePos={mousePos} />

      {/* --- CASTLE GATE ARCHITECTURE --- */}
      <group position={[0, 0, 0]}>
        {/* Left Pearl Stone Pillar */}
        <mesh material={gateMaterials.pearlStone} position={[-2.4, 3, 0]} castShadow>
          <boxGeometry args={[1.2, 8, 1.2]} />
        </mesh>
        <mesh material={gateMaterials.goldFiligree} position={[-2.4, 7.2, 0]}>
          <coneGeometry args={[0.9, 1.6, 4]} />
        </mesh>

        {/* Right Pearl Stone Pillar */}
        <mesh material={gateMaterials.pearlStone} position={[2.4, 3, 0]} castShadow>
          <boxGeometry args={[1.2, 8, 1.2]} />
        </mesh>
        <mesh material={gateMaterials.goldFiligree} position={[2.4, 7.2, 0]}>
          <coneGeometry args={[0.9, 1.6, 4]} />
        </mesh>

        {/* Grand Arch Overhead */}
        <mesh material={gateMaterials.pearlStone} position={[0, 6.5, 0]}>
          <boxGeometry args={[6.0, 1.0, 1.4]} />
        </mesh>

        {/* Central Crown Heart Filigree on Arch Top */}
        <mesh material={gateMaterials.goldFiligree} position={[0, 7.4, 0]}>
          <torusGeometry args={[0.8, 0.1, 12, 32]} />
        </mesh>
        <mesh material={gateMaterials.runeGlow} position={[0, 7.4, 0]}>
          <octahedronGeometry args={[0.3, 0]} />
        </mesh>

        {/* --- RUNIC GLYPHS ACROSS ARCH --- */}
        <group ref={runeGroupRef} position={[0, 6.0, 0.6]}>
          {[-1.6, -0.8, 0, 0.8, 1.6].map((x, i) => (
            <mesh key={i} material={gateMaterials.runeGlow} position={[x, 0, 0]} rotation={[0, 0, (i % 2) * 0.78]}>
              <boxGeometry args={[0.18, 0.18, 0.05]} />
            </mesh>
          ))}
        </group>

        {/* --- TWIN GATE DOORS --- */}
        {/* Left Door Pivot */}
        <group ref={leftDoorRef} position={[-1.8, 0, 0]}>
          <group position={[0.9, 2.5, 0]}>
            {/* Iron Door Slab */}
            <mesh material={gateMaterials.darkIron} castShadow>
              <boxGeometry args={[1.75, 5.0, 0.15]} />
            </mesh>
            {/* Gold Filigree Heart Trim on Left Door */}
            <mesh material={gateMaterials.goldFiligree} position={[0, 0.2, 0.1]}>
              <torusGeometry args={[0.55, 0.04, 12, 24]} />
            </mesh>
            <mesh material={gateMaterials.goldFiligree} position={[0, -1.2, 0.1]}>
              <boxGeometry args={[1.4, 0.08, 0.04]} />
            </mesh>
            <mesh material={gateMaterials.goldFiligree} position={[0, 1.6, 0.1]}>
              <boxGeometry args={[1.4, 0.08, 0.04]} />
            </mesh>
          </group>
        </group>

        {/* Right Door Pivot */}
        <group ref={rightDoorRef} position={[1.8, 0, 0]}>
          <group position={[-0.9, 2.5, 0]}>
            {/* Iron Door Slab */}
            <mesh material={gateMaterials.darkIron} castShadow>
              <boxGeometry args={[1.75, 5.0, 0.15]} />
            </mesh>
            {/* Gold Filigree Heart Trim on Right Door */}
            <mesh material={gateMaterials.goldFiligree} position={[0, 0.2, 0.1]}>
              <torusGeometry args={[0.55, 0.04, 12, 24]} />
            </mesh>
            <mesh material={gateMaterials.goldFiligree} position={[0, -1.2, 0.1]}>
              <boxGeometry args={[1.4, 0.08, 0.04]} />
            </mesh>
            <mesh material={gateMaterials.goldFiligree} position={[0, 1.6, 0.1]}>
              <boxGeometry args={[1.4, 0.08, 0.04]} />
            </mesh>
          </group>
        </group>

        {/* Flagstone Entrance Pathway */}
        <mesh material={gateMaterials.pearlStone} position={[0, -0.1, 2]} receiveShadow>
          <boxGeometry args={[4.8, 0.2, 8]} />
        </mesh>
      </group>

      {/* --- FLOATING STARDUST PARTICLES --- */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
