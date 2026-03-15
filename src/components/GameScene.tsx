
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Environment, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { Fighter } from './Fighter';
import { Meteor } from './Meteor';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';
import { Entity } from '../types';

interface GameSceneProps {
  joystick: { x: number; y: number };
  isFiring: boolean;
  gpsSpeed: number;
  onCollision: (type: string) => void;
  onEnemyKill: () => void;
  isGameOver: boolean;
}

const GameContent: React.FC<GameSceneProps> = ({
  joystick,
  isFiring,
  gpsSpeed,
  onCollision,
  onEnemyKill,
  isGameOver
}) => {
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 0]);
  const [playerRot, setPlayerRot] = useState<[number, number, number]>([0, 0, 0]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [bullets, setBullets] = useState<Entity[]>([]);
  const lastFireTime = useRef(0);
  const frameCount = useRef(0);

  // Game constants
  const BASE_SPEED = 0.2;
  const PLAYER_SPEED = 0.15;
  const SPAWN_RATE = 60; // frames
  const BOUNDS = { x: 8, y: 5 };

  useFrame((state) => {
    if (isGameOver) return;

    frameCount.current++;

    // Update player position based on joystick
    setPlayerPos((prev) => {
      const newX = THREE.MathUtils.clamp(prev[0] + joystick.x * PLAYER_SPEED, -BOUNDS.x, BOUNDS.x);
      const newY = THREE.MathUtils.clamp(prev[1] + joystick.y * PLAYER_SPEED, -BOUNDS.y, BOUNDS.y);
      return [newX, newY, 0];
    });

    // Update player rotation for banking effect
    setPlayerRot([
      joystick.y * 0.3,
      -joystick.x * 0.3,
      -joystick.x * 0.5
    ]);

    // Calculate current forward speed
    const currentSpeed = BASE_SPEED + gpsSpeed * 0.1;

    // Spawn entities
    if (frameCount.current % SPAWN_RATE === 0) {
      const type = Math.random() > 0.7 ? 'enemy' : 'meteor';
      const newEntity: Entity = {
        id: Math.random().toString(),
        position: [
          (Math.random() - 0.5) * BOUNDS.x * 2,
          (Math.random() - 0.5) * BOUNDS.y * 2,
          -50
        ],
        type,
        health: type === 'enemy' ? 2 : 1,
        size: type === 'meteor' ? 0.5 + Math.random() * 1.5 : 1
      };
      setEntities((prev) => [...prev, newEntity]);
    }

    // Handle firing
    if (isFiring && state.clock.elapsedTime - lastFireTime.current > 0.1) {
      const newBullet: Entity = {
        id: Math.random().toString(),
        position: [playerPos[0], playerPos[1], -1],
        type: 'bullet',
        health: 1,
        size: 0.1
      };
      setBullets((prev) => [...prev, newBullet]);
      lastFireTime.current = state.clock.elapsedTime;
    }

    // Update entities
    setEntities((prev) => {
      const next = prev
        .map((e) => ({
          ...e,
          position: [e.position[0], e.position[1], e.position[2] + currentSpeed] as [number, number, number]
        }))
        .filter((e) => e.position[2] < 10 && e.health > 0);

      // Collision detection: Player vs Entities
      next.forEach((e) => {
        const dx = e.position[0] - playerPos[0];
        const dy = e.position[1] - playerPos[1];
        const dz = e.position[2] - playerPos[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < (e.size + 0.5)) {
          onCollision(e.type);
          e.health = 0; // Destroy entity on collision
        }
      });

      return next;
    });

    // Update bullets
    setBullets((prev) => {
      const next = prev
        .map((b) => ({
          ...b,
          position: [b.position[0], b.position[1], b.position[2] - 1] as [number, number, number]
        }))
        .filter((b) => b.position[2] > -60);

      // Collision detection: Bullets vs Entities
      setEntities((entities) => {
        const updatedEntities = [...entities];
        next.forEach((bullet) => {
          updatedEntities.forEach((entity) => {
            if (entity.health <= 0) return;
            const dx = bullet.position[0] - entity.position[0];
            const dy = bullet.position[1] - entity.position[1];
            const dz = bullet.position[2] - entity.position[2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < entity.size) {
              entity.health -= 1;
              bullet.health = 0; // Bullet spent
              if (entity.health <= 0) {
                onEnemyKill();
              }
            }
          });
        });
        return updatedEntities;
      });

      return next.filter(b => b.health > 0);
    });
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="night" />

      <Fighter position={playerPos} rotation={playerRot} />

      {entities.map((e) => (
        e.type === 'meteor' ? (
          <Meteor key={e.id} position={e.position} size={e.size} />
        ) : (
          <Enemy key={e.id} position={e.position} />
        )
      ))}

      {bullets.map((b) => (
        <Bullet key={b.id} position={b.position} />
      ))}
      <Preload all />
    </>
  );
};

export const GameScene: React.FC<GameSceneProps> = (props) => {
  return (
    <div className="fixed inset-0 bg-slate-950">
      <Canvas shadows dpr={[1, 2]} key={props.isGameOver ? 'over' : 'active'}>
        <Suspense fallback={null}>
          <GameContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};
