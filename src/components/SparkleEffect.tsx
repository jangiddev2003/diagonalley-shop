// 1. IMPORTS
import { useEffect, useState } from 'react';

// 2. INTERFACES
// This defines the mathematical attributes for a single floating sparkle particle
interface Sparkle {
  id: number;
  x: number; // Horizontal position (%)
  y: number; // Vertical position (%)
  size: number; // How big it is (pixels)
  delay: number; // How long to wait before it starts animating (seconds)
}

// 3. MAIN COMPONENT
const SparkleEffect = () => {
  // STATE: An array to hold our generated particles
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // LOGIC: As soon as the component loads, calculate all the math!
  useEffect(() => {
    // Array.from({length: 20}) creates an array with 20 empty slots.
    // We then map over it to fill each slot with a randomized Sparkle object.
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random number between 0 and 100
      y: Math.random() * 100, // Random number between 0 and 100
      size: Math.random() * 4 + 2, // Random size between 2 and 6 pixels
      delay: Math.random() * 5, // Random delay between 0 and 5 seconds
    }));
    // Save all 20 calculated sparkles into React State
    setSparkles(generated);
  }, []); // The empty array [] means "only run this equation one single time when the page loads"

  // RENDER: Now we physically draw them!
  return (
    // fixed inset-0 pointer-events-none: makes this invisible div cover the whole screen, but click-through
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      
      {/* Loop through all 20 calculations and turn each one into a real HTML div instance */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full animate-sparkle" // References tailwind.config keyframes
          // This is where the magic happens: mapping our math directly to inline CSS variables
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: 'hsl(var(--gold))',
            animationDelay: `${s.delay}s`,
            opacity: 0, // Starts invisible so they don't all flash onto screen at once!
          }}
        />
      ))}
    </div>
  );
};

export default SparkleEffect;
