// 1. IMPORTS
// Hook into our global CartContext to access the cart items and functions!
import { useCart } from '@/context/CartContext';
// Link is for standard navigation, useNavigate is for programmatic navigation (like buttons triggering a redirect)
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { galleonsToUSD } from '@/lib/currency';
import galleonImg from '@/assets/galleon.png';

// 2. MAIN COMPONENT
const CartPage = () => {
  // Destructure everything we need from our global cart state
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  // LOGIC: Check session storage to see if the user won a discount in the SpellCasting minigame
  const spellDiscount = Number(sessionStorage.getItem('spell-discount') || '0');
  
  // LOGIC: Calculate the newly discounted price mathematically
  const discountedTotal = totalPrice * (1 - spellDiscount / 100);

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

      {/* FINAL SUMMARY BOX */}
      <div className="mt-8 p-6 rounded-xl border border-primary/30 bg-card glow-gold">
        
        <div className="flex justify-between items-center mb-4">
          <span className="font-body text-muted-foreground">Total Items:</span>
          <span className="font-display font-bold text-foreground">{totalItems}</span>
        </div>
        
        {/* Only show the discount row if they actually HAVE a discount > 0 */}
        {spellDiscount > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="font-body text-muted-foreground">Spell Quiz Discount:</span>
            <span className="font-display font-bold text-green-400">-{spellDiscount}%</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-2">
          <span className="font-body text-muted-foreground">Total (Galleons):</span>
          <span className="font-display text-2xl font-bold text-primary text-glow flex items-center gap-1">
            {/* Use a boolean check (ternary operator) to output either the discounted total or normal total */}
            {spellDiscount > 0 ? discountedTotal.toFixed(0) : totalPrice}
            <img src={galleonImg} alt="G" className="h-6 w-6 object-contain" />
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <span className="font-body text-muted-foreground">Total (USD):</span>
          <span className="font-display text-lg font-bold text-foreground">
            ${galleonsToUSD(spellDiscount > 0 ? discountedTotal : totalPrice)}
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

      </div>
    </div>
  );
};

export default CartPage;
