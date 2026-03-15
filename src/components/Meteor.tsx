
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MeteorProps {
  position: [number, number, number];
  size: number;
}

export const Meteor: React.FC<MeteorProps> = ({ position, size }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationSpeed = useRef({
    x: Math.random() * 0.02,
    y: Math.random() * 0.02,
    z: Math.random() * 0.02
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed.current.x;
      meshRef.current.rotation.y += rotationSpeed.current.y;
      meshRef.current.rotation.z += rotationSpeed.current.z;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial color="#57534e" roughness={1} flatShading />
    </mesh>
  );
};
