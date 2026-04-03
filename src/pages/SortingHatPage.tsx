import { useState } from 'react';
import sortingHatImg from '@/assets/sorting-hat.png';

const houses = [
  {
    name: 'Gryffindor',
    colors: 'from-red-900 to-yellow-700',
    border: 'border-red-600',
    text: 'text-yellow-300',
    crest: '🦁',
    description: 'Brave at heart, true Gryffindor!',
    personality: 'You value courage above all else. You are daring, chivalrous, and determined. Your boldness inspires others to follow your lead, even in the darkest of times.',
  },
  {
    name: 'Hufflepuff',
    colors: 'from-yellow-700 to-yellow-900',
    border: 'border-yellow-500',
    text: 'text-yellow-200',
    crest: '🦡',
    description: 'Loyal, patient, and unafraid of toil!',
    personality: 'You are kind-hearted, dedicated, and fair. Your loyalty knows no bounds, and your patience makes you a trusted companion. Hufflepuffs are the heart of Hogwarts.',
  },
  {
    name: 'Ravenclaw',
    colors: 'from-blue-900 to-blue-700',
    border: 'border-blue-400',
    text: 'text-blue-200',
    crest: '🦅',
    description: 'Wit beyond measure is a treasure!',
    personality: 'You possess a sharp mind and endless curiosity. You value wisdom, creativity, and learning. Your intellect and originality set you apart from the crowd.',
  },
  {
    name: 'Slytherin',
    colors: 'from-green-900 to-emerald-700',
    border: 'border-green-500',
    text: 'text-green-200',
    crest: '🐍',
    description: 'Cunning and ambitious, destined for greatness!',
    personality: 'You are resourceful, ambitious, and determined to succeed. Your cunning mind finds the path others overlook. Great leaders often come from your ranks.',
  },
];

const SortingHatPage = () => {
  const [thought, setThought] = useState('');
  const [result, setResult] = useState<typeof houses[0] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;
    setResult(null);
    setIsAnimating(true);
    setTimeout(() => {
      const house = houses[Math.floor(Math.random() * houses.length)];
      setResult(house);
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-10 max-w-xl">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-2">
          🎩 The Sorting Hat
        </h1>
        <p className="font-medieval text-muted-foreground italic">
          Share your thought and discover your house
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <img
          src={sortingHatImg}
          alt="The Sorting Hat"
          className={`h-40 w-40 object-contain drop-shadow-lg ${isAnimating ? 'animate-sorting-wobble' : ''}`}
        />
      </div>

      <form onSubmit={handleSort} className="space-y-4 mb-8">
        <input
          type="text"
          value={thought}
          onChange={e => setThought(e.target.value)}
          placeholder="Share a one-line thought..."
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <button
          type="submit"
          disabled={isAnimating}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg hover:glow-gold-intense active:scale-95 transition-all disabled:opacity-50"
        >
          {isAnimating ? 'Hmm, let me think...' : 'Sort Me 🎩'}
        </button>
      </form>

      {result && (
        <div className={`rounded-xl border-2 ${result.border} bg-gradient-to-br ${result.colors} p-8 text-center animate-fade-in`}>
          <span className="text-6xl block mb-4">{result.crest}</span>
          <h2 className={`font-display text-3xl font-bold ${result.text} mb-2`}>
            {result.name}!
          </h2>
          <p className="font-medieval text-lg text-foreground/90 mb-4">{result.description}</p>
          
          {/* Personality insight */}
          <div className="mt-4 pt-4 border-t border-foreground/20">
            <p className="font-body text-sm text-foreground/80 italic leading-relaxed">
              ✨ {result.personality}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortingHatPage;
