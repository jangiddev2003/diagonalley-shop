import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CurrencyInfo } from '@/components/CurrencyDisplay';
import heroBanner from '@/assets/hero-banner.jpg';
import wandsImg from '@/assets/wands-category.jpg';
import broomsImg from '@/assets/brooms-category.jpg';
import booksImg from '@/assets/books-category.jpg';
import potionsImg from '@/assets/potions-category.jpg';
import robesImg from '@/assets/robes-category.jpg';
import wandIcon from '@/assets/wand-icon.png';
import broomIcon from '@/assets/broom-icon.png';
import bookIcon from '@/assets/book-icon.png';
import potionIcon from '@/assets/potion-icon.png';
import robesIcon from '@/assets/robes-icon.png';

const categories = [
  { path: '/wands', label: 'Wands', subtitle: "Ollivander's Finest", image: wandsImg, icon: wandIcon },
  { path: '/brooms', label: 'Brooms', subtitle: 'Racing & Travel', image: broomsImg, icon: broomIcon },
  { path: '/books', label: 'Spell Books', subtitle: 'Ancient Knowledge', image: booksImg, icon: bookIcon },
  { path: '/potions', label: 'Potions', subtitle: 'Elixirs & Draughts', image: potionsImg, icon: potionIcon },
  { path: '/robes', label: 'Robes', subtitle: 'Wizarding Attire', image: robesImg, icon: robesIcon },
];

const Index = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center">
      <img src={heroBanner} alt="Magical marketplace" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary animate-float" />
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground text-glow mb-4">
          Welcome to Diagonally
        </h1>
        <p className="font-medieval text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
          Your gateway to the finest magical wares in the wizarding world
        </p>
        <Link
          to="/wands"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg transition-all hover:glow-gold-intense active:scale-95"
        >
          Enter the Marketplace <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    {/* Categories Grid */}
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
        Explore Our Shops
      </h2>
      <p className="text-center text-muted-foreground font-body mb-10">
        Every shop holds something magical
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <Link
            key={cat.path}
            to={cat.path}
            className="group relative overflow-hidden rounded-xl border border-border transition-all duration-300 hover:border-primary/50 hover:glow-gold"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                <img src={cat.icon} alt="" className="h-5 w-5 object-contain" />
                {cat.label}
              </h3>
              <p className="text-sm text-muted-foreground font-body">{cat.subtitle}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-display opacity-0 group-hover:opacity-100 transition-opacity">
                Browse <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* Currency info */}
    <section className="container mx-auto px-4 pb-16">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="font-display text-xl font-bold text-foreground mb-6">
          Magical Currency
        </h2>
        <CurrencyInfo />
        <p className="mt-4 text-xs text-muted-foreground">All prices listed in Galleons • 1 Galleon ≈ £5 ($6.25)</p>
      </div>
    </section>
  </div>
);

export default Index;
