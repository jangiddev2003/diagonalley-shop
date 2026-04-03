import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import wandIcon from '@/assets/wand-icon.png';
import broomIcon from '@/assets/broom-icon.png';
import bookIcon from '@/assets/book-icon.png';
import potionIcon from '@/assets/potion-icon.png';
import robesIcon from '@/assets/robes-icon.png';

const categoryFallbackIcons: Record<string, string> = {
  wands: wandIcon,
  brooms: broomIcon,
  books: bookIcon,
  potions: potionIcon,
  robes: robesIcon,
};

const getCardGradient = (id: string) => {
  const num = id.charCodeAt(1) || 0;
  const hue1 = 25 + (num * 7) % 20;
  const hue2 = 0 + (num * 13) % 30;
  return `linear-gradient(135deg, hsl(${hue1} 35% 14%) 0%, hsl(${hue2} 30% 16%) 100%)`;
};

const rarityColors: Record<string, string> = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-accent text-primary',
  legendary: 'bg-primary text-primary-foreground',
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart! ✨`, {
      description: `${product.price} Galleons`,
    });
  };

  const fallbackIcon = categoryFallbackIcons[product.category] || wandIcon;

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-border transition-all duration-300 hover:border-primary/50 hover:glow-gold"
      style={{ background: getCardGradient(product.id) }}
    >
      <div className="relative h-48 overflow-hidden bg-muted/30 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="group-hover:scale-110 transition-transform duration-500">
            <img src={fallbackIcon} alt={product.category} className="h-20 w-20 object-contain opacity-70" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity" 
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>

      {product.rarity && product.rarity !== 'common' && (
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-display font-bold ${rarityColors[product.rarity]}`}>
            <Star className="h-3 w-3" />
            {product.rarity.charAt(0).toUpperCase() + product.rarity.slice(1)}
          </span>
        </div>
      )}

      <div className="p-4 space-y-3">
        <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 font-body">
          {product.description}
        </p>

        {product.details && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(product.details).slice(0, 2).map(([key, val]) => (
              <span key={key} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground font-body">
                {key}: {val}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <CurrencyDisplay galleons={product.price} size="sm" />
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-display font-semibold transition-all hover:glow-gold-intense active:scale-95"
          >
            <ShoppingCart className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
