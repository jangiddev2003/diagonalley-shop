// 1. IMPORTS
// Hook into our global CartContext to access the cart items and functions!
import { useCart } from '@/context/CartContext';
// Link is for standard navigation, useNavigate is for programmatic navigation (like buttons triggering a redirect)
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Sparkles, Train, X, Package } from 'lucide-react';
import { toast } from 'sonner';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { galleonsToUSD } from '@/lib/currency';
import galleonImg from '@/assets/galleon.png';

// ──────────────────────────────────────────────
// COUPON VALIDATION HELPERS
// ──────────────────────────────────────────────

/** Valid coupon codes mapped to their discount percentages */
const getValidCoupon = (code: string): number | null => {
  const trimmed = code.trim().toUpperCase();

  // Check against the code stored by PlatformPage
  const storedCode = localStorage.getItem('platform-coupon-code');
  const storedDiscount = Number(localStorage.getItem('platform-coupon-discount') || '0');

  if (storedCode && trimmed === storedCode.toUpperCase() && storedDiscount > 0) {
    return storedDiscount;
  }

  // Fallback: validate pattern MAGIC{1-40} even if localStorage was cleared
  const match = trimmed.match(/^MAGIC(\d+)$/);
  if (match) {
    const pct = parseInt(match[1], 10);
    if (pct >= 1 && pct <= 40) return pct;
  }

  return null;
};

// ──────────────────────────────────────────────
// MAGICAL SOUND EFFECT
// ──────────────────────────────────────────────
const playMagicSound = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    // A magical ascending arpeggio
    osc.frequency.setValueAtTime(523, ctx.currentTime);       // C5
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
    osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.3); // C6
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Silently fail if audio isn't available
  }
};

// 2. MAIN COMPONENT
const CartPage = () => {
  // Destructure everything we need from our global cart state
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  // LOGIC: Check session storage to see if the user won a discount in the SpellCasting minigame
  const spellDiscount = Number(sessionStorage.getItem('spell-discount') || '0');

  // ──────────────────────────────────────────────
  // COUPON STATE
  // ──────────────────────────────────────────────
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Load previously saved coupon from localStorage on mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem('applied-platform-coupon');
    if (savedCoupon) {
      try {
        const parsed = JSON.parse(savedCoupon);
        if (parsed.code && parsed.discount > 0) {
          setAppliedCoupon(parsed);
        }
      } catch {
        // Invalid saved data, ignore
      }
    }
  }, []);

  // ──────────────────────────────────────────────
  // PRICE CALCULATIONS (STACKING DISCOUNTS)
  // ──────────────────────────────────────────────
  const platformDiscount = appliedCoupon?.discount || 0;

  // Apply Spell Quiz discount first, then Platform coupon discount
  // Both are percentage discounts that stack multiplicatively
  const afterSpellDiscount = totalPrice * (1 - spellDiscount / 100);
  const afterAllDiscounts = afterSpellDiscount * (1 - platformDiscount / 100);
  const finalTotal = afterAllDiscounts;

  // The total savings in galleons
  const totalSavings = totalPrice - finalTotal;

  // ──────────────────────────────────────────────
  // COUPON HANDLERS
  // ──────────────────────────────────────────────
  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess(false);

    const trimmed = couponInput.trim().toUpperCase();

    if (!trimmed) {
      setCouponError('Please enter a coupon code');
      return;
    }

    // Prevent applying the same coupon twice
    if (appliedCoupon && appliedCoupon.code === trimmed) {
      setCouponError('This coupon is already applied!');
      return;
    }

    const discount = getValidCoupon(trimmed);

    if (discount === null) {
      setCouponError('Invalid coupon code. Only codes from Platform 9¾ are accepted.');
      toast.error('Invalid coupon code! 🚫', {
        description: 'This is not a valid magical coupon.',
      });
      return;
    }

    // Apply with a brief magical animation
    setIsApplying(true);

    setTimeout(() => {
      const couponData = { code: trimmed, discount };
      setAppliedCoupon(couponData);
      setCouponSuccess(true);
      setCouponInput('');
      setIsApplying(false);

      // Save to localStorage for persistence
      localStorage.setItem('applied-platform-coupon', JSON.stringify(couponData));

      // Play magical sound
      playMagicSound();

      // Toast notification
      toast.success(`Coupon ${trimmed} applied! ✨`, {
        description: `You've unlocked a ${discount}% discount from Platform 9¾!`,
      });

      // Reset success animation after a delay
      setTimeout(() => setCouponSuccess(false), 3000);
    }, 800);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess(false);
    localStorage.removeItem('applied-platform-coupon');
    toast.info('Coupon removed', { description: 'Platform 9¾ discount has been cleared.' });
  };

  // LOGIC: Edge Case Guard!
  // If the cart array is completely empty, don't try to render the list. Show this empty state instead.
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h1 className="font-display text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="font-body text-muted-foreground">Time to explore the magical marketplace!</p>
        <Link to="/" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:glow-gold-intense transition-all">
          Browse Shops
        </Link>
        <Link to="/orders" className="flex items-center gap-2 px-6 py-2 rounded-lg border border-border text-foreground font-display font-semibold hover:bg-muted transition-all">
          <Package className="h-4 w-4" /> View Orders
        </Link>
      </div>
    );
  }

  // DEFAULT VIEW (If they have items)
  return (
    <div className="min-h-screen container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-foreground text-glow mb-8 text-center">
        🛒 Your Magical Cart
      </h1>

      {/* ITEMS LIST */}
      <div className="space-y-4">
        {/* We map over every item currently in the cart and generate a visual row for it */}
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card transition-all hover:border-primary/30">
            
            {/* THUMBNAIL */}
            <div className="flex-shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
              ) : (
                <img src={galleonImg} alt="" className="h-8 w-8 object-contain" />
              )}
            </div>
            
            {/* NAME & PRICE */}
            <div className="flex-1 min-w-0">
              {/* 'truncate' cuts off the text with "..." if the title is too long for the screen! */}
              <h3 className="font-display text-sm font-semibold text-foreground truncate">{product.name}</h3>
              <CurrencyDisplay galleons={product.price} size="sm" />
            </div>

            {/* QUANTITY CONTROLS */}
            <div className="flex items-center gap-2">
              <button 
                // Updating quantity down by passing (quantity - 1) to our Context function
                onClick={() => updateQuantity(product.id, quantity - 1)} 
                className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              
              <span className="font-display text-sm font-bold text-foreground w-6 text-center">{quantity}</span>
              
              <button 
                // Updating quantity UP by passing (quantity + 1)
                onClick={() => updateQuantity(product.id, quantity + 1)} 
                className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* ROW SUBTOTAL */}
            <div className="text-right w-20">
              <CurrencyDisplay galleons={product.price * quantity} size="sm" />
              <p className="text-[10px] text-muted-foreground">${galleonsToUSD(product.price * quantity)}</p>
            </div>
            
            {/* DELETE BUTTON */}
            <button 
              onClick={() => removeFromCart(product.id)} 
              className="p-1 text-destructive hover:text-destructive/80 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>

          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════
          PLATFORM 9¾ COUPON REDEMPTION SECTION
          ════════════════════════════════════════════════ */}
      <div className={`mt-8 p-5 rounded-xl border bg-card transition-all duration-500 ${
        appliedCoupon 
          ? 'border-green-500/50 coupon-applied-glow' 
          : 'border-primary/20 hover:border-primary/40'
      }`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Train className="h-5 w-5 text-primary" />
          <h3 className="font-display text-sm font-bold text-foreground">
            Redeem Magical Coupon
          </h3>
          <Sparkles className="h-4 w-4 text-primary/60 animate-sparkle" />
        </div>

        {appliedCoupon ? (
          /* ─── COUPON APPLIED STATE ─── */
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎫</span>
              <div>
                <p className="font-display text-xs font-bold text-green-400">
                  {appliedCoupon.code}
                </p>
                <p className="text-[11px] text-green-400/70 font-body">
                  Platform 9¾ — {appliedCoupon.discount}% OFF
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              title="Remove coupon"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* ─── COUPON INPUT STATE ─── */
          <>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyCoupon();
                  }}
                  placeholder="Enter coupon code..."
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-display tracking-wider placeholder:text-muted-foreground placeholder:tracking-normal placeholder:font-body focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all uppercase"
                  disabled={isApplying}
                  id="coupon-input"
                />
                {isApplying && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Sparkles className="h-4 w-4 text-primary animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={isApplying || !couponInput.trim()}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:glow-gold-intense active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                id="apply-coupon-btn"
              >
                {isApplying ? '✨ Casting...' : 'Apply Magic ✨'}
              </button>
            </div>

            {/* Error message */}
            {couponError && (
              <p className="mt-2 text-xs text-destructive font-body animate-fade-in">
                ⚠️ {couponError}
              </p>
            )}

            {/* Success animation */}
            {couponSuccess && (
              <div className="mt-2 text-xs text-green-400 font-body animate-fade-in flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Magical discount activated!
              </div>
            )}

            <p className="mt-2 text-[11px] text-muted-foreground font-body">
              🚂 Discover coupon codes by visiting Platform 9¾
            </p>
          </>
        )}
      </div>

      {/* ════════════════════════════════════════════════
          FINAL SUMMARY BOX
          ════════════════════════════════════════════════ */}
      <div className="mt-6 p-6 rounded-xl border border-primary/30 bg-card glow-gold">
        
        {/* Subtotal (before discounts) */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-body text-muted-foreground">Subtotal:</span>
          <span className="font-display font-bold text-foreground flex items-center gap-1">
            {totalPrice}
            <img src={galleonImg} alt="G" className="h-4 w-4 object-contain" />
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="font-body text-muted-foreground">Total Items:</span>
          <span className="font-display font-bold text-foreground">{totalItems}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 my-3" />
        
        {/* Spell Quiz Discount */}
        {spellDiscount > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="font-body text-muted-foreground">⚡ Spell Quiz Discount:</span>
            <span className="font-display font-bold text-green-400">-{spellDiscount}%</span>
          </div>
        )}

        {/* Platform 9¾ Coupon Discount */}
        {platformDiscount > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="font-body text-muted-foreground">🚂 Platform 9¾ Discount:</span>
            <span className="font-display font-bold text-green-400">-{platformDiscount}%</span>
          </div>
        )}

        {/* Total savings */}
        {(spellDiscount > 0 || platformDiscount > 0) && (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="font-body text-sm text-green-400/70">You save:</span>
              <span className="font-display text-sm font-bold text-green-400 flex items-center gap-1">
                {totalSavings.toFixed(1)}
                <img src={galleonImg} alt="G" className="h-3 w-3 object-contain opacity-70" />
                <span className="text-xs text-green-400/60">(${galleonsToUSD(totalSavings)})</span>
              </span>
            </div>
            <div className="border-t border-border/50 my-3" />
          </>
        )}

        {/* Final Total in Galleons */}
        <div className="flex justify-between items-center mb-2">
          <span className="font-body text-muted-foreground">Total (Galleons):</span>
          <span className="font-display text-2xl font-bold text-primary text-glow flex items-center gap-1">
            {Math.round(finalTotal)}
            <img src={galleonImg} alt="G" className="h-6 w-6 object-contain" />
          </span>
        </div>
        
        {/* Final Total in USD */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-body text-muted-foreground">Total (USD):</span>
          <span className="font-display text-lg font-bold text-foreground">
            ${galleonsToUSD(finalTotal)}
          </span>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex gap-3">
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border text-foreground font-display text-sm hover:bg-muted transition-all">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
          
          <button
            // Programmatically navigate to checkout
            onClick={() => navigate('/checkout')}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:glow-gold-intense active:scale-95 transition-all"
          >
            Buy Now ✨
          </button>
        </div>

        {/* VIEW ORDERS LINK */}
        <Link to="/orders" className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border/50 text-muted-foreground font-display text-xs hover:bg-muted hover:text-foreground transition-all">
          <Package className="h-3.5 w-3.5" /> View Past Orders
        </Link>

      </div>
    </div>
  );
};

export default CartPage;
