// 1. REACT IMPORTS
// React Hooks allow us to "hook" into React features like state and lifecycle methods.
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import our Product type so we know what data structure a product has
import { Product } from '@/data/products';

// 2. INTERFACES
// A CartItem isn't just a Product; it also needs a 'quantity' to know how many the user is buying!
export interface CartItem {
  product: Product;
  quantity: number;
}

// This interface defines everything our Context will provide to the rest of the app.
// If another component uses our CartContext, they will have access to all of these variables and functions.
interface CartContextType {
  items: CartItem[]; // The list of items currently in the cart
  addToCart: (product: Product) => void; // Function to add a single product
  removeFromCart: (productId: string) => void; // Function to remove an entire product completely
  updateQuantity: (productId: string, quantity: number) => void; // Function to change the amount (e.g. from 1 to 3)
  clearCart: () => void; // Function to empty the cart completely
  totalItems: number; // The total count of all items combined
  totalPrice: number; // The total cost of all items in galleons
}

// 3. CREATE THE CONTEXT
// Think of Context like a global broadcast station. Any component can "tune in" and listen for this data,
// without having to pass the data down manually through every parent component.
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. THE PROVIDER COMPONENT
// This component wraps around our whole application (in App.tsx).
// It actually 'holds' the data and the functions, and 'provides' them to its children.
export const CartProvider = ({ children }: { children: ReactNode }) => {
  
  // STATE: This variable holds the actual cart items.
  // We use a "lazy initializer" (the arrow function) so it only checks localStorage ONCE when it first loads.
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('diagonally-cart');
    // If there is saved cart data in the browser, parse it back into a JavaScript array. Otherwise, start empty [].
    return saved ? JSON.parse(saved) : [];
  });

  // EFFECT: Every time the 'items' array changes, we run this code!
  // This automatically saves the cart to the browser's memory, so if the user refreshes the page, their cart is still there.
  useEffect(() => {
    localStorage.setItem('diagonally-cart', JSON.stringify(items));
  }, [items]);

  // ACTIONS (Functions to modify the cart)
  
  // Adds a product to the cart
  const addToCart = (product: Product) => {
    setItems(prev => {
      // Check if the item is already in the cart
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        // If yes, map through the cart and increase the quantity of JUST that item by 1
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      // If no, add the new product to the end of the array with a quantity of 1
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Removes a product entirely by filtering it out of the array
  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  // Changes the quantity of an item
  const updateQuantity = (productId: string, quantity: number) => {
    // If they try to set the quantity to 0 or less, just remove it completely.
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    // Otherwise, find the item and update its quantity value to the new number
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  };

  // Resets the cart back to an empty array
  const clearCart = () => setItems([]);

  // DERIVED STATE (Data calculated automatically based on the 'items' array)
  // 'reduce' goes through every item in the cart and adds up all the quantities
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  // 'reduce' goes through every item, multiplies its price by its quantity, and adds it to the total running sum.
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Return the actual Provider component. We pass all our state and functions into the 'value' prop.
  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// 5. CUSTOM HOOK
// This is a helper function that makes it SUPER easy for other components to use the cart!
// Instead of importing useContext AND CartContext everywhere, they just: const cart = useCart();
export const useCart = () => {
  const ctx = useContext(CartContext);
  // Safety check: if someone tries to use useCart() outside of the CartProvider, it will throw a helpful error.
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
