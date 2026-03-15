
import { useState, useEffect } from 'react';

export function useGPS() {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // speed is in meters per second
        const currentSpeed = position.coords.speed || 0;
        // Convert to km/h for display/logic if needed, but we'll use m/s
        setSpeed(currentSpeed);
      },
      (error) => {
        console.error('GPS Error:', error);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return speed;
}
