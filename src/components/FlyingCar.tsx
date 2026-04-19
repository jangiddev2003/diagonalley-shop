import { useState, useEffect, useRef } from 'react';
import flyingCarImg from '@/assets/flying-car.png';
import trainImg from '@/assets/hogwart_exp.png';

type Stage = 'IDLE' | 'SOLO_CAR' | 'CAR_WITH_TRAIN';

interface SequenceState {
  stage: Stage;
  fromLeft: boolean;
  startY: number;
  endY: number;
  id: number;
  runCount: number;
}

const FlyingCar = () => {
  const [seqState, setSeqState] = useState<SequenceState>({
    stage: 'IDLE',
    fromLeft: true,
    startY: 0,
    endY: 0,
    id: 0,
    runCount: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generates new random coordinates for the flight path
  const generateFlightParams = () => {
    const fromLeft = Math.random() > 0.5;
    const startY = 15 + Math.random() * 40;
    const endY = startY + (Math.random() * 20 - 10);
    return { fromLeft, startY, endY };
  };

  const startSequence = () => {
    const params = generateFlightParams();
    setSeqState((prev) => ({
      ...prev,
      stage: 'SOLO_CAR',
      ...params,
      id: Date.now(), // Unique ID forces a new render tree for the animation
    }));
  };

  // 1. Initial Start
  useEffect(() => {
    // Start the very first sequence after a small delay
    timerRef.current = setTimeout(() => {
      startSequence();
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 2. State Machine Transitions via onAnimationEnd
  const handleSoloCarEnd = () => {
    // When the solo car finishes, immediately send the car again with the train
    setSeqState((prev) => ({
      ...prev,
      stage: 'CAR_WITH_TRAIN',
      // Slightly alter the Y path so it doesn't look completely identical
      startY: prev.startY + (Math.random() * 10 - 5),
      endY: prev.endY + (Math.random() * 10 - 5),
      id: Date.now(),
    }));
  };

  const handleTrainEnd = () => {
    const nextCount = seqState.runCount + 1;
    
    // MODIFIED: Reduced max rotations to between 1 and 3 times per burst (previously 5 to 6)
    const MAX_RUNS = Math.floor(Math.random() * 3) + 1;

    // Once the train sequence is done, go IDLE.
    setSeqState((prev) => ({
      ...prev,
      stage: 'IDLE',
      runCount: nextCount,
    }));

    if (nextCount < MAX_RUNS) {
      timerRef.current = setTimeout(() => {
        startSequence();
      }, 3000); // 3 seconds gap between flights in the same burst so we don't wait forever to witness the train!
    } else {
      // MODIFIED: Increased the idle gap between entire bursts to 2-3 minutes.
      // 120,000ms (2 mins) minimum + up to 60,000ms (1 min) randomly.
      const gapDelayMs = 120000 + Math.floor(Math.random() * 60000);
      
      timerRef.current = setTimeout(() => {
        setSeqState((prev) => ({ ...prev, runCount: 0 }));
        startSequence();
      }, gapDelayMs);
    }
  };

  // Render nothing if idle
  if (seqState.stage === 'IDLE') return null;

  // Visual calculation
  const flipStyle = seqState.fromLeft ? 'scaleX(-1)' : 'none';
  const startX = seqState.fromLeft ? -30 : 130;
  const endX = seqState.fromLeft ? 130 : -30;
  const bgDrift = seqState.startY - 3; // Bobbing effect height

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">

      {/* --------------------
          STAGE 1: SOLO CAR 
          -------------------- */}
      {seqState.stage === 'SOLO_CAR' && (
        <img
          key={`solo-${seqState.id}`}
          src={flyingCarImg}
          alt="Magical Flying Car"
          onAnimationEnd={handleSoloCarEnd} // Tying the transition directly to the CSS completion!
          className="absolute h-12 md:h-16 object-contain"
          style={{
            transform: flipStyle,
            animation: 'fly-base 6s ease-in-out forwards',
            '--sx': `${startX}%`,
            '--sy': `${seqState.startY}%`,
            '--my': `${bgDrift}%`,
            '--ex': `${endX}%`,
            '--ey': `${seqState.endY}%`,
          } as React.CSSProperties}
        />
      )}

      {/* --------------------
          STAGE 2: CAR & TRAIN 
          -------------------- */}
      {seqState.stage === 'CAR_WITH_TRAIN' && (
        <>
          {/* Fleeing Car - Doesn't trigger state change, just animates */}
          <img
            key={`chased-${seqState.id}`}
            src={flyingCarImg}
            alt="Magical Flying Car"
            className="absolute h-10 md:h-14 object-contain"
            style={{
              transform: flipStyle,
              // Fixed at 8.0s so they travel at similar speeds
              animation: 'fly-base 8s ease-in-out forwards',
              '--sx': `${seqState.fromLeft ? startX + 5 : startX - 5}%`,
              // Removed vertical offset to match the train perfectly!
              '--sy': `${seqState.startY}%`,
              '--my': `${bgDrift}%`,
              '--ex': `${seqState.fromLeft ? endX + 5 : endX - 5}%`,
              '--ey': `${seqState.endY}%`,
            } as React.CSSProperties}
          />

          {/* Steam Train - Triggers IDLE state when done */}
          <div
            key={`train-container-${seqState.id}`}
            className="absolute flex items-center justify-center pointer-events-none"
            onAnimationEnd={handleTrainEnd}
            style={{
              // Synchronized speed and greatly reduced the percentage gap
              animation: 'fly-base 8.2s ease-in-out forwards',
              zIndex: -1,
              '--sx': `${seqState.fromLeft ? startX - 8 : startX + 8}%`,
              // Removed vertical offset to match the car perfectly!
              '--sy': `${seqState.startY}%`,
              '--my': `${bgDrift}%`,
              '--ex': `${seqState.fromLeft ? endX - 8 : endX + 8}%`,
              '--ey': `${seqState.endY}%`,
            } as React.CSSProperties}
          >
            {/* The smoke effect particles */}
            <div className={`absolute ${seqState.fromLeft ? '-left-10' : '-right-10'} -top-6 w-16 h-16 pointer-events-none`}>
              <span className="smoke-particle p1"></span>
              <span className="smoke-particle p2"></span>
              <span className="smoke-particle p3"></span>
              <span className="smoke-particle p4"></span>
            </div>

            <img
              src={trainImg}
              alt="Hogwarts Express"
              className="h-20 md:h-28 object-contain drop-shadow-2xl"
              style={{ transform: flipStyle }}
            />
          </div>
        </>
      )}

      {/* Reusable Keyframes using CSS Variables ensures pure reliability */}
      <style>{`
        .smoke-particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          filter: blur(5px);
          animation: smokeOut 2.5s infinite ease-out;
        }
        .smoke-particle.p1 { animation-delay: 0s; left: 10%; }
        .smoke-particle.p2 { animation-delay: 0.6s; left: 30%; width: 14px; height: 14px; }
        .smoke-particle.p3 { animation-delay: 1.2s; left: 60%; width: 12px; height: 12px; }
        .smoke-particle.p4 { animation-delay: 1.8s; left: 80%; width: 18px; height: 18px; filter: blur(7px); }
        
        @keyframes smokeOut {
          0% { transform: scale(1) translateY(0); opacity: 0.9; }
          100% { transform: scale(5) translateY(-40px); opacity: 0; }
        }

        /* ONE reusable keyframe relying strictly on the elements CSS Vars! */
        @keyframes fly-base {
          0% { left: var(--sx); top: var(--sy); }
          50% { top: var(--my); }
          100% { left: var(--ex); top: var(--ey); }
        }
      `}</style>
    </div>
  );
};

export default FlyingCar;
