'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface SanctuaryIslandProps {
  onSelectRoom?: (roomKey: string) => void;
  activeRoom?: string | null;
}

export function SanctuaryIsland({ onSelectRoom, activeRoom }: SanctuaryIslandProps) {
  const islandGroupRef = useRef<THREE.Group>(null);
  const houseGlowRef = useRef<THREE.PointLight>(null);
  const crystalsRef = useRef<THREE.Group>(null);
  const waterfallParticlesRef = useRef<THREE.Points>(null);

  // Materials
  const materials = useMemo(() => {
    return {
      grass: new THREE.MeshStandardMaterial({
        color: '#1e3a2f',
        roughness: 0.8,
        metalness: 0.1,
      }),
      pathStone: new THREE.MeshStandardMaterial({
        color: '#f1e6d0',
        roughness: 0.6,
      }),
      cliffRock: new THREE.MeshStandardMaterial({
        color: '#1c2438',
        roughness: 0.9,
        metalness: 0.2,
      }),
      houseWalls: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.7,
      }),
      houseRoof: new THREE.MeshStandardMaterial({
        color: '#223254',
        roughness: 0.4,
        metalness: 0.3,
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: '#d4af37',
        metalness: 0.9,
        roughness: 0.2,
        emissive: '#45350b',
        emissiveIntensity: 0.2,
      }),
      waterPool: new THREE.MeshStandardMaterial({
        color: '#48bfe3',
        roughness: 0.1,
        metalness: 0.6,
        transparent: true,
        opacity: 0.85,
      }),
      treeLeaves: new THREE.MeshStandardMaterial({
        color: '#2a5a44',
        roughness: 0.6,
      }),
      treeTrunk: new THREE.MeshStandardMaterial({
        color: '#3d2817',
        roughness: 0.9,
      }),
      crystalGlow: new THREE.MeshStandardMaterial({
        color: '#64dfdf',
        emissive: '#64dfdf',
        emissiveIntensity: 1.8,
        toneMapped: false,
      }),
      portalRing: new THREE.MeshStandardMaterial({
        color: '#ffd700',
        emissive: '#ffd700',
        emissiveIntensity: 1.2,
        wireframe: true,
      }),
    };
  }, []);

  // Waterfall particles falling into clouds
  const [waterfallPositions] = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 4.2 + (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 1] = Math.random() * -6;
      pos[i * 3 + 2] = -1.2 + (Math.random() - 0.5) * 0.8;
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Gentle floating island bobbing
    if (islandGroupRef.current) {
      islandGroupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
    }

    // Windows warm breathing glow
    if (houseGlowRef.current) {
      houseGlowRef.current.intensity = 8 + Math.sin(t * 2) * 2;
    }

    // Floating crystals hovering & rotating
    if (crystalsRef.current) {
      crystalsRef.current.rotation.y += delta * 0.3;
      crystalsRef.current.position.y = Math.sin(t * 1.5) * 0.2;
    }

    // Waterfall stream cycle
    if (waterfallParticlesRef.current) {
      const positions = waterfallParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= delta * 3.5;
        if (positions[i + 1] < -6) {
          positions[i + 1] = 0;
        }
      }
      waterfallParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={8}
        maxDistance={22}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={!activeRoom}
        autoRotateSpeed={0.5}
      />

      {/* --- ATMOSPHERIC LIGHTING --- */}
      <ambientLight intensity={0.45} color="#1b2447" />
      <directionalLight position={[10, 15, 8]} intensity={1.6} color="#fff2db" castShadow />
      <directionalLight position={[-10, 8, -6]} intensity={0.7} color="#64dfdf" />

      {/* --- FLOATING SANCTUARY ISLAND --- */}
      <group ref={islandGroupRef} position={[0, 0, 0]}>
        {/* Island Surface Plateau */}
        <mesh material={materials.grass} position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[6.5, 5.8, 1.2, 32]} />
        </mesh>

        {/* Island Rock Base & Hanging Stalactites */}
        <mesh material={materials.cliffRock} position={[0, -2.2, 0]}>
          <coneGeometry args={[6.0, 3.8, 16]} />
        </mesh>
        <mesh material={materials.cliffRock} position={[1.5, -4.2, 1.0]}>
          <coneGeometry args={[1.5, 3.0, 8]} />
        </mesh>
        <mesh material={materials.cliffRock} position={[-2.0, -3.8, -1.2]}>
          <coneGeometry args={[1.8, 2.5, 8]} />
        </mesh>

        {/* Winding Cobblestone Pathway */}
        <mesh material={materials.pathStone} position={[0, 0.62, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 4.5]} />
        </mesh>

        {/* --- THE CENTRAL SANCTUARY HOUSE --- */}
        <group position={[0, 0.6, -1.0]}>
          {/* Main House Base */}
          <mesh material={materials.houseWalls} position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[3.4, 2.4, 2.8]} />
          </mesh>

          {/* Steep Slate Roof */}
          <mesh material={materials.houseRoof} position={[0, 3.1, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[2.8, 1.8, 4]} />
          </mesh>

          {/* Roof Gold Finial Crest */}
          <mesh material={materials.goldAccent} position={[0, 4.1, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
          </mesh>

          {/* Chimney */}
          <mesh material={materials.cliffRock} position={[1.1, 3.0, -0.6]}>
            <boxGeometry args={[0.5, 1.6, 0.5]} />
          </mesh>

          {/* Front Door */}
          <mesh material={materials.treeTrunk} position={[0, 0.8, 1.42]}>
            <boxGeometry args={[0.9, 1.6, 0.1]} />
          </mesh>
          <mesh material={materials.goldAccent} position={[0.3, 0.8, 1.48]}>
            <sphereGeometry args={[0.05, 8, 8]} />
          </mesh>

          {/* Glowing Windows */}
          <mesh position={[-0.9, 1.4, 1.42]}>
            <planeGeometry args={[0.6, 0.7]} />
            <meshStandardMaterial emissive="#ffd166" emissiveIntensity={2.5} color="#ffd166" />
          </mesh>
          <mesh position={[0.9, 1.4, 1.42]}>
            <planeGeometry args={[0.6, 0.7]} />
            <meshStandardMaterial emissive="#ffd166" emissiveIntensity={2.5} color="#ffd166" />
          </mesh>

          {/* Interior House Light */}
          <pointLight ref={houseGlowRef} position={[0, 1.5, 0.5]} color="#ffd166" distance={8} intensity={8} />

          {/* Porch Lanterns */}
          <mesh material={materials.goldAccent} position={[-0.8, 1.6, 1.6]}>
            <boxGeometry args={[0.15, 0.25, 0.15]} />
          </mesh>
          <pointLight position={[-0.8, 1.6, 1.6]} color="#ffb703" distance={3} intensity={3} />
          <mesh material={materials.goldAccent} position={[0.8, 1.6, 1.6]}>
            <boxGeometry args={[0.15, 0.25, 0.15]} />
          </mesh>
          <pointLight position={[0.8, 1.6, 1.6]} color="#ffb703" distance={3} intensity={3} />
        </group>

        {/* --- WATER FEATURE: CELESTIAL POND & WATERFALL --- */}
        <group position={[4.0, 0.62, -1.2]}>
          {/* Pond Surface */}
          <mesh material={materials.waterPool} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.5, 24]} />
          </mesh>
          <pointLight position={[0, 0.5, 0]} color="#48bfe3" distance={5} intensity={4} />

          {/* Pond Border Stones */}
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
            const angle = (idx / 7) * Math.PI * 2;
            return (
              <mesh
                key={idx}
                material={materials.cliffRock}
                position={[Math.cos(angle) * 1.5, 0.1, Math.sin(angle) * 1.5]}
              >
                <sphereGeometry args={[0.3, 8, 8]} />
              </mesh>
            );
          })}

          {/* Falling Waterfall Stream */}
          <points ref={waterfallParticlesRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[waterfallPositions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.12}
              color="#a0e7e5"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>

        {/* --- SURROUNDING TREES & FLORA --- */}
        {/* Tree 1 (Left Grove) */}
        <group position={[-3.8, 0.6, 0.5]}>
          <mesh material={materials.treeTrunk} position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.18, 0.25, 2.4, 8]} />
          </mesh>
          <mesh material={materials.treeLeaves} position={[0, 2.5, 0]}>
            <coneGeometry args={[1.2, 2.0, 8]} />
          </mesh>
          <mesh material={materials.treeLeaves} position={[0, 3.4, 0]}>
            <coneGeometry args={[0.9, 1.6, 8]} />
          </mesh>
        </group>

        {/* Tree 2 (Back Right Grove) */}
        <group position={[-2.8, 0.6, -3.2]}>
          <mesh material={materials.treeTrunk} position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.16, 0.22, 2.0, 8]} />
          </mesh>
          <mesh material={materials.treeLeaves} position={[0, 2.2, 0]}>
            <coneGeometry args={[1.1, 1.8, 8]} />
          </mesh>
        </group>

        {/* Bioluminescent Flowers (Rose of Eternal Love, Celestial Lilies) */}
        {[
          { pos: [-1.8, 0.7, 3.2], col: '#ff2d55' },
          { pos: [-2.4, 0.7, 2.6], col: '#ff2d55' },
          { pos: [2.2, 0.7, 2.8], col: '#64dfdf' },
          { pos: [2.8, 0.7, 1.9], col: '#ffd700' },
          { pos: [-3.4, 0.7, -1.2], col: '#b5179e' },
        ].map((f, i) => (
          <group key={i} position={f.pos as [number, number, number]}>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.12, 10, 10]} />
              <meshStandardMaterial color={f.col} emissive={f.col} emissiveIntensity={1.8} />
            </mesh>
            <pointLight position={[0, 0.3, 0]} color={f.col} distance={2} intensity={2} />
          </group>
        ))}

        {/* --- FLOATING CELESTIAL CRYSTALS --- */}
        <group ref={crystalsRef} position={[0, 3.5, 0]}>
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh material={materials.crystalGlow} position={[4.8, 1.2, 2.0]} rotation={[0.4, 0.5, 0.2]}>
              <octahedronGeometry args={[0.4, 0]} />
            </mesh>
          </Float>
          <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1}>
            <mesh material={materials.crystalGlow} position={[-4.5, 2.0, -2.5]} rotation={[-0.3, 0.2, 0.4]}>
              <octahedronGeometry args={[0.5, 0]} />
            </mesh>
          </Float>
          <Float speed={2.2} rotationIntensity={0.8} floatIntensity={1.2}>
            <mesh material={materials.crystalGlow} position={[0, 4.0, -4.5]} rotation={[0.2, -0.4, 0.1]}>
              <octahedronGeometry args={[0.45, 0]} />
            </mesh>
          </Float>
        </group>
      </group>
    </>
  );
}
