
import { useState, useCallback } from 'react';

export function useJoystick() {
  const [joystick, setJoystick] = useState({ x: 0, y: 0 });
  const [isFiring, setIsFiring] = useState(false);

  const handleJoystickMove = useCallback((x: number, y: number) => {
    setJoystick({ x, y });
  }, []);

  const handleFire = useCallback((firing: boolean) => {
    setIsFiring(firing);
  }, []);

  return { joystick, isFiring, handleJoystickMove, handleFire };
}
