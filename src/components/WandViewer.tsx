// We import React's useState if we need local state (not currently used but often helpful)
import { useState } from 'react';
// Import the 'Product' type so TypeScript knows the exact structure of a wand
import { Product } from '@/data/products';
// We use a custom hook 'useCart' which provides access to our shopping cart logic
import { useCart } from '@/context/CartContext';
// Import some helpful icons from the 'lucide-react' library
import { ShoppingCart, RotateCcw, Coins } from 'lucide-react';
// Import 'toast' for showing small pop-up notifications
import { toast } from 'sonner';
// Import our custom 3D viewer component to render the wands
import { ThreeDViewer } from './ThreeDModel';

// This is the WandViewer component. It expects to receive a 'wand' object as a prop.
const WandViewer = ({ wand }: { wand: Product }) => {
  // Destructure the 'addToCart' function from our global cart context
  const { addToCart } = useCart();

  // This function is triggered when a user clicks the Add to Cart button
  const handleAdd = () => {
    // Add the specific wand to the global cart state
    addToCart(wand);
    // Show a success message pop-up
    toast.success(`${wand.name} added to cart! ✨`);
  };

  return (
    // The main container card with border, background, and padding
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      
      {/* 
          This section holds the 3D model.
          It has a fixed height, hidden overflow, and a subtle background. 
      */}
      <div className="relative h-48 flex items-center justify-center select-none overflow-hidden rounded-md bg-muted/20">
        {/* We pass the wand's name to our 3D viewer so it knows which wand to render */}
        <ThreeDViewer productName={wand.name} />
        
        {/* A small overlay icon and text hinting that the model can be rotated */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-muted-foreground pointer-events-none">
          <RotateCcw className="h-3 w-3" /> Drag to rotate
        </div>
      </div>
      
      {/* Container for the wand's textual information */}
      <div>
        {/* Display the name of the wand */}
        <h3 className="font-display text-sm font-semibold text-foreground">{wand.name}</h3>
        
        {/* If the wand has 'details' (like core, wood type), map over them and render pills */}
        {wand.details && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(wand.details).map(([k, v]) => (
               // A unique key is required for mapped items in React
              <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                {k}: {v}
              </span>
            ))}
          </div>
        )}
        
        {/* Conditionally render a "Rare" badge if the wand's rarity is exactly 'rare' */}
        {wand.rarity === 'rare' && (
          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-accent text-primary font-display font-bold">⭐ Rare</span>
        )}
      </div>
      
      {/* Bottom section grouping the price and the add-to-cart button */}
      <div className="flex items-center justify-between">
        {/* Show the price alongside a coin icon */}
        <span className="font-display font-bold text-primary text-glow flex items-center gap-1">
          {wand.price} <Coins className="h-4 w-4" />
        </span>
        
        {/* The button that triggers the 'handleAdd' function when clicked */}
        <button onClick={handleAdd} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-display font-semibold hover:glow-gold-intense active:scale-95 transition-all">
          <ShoppingCart className="h-3 w-3" /> Add
        </button>
      </div>
    </div>
  );
};

// Exporting it allows us to render <WandViewer /> anywhere else in the app!
export default WandViewer;
