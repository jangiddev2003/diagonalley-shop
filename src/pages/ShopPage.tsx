import { useState, useMemo } from 'react';
import { Category, categoryTitles, allProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import WandViewer from '@/components/WandViewer';
import { wands } from '@/data/products';

interface ShopPageProps {
  category: Category;
}

const ShopPage = ({ category }: ShopPageProps) => {
  const [search, setSearch] = useState('');
  const { title, subtitle } = categoryTitles[category];

  const products = useMemo(() => {
    return allProducts
      .filter(p => p.category === category)
      .filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
  }, [category, search]);

  return (
    <div className="min-h-screen container mx-auto px-4 py-10">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-2">
          {title}
        </h1>
        <p className="font-medieval text-muted-foreground italic">{subtitle}</p>
      </div>

      <div className="mb-8">
        <SearchBar value={search} onChange={setSearch} placeholder={`Search ${category}...`} />
      </div>

      {/* Special wand viewer for wands page */}
      {category === 'wands' && (
        <div className="mb-12">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">
            ✨ Interactive Wand Viewer — Drag to Rotate
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wands.filter(w => w.rarity === 'rare').map(w => (
              <WandViewer key={w.id} wand={w} />
            ))}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-medieval text-xl text-muted-foreground">No magical items found... 🔮</p>
          <p className="text-sm text-muted-foreground mt-2">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
