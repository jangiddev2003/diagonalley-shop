// 1. IMPORTS
import { Product } from '@/data/products';
// useCart hook allows this component to add items directly to the global shopping cart
import { useCart } from '@/context/CartContext';
// Icons from lucide-react used for UI design
import { ShoppingCart, Star } from 'lucide-react';
// toast is used to show a small popup notification after adding to cart
import { toast } from 'sonner';
// Custom component to format the price display
import CurrencyDisplay from '@/components/CurrencyDisplay';
// Import the glowing 3D viewer for direct card display
import { ThreeDViewer } from '@/components/ThreeDModel';

// Fallback images just in case a product doesn't have an image specified
import wandIcon from '@/assets/wand-icon.png';
import broomIcon from '@/assets/broom-icon.png';
import bookIcon from '@/assets/book-icon.png';
import potionIcon from '@/assets/potion-icon.png';
import robesIcon from '@/assets/robes-icon.png';

// 2. HELPER DATA
// A dictionary mapping a category to its corresponding fallback image
const categoryFallbackIcons: Record<string, string> = {
  wands: wandIcon,
  brooms: broomIcon,
  books: bookIcon,
  potions: potionIcon,
  robes: robesIcon,
};

// 3. UTILITY FUNCTIONS
// Dynamically generates a background gradient for the product card based on its unique ID.
// This ensures that every card has a slightly different magical hue!
const getCardGradient = (id: string) => {
  // Extract a numerical value from the string ID
  const num = id.charCodeAt(1) || 0;
  // Calculate two different color hues mathematically
  const hue1 = 25 + (num * 7) % 20;
  const hue2 = 0 + (num * 13) % 30;
  // Return the CSS linear-gradient string
  return `linear-gradient(135deg, hsl(${hue1} 35% 14%) 0%, hsl(${hue2} 30% 16%) 100%)`;
};

// Tailwind CSS classes to color-code the "rarity" badges
const rarityColors: Record<string, string> = {
  common: 'bg-muted text-muted-foreground', // Gray/Neutral
  rare: 'bg-accent text-primary', // Special accent color
  legendary: 'bg-primary text-primary-foreground', // Bright gold/primary color
};

// 4. MAIN COMPONENT
// This component displays a single product. It takes a 'product' object as a prop.
const ProductCard = ({ product }: { product: Product }) => {
  
  // Extract the addToCart function from our global CartContext
  const { addToCart } = useCart();

  // Function called when the user clicks the "Add to Cart" button
  const handleAdd = () => {
    addToCart(product); // Add the item to context state
    // Trigger a popup notification showing the name and price
    toast.success(`${product.name} added to cart! ✨`, {
      description: `${product.price} Galleons`,
    });
  };

  // Determine what image to show if the product image is missing
  const fallbackIcon = categoryFallbackIcons[product.category] || wandIcon;

  return (
    <div
      // 'group' allows hovering over the card to trigger animations on its children
      className="group relative overflow-hidden rounded-lg border border-border transition-all duration-300 hover:border-primary/50 hover:glow-gold"
      // Apply the dynamically generated gradient background
      style={{ background: getCardGradient(product.id) }}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-48 overflow-hidden bg-muted/30 flex items-center justify-center">
        {product.category === 'wands' || product.category === 'brooms' ? (
          // If the product is a wand or broom, render the fully interactive 3D model!
          <ThreeDViewer productName={product.name} />
        ) : product.image ? (
          // If product has an image, render it and scale up slightly on hover (group-hover:scale-110)
          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          // Otherwise, show the fallback icon with a lower opacity
          <div className="group-hover:scale-110 transition-transform duration-500">
            <img src={fallbackIcon} alt={product.category} className="h-20 w-20 object-contain opacity-70" />
          </div>
        )}
        {/* A magical glowing shimmer effect that sweeps across the image on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity" 
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>

      {/* RARITY BADGE */}
      {/* Only show the rarity badge if it exists AND is not 'common' */}
      {product.rarity && product.rarity !== 'common' && (
        <div className="absolute top-3 right-3">
          {/* Apply the specific colors defined in rarityColors at the top of the file */}
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-display font-bold ${rarityColors[product.rarity]}`}>
            <Star className="h-3 w-3" />
            {product.rarity.charAt(0).toUpperCase() + product.rarity.slice(1)}
          </span>
        </div>
      )}

      {/* CONTENT/TEXT CONTAINER */}
      <div className="p-4 space-y-3">
        {/* Title. 'line-clamp-2' prevents it from taking up more than 2 lines if it's super long. */}
        <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 font-body">
          {product.description}
        </p>

        {/* DETAILS SECTION */}
        {/* Some products have extra details like 'wood: Holly', we display up to 2 of them here. */}
        {product.details && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(product.details).slice(0, 2).map(([key, val]) => (
              <span key={key} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground font-body">
                {key}: {val}
              </span>
            ))}
          </div>
        )}

        {/* FOOTER SECTION (Price and Add Button) */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <CurrencyDisplay galleons={product.price} size="sm" />
          
          <button
            onClick={handleAdd}
            // active:scale-95 makes the button physically shrink a tiny bit when clicked!
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
