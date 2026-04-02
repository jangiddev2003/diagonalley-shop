import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Search } from 'lucide-react';
import castingWandImg from '@/assets/casting-wand.png';

const spells = [
  { name: 'Expelliarmus', effect: 'Disarming Charm — forces the opponent to release whatever they are holding.' },
  { name: 'Wingardium Leviosa', effect: 'Levitation Charm — makes objects fly. Swish and flick!' },
  { name: 'Accio', effect: 'Summoning Charm — summons an object to the caster.' },
  { name: 'Lumos', effect: 'Wand-Lighting Charm — illuminates the tip of the caster\'s wand.' },
  { name: 'Nox', effect: 'Counter-charm to Lumos — extinguishes the wand light.' },
  { name: 'Expecto Patronum', effect: 'Patronus Charm — conjures a spirit guardian against Dementors.' },
  { name: 'Alohomora', effect: 'Unlocking Charm — opens locked doors and windows.' },
  { name: 'Riddikulus', effect: 'Boggart-Banishing Spell — forces a Boggart to assume a comical form.' },
  { name: 'Stupefy', effect: 'Stunning Spell — renders the target unconscious.' },
  { name: 'Protego', effect: 'Shield Charm — creates a magical barrier to deflect spells.' },
  { name: 'Obliviate', effect: 'Memory Charm — erases specific memories from the target.' },
  { name: 'Petrificus Totalus', effect: 'Full Body-Bind Curse — temporarily paralyses the target.' },
];

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const SpellCastingPage = () => {
  const [search, setSearch] = useState('');
  const [selectedSpell, setSelectedSpell] = useState<typeof spells[0] | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  const filtered = spells.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const castSpell = useCallback((spell: typeof spells[0]) => {
    setSelectedSpell(spell);
    setIsCasting(true);

    // Generate sparkle particles
    const newParticles: SparkleParticle[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 12 + 4,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);

    setTimeout(() => setIsCasting(false), 2000);
  }, []);

  useEffect(() => {
    if (!isCasting) {
      const timer = setTimeout(() => setParticles([]), 500);
      return () => clearTimeout(timer);
    }
  }, [isCasting]);

  return (
    <div className="min-h-screen container mx-auto px-4 py-10 max-w-2xl cursor-[url('/placeholder.svg'),_auto]">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-2">
          ⚡ Cast a Spell
        </h1>
        <p className="font-medieval text-muted-foreground italic">
          Choose your spell wisely, young wizard
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <img
          src={castingWandImg}
          alt="Casting Wand"
          className={`h-32 w-32 object-contain drop-shadow-lg ${isCasting ? 'animate-spell-cast' : ''}`}
        />
      </div>

      {/* Spell result */}
      {selectedSpell && (
        <div className="relative mb-8 rounded-xl border border-primary/50 bg-card p-6 text-center glow-gold-intense animate-fade-in overflow-hidden">
          {particles.map(p => (
            <span
              key={p.id}
              className="absolute rounded-full bg-primary animate-sparkle-particle pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
          <h2 className="font-display text-2xl font-bold text-primary text-glow mb-2">
            "{selectedSpell.name}!"
          </h2>
          <p className="font-body text-sm text-muted-foreground">{selectedSpell.effect}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for a spell..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Spell list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(spell => (
          <button
            key={spell.name}
            onClick={() => castSpell(spell)}
            className={`group flex items-center gap-3 p-4 rounded-lg border text-left transition-all hover:glow-gold active:scale-95 ${
              selectedSpell?.name === spell.name
                ? 'border-primary/50 bg-card glow-gold'
                : 'border-border bg-card/50 hover:border-primary/30'
            }`}
          >
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 group-hover:animate-sparkle" />
            <div>
              <span className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {spell.name}
              </span>
              <p className="text-[11px] text-muted-foreground font-body line-clamp-1">{spell.effect}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpellCastingPage;
