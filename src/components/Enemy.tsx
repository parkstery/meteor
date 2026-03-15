
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnemyProps {
  position: [number, number, number];
}

export const Enemy: React.FC<EnemyProps> = ({ position }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x += Math.sin(state.clock.elapsedTime * 3) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={[0, Math.PI, 0]}>
      {/* Body */}
      <mesh>
        <coneGeometry args={[0.5, 1.5, 4]} />
        <meshStandardMaterial color="#991b1b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
    </group>
  );
};
