import { useState, useRef, useCallback } from 'react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import wandIcon from '@/assets/wand-icon.png';

const WandViewer = ({ wand }: { wand: Product }) => {
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const { addToCart } = useCart();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - lastX.current;
    setRotation(prev => prev + delta * 0.5);
    lastX.current = e.clientX;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    lastX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - lastX.current;
    setRotation(prev => prev + delta * 0.5);
    lastX.current = e.touches[0].clientX;
  }, []);

  const handleAdd = () => {
    addToCart(wand);
    toast.success(`${wand.name} added to cart! ✨`);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div
        className="relative h-32 flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-md bg-muted/20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          className="transition-none"
          style={{ transform: `perspective(400px) rotateY(${rotation}deg)` }}
        >
          {wand.image ? (
            <img src={wand.image} alt={wand.name} className="h-24 w-auto object-contain" />
          ) : (
            <img src={wandIcon} alt="wand" className="h-20 w-20 object-contain" />
          )}
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-muted-foreground">
          <RotateCcw className="h-3 w-3" /> Drag to rotate
        </div>
      </div>
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground">{wand.name}</h3>
        {wand.details && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(wand.details).map(([k, v]) => (
              <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                {k}: {v}
              </span>
            ))}
          </div>
        )}
        {wand.rarity === 'rare' && (
          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-accent text-primary font-display font-bold">⭐ Rare</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-primary text-glow">{wand.price} 🪙</span>
        <button onClick={handleAdd} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-display font-semibold hover:glow-gold-intense active:scale-95 transition-all">
          <ShoppingCart className="h-3 w-3" /> Add
        </button>
      </div>
    </div>
  );
};

export default WandViewer;
