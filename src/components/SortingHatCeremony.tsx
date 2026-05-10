// ============================================
// SORTING HAT CEREMONY MODAL
// ============================================
// Shown automatically after the user's FIRST login.
// Calls the backend to permanently assign a Hogwarts house.
// The house assignment is done server-side (random, secure).

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import sortingHatImg from '@/assets/sorting-hat.png';

// House metadata
const HOUSE_META: Record<
  string,
  { colors: string; border: string; text: string; bg: string; crest: string; desc: string; glow: string }
> = {
  Gryffindor: {
    colors: 'from-red-950 via-red-900 to-yellow-900',
    border: 'border-red-500',
    text:   'text-yellow-300',
    bg:     'bg-red-950/80',
    glow:   'shadow-[0_0_40px_rgba(239,68,68,0.6),0_0_80px_rgba(239,68,68,0.3)]',
    crest:  '🦁',
    desc:   'Brave at heart, true Gryffindor!',
  },
  Hufflepuff: {
    colors: 'from-yellow-900 via-yellow-800 to-yellow-950',
    border: 'border-yellow-400',
    text:   'text-yellow-200',
    bg:     'bg-yellow-950/80',
    glow:   'shadow-[0_0_40px_rgba(234,179,8,0.6),0_0_80px_rgba(234,179,8,0.3)]',
    crest:  '🦡',
    desc:   'Loyal, patient, and unafraid of toil!',
  },
  Ravenclaw: {
    colors: 'from-blue-950 via-blue-900 to-indigo-900',
    border: 'border-blue-400',
    text:   'text-blue-200',
    bg:     'bg-blue-950/80',
    glow:   'shadow-[0_0_40px_rgba(59,130,246,0.6),0_0_80px_rgba(59,130,246,0.3)]',
    crest:  '🦅',
    desc:   'Wit beyond measure is a treasure!',
  },
  Slytherin: {
    colors: 'from-green-950 via-emerald-900 to-green-950',
    border: 'border-green-500',
    text:   'text-green-300',
    bg:     'bg-green-950/80',
    glow:   'shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(34,197,94,0.3)]',
    crest:  '🐍',
    desc:   'Cunning and ambitious, destined for greatness!',
  },
};

interface Props {
  onClose: () => void;
}

type Phase = 'intro' | 'thinking' | 'reveal' | 'done';

const SortingHatCeremony = ({ onClose }: Props) => {
  const { runSortingHat } = useAuth();
  const [phase,  setPhase]  = useState<Phase>('intro');
  const [house,  setHouse]  = useState<string | null>(null);
  const [error,  setError]  = useState('');

  // Kick off automatically after a 1s intro delay
  useEffect(() => {
    const timer = setTimeout(() => startCeremony(), 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCeremony = async () => {
    setPhase('thinking');
    try {
      // Small suspense delay before calling backend
      await new Promise((r) => setTimeout(r, 2800));

      const result = await runSortingHat();

      if (!result.success || !result.house) {
        setError(result.message || 'The Sorting Hat is confused. Try again later.');
        setPhase('intro');
        return;
      }

      setHouse(result.house);
      setPhase('reveal');

      // Auto-advance to done state
      setTimeout(() => setPhase('done'), 3000);
    } catch {
      setError('Something went wrong. Try again.');
      setPhase('intro');
    }
  };

  const meta = house ? HOUSE_META[house] : null;

  return (
    // Full-screen overlay
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md">

      {/* Particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-400 opacity-0 animate-sparkle-particle"
            style={{
              left:            `${Math.random() * 100}%`,
              top:             `${Math.random() * 100}%`,
              animationDelay:  `${Math.random() * 3}s`,
              animationDuration:`${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 rounded-2xl border-2 p-8 text-center transition-all duration-700 animate-fade-in
          ${meta ? `bg-gradient-to-br ${meta.colors} ${meta.border} ${meta.glow}` : 'bg-card border-border glow-gold'}`}
      >

        {/* ── INTRO PHASE ──────────────────────────────────────── */}
        {(phase === 'intro') && (
          <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-bold text-foreground text-glow mb-2">
              🎩 The Sorting Hat Ceremony
            </h2>
            <p className="font-medieval text-muted-foreground text-sm mb-6">
              Your house shall be decided...
            </p>
            <img src={sortingHatImg} alt="Sorting Hat" className="h-32 w-32 object-contain mx-auto drop-shadow-2xl" />
            {error && (
              <p className="mt-4 text-sm text-red-400 font-body">{error}</p>
            )}
          </div>
        )}

        {/* ── THINKING PHASE ───────────────────────────────────── */}
        {phase === 'thinking' && (
          <div className="animate-fade-in">
            <img
              src={sortingHatImg}
              alt="Sorting Hat"
              className="h-32 w-32 object-contain mx-auto drop-shadow-2xl animate-sorting-wobble"
              style={{ animationIterationCount: 'infinite', animationDuration: '1.2s' }}
            />
            <p className="mt-6 font-display text-xl font-bold text-primary text-glow animate-pulse">
              Hmm... let me think...
            </p>
            <p className="font-medieval text-sm text-muted-foreground mt-2">
              The Hat is searching your soul...
            </p>

            {/* Thinking dots */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── REVEAL PHASE ─────────────────────────────────────── */}
        {(phase === 'reveal' || phase === 'done') && meta && house && (
          <div className="animate-fade-in">
            <div
              className={`text-8xl mb-4 block animate-bounce`}
              style={{ filter: 'drop-shadow(0 0 20px currentColor)' }}
            >
              {meta.crest}
            </div>
            <p className="font-display text-sm font-semibold text-foreground/70 mb-1 uppercase tracking-widest">
              The Sorting Hat declares...
            </p>
            <h2 className={`font-display text-4xl font-bold ${meta.text} text-glow mb-2`}>
              {house}!
            </h2>
            <p className={`font-medieval text-lg ${meta.text} opacity-90 mb-6`}>
              {meta.desc}
            </p>

            {phase === 'done' && (
              <button
                onClick={onClose}
                className={`w-full py-3 rounded-lg font-display font-semibold text-lg transition-all active:scale-95
                  bg-primary text-primary-foreground hover:glow-gold-intense`}
              >
                Enter Hogwarts 🏰
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingHatCeremony;
