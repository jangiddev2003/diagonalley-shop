import { useState, useEffect } from 'react';
import flyingCarImg from '@/assets/flying-car.png';

interface CarInstance {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  flip: boolean;
}

const FlyingCar = () => {
  const [cars, setCars] = useState<CarInstance[]>([]);

  useEffect(() => {
    const spawnCar = () => {
      const fromLeft = Math.random() > 0.5;
      const y = 10 + Math.random() * 60;
      const car: CarInstance = {
        id: Date.now(),
        startX: fromLeft ? -20 : 120,
        startY: y,
        endX: fromLeft ? 120 : -20,
        endY: y + (Math.random() * 20 - 10),
        duration: 6 + Math.random() * 4,
        // Flip the sprite so it visually faces the direction it's moving.
        // (If the PNG is left-facing by default, `flip: fromLeft` makes right-movers face right.)
        flip: fromLeft,
      };
      setCars(prev => [...prev, car]);
      setTimeout(() => {
        setCars(prev => prev.filter(c => c.id !== car.id));
      }, car.duration * 1000 + 500);
    };

    // Spawn 2-3 times: at random intervals between 8-25 seconds
    const timers: NodeJS.Timeout[] = [];
    const scheduleNext = (count: number) => {
      if (count <= 0) return;
      const delay = 8000 + Math.random() * 17000;
      const t = setTimeout(() => {
        spawnCar();
        scheduleNext(count - 1);
      }, delay);
      timers.push(t);
    };
    // First one after a short delay
    const initial = setTimeout(() => {
      spawnCar();
      scheduleNext(2);
    }, 3000 + Math.random() * 5000);
    timers.push(initial);

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {cars.map(car => (
        <img
          key={car.id}
          src={flyingCarImg}
          alt=""
          className="absolute h-16 md:h-20 object-contain"
          style={{
            left: `${car.startX}%`,
            top: `${car.startY}%`,
            transform: car.flip ? 'scaleX(-1)' : 'none',
            animation: `fly-car-${car.id} ${car.duration}s linear forwards`,
          }}
        />
      ))}
      <style>{cars.map(car => `
        @keyframes fly-car-${car.id} {
          0% { left: ${car.startX}%; top: ${car.startY}%; }
          50% { top: ${car.startY - 5}%; }
          100% { left: ${car.endX}%; top: ${car.endY}%; }
        }
      `).join('')}</style>
    </div>
  );
};

export default FlyingCar;
