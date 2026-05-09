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

/** Returns true if viewport width is <= 768px */
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

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
    const mobile = isMobile();
    // On mobile, keep the Y range tighter so elements stay visible
    const startY = mobile
      ? 20 + Math.random() * 30
      : 15 + Math.random() * 40;
    const endY = startY + (Math.random() * (mobile ? 10 : 20) - (mobile ? 5 : 10));
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
    // On mobile/small screens: skip the train, go straight to idle & schedule next
    if (isMobile()) {
      const nextCount = seqState.runCount + 1;
      const MAX_RUNS = Math.floor(Math.random() * 3) + 1;

      setSeqState((prev) => ({
        ...prev,
        stage: 'IDLE',
        runCount: nextCount,
      }));

      if (nextCount < MAX_RUNS) {
        timerRef.current = setTimeout(() => {
          startSequence();
        }, 3000);
      } else {
        const gapDelayMs = 120000 + Math.floor(Math.random() * 60000);
        timerRef.current = setTimeout(() => {
          setSeqState((prev) => ({ ...prev, runCount: 0 }));
          startSequence();
        }, gapDelayMs);
      }
      return;
    }

    // On tablet/laptop/desktop: send the car again with the train
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

  // Visual calculation — responsive offsets
  const mobile = isMobile();
  const flipStyle = seqState.fromLeft ? 'scaleX(-1)' : 'none';
  // On mobile, use tighter offsets so the elements don't fly too far off-screen
  const startX = seqState.fromLeft ? (mobile ? -20 : -30) : (mobile ? 110 : 130);
  const endX = seqState.fromLeft ? (mobile ? 110 : 130) : (mobile ? -20 : -30);
  const bgDrift = seqState.startY - 3; // Bobbing effect height

  // Gap between car and train — tighter on mobile so train stays visible
  const trainGapX = mobile ? 4 : 8;
  const carLeadX = mobile ? 3 : 5;

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
          className="absolute flying-car-solo object-contain"
          style={{
            transform: flipStyle,
            animation: `fly-base ${mobile ? '5s' : '6s'} ease-in-out forwards`,
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
            className="absolute flying-car-chased object-contain"
            style={{
              transform: flipStyle,
              animation: `fly-base ${mobile ? '6.5s' : '8s'} ease-in-out forwards`,
              '--sx': `${seqState.fromLeft ? startX + carLeadX : startX - carLeadX}%`,
              // Removed vertical offset to match the train perfectly!
              '--sy': `${seqState.startY}%`,
              '--my': `${bgDrift}%`,
              '--ex': `${seqState.fromLeft ? endX + carLeadX : endX - carLeadX}%`,
              '--ey': `${seqState.endY}%`,
            } as React.CSSProperties}
          />

          {/* Steam Train - Triggers IDLE state when done */}
          <div
            key={`train-container-${seqState.id}`}
            className="absolute flex items-center justify-center pointer-events-none"
            onAnimationEnd={handleTrainEnd}
            style={{
              animation: `fly-base ${mobile ? '6.7s' : '8.2s'} ease-in-out forwards`,
              zIndex: -1,
              '--sx': `${seqState.fromLeft ? startX - trainGapX : startX + trainGapX}%`,
              // Removed vertical offset to match the car perfectly!
              '--sy': `${seqState.startY}%`,
              '--my': `${bgDrift}%`,
              '--ex': `${seqState.fromLeft ? endX - trainGapX : endX + trainGapX}%`,
              '--ey': `${seqState.endY}%`,
            } as React.CSSProperties}
          >
            {/* The smoke effect particles */}
            <div className={`absolute ${seqState.fromLeft ? '-left-10' : '-right-10'} -top-6 smoke-container pointer-events-none`}>
              <span className="smoke-particle p1"></span>
              <span className="smoke-particle p2"></span>
              <span className="smoke-particle p3"></span>
              <span className="smoke-particle p4"></span>
            </div>

            <img
              src={trainImg}
              alt="Hogwarts Express"
              className="flying-train object-contain drop-shadow-2xl"
              style={{ transform: flipStyle }}
            />
          </div>
        </>
      )}

      {/* Reusable Keyframes using CSS Variables ensures pure reliability */}
      <style>{`
        /* Responsive sizes for the flying elements */
        .flying-car-solo {
          height: 2rem;       /* 32px — mobile default */
        }
        .flying-car-chased {
          height: 1.75rem;    /* 28px — mobile default */
        }
        .flying-train {
          height: 2.75rem;    /* 44px — mobile default */
        }
        .smoke-container {
          width: 2.5rem;
          height: 2.5rem;
        }

        /* Tablet and up */
        @media (min-width: 640px) {
          .flying-car-solo   { height: 2.5rem; }
          .flying-car-chased { height: 2.25rem; }
          .flying-train      { height: 4rem; }
          .smoke-container   { width: 3rem; height: 3rem; }
        }

        /* Desktop */
        @media (min-width: 768px) {
          .flying-car-solo   { height: 4rem; }
          .flying-car-chased { height: 3.5rem; }
          .flying-train      { height: 7rem; }
          .smoke-container   { width: 4rem; height: 4rem; }
        }

        .smoke-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          filter: blur(3px);
          animation: smokeOut 2.5s infinite ease-out;
        }
        @media (min-width: 768px) {
          .smoke-particle {
            width: 10px;
            height: 10px;
            filter: blur(5px);
          }
        }
        .smoke-particle.p1 { animation-delay: 0s; left: 10%; }
        .smoke-particle.p2 { animation-delay: 0.6s; left: 30%; width: 9px; height: 9px; }
        .smoke-particle.p3 { animation-delay: 1.2s; left: 60%; width: 8px; height: 8px; }
        .smoke-particle.p4 { animation-delay: 1.8s; left: 80%; width: 11px; height: 11px; filter: blur(5px); }
        @media (min-width: 768px) {
          .smoke-particle.p2 { width: 14px; height: 14px; }
          .smoke-particle.p3 { width: 12px; height: 12px; }
          .smoke-particle.p4 { width: 18px; height: 18px; filter: blur(7px); }
        }
        
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

