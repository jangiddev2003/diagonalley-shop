import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, RotateCcw, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { ThreeDViewer } from './ThreeDModel';
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

const ProductViewer = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart! ✨`);
  };

  const fallbackIcon = categoryFallbackIcons[product.category] || wandIcon;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4 transition-all hover:border-primary/50 hover:glow-gold">
      <div className="relative h-48 flex items-center justify-center select-none overflow-hidden rounded-md bg-muted/20">
        {product.category === 'wands' ? (
          <ThreeDViewer productName={product.name} />
        ) : (
          <div className="transition-none">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-28 w-auto object-contain" />
            ) : (
              <img src={fallbackIcon} alt={product.category} className="h-20 w-20 object-contain" />
            )}
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-muted-foreground pointer-events-none">
          <RotateCcw className="h-3 w-3" /> {product.category === 'wands' ? 'Drag to rotate' : 'View'}
        </div>
      </div>
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground">{product.name}</h3>
        {product.details && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(product.details).map(([k, v]) => (
              <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                {k}: {v}
              </span>
            ))}
          </div>
        )}
        {product.rarity && product.rarity !== 'common' && (
          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-display font-bold ${
            product.rarity === 'legendary' ? 'bg-primary text-primary-foreground' : 'bg-accent text-primary'
          }`}>
            {product.rarity === 'legendary' ? '🏆' : '⭐'} {product.rarity.charAt(0).toUpperCase() + product.rarity.slice(1)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-primary text-glow flex items-center gap-1">
          {product.price} <Coins className="h-4 w-4" />
        </span>
        <button onClick={handleAdd} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-display font-semibold hover:glow-gold-intense active:scale-95 transition-all">
          <ShoppingCart className="h-3 w-3" /> Add
        </button>
      </div>
    </div>
  );
};

export default ProductViewer;
