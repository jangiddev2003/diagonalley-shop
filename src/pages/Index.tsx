// 1. THIRD-PARTY IMPORTS
// Link is used from React Router to navigate between pages without refreshing the browser
import { Link } from 'react-router-dom';
// Lucide React provides modern, customizable SVG icons (Sparkles for magic, ArrowRight for links)
import { Sparkles, ArrowRight } from 'lucide-react';

// 2. COMPONENT IMPORTS
// This imports a custom component that formats and displays our magical currency
import { CurrencyInfo } from '@/components/CurrencyDisplay';

// 3. ASSET IMPORTS
// We import images directly into the module. Vite ensures these will have the correct paths.
import heroBanner from '@/assets/hero-banner.jpg';
import wandsImg from '@/assets/wands-category.jpg';
import broomsImg from '@/assets/brooms-category.jpg';
import booksImg from '@/assets/books-category.jpg';
import potionsImg from '@/assets/potions-category.jpg';
import robesImg from '@/assets/robes-category.jpg';
// We also import icons to display beside the category names
import wandIcon from '@/assets/wand-icon.png';
import broomIcon from '@/assets/broom-icon.png';
import bookIcon from '@/assets/book-icon.png';
import potionIcon from '@/assets/potion-icon.png';
import robesIcon from '@/assets/robes-icon.png';

// 4. DATA ARRAYS
// This array holds the data for the category grid we display on the homepage.
// Defining this as an array makes it easy to loop over it using .map() below.
const categories = [
  { path: '/wands', label: 'Wands', subtitle: "Ollivander's Finest", image: wandsImg, icon: wandIcon },
  { path: '/brooms', label: 'Brooms', subtitle: 'Racing & Travel', image: broomsImg, icon: broomIcon },
  { path: '/books', label: 'Spell Books', subtitle: 'Ancient Knowledge', image: booksImg, icon: bookIcon },
  { path: '/potions', label: 'Potions', subtitle: 'Elixirs & Draughts', image: potionsImg, icon: potionIcon },
  { path: '/robes', label: 'Robes', subtitle: 'Wizarding Attire', image: robesImg, icon: robesIcon },
];

// 5. MAIN COMPONENT
// This is the functional component for the Home page (Index).
const Index = () => (
  // min-h-screen ensures this div takes up at least the full height of the viewport
  <div className="min-h-screen">
    
    {/* HERO SECTION */}
    {/* This section contains the big welcoming image and text at the top of the page. */}
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center">
      {/* Background Image: 'absolute inset-0' stretches it to match the section size */}
      <img src={heroBanner} alt="Magical marketplace" className="absolute inset-0 w-full h-full object-cover" />
      
      {/* Gradient Overlay: Makes text easier to read by fading from a dark background to transparent */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      
      {/* Foreground Content: 'relative z-10' keeps it on top of the background image */}
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-4">
          {/* Sparkles icon using 'animate-float' for a magical floating effect */}
          <Sparkles className="h-8 w-8 text-primary animate-float" />
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground text-glow mb-4">
          Welcome to Diagonally
        </h1>
        <p className="font-medieval text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
          Your gateway to the finest magical wares in the wizarding world
        </p>

        {/* CTA (Call To Action) Button: Links to the full shop ('/wands') */}
        <Link
          to="/wands"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg transition-all hover:glow-gold-intense active:scale-95"
        >
          Enter the Marketplace <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    {/* CATEGORIES GRID SECTION */}
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
        Explore Our Shops
      </h2>
      <p className="text-center text-muted-foreground font-body mb-10">
        Every shop holds something magical
      </p>

      {/* CSS Grid is used to create columns that adjust based on screen size:
          grid-cols-1 for mobile, sm:grid-cols-2 for tablets, lg:grid-cols-3 for desktops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* We map over the 'categories' array to dynamically generate a card for each category */}
        {categories.map((cat, i) => (
          <Link
            // React requires a unique 'key' when looping over arrays to build UI elements
            key={cat.path}
            to={cat.path}
            // 'group' allows child elements to react when the parent card is hovered over
            className="group relative overflow-hidden rounded-xl border border-border transition-all duration-300 hover:border-primary/50 hover:glow-gold"
            // We stagger the animations so they appear one after the other
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="relative h-56 overflow-hidden">
              {/* The category image. We scale it up slightly (scale-110) when the 'group' is hovered. */}
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
            
            {/* Card text overlay placed at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                <img src={cat.icon} alt="" className="h-5 w-5 object-contain" />
                {cat.label}
              </h3>
              <p className="text-sm text-muted-foreground font-body">{cat.subtitle}</p>
              {/* Shows a tiny 'Browse ->' text that only fades in (opacity-100) on hover */}
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-display opacity-0 group-hover:opacity-100 transition-opacity">
                Browse <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* CURRENCY INFO SECTION */}
    <section className="container mx-auto px-4 pb-16">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="font-display text-xl font-bold text-foreground mb-6">
          Magical Currency
        </h2>
        {/* Render the CurrencyInfo component here */}
        <CurrencyInfo />
        <p className="mt-4 text-xs text-muted-foreground">All prices listed in Galleons • 1 Galleon ≈ £5 ($6.25)</p>
      </div>
    </section>
  </div>
);

// We export 'Index' so our React Router in App.tsx can use it.
export default Index;
