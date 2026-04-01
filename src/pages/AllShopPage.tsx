import { useState, useMemo } from 'react';
import { allProducts, Category } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';

const AllShopPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');

  const filtered = useMemo(() => {
    return allProducts
      .filter(p => category === 'all' || p.category === category)
      .filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
  }, [search, category]);

  return (
    <div className="min-h-screen container mx-auto px-4 py-10">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-2">
          ✨ The Full Marketplace
        </h1>
        <p className="font-medieval text-muted-foreground italic">Browse every magical item in one place</p>
      </div>

      <div className="space-y-6 mb-10">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-medieval text-xl text-muted-foreground">No magical items found... 🔮</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, i) => (
            <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllShopPage;
