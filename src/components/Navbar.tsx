// ============================================
// NAVBAR
// ============================================
// Adds profile avatar icon, SortingHat ceremony trigger, and ProfilePanel.
// All existing nav links, styling, and animations are preserved exactly.

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Sparkles, Package } from 'lucide-react';

// Lazy-load heavy panel components (code-split)
import ProfilePanel from '@/components/ProfilePanel';
import SortingHatCeremony from '@/components/SortingHatCeremony';

import wandIcon   from '@/assets/wand-icon.png';
import broomIcon  from '@/assets/broom-icon.png';
import bookIcon   from '@/assets/book-icon.png';
import potionIcon from '@/assets/potion-icon.png';
import robesIcon  from '@/assets/robes-icon.png';

const navItems = [
  { path: '/wands',   label: 'Wands',   icon: wandIcon   },
  { path: '/brooms',  label: 'Brooms',  icon: broomIcon  },
  { path: '/books',   label: 'Books',   icon: bookIcon   },
  { path: '/potions', label: 'Potions', icon: potionIcon },
  { path: '/robes',   label: 'Robes',   icon: robesIcon  },
];

const extraLinks = [
  { path: '/sorting-hat', label: '🎩 Sorting Hat' },
  { path: '/spells',      label: '⚡ Spells'      },
  { path: '/platform',   label: '🚂 9¾'           },
];

// House avatar icon map
const AVATAR_ICON: Record<string, string> = {
  gryffindor: '/icons8-gryffindor-50.ico',
  hufflepuff:  '/icons8-hufflepuff-50.ico',
  ravenclaw:   '/icons8-ravenclaw-50.ico',
  slytherin:   '/icons8-slytherin-50.ico',
};

// House border colours for the avatar ring
const AVATAR_RING: Record<string, string> = {
  gryffindor: 'ring-red-500',
  hufflepuff:  'ring-yellow-400',
  ravenclaw:   'ring-blue-400',
  slytherin:   'ring-green-500',
};

const Navbar = () => {
  const { totalItems }                           = useCart();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const location                                 = useLocation();
  const navigate                                 = useNavigate();

  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [showProfile,      setShowProfile]      = useState(false);
  const [showSortingHat,   setShowSortingHat]   = useState(false);
  const [sortingTriggered, setSortingTriggered] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('diagonally-theme');
    return saved ? saved === 'dark' : true;
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
    localStorage.setItem('diagonally-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // ── Trigger Sorting Hat once after first login ────────────────────
  // We watch for: authenticated + sortingCompleted === false
  // We use a local flag (sortingTriggered) to avoid showing it more than once per session.
  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      user &&
      !user.sortingCompleted &&
      !sortingTriggered
    ) {
      setSortingTriggered(true);
      // Small delay so the page can settle after login
      const t = setTimeout(() => setShowSortingHat(true), 800);
      return () => clearTimeout(t);
    }
  }, [isLoading, isAuthenticated, user, sortingTriggered]);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate('/');
    setMobileOpen(false);
  };

  const handleSortingHatClose = () => {
    setShowSortingHat(false);
  };

  // Avatar display
  const avatarIcon = user?.avatar ? AVATAR_ICON[user.avatar] ?? null : null;
  const avatarRing  = user?.avatar ? AVATAR_RING[user.avatar]  ?? 'ring-primary' : 'ring-primary';

  return (
    <>
      {/* ── Sorting Hat Ceremony (overlay) ─────────────────────── */}
      {showSortingHat && <SortingHatCeremony onClose={handleSortingHatClose} />}

      {/* ── Profile Panel (side drawer) ────────────────────────── */}
      {showProfile && (
        <ProfilePanel onClose={() => setShowProfile(false)} onLogout={handleLogout} />
      )}

      {/* ── Main Navbar ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-display text-xl font-bold text-primary text-glow">
              Diagonally
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
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
            {extraLinks.map((item) => (
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

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medieval border border-border bg-muted hover:bg-muted/80 hover:text-primary transition-all"
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {isDark ? '🕯️ Lumos' : '🌑 Nox'}
            </button>

            {/* AUTH SECTION */}
            {isAuthenticated ? (
              // ── Logged in: show avatar button ──────────────────
              <button
                id="profile-avatar-btn"
                onClick={() => setShowProfile(true)}
                title={`${user?.username} — View Profile`}
                className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-full ring-2 ${avatarRing}
                  bg-muted overflow-hidden hover:scale-110 transition-all duration-200 glow-gold p-0.5`}
              >
                {avatarIcon ? (
                  <img
                    src={avatarIcon}
                    alt={user?.avatar ?? 'avatar'}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain select-none"
                    style={{
                      imageRendering: 'crisp-edges',
                      filter: 'contrast(1.12) brightness(1.08) saturate(1.1) drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                    draggable={false}
                  />
                ) : (
                  <span className="text-xl">🧙</span>
                )}
              </button>
            ) : (
              // ── Logged out: show login link ─────────────────────
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medieval text-foreground hover:bg-muted hover:text-primary transition-all"
              >
                🔐
              </Link>
            )}

            {/* Orders */}
            <Link
              to="/orders"
              className={`hidden sm:flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medieval transition-all hover:bg-muted hover:text-primary ${
                location.pathname === '/orders' ? 'text-primary bg-muted' : 'text-foreground'
              }`}
              title="My Orders"
            >
              <Package className="h-5 w-5" />
            </Link>

            {/* Cart */}
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

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 pb-4 animate-fade-in">
            {navItems.map((item) => (
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
            {extraLinks.map((item) => (
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

            {/* Mobile Orders */}
            <Link
              to="/orders"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medieval transition-all hover:bg-muted ${
                location.pathname === '/orders' ? 'text-primary bg-muted' : 'text-foreground'
              }`}
            >
              📦 My Orders
            </Link>

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { setMobileOpen(false); setShowProfile(true); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medieval text-primary w-full text-left hover:bg-muted transition-all"
                >
                  {avatarIcon ? (
                    <img
                      src={avatarIcon}
                      alt={user?.avatar ?? 'avatar'}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain select-none"
                      style={{
                        imageRendering: 'crisp-edges',
                        filter: 'contrast(1.12) brightness(1.08) saturate(1.1) drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                      draggable={false}
                    />
                  ) : (
                    <span className="text-lg">🧙</span>
                  )}
                  {user?.username} — Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medieval text-foreground hover:bg-muted w-full text-left"
                >
                  🔐 Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medieval text-foreground hover:bg-muted"
              >
                🔐 Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
