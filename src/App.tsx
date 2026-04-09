// 1. THIRD-PARTY LIBRARIES
// We import necessary tools from external libraries. 
// QueryClient helps us manage data fetching (like getting data from an API or database).
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// React Router allows our app to have multiple separate pages (URLs) without reloading the whole browser.
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 2. UI COMPONENTS & CONTEXTS
// Sonner is a library used to toast notifications (like "Added to cart!")
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// The CartProvider wraps our app and allows any component inside to access the shopping cart data.
import { CartProvider } from "@/context/CartContext";

// 3. GLOBAL COMPONENTS
// These components usually appear on every page (like the Navbar at the top and Footer at the bottom).
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Fun magical effects that run constantly in the background across all pages
import SparkleEffect from "@/components/SparkleEffect";
import FlyingCar from "@/components/FlyingCar";
import MagicCursor from "@/components/MagicCursor";

// 4. PAGES
// We import all the individual "Views" or "Pages" that the user can navigate to.
import Index from "./pages/Index";
import ShopPage from "./pages/ShopPage";
import AllShopPage from "./pages/AllShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SortingHatPage from "./pages/SortingHatPage";
import SpellCastingPage from "./pages/SpellCastingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlatformPage from "./pages/PlatformPage";
// NotFound is the component that shows up if a user goes to a URL that doesn't exist.
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance capable of caching our fetched data.
const queryClient = new QueryClient();

// This is the ROOT component of our application. Everything starts rendering from here!
const App = () => (
  // Providers wrap our entire app. They use React Context to "provide" data globally.
  // QueryClientProvider gives access to data fetching tools anywhere in the app.
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider lets us use hovering tooltips smoothly */}
    <TooltipProvider>
      {/* CartProvider makes sure any component can see how many items are in the cart */}
      <CartProvider>
        {/* Sonner controls any pop-up notifications globally */}
        <Sonner />
        
        {/* BrowserRouter enables the routing (navigation) system */}
        <BrowserRouter>
          {/* These elements are placed outside <Routes> so they exist on EVERY single page */}
          <MagicCursor />
          <SparkleEffect />
          <FlyingCar />
          <Navbar />
          
          {/* <Routes> acts like a switchboard. It looks at the current URL and renders the matching <Route> */}
          <Routes>
            {/* The root path ("/") shows the home page (the 'Index' component) */}
            <Route path="/" element={<Index />} />
            
            {/* The "/shop" URL shows all items */}
            <Route path="/shop" element={<AllShopPage />} />
            
            {/* 
                Notice how we reuse the SAME 'ShopPage' component for different URLs.
                We just pass a different 'category' prop to tell it what things to display! 
            */}
            <Route path="/wands" element={<ShopPage category="wands" />} />
            <Route path="/brooms" element={<ShopPage category="brooms" />} />
            <Route path="/books" element={<ShopPage category="books" />} />
            <Route path="/potions" element={<ShopPage category="potions" />} />
            <Route path="/robes" element={<ShopPage category="robes" />} />
            
            {/* Standard utility pages */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/sorting-hat" element={<SortingHatPage />} />
            <Route path="/spells" element={<SpellCastingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/platform" element={<PlatformPage />} />
            
            {/* The "*" path is a wildcard. It catches ANY url that didn't match the ones defined above. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* The Footer is also rendered at the bottom of every page */}
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Exporting App so it can be mounted to the root HTML document in main.tsx
export default App;
