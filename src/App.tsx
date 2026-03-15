/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { HUD } from './components/HUD';
import { useJoystick } from './hooks/useJoystick';
import { useGPS } from './hooks/useGPS';

// Lazy load the heavy 3D scene to prevent initialization blocking
const GameScene = lazy(() => import('./components/GameScene').then(m => ({ default: m.GameScene })));

export default function App() {
  const [lives, setLives] = useState(3);
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [invulnerable, setInvulnerable] = useState(false);

  const { joystick, isFiring, handleJoystickMove, handleFire } = useJoystick();
  const gpsSpeed = useGPS();

  // Orientation check
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscapeMode = window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscapeMode);
    };

    // Initial check
    checkOrientation();
    
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    // Also use matchMedia as a backup
    const mql = window.matchMedia('(orientation: landscape)');
    const handleMqlChange = (e: MediaQueryListEvent) => setIsLandscape(e.matches);
    mql.addEventListener('change', handleMqlChange);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      mql.removeEventListener('change', handleMqlChange);
    };
  }, []);

  const handleCollision = useCallback((type: string) => {
    if (invulnerable || isGameOver || !gameStarted) return;

    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setIsGameOver(true);
      }
      return newLives;
    });

    // Invulnerability period
    setInvulnerable(true);
    setTimeout(() => setInvulnerable(false), 2000);
  }, [invulnerable, isGameOver]);

  const handleEnemyKill = useCallback(() => {
    setScore((prev) => prev + 100);
  }, []);

  const handleRestart = () => {
    setLives(3);
    setScore(0);
    setStage(1);
    setIsGameOver(false);
    setInvulnerable(false);
  };

  // Stage progression logic
  useEffect(() => {
    if (score > 0 && score % 1000 === 0) {
      setStage(Math.floor(score / 1000) + 1);
    }
  }, [score]);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-black font-mono text-white"
      style={{ backgroundColor: '#020617' }} // Fallback for Tailwind delay
    >
      {/* Debug Mount Indicator */}
      <div className="absolute top-2 left-2 text-[8px] opacity-20 z-[10000] pointer-events-none">
        SYS_BOOT_OK
      </div>

      {!gameStarted ? (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-2 text-white">
              METEOR FIGHTER
            </h1>
            <div className="flex items-center justify-center gap-4 text-[10px] tracking-[0.2em] opacity-40 mb-2">
              <span>GPS: {gpsSpeed > 0 ? 'ACTIVE' : 'WAITING'}</span>
              <span>•</span>
              <span>ORIENTATION: {isLandscape ? 'LANDSCAPE' : 'PORTRAIT'}</span>
            </div>
            <p className="text-emerald-400 font-bold tracking-widest animate-pulse">SYSTEMS READY</p>
          </div>

          <div className="max-w-md space-y-2 mb-10 text-xs opacity-50">
            <p>• LEFT: MANEUVER | RIGHT: FIRE</p>
            <p>• REAL SPEED BOOSTS ENGINES</p>
          </div>

          {!isLandscape && (
            <div className="mb-6 p-3 border border-amber-500/30 bg-amber-500/5 rounded-lg text-amber-500 text-xs">
              <p className="font-bold mb-1 text-amber-400">LANDSCAPE RECOMMENDED</p>
            </div>
          )}

          <button
            onClick={() => setGameStarted(true)}
            className="px-14 py-4 bg-white text-black font-black text-xl rounded-full hover:bg-emerald-400 transition-all active:scale-95 shadow-xl"
          >
            START MISSION
          </button>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="flex items-center justify-center w-full h-full bg-slate-950">
                <div className="text-emerald-400 animate-pulse">INITIALIZING ENGINES...</div>
              </div>
            }>
              <GameScene
                joystick={joystick}
                isFiring={isFiring}
                gpsSpeed={gpsSpeed}
                onCollision={handleCollision}
                onEnemyKill={handleEnemyKill}
                isGameOver={isGameOver}
              />
            </Suspense>
          </div>
          
          <div className="absolute inset-0 z-10 pointer-events-none">
            <HUD
              lives={lives}
              stage={stage}
              score={score}
              gpsSpeed={gpsSpeed}
              onJoystickMove={handleJoystickMove}
              onFireStart={() => handleFire(true)}
              onFireEnd={() => handleFire(false)}
              isGameOver={isGameOver}
              onRestart={handleRestart}
            />
          </div>
        </>
      )}

      {/* Mobile Orientation Warning (Active Game) */}
      {gameStarted && !isLandscape && !isGameOver && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-10 text-center backdrop-blur-md">
          <div className="text-white max-w-xs">
            <h2 className="text-3xl font-black italic mb-2 tracking-tighter">ROTATE DEVICE</h2>
            <p className="opacity-60 text-sm mb-8">Landscape mode is required for optimal flight controls.</p>
            
            <button
              onClick={() => setIsLandscape(true)}
              className="px-6 py-2 border border-white/30 rounded-full text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
            >
              CONTINUE ANYWAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
