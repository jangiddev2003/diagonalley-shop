// 1. IMPORTS
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
// useNavigate is a powerful React Router hook that lets us programmatically change pages via code
import { useNavigate } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { galleonsToUSD } from '@/lib/currency';
import magicQrImg from '@/assets/magic-qr.png';
import { ThreeDViewer } from '@/components/ThreeDModel';
import { saveOrder } from '@/pages/OrdersPage';

// 2. MAIN COMPONENT
const CheckoutPage = () => {
  // Grab our shopping cart data and the clearCart function
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate(); // The function used to redirect the user

  // STATE MACHINE: We control the complex checkout flow by changing what "stage" we are in.
  // Instead of creating 5 different pages, we just change which UI is visible on this one page!
  const [paymentStage, setPaymentStage] = useState<'form' | 'payment' | 'revelio' | 'qr' | 'success'>('form');
  const [showThankYou, setShowThankYou] = useState(false);

  // STATE: A single object to hold all the form data inputs at once
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    houseNo: '',
    roadArea: '',
  });

  // LOGIC: Check for any magical discount codes applied earlier
  const spellDiscount = Number(sessionStorage.getItem('spell-discount') || '0');

  // LOGIC: Check for Platform 9¾ coupon discount
  const savedCoupon = localStorage.getItem('applied-platform-coupon');
  const platformDiscount = savedCoupon ? (JSON.parse(savedCoupon)?.discount || 0) : 0;

  // Apply both discounts multiplicatively (same as CartPage)
  const afterSpellDiscount = totalPrice * (1 - spellDiscount / 100);
  const afterAllDiscounts = afterSpellDiscount * (1 - platformDiscount / 100);
  const finalPrice = afterAllDiscounts;

  // LOGIC: This single arrow function handles typing in ALL input fields.
  // It uses the "name" attribute of the HTML input (like name="phone") to dynamically update the correct property in our state object!
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // LOGIC: Triggered when the user hits the "Place Order" button on the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stops the browser from accidentally refreshing the page (default HTML form behavior)
    setPaymentStage('payment'); // Transition to the next stage in our state machine
  };

  // LOGIC: Handing the fake "magical" payment verification flow using timers
  const handleRevelio = () => {
    setPaymentStage('revelio'); // Show the casting animation

    // In a real app, this is where you would make an API request to Stripe or PayPal!
    // Since this is a wizarding shop, we just fake the delay using setTimeout
    setTimeout(() => {
      setPaymentStage('qr'); // Show the QR code briefly

      setTimeout(() => {
        // Save the order to history before clearing
        saveOrder({
          id: `ORD-${Date.now()}`,
          date: new Date().toISOString(),
          items: items.map(({ product, quantity }) => ({
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            category: product.category,
          })),
          subtotal: totalPrice,
          spellDiscount,
          platformDiscount,
          finalTotal: finalPrice,
          deliveryAddress: form,
          status: 'processing',
        });

        setPaymentStage('success'); // Finish the flow
        clearCart(); // Empty the user's cart automatically because they bought the items
        sessionStorage.removeItem('spell-discount'); // Remove their discount so they can't reuse it
        localStorage.removeItem('applied-platform-coupon'); // Clear the platform coupon too
        setShowThankYou(true); // Trigger the final modal
      }, 3000);
    }, 1500);
  };

  // LOGIC: Edge Case Guard
  // If the user somehow navigates to the checkout page but has 0 items in their cart, instantly kick them back!
  if (totalItems === 0 && !showThankYou && paymentStage === 'form') {
    navigate('/cart');
    return null; // Return nothing so React stops rendering this page entirely
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-10 max-w-lg">
      <h1 className="font-display text-3xl font-bold text-foreground text-glow mb-8 text-center">
        🧾 Checkout
      </h1>

      {/* ORDER SUMMARY BLOCK */}
      <div className="mb-6 p-4 rounded-lg border border-border bg-card text-center">
        <p className="font-body text-muted-foreground">Order Total</p>
        <div className="flex justify-center">
          <CurrencyDisplay galleons={Math.round(finalPrice)} size="lg" />
        </div>
        <p className="text-sm text-muted-foreground mt-1">${galleonsToUSD(finalPrice)}</p>
        <p className="text-xs text-muted-foreground mt-1">{totalItems} items</p>
        {/* If a spell discount was applied, show it in green */}
        {spellDiscount > 0 && (
          <p className="text-xs text-green-400 mt-1">⚡ Spell discount: -{spellDiscount}%</p>
        )}
        {/* If a platform coupon was applied, show it in green */}
        {platformDiscount > 0 && (
          <p className="text-xs text-green-400 mt-1">🚂 Platform 9¾ discount: -{platformDiscount}%</p>
        )}
      </div>

      {/* STATE 1: Data entry form */}
      {paymentStage === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Instead of writing out 5 <input> blocks manually, we map over a configuration array! Highly efficient HTML generation. */}
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
                // Tie the value directly to our State object so React completely controls it
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required // HTML5 validation makes sure they fill it out before clicking submit
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
      )}

      {/* STATE 2: Waiting for user to click the final magical pay button */}
      {paymentStage === 'payment' && (
        <div className="text-center p-8 rounded-xl border border-border bg-card animate-fade-in">
          <p className="font-display text-lg font-bold text-foreground mb-4">Order placed! Time to pay</p>
          <button
            onClick={handleRevelio}
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xl hover:glow-gold-intense active:scale-95 transition-all animate-glow-pulse"
          >
            Revelio
          </button>
        </div>
      )}

      {/* STATE 3: The wand animation spinning (simulating talking to a server database) */}
      {paymentStage === 'revelio' && (
        <div className="text-center p-8 rounded-xl border border-primary/50 bg-card animate-fade-in glow-gold-intense flex flex-col items-center">
          <div className="relative h-48 w-full max-w-[200px] mb-4">
            <ThreeDViewer productName="The Elder Wand" noBackground noAutoRotate />
          </div>
          <p className="font-medieval text-lg text-primary text-glow animate-pulse mt-4">Casting payment spell...</p>
        </div>
      )}

      {/* STATE 4: Final verification scanning QR code */}
      {paymentStage === 'qr' && (
        <div className="text-center p-8 rounded-xl border border-primary/50 bg-card animate-fade-in glow-gold">
          <img src={magicQrImg} alt="Payment QR" className="h-48 w-48 mx-auto mb-4 object-contain" />
          <p className="font-body text-sm text-muted-foreground">Processing magical payment...</p>
        </div>
      )}

      {/* STATE 5 (showThankYou override): The giant modal confirming success */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative max-w-md w-full rounded-2xl border border-primary/50 bg-card p-8 text-center animate-fade-in glow-gold-intense overflow-y-auto max-h-[90vh]">
            <button
              // Clicking close flips the state to false AND redirects user to the home page!
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

              <div className="inline-block px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 mb-2">
                <p className="font-display text-lg font-bold text-green-400">Payment Successful ✨</p>
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

              {/* Collect actual feedback from the user. We nest another component here. */}
              <div className="pt-4 border-t border-border/50">
                <FeedbackForm />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => { setShowThankYou(false); navigate('/orders'); }}
                  className="flex-1 px-6 py-3 rounded-lg border border-primary/50 text-primary font-display font-semibold hover:bg-primary/10 active:scale-95 transition-all"
                >
                  📦 View My Orders
                </button>
                <button
                  // The big return button functions exactly like the X icon via the exact same functions
                  onClick={() => { setShowThankYou(false); navigate('/'); }}
                  className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:glow-gold-intense active:scale-95 transition-all"
                >
                  Return to Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
