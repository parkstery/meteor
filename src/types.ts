
export interface GameState {
  lives: number;
  stage: number;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  gpsSpeed: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: [number, number, number];
  type: 'meteor' | 'enemy' | 'boss' | 'bullet';
  health: number;
  size: number;
}
