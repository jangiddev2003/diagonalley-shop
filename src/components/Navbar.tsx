// 1. IMPORTS
// React Router's Link is used instead of standard <a> tags so we can switch pages without reloading the whole website.
// useLocation lets us know what the current URL is so we can highlight the active button.
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Our custom cart context lets the navbar know how many items the user put in their cart.
import { useCart } from '@/context/CartContext';
// Our custom auth context lets the navbar know if the user is logged in.
import { useAuth } from '@/context/AuthContext';
// React Hooks: useState (to hold variables that change) and useEffect (to run code when things happen)
import { useState, useEffect } from 'react';
// We import some cool SVG icons from the lucide-react library
import { ShoppingCart, Menu, X, Sparkles, LogOut, User } from 'lucide-react';

// We import images directly into the component. Vite (our bundler) handles turning these into proper URLs.
import wandIcon from '@/assets/wand-icon.png';
import broomIcon from '@/assets/broom-icon.png';
import bookIcon from '@/assets/book-icon.png';
import potionIcon from '@/assets/potion-icon.png';
import robesIcon from '@/assets/robes-icon.png';

// 2. STATIC DATA
// This is a simple array defining our main navigation links. Creating data arrays like this keeps our HTML clean.
const navItems = [
  { path: '/wands', label: 'Wands', icon: wandIcon },
  { path: '/brooms', label: 'Brooms', icon: broomIcon },
  { path: '/books', label: 'Books', icon: bookIcon },
  { path: '/potions', label: 'Potions', icon: potionIcon },
  { path: '/robes', label: 'Robes', icon: robesIcon },
];

// Another array for the special/extra links
const extraLinks = [
  { path: '/sorting-hat', label: '🎩 Sorting Hat' },
  { path: '/spells', label: '⚡ Spells' },
  { path: '/platform', label: '🚂 9¾' },
];

// 3. MAIN COMPONENT
const Navbar = () => {
  // STATE: Get the total number of items from the shopping cart context.
  const { totalItems } = useCart();
  
  // STATE: Get authentication state from AuthContext
  const { user, isAuthenticated, logout } = useAuth();
  
  // STATE: Get the current route/URL from React Router
  const location = useLocation();
  const navigate = useNavigate();
  
  // STATE: Keep track of whether the mobile dropdown menu is currently open or closed (true/false)
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // STATE: Keep track of whether Dark Mode is active.
  // We use a "lazy initializer" (the function inside useState) so it only checks localStorage the FIRST time the component loads.
  const [isDark, setIsDark] = useState(() => {
    // Try to find a saved theme in the browser's storage
    const saved = localStorage.getItem('diagonally-theme');
    // If we found one, use it. If not, default to 'true' (Dark mode by default, because magic!)
    return saved ? saved === 'dark' : true;
  });

  // LOGIC: Theme Toggling Effect
  // useEffect watches the [isDark] variable. Whenever isDark changes, this code block runs!
  useEffect(() => {
    // Toggles a special 'light' CSS class on the very top <html> tag of the website.
    // If isDark is false, we add 'light'. If isDark is true, we remove 'light'.
    document.documentElement.classList.toggle('light', !isDark);
    
    // Save their preference to localStorage so their web browser remembers it next time they visit!
    localStorage.setItem('diagonally-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // LOGIC: Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    // 'sticky top-0 z-50' makes sure the navbar stays pasted to the top of the screen even as you scroll down.
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        
        {/* LOGO AREA */}
        {/* <Link> is like an <a> tag, but much faster for single-page React apps. */}
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-display text-xl font-bold text-primary text-glow">
            Diagonally
          </span>
        </Link>

        {/* DESKTOP NAVIGATION (Hidden on mobile phones via 'hidden lg:flex' utility classes) */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Loop over our navItems array and generate a Link for each one */}
          {navItems.map(item => (
            <Link
              // React ALWAYS needs a unique 'key' when making lists of elements
              key={item.path}
              to={item.path}
              // Here we check if the current browser URL matches the link's path. 
              // If yes, give it a bright 'glow-gold' background. If no, keep it normal.
              className={`px-3 py-2 rounded-md text-sm font-medieval transition-all hover:bg-muted hover:text-primary flex items-center gap-1.5 ${
                location.pathname === item.path ? 'bg-muted text-primary glow-gold' : 'text-foreground'
              }`}
            >
              <img src={item.icon} alt="" className="h-4 w-4 object-contain" />
              {item.label}
            </Link>
          ))}
          
          {/* Loop over our extraLinks the exact same way */}
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

        {/* RIGHT SIDE (Buttons, Cart, Auth, and Mobile Menu Toggle) */}
        <div className="flex items-center gap-2">
          
          {/* Theme Toggle Button (Lumos for Light / Nox for Dark) */}
          <button
            // When clicked, flip the isDark boolean to its opposite (!prev tells it to take the previous value and flip it)
            onClick={() => setIsDark(prev => !prev)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medieval border border-border bg-muted hover:bg-muted/80 hover:text-primary transition-all"
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDark ? '🕯️ Lumos' : '🌑 Nox'}
          </button>

          {/* AUTH SECTION: Show different buttons based on login state */}
          {isAuthenticated ? (
            // LOGGED IN: Show user greeting and logout button
            <div className="hidden sm:flex items-center gap-2">
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medieval text-primary">
                <User className="h-3.5 w-3.5" />
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medieval text-foreground hover:bg-muted hover:text-destructive transition-all"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            // NOT LOGGED IN: Show login link (same as original)
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medieval text-foreground hover:bg-muted hover:text-primary transition-all"
            >
              🔐
            </Link>
          )}

          {/* Shopping Cart Button */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medieval transition-all hover:bg-muted hover:text-primary"
          >
            <ShoppingCart className="h-5 w-5" />
            
            {/* If there are items in the cart, show the little red number badge! */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu "Hamburger" Button */}
          {/* 'lg:hidden' means it vanishes on large desktop screens! */}
          <button
            className="lg:hidden p-2 text-foreground"
            // Clicking toggles mobileOpen true or false
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {/* Show an 'X' icon if open, show a Hamburger (Menu) if closed */}
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROP DOWN MENU */}
      {/* If mobileOpen is 'true', this entire <div> will render. If 'false', it vanishes. */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 pb-4 animate-fade-in">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              // Clicking a link on mobile should automatically close the menu, so we set it back to false!
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

          {/* MOBILE AUTH SECTION */}
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medieval text-primary">
                <User className="h-3.5 w-3.5" />
                {user?.username}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medieval text-foreground hover:bg-muted w-full text-left"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
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
  );
};

export default Navbar;
