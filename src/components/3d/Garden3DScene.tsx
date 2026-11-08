'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GardenPlant } from '@/types/sanctuary';

// ─── Procedural Flower ────────────────────────────────────────────────────────

interface FlowerMeshProps {
  plant: GardenPlant;
  position: [number, number, number];
  selected: boolean;
  isWatering: boolean;
  onClick: () => void;
}

function petalColor(type: string): string {
  switch (type) {
    case 'eternal_rose': return '#e05070';
    case 'celestial_lily': return '#f8f0c0';
    case 'starlight_orchid': return '#40e0d0';
    case 'sunburst_flower': return '#ffb347';
    case 'moonlight_fern': return '#66cc88';
    default: return '#e8a0c0';
  }
}

// ─── Water Droplet Shower (Triggered when watering) ───────────────────────────

function WaterParticleShower({ position }: { position: [number, number, number] }) {
  const count = 45;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = position[0] + (Math.random() - 0.5) * 0.45;
      arr[i * 3 + 1] = position[1] + 0.8 + Math.random() * 0.9;
      arr[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.45;
    }
    return arr;
  }, [position]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - delta * 3.5;
      if (y < position[1]) {
        y = position[1] + 0.8 + Math.random() * 0.9;
      }
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#7dd3fc"
        size={0.06}
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FlowerMesh({ plant, position, selected, isWatering, onClick }: FlowerMeshProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const color = petalColor(plant.plantType);
  const stage = Math.min(Math.max(plant.growthStage, 1), 4);

  // Gentle sway animation + bounce response on watering
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.z = Math.sin(t * 0.8 + position[0]) * 0.04;
      groupRef.current.rotation.x = Math.sin(t * 0.6 + position[2]) * 0.02;

      if (isWatering) {
        groupRef.current.position.y = position[1] + Math.sin(t * 12) * 0.05;
        groupRef.current.scale.setScalar(1 + Math.sin(t * 8) * 0.08);
      } else if (selected) {
        groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.04;
        groupRef.current.scale.setScalar(1);
      } else {
        groupRef.current.position.y = position[1];
        groupRef.current.scale.setScalar(1);
      }
    }
  });

  const stemHeight = 0.3 + stage * 0.25;
  const bloomScale = stage >= 3 ? 1 : stage === 2 ? 0.6 : 0.3;
  const showFullBloom = stage >= 2;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Soil patch — darkens and glistens when watered */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 16]} />
        <meshStandardMaterial
          color={isWatering ? '#22140a' : '#4a3020'}
          roughness={isWatering ? 0.3 : 1}
          metalness={isWatering ? 0.4 : 0}
        />
      </mesh>

      {/* Stem */}
      <mesh position={[0, stemHeight / 2, 0]}>
        <cylinderGeometry args={[0.025, 0.035, stemHeight, 6]} />
        <meshStandardMaterial color="#2d7a40" roughness={0.8} />
      </mesh>

      {/* Leaves — stage 2+ */}
      {stage >= 2 && (
        <>
          <mesh position={[0.12, stemHeight * 0.4, 0]} rotation={[0.3, 0, -0.6]}>
            <planeGeometry args={[0.16, 0.08]} />
            <meshStandardMaterial color="#2d8a40" side={THREE.DoubleSide} roughness={0.7} />
          </mesh>
          <mesh position={[-0.12, stemHeight * 0.6, 0]} rotation={[-0.3, 0, 0.6]}>
            <planeGeometry args={[0.16, 0.08]} />
            <meshStandardMaterial color="#248840" side={THREE.DoubleSide} roughness={0.7} />
          </mesh>
        </>
      )}

      {/* Bloom head */}
      {showFullBloom && (
        <group position={[0, stemHeight + 0.02, 0]} scale={bloomScale}>
          {/* Petals */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 0.13,
                  0,
                  Math.sin(angle) * 0.13,
                ]}
                rotation={[0, angle, Math.PI / 8]}
              >
                <planeGeometry args={[0.14, 0.22]} />
                <meshStandardMaterial
                  color={color}
                  side={THREE.DoubleSide}
                  roughness={0.4}
                  emissive={color}
                  emissiveIntensity={isWatering ? 0.6 : selected ? 0.3 : 0.08}
                />
              </mesh>
            );
          })}
          {/* Center */}
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial
              color="#f5e070"
              roughness={0.5}
              emissive="#f0c820"
              emissiveIntensity={isWatering ? 0.5 : 0.2}
            />
          </mesh>
        </group>
      )}

      {/* Stage 1 — Tender Bud */}
      {!showFullBloom && (
        <mesh position={[0, stemHeight + 0.04, 0]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.5}
            emissive={color}
            emissiveIntensity={isWatering ? 0.4 : 0.1}
          />
        </mesh>
      )}

      {/* Selection / Water Glow Ring */}
      {(selected || isWatering) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.3, 24]} />
          <meshStandardMaterial
            color={isWatering ? '#38bdf8' : '#f5e070'}
            emissive={isWatering ? '#38bdf8' : '#f5e070'}
            emissiveIntensity={1.5}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// ─── Grass Blades ─────────────────────────────────────────────────────────────

function GrassField({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);

  useMemo(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 14;
      const scale = 0.5 + Math.random() * 0.5;
      dummy.position.set(x, 0.06, z);
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
      dummy.scale.set(scale, scale + Math.random() * 0.4, scale);
      dummy.updateMatrix();
      if (ref.current) ref.current.setMatrixAt(i, dummy.matrix);
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      ref.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      dummy.rotation.z = Math.sin(t * 1.2 + dummy.position.x * 0.5) * 0.08;
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.025, 0.22, 4]} />
      <meshStandardMaterial color="#3a7a3a" roughness={0.9} />
    </instancedMesh>
  );
}

// ─── Ground ───────────────────────────────────────────────────────────────────

function GardenGround() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18, 1, 1]} />
        <meshStandardMaterial color="#2d6030" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[7, 32]} />
        <meshStandardMaterial color="#3d2a14" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[6.6, 7.2, 32]} />
        <meshStandardMaterial color="#8a7060" roughness={1} />
      </mesh>
    </>
  );
}

// ─── Particle Petal Drift ─────────────────────────────────────────────────────

function PetalParticles() {
  const count = 35;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = Math.random() * 3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      pos.setY(i, (pos.getY(i) - 0.004 + 3) % 3);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.3 + i) * 0.002);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f4b8d0" size={0.045} transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

// ─── Main Garden Scene ────────────────────────────────────────────────────────

interface Garden3DSceneProps {
  plants: GardenPlant[];
  onSelectPlant: (plant: GardenPlant | null) => void;
  selectedPlantId: string | null;
  wateringPlantId?: string | null;
}

function computePosition(index: number, total: number): [number, number, number] {
  if (total === 0) return [0, 0, 0];
  const rings = [1, 6, 12, 18, 24];
  let ring = 0;
  let countSoFar = 0;
  let posInRing = index;
  for (let r = 0; r < rings.length; r++) {
    if (index < countSoFar + rings[r]) {
      ring = r;
      posInRing = index - countSoFar;
      break;
    }
    countSoFar += rings[r];
  }
  if (ring === 0) return [0, 0, 0];
  const radius = ring * 1.4;
  const angle = (posInRing / rings[ring]) * Math.PI * 2;
  const jitter = Math.sin(index * 73.1) * 0.3;
  return [
    Math.cos(angle) * radius + jitter,
    0,
    Math.sin(angle) * radius + jitter,
  ];
}

function GardenScene({ plants, onSelectPlant, selectedPlantId, wateringPlantId }: Garden3DSceneProps) {
  return (
    <>
      <color attach="background" args={['#0a1a0a']} />
      <fog attach="fog" args={['#0a1a0a', 10, 22]} />

      {/* Lighting */}
      <ambientLight intensity={0.65} color="#c8e8c0" />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.5}
        color="#fff8e8"
        castShadow
      />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffe090" distance={12} />
      <pointLight position={[-4, 2, -4]} intensity={0.3} color="#90d0ff" distance={8} />

      <GardenGround />
      <GrassField count={180} />
      <PetalParticles />

      {plants.map((plant, index) => {
        const pos = computePosition(index, plants.length);
        const isWatering = wateringPlantId === plant.id;
        return (
          <React.Fragment key={plant.id}>
            <FlowerMesh
              plant={plant}
              position={pos}
              selected={selectedPlantId === plant.id}
              isWatering={isWatering}
              onClick={() => onSelectPlant(selectedPlantId === plant.id ? null : plant)}
            />
            {/* Active Watering Shower Effect */}
            {isWatering && <WaterParticleShower position={pos} />}
          </React.Fragment>
        );
      })}

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={0.2}
        autoRotate={!selectedPlantId}
        autoRotateSpeed={0.35}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

// ─── Exported Wrapper ─────────────────────────────────────────────────────────

export function Garden3DScene({ plants, onSelectPlant, selectedPlantId, wateringPlantId }: Garden3DSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 5, 9], fov: 48 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <GardenScene
            plants={plants}
            onSelectPlant={onSelectPlant}
            selectedPlantId={selectedPlantId}
            wateringPlantId={wateringPlantId}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
