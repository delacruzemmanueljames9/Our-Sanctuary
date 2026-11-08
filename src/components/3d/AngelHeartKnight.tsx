'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AngelHeartKnightProps {
  gateState: 'approaching' | 'greeting' | 'authenticating' | 'granted' | 'denied';
  mousePos?: { x: number; y: number };
}

export function AngelHeartKnight({ gateState, mousePos = { x: 0, y: 0 } }: AngelHeartKnightProps) {
  const knightGroupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const heartEmblemRef = useRef<THREE.Mesh>(null);
  const heartLightRef = useRef<THREE.PointLight>(null);
  const swordRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Materials: Silver-white armor, gold trim, glowing heart
  const materials = useMemo(() => {
    return {
      silverArmor: new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.85,
        roughness: 0.25,
        envMapIntensity: 1.2,
      }),
      goldTrim: new THREE.MeshStandardMaterial({
        color: '#d4af37',
        metalness: 0.95,
        roughness: 0.18,
        emissive: '#443405',
        emissiveIntensity: 0.2,
      }),
      whiteFeathers: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.6,
        metalness: 0.1,
      }),
      heartEmblem: new THREE.MeshStandardMaterial({
        color: '#ff2d55',
        emissive: '#ff2d55',
        emissiveIntensity: 1.5,
        toneMapped: false,
      }),
      bladeSteel: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        metalness: 0.98,
        roughness: 0.1,
      }),
      capeCloth: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.85,
        side: THREE.DoubleSide,
      }),
    };
  }, []);

  // Heart shape geometry for the chest emblem
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x, y + 0.15);
    shape.bezierCurveTo(x, y + 0.25, x - 0.2, y + 0.35, x - 0.3, y + 0.15);
    shape.bezierCurveTo(x - 0.35, y, x - 0.15, y - 0.15, x, y - 0.3);
    shape.bezierCurveTo(x + 0.15, y - 0.15, x + 0.35, y, x + 0.3, y + 0.15);
    shape.bezierCurveTo(x + 0.2, y + 0.35, x, y + 0.25, x, y + 0.15);

    const extrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Natural animations: idle breathing, wing flap, mouse tracking, gesture on granted/denied
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Idle breathing on main body
    if (knightGroupRef.current) {
      knightGroupRef.current.position.y = -1.2 + Math.sin(t * 1.5) * 0.03;
    }

    // Wings gentle idle flapping
    if (leftWingRef.current && rightWingRef.current) {
      const flap = Math.sin(t * 2) * 0.12;
      leftWingRef.current.rotation.y = 0.4 + flap;
      rightWingRef.current.rotation.y = -0.4 - flap;

      leftWingRef.current.rotation.z = Math.cos(t * 1.8) * 0.05;
      rightWingRef.current.rotation.z = -Math.cos(t * 1.8) * 0.05;
    }

    // Pulsing heart light
    if (heartLightRef.current && heartEmblemRef.current) {
      if (gateState === 'granted') {
        const pulse = 2.5 + Math.sin(t * 8) * 1.5;
        heartLightRef.current.intensity = pulse * 15;
        (heartEmblemRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
      } else if (gateState === 'denied') {
        heartLightRef.current.intensity = 1.0;
        (heartEmblemRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
      } else {
        const pulse = 1.2 + Math.sin(t * 2.5) * 0.4;
        heartLightRef.current.intensity = pulse * 6;
        (heartEmblemRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
      }
    }

    // Head smooth tracking toward mouse
    if (headRef.current) {
      const targetY = (mousePos.x * 0.4);
      const targetX = -(mousePos.y * 0.25);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetY, 0.05);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetX, 0.05);
    }

    // Arm gesture when entrance is granted (raising hand/blade in salute)
    if (rightArmRef.current) {
      if (gateState === 'granted') {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.2, 0.06);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.4, 0.06);
      } else if (gateState === 'denied') {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.3, 0.08);
      } else {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.0, 0.05);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.0, 0.05);
      }
    }
  });

  return (
    <group ref={knightGroupRef} position={[2.8, -1.2, 1.2]} rotation={[0, -0.45, 0]}>
      {/* --- TORSO & CHEST ARMOR --- */}
      <mesh material={materials.silverArmor} position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.34, 0.9, 16]} />
      </mesh>

      {/* Gold Trim Breastplate Collar */}
      <mesh material={materials.goldTrim} position={[0, 2.25, 0]}>
        <torusGeometry args={[0.38, 0.05, 12, 24]} />
      </mesh>

      {/* Gold Belt & Buckle */}
      <mesh material={materials.goldTrim} position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.12, 16]} />
      </mesh>
      <mesh material={materials.goldTrim} position={[0, 1.45, 0.35]}>
        <boxGeometry args={[0.2, 0.16, 0.08]} />
      </mesh>

      {/* --- GLOWING HEART EMBLEM --- */}
      <group position={[0, 1.95, 0.38]} scale={[0.8, 0.8, 0.8]}>
        <mesh ref={heartEmblemRef} geometry={heartGeometry} material={materials.heartEmblem} />
        <pointLight ref={heartLightRef} color="#ff3366" distance={4} intensity={6} />
      </group>

      {/* --- HEAD & HELMET --- */}
      <group ref={headRef} position={[0, 2.55, 0]}>
        {/* Silver Helmet */}
        <mesh material={materials.silverArmor} castShadow>
          <sphereGeometry args={[0.28, 20, 20]} />
        </mesh>
        {/* Golden Winged Visor Trim */}
        <mesh material={materials.goldTrim} position={[0, 0.02, 0.18]}>
          <boxGeometry args={[0.36, 0.08, 0.15]} />
        </mesh>
        {/* Helmet Crest Winglets */}
        <mesh material={materials.goldTrim} position={[0, 0.28, -0.05]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.06, 0.25, 0.3]} />
        </mesh>
        {/* Golden Halo / Circlet */}
        <mesh material={materials.goldTrim} position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.32, 0.025, 12, 32]} />
        </mesh>
      </group>

      {/* --- SHOULDERS (PAULDRONS) --- */}
      {/* Left Shoulder */}
      <group position={[-0.58, 2.15, 0]}>
        <mesh material={materials.silverArmor} rotation={[0, 0, 0.3]} castShadow>
          <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[0, 0.1, 0]}>
          <torusGeometry args={[0.22, 0.03, 12, 24]} />
        </mesh>
      </group>
      {/* Right Shoulder */}
      <group position={[0.58, 2.15, 0]}>
        <mesh material={materials.silverArmor} rotation={[0, 0, -0.3]} castShadow>
          <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[0, 0.1, 0]}>
          <torusGeometry args={[0.22, 0.03, 12, 24]} />
        </mesh>
      </group>

      {/* --- ARMS --- */}
      {/* Left Arm (Resting on sword pommel) */}
      <group position={[-0.55, 1.95, 0]}>
        <mesh material={materials.silverArmor} position={[0.1, -0.4, 0.2]} rotation={[0.4, -0.3, -0.3]}>
          <cylinderGeometry args={[0.11, 0.09, 0.75, 12]} />
        </mesh>
        {/* Golden Gauntlet */}
        <mesh material={materials.goldTrim} position={[0.22, -0.75, 0.38]}>
          <boxGeometry args={[0.14, 0.16, 0.18]} />
        </mesh>
      </group>

      {/* Right Arm (Dynamic gesture / salute) */}
      <group ref={rightArmRef} position={[0.55, 1.95, 0]}>
        <mesh material={materials.silverArmor} position={[-0.05, -0.4, 0.1]} rotation={[-0.2, 0.2, 0.2]}>
          <cylinderGeometry args={[0.11, 0.09, 0.75, 12]} />
        </mesh>
        {/* Golden Gauntlet */}
        <mesh material={materials.goldTrim} position={[-0.08, -0.78, 0.18]}>
          <boxGeometry args={[0.14, 0.16, 0.18]} />
        </mesh>
      </group>

      {/* --- TASSETS & LEGS --- */}
      {/* Tassets / Skirt Armor */}
      <mesh material={materials.silverArmor} position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.38, 0.44, 0.4, 16]} />
      </mesh>
      {/* Left Leg */}
      <group position={[-0.22, 0.65, 0]}>
        <mesh material={materials.silverArmor} castShadow>
          <cylinderGeometry args={[0.14, 0.11, 1.1, 12]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[0, 0.2, 0.12]}>
          <sphereGeometry args={[0.12, 12, 12]} />
        </mesh>
        {/* Sabaton / Boot */}
        <mesh material={materials.silverArmor} position={[0, -0.58, 0.08]}>
          <boxGeometry args={[0.18, 0.16, 0.32]} />
        </mesh>
      </group>
      {/* Right Leg */}
      <group position={[0.22, 0.65, 0]}>
        <mesh material={materials.silverArmor} castShadow>
          <cylinderGeometry args={[0.14, 0.11, 1.1, 12]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[0, 0.2, 0.12]}>
          <sphereGeometry args={[0.12, 12, 12]} />
        </mesh>
        {/* Sabaton / Boot */}
        <mesh material={materials.silverArmor} position={[0, -0.58, 0.08]}>
          <boxGeometry args={[0.18, 0.16, 0.32]} />
        </mesh>
      </group>

      {/* --- FEATHERED ANGELIC WINGS --- */}
      {/* Left Wing */}
      <group ref={leftWingRef} position={[-0.25, 2.1, -0.3]}>
        {/* Primary Feathers Wing Structure */}
        <mesh material={materials.whiteFeathers} position={[-0.8, 0.8, -0.2]} rotation={[0.2, -0.4, 0.6]}>
          <boxGeometry args={[0.12, 1.8, 0.7]} />
        </mesh>
        <mesh material={materials.whiteFeathers} position={[-1.3, 1.4, -0.3]} rotation={[0.1, -0.3, 0.9]}>
          <boxGeometry args={[0.08, 1.4, 0.5]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[-0.4, 0.4, -0.1]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.06, 0.08, 0.9, 8]} />
        </mesh>
      </group>

      {/* Right Wing */}
      <group ref={rightWingRef} position={[0.25, 2.1, -0.3]}>
        {/* Primary Feathers Wing Structure */}
        <mesh material={materials.whiteFeathers} position={[0.8, 0.8, -0.2]} rotation={[0.2, 0.4, -0.6]}>
          <boxGeometry args={[0.12, 1.8, 0.7]} />
        </mesh>
        <mesh material={materials.whiteFeathers} position={[1.3, 1.4, -0.3]} rotation={[0.1, 0.3, -0.9]}>
          <boxGeometry args={[0.08, 1.4, 0.5]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[0.4, 0.4, -0.1]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.06, 0.08, 0.9, 8]} />
        </mesh>
      </group>

      {/* --- CELESTIAL BROADSWORD --- */}
      <group ref={swordRef} position={[-0.32, 0.9, 0.55]} rotation={[0, 0, 0.08]}>
        {/* Golden Pommel & Crossguard */}
        <mesh material={materials.goldTrim} position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.5, 8]} />
        </mesh>
        <mesh material={materials.goldTrim} position={[0, 0.35, 0]}>
          <boxGeometry args={[0.65, 0.08, 0.12]} />
        </mesh>
        {/* Blade (Planted gracefully) */}
        <mesh material={materials.bladeSteel} position={[0, -0.6, 0]}>
          <boxGeometry args={[0.15, 1.8, 0.04]} />
        </mesh>
      </group>
    </group>
  );
}
