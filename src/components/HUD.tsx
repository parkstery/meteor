
import React from 'react';
import { Heart, Target } from 'lucide-react';
import { Joystick } from './Joystick';

interface HUDProps {
  lives: number;
  stage: number;
  score: number;
  gpsSpeed: number;
  onJoystickMove: (x: number, y: number) => void;
  onFireStart: () => void;
  onFireEnd: () => void;
  isGameOver: boolean;
  onRestart: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  lives,
  stage,
  score,
  gpsSpeed,
  onJoystickMove,
  onFireStart,
  onFireEnd,
  isGameOver,
  onRestart
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 select-none font-mono text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${i < lives ? 'fill-red-500 text-red-500' : 'text-white/20'}`}
              />
            ))}
          </div>
          <div className="text-sm opacity-70">SPEED: {(gpsSpeed * 3.6).toFixed(1)} km/h</div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold tracking-tighter">STAGE {stage}</div>
          <div className="text-sm opacity-70">SCORE: {score.toString().padStart(6, '0')}</div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center pointer-events-auto">
          <h1 className="text-6xl font-black italic mb-4 tracking-tighter">GAME OVER</h1>
          <p className="text-xl mb-8 opacity-70">FINAL SCORE: {score}</p>
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-emerald-400 transition-colors"
          >
            RETRY MISSION
          </button>
        </div>
      )}

      {/* Controls */}
      {!isGameOver && (
        <div className="flex justify-between items-end">
          <div className="pointer-events-auto">
            <Joystick onMove={onJoystickMove} />
          </div>
          
          <div className="pointer-events-auto">
            <button
              onMouseDown={onFireStart}
              onMouseUp={onFireEnd}
              onTouchStart={onFireStart}
              onTouchEnd={onFireEnd}
              className="w-24 h-24 bg-red-500/30 border-4 border-red-500 rounded-full flex items-center justify-center active:bg-red-500/60 active:scale-95 transition-all"
            >
              <Target className="w-10 h-10 text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
