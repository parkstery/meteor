
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FighterProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

export const Fighter: React.FC<FighterProps> = ({ position, rotation }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle hovering effect
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.005;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Main Body */}
      <mesh>
        <boxGeometry args={[1, 0.3, 2]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[3, 0.1, 0.8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.2, 0.3]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.6} />
      </mesh>
      {/* Engines */}
      <mesh position={[-0.4, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.4, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Engine Glow */}
      <pointLight position={[0, 0, -1.2]} color="#fb923c" intensity={2} distance={2} />
    </group>
  );
};
