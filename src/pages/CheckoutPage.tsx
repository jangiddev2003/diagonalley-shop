import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';

const CheckoutPage = () => {
  const { totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [showThankYou, setShowThankYou] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    houseNo: '',
    roadArea: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowThankYou(true);
    clearCart();
  };

  if (totalItems === 0 && !showThankYou) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-10 max-w-lg">
      <h1 className="font-display text-3xl font-bold text-foreground text-glow mb-8 text-center">
        🧾 Checkout
      </h1>

      <div className="mb-6 p-4 rounded-lg border border-border bg-card text-center">
        <p className="font-body text-muted-foreground">Order Total</p>
        <p className="font-display text-2xl font-bold text-primary text-glow">{totalPrice} 🪙</p>
        <p className="text-xs text-muted-foreground mt-1">{totalItems} items</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'fullName', label: 'Full Name', placeholder: 'Harry James Potter' },
          { name: 'phone', label: 'Phone Number', placeholder: '+44 7700 900000' },
          { name: 'pincode', label: 'Pincode', placeholder: 'W1D 3AF' },
          { name: 'houseNo', label: 'House No. / Building Name', placeholder: '4 Privet Drive' },
          { name: 'roadArea', label: 'Road / Area Details', placeholder: 'Little Whinging, Surrey' },
        ].map(field => (
          <div key={field.name}>
            <label className="block font-display text-xs font-semibold text-foreground mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg hover:glow-gold-intense active:scale-95 transition-all mt-6"
        >
          Place Order ✨
        </button>
      </form>

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative max-w-md w-full rounded-2xl border border-primary/50 bg-card p-8 text-center animate-fade-in glow-gold-intense overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => { setShowThankYou(false); navigate('/'); }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                <span className="text-4xl animate-float">🦉</span>
                <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
                <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🏆</span>
              </div>

              <h2 className="font-display text-2xl font-bold text-primary text-glow">
                Order Placed Successfully!
              </h2>

              <p className="font-medieval text-lg text-foreground">
                "The owl is on its way!"
              </p>

              <p className="font-body text-sm text-muted-foreground">
                Your magical items have been dispatched via Owl Post. 
                Expect delivery within 3-5 wizarding business days.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <span className="text-2xl animate-sparkle" style={{ animationDelay: '0.2s' }}>⚡</span>
                <span className="text-2xl animate-sparkle" style={{ animationDelay: '0.6s' }}>✨</span>
                <span className="text-2xl animate-sparkle" style={{ animationDelay: '1s' }}>🪄</span>
              </div>

              {/* Feedback Section */}
              <div className="pt-4 border-t border-border/50">
                <FeedbackForm />
              </div>

              <button
                onClick={() => { setShowThankYou(false); navigate('/'); }}
                className="mt-4 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:glow-gold-intense active:scale-95 transition-all"
              >
                Return to Marketplace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
