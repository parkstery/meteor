
import React from 'react';

interface BulletProps {
  position: [number, number, number];
}

export const Bullet: React.FC<BulletProps> = ({ position }) => {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
      <meshBasicMaterial color="#ef4444" />
      <pointLight color="#ef4444" intensity={1} distance={1} />
    </mesh>
  );
};
