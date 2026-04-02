import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SparkleEffect from "@/components/SparkleEffect";
import Index from "./pages/Index";
import ShopPage from "./pages/ShopPage";
import AllShopPage from "./pages/AllShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SortingHatPage from "./pages/SortingHatPage";
import SpellCastingPage from "./pages/SpellCastingPage";
import LoginPage from "./pages/LoginPage";
import PlatformPage from "./pages/PlatformPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Sonner />
        <BrowserRouter>
          <SparkleEffect />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<AllShopPage />} />
            <Route path="/wands" element={<ShopPage category="wands" />} />
            <Route path="/brooms" element={<ShopPage category="brooms" />} />
            <Route path="/books" element={<ShopPage category="books" />} />
            <Route path="/potions" element={<ShopPage category="potions" />} />
            <Route path="/robes" element={<ShopPage category="robes" />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/sorting-hat" element={<SortingHatPage />} />
            <Route path="/spells" element={<SpellCastingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
