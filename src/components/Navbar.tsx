import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Sparkles } from 'lucide-react';
import wandIcon from '@/assets/wand-icon.png';
import broomIcon from '@/assets/broom-icon.png';
import bookIcon from '@/assets/book-icon.png';
import potionIcon from '@/assets/potion-icon.png';
import robesIcon from '@/assets/robes-icon.png';

const navItems = [
  { path: '/wands', label: 'Wands', icon: wandIcon },
  { path: '/brooms', label: 'Brooms', icon: broomIcon },
  { path: '/books', label: 'Books', icon: bookIcon },
  { path: '/potions', label: 'Potions', icon: potionIcon },
  { path: '/robes', label: 'Robes', icon: robesIcon },
];

const extraLinks = [
  { path: '/sorting-hat', label: '🎩 Sorting Hat' },
  { path: '/spells', label: '⚡ Spells' },
  { path: '/platform', label: '🚂 9¾' },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('diagonally-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
    localStorage.setItem('diagonally-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-display text-xl font-bold text-primary text-glow">
            Diagonally
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medieval transition-all hover:bg-muted hover:text-primary flex items-center gap-1.5 ${
                location.pathname === item.path ? 'bg-muted text-primary glow-gold' : 'text-foreground'
              }`}
            >
              <img src={item.icon} alt="" className="h-4 w-4 object-contain" />
              {item.label}
            </Link>
          ))}
          {extraLinks.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medieval transition-all hover:bg-muted hover:text-primary ${
                location.pathname === item.path ? 'bg-muted text-primary glow-gold' : 'text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Lumos / Nox Toggle */}
          <button
            onClick={() => setIsDark(prev => !prev)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medieval border border-border bg-muted hover:bg-muted/80 hover:text-primary transition-all"
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDark ? '🕯️ Lumos' : '🌑 Nox'}
          </button>

          <Link
            to="/login"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medieval text-foreground hover:bg-muted hover:text-primary transition-all"
          >
            🔐
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medieval transition-all hover:bg-muted hover:text-primary"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 pb-4 animate-fade-in">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medieval transition-all hover:bg-muted ${
                location.pathname === item.path ? 'text-primary bg-muted' : 'text-foreground'
              }`}
            >
              <img src={item.icon} alt="" className="h-4 w-4 object-contain" />
              {item.label}
            </Link>
          ))}
          {extraLinks.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medieval transition-all hover:bg-muted ${
                location.pathname === item.path ? 'text-primary bg-muted' : 'text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medieval text-foreground hover:bg-muted"
          >
            🔐 Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
