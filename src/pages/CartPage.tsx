import { useCart } from '@/context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { galleonsToUSD } from '@/lib/currency';
import galleonImg from '@/assets/galleon.png';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const spellDiscount = Number(sessionStorage.getItem('spell-discount') || '0');
  const discountedTotal = totalPrice * (1 - spellDiscount / 100);

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

  return (
    <div className="min-h-screen container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-foreground text-glow mb-8 text-center">
        🛒 Your Magical Cart
      </h1>

      <div className="space-y-4">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card transition-all hover:border-primary/30">
            <div className="flex-shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
              ) : (
                <img src={galleonImg} alt="" className="h-8 w-8 object-contain" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-sm font-semibold text-foreground truncate">{product.name}</h3>
              <CurrencyDisplay galleons={product.price} size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors">
                <Minus className="h-3 w-3" />
              </button>
              <span className="font-display text-sm font-bold text-foreground w-6 text-center">{quantity}</span>
              <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors">
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="text-right w-20">
              <CurrencyDisplay galleons={product.price * quantity} size="sm" />
              <p className="text-[10px] text-muted-foreground">${galleonsToUSD(product.price * quantity)}</p>
            </div>
            <button onClick={() => removeFromCart(product.id)} className="p-1 text-destructive hover:text-destructive/80 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 rounded-xl border border-primary/30 bg-card glow-gold">
        <div className="flex justify-between items-center mb-4">
          <span className="font-body text-muted-foreground">Total Items:</span>
          <span className="font-display font-bold text-foreground">{totalItems}</span>
        </div>
        {spellDiscount > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="font-body text-muted-foreground">Spell Quiz Discount:</span>
            <span className="font-display font-bold text-green-400">-{spellDiscount}%</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <span className="font-body text-muted-foreground">Total (Galleons):</span>
          <span className="font-display text-2xl font-bold text-primary text-glow flex items-center gap-1">
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
        <div className="flex gap-3">
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border text-foreground font-display text-sm hover:bg-muted transition-all">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
          <button
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
