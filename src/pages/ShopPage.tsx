// 1. IMPORTS
// We import React Hooks: useState (to hold data) and useMemo (to cache calculations so the app runs faster)
import { useState, useMemo } from 'react';
import { Category, categoryTitles, allProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductViewer from '@/components/ProductViewer';
import SearchBar from '@/components/SearchBar';

// 2. INTERFACES
// This page receives a 'category' prop from the router (e.g. 'wands' or 'potions')
// This means we can reuse this single "ShopPage" layout for every single category simply by passing a different prop!
interface ShopPageProps {
  category: Category;
}

// 3. MAIN COMPONENT
const ShopPage = ({ category }: ShopPageProps) => {
  // STATE: Keeps track of whatever text the user types into the search bar
  const [search, setSearch] = useState('');

  // Look up the correct Title and Subtitle dynamically based on the category prop
  const { title, subtitle } = categoryTitles[category];

  // LOGIC: useMemo remembers (memoizes) the result of this function.
  // It only re-calculates the array IF [category] or [search] changes.
  // This prevents React from wasting processing power filtering the giant array every time the user clicks a button.
  const products = useMemo(() => {
    return allProducts
      // Step 1: Only keep products that belong to the current category page we're on
      .filter(p => p.category === category)
      // Step 2: Only keep products whose name OR description matches what the user typed in the search bar
      .filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
  }, [category, search]); // These are the "dependencies"

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.rarity === 'rare' || p.rarity === 'legendary');
  }, [products]);

  // LOGIC: We want to show only "common" or "uncommon" items in the standard cards section.
  const standardProducts = useMemo(() => {
    return products.filter(p => p.rarity !== 'rare' && p.rarity !== 'legendary');
  }, [products]);

  return (
    // min-h-screen stretches container to the bottom of the page
    <div className="min-h-screen container mx-auto px-4 py-10">

      {/* HEADER SECTION */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-2">
          {title}
        </h1>
        <p className="font-medieval text-muted-foreground italic">{subtitle}</p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-8">
        {/* We pass the search state and our 'setSearch' modifying function directly into the SearchBar component */}
        <SearchBar value={search} onChange={setSearch} placeholder={`Search ${category}...`} />
      </div>

      {/* FEATURED ITEMS SECTION (Interactive Viewers) */}
      {/* If there are NO featured items (length is 0), this entire block is skipped! */}
      {featuredProducts.length > 0 && (
        <div className="mb-12">
          {(category === 'wands' || category === 'brooms') ? (
            <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">
              ✨ Interactive 360° Viewer — Drag to Rotate
            </h2>
          ) : (
            <h2 className="font-display text-xl font-bold text-foreground mb-4 text-center">
              ✨ Featured & Rare Collection
            </h2>
          )}
          {/* CSS Grid layout for the big viewers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Loop over our filtered featured array */}
            {featuredProducts.map(p => (
              <ProductViewer key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* STANDARD ITEMS SECTION (Normal Cards) */}
      {/* If the user searched for something random like "xyzzzz" and the list is empty, show this fallback message */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-medieval text-xl text-muted-foreground">No magical items found... 🔮</p>
          <p className="text-sm text-muted-foreground mt-2">Try a different search term</p>
        </div>
      ) : standardProducts.length > 0 && (
        /* Otherwise, grid out all the products that matched the search! */
        // MODIFIED: Capped the grid columns to 3 (removed xl:grid-cols-4) so it's always exactly 3 items per line max.
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardProducts.map((p, i) => (
            // The 'animationDelay' inline style makes them fade in one after the other in a staggering effect
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
