// 1. IMPORTS
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Sparkles, ShoppingBag, Calendar, Coins, Truck, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { galleonsToUSD } from '@/lib/currency';
import galleonImg from '@/assets/galleon.png';
import { toast } from 'sonner';

// ──────────────────────────────────────────────
// ORDER TYPE
// ──────────────────────────────────────────────
export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  spellDiscount: number;
  platformDiscount: number;
  finalTotal: number;
  deliveryAddress: {
    fullName: string;
    phone: string;
    pincode: string;
    houseNo: string;
    roadArea: string;
  };
  status: 'processing' | 'dispatched' | 'delivered';
}

// ──────────────────────────────────────────────
// HELPER: Load orders from localStorage
// ──────────────────────────────────────────────
export const getOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem('diagonally-orders');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveOrder = (order: Order) => {
  const orders = getOrders();
  orders.unshift(order); // Newest first
  localStorage.setItem('diagonally-orders', JSON.stringify(orders));
};

// ──────────────────────────────────────────────
// STATUS CONFIG
// ──────────────────────────────────────────────
const statusConfig = {
  processing: {
    label: 'Processing',
    emoji: '🧙‍♂️',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10 border-yellow-400/30',
    description: 'Your order is being prepared by our house-elves',
  },
  dispatched: {
    label: 'Dispatched via Owl Post',
    emoji: '🦉',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10 border-blue-400/30',
    description: 'An owl is on its way with your package',
  },
  delivered: {
    label: 'Delivered',
    emoji: '✨',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10 border-green-400/30',
    description: 'Mischief managed! Your order has arrived',
  },
};

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────
const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  // Simulate order status progression
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => prev.map(order => {
        const orderAge = Date.now() - new Date(order.date).getTime();
        if (order.status === 'processing' && orderAge > 30000) {
          return { ...order, status: 'dispatched' };
        }
        if (order.status === 'dispatched' && orderAge > 120000) {
          return { ...order, status: 'delivered' };
        }
        return order;
      }));
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('diagonally-orders');
    setOrders([]);
    toast.info('Order history cleared', { description: 'All past orders have been removed.' });
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(prev => prev === orderId ? null : orderId);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ──────────────────────────────────────────────
  // EMPTY STATE
  // ──────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <Package className="h-16 w-16 text-muted-foreground" />
        <h1 className="font-display text-2xl font-bold text-foreground">No Orders Yet</h1>
        <p className="font-body text-muted-foreground text-center max-w-md">
          You haven't placed any magical orders yet. Visit the marketplace to find enchanted items!
        </p>
        <Link
          to="/"
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:glow-gold-intense transition-all"
        >
          Browse Shops ✨
        </Link>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // ORDERS LIST
  // ──────────────────────────────────────────────
  return (
    <div className="min-h-screen container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground text-glow text-center flex-1">
          📦 Your Magical Orders
        </h1>
      </div>

      {/* Order count & clear button */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-body text-sm text-muted-foreground">
          <ShoppingBag className="h-4 w-4 inline mr-1" />
          {orders.length} order{orders.length !== 1 ? 's' : ''} placed
        </p>
        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medieval text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border transition-all"
        >
          <Trash2 className="h-3 w-3" />
          Clear History
        </button>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status];
          const isExpanded = expandedOrder === order.id;
          const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div
              key={order.id}
              className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30"
            >
              {/* Order Header (always visible) */}
              <button
                onClick={() => toggleOrder(order.id)}
                className="w-full p-4 md:p-5 flex items-center gap-4 text-left transition-colors hover:bg-muted/30"
              >
                {/* Status Icon */}
                <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${status.bgColor} border flex items-center justify-center text-xl`}>
                  {status.emoji}
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-sm font-bold text-foreground">
                      Order #{order.id.slice(-6).toUpperCase()}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-display font-bold ${status.bgColor} ${status.color} border`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(order.date)}
                    </span>
                    <span>•</span>
                    <span>{totalItemCount} item{totalItemCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Price & Expand */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-display text-sm font-bold text-primary flex items-center gap-1 justify-end">
                      {Math.round(order.finalTotal)}
                      <img src={galleonImg} alt="G" className="h-4 w-4 object-contain" />
                    </span>
                    <p className="text-[10px] text-muted-foreground">${galleonsToUSD(order.finalTotal)}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-border px-4 md:px-5 pb-5 animate-fade-in">
                  {/* Status Description */}
                  <div className={`mt-4 p-3 rounded-lg ${status.bgColor} border`}>
                    <div className="flex items-center gap-2">
                      <Truck className={`h-4 w-4 ${status.color}`} />
                      <p className={`font-body text-xs ${status.color}`}>{status.description}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="mt-4 space-y-2">
                    <h4 className="font-display text-xs font-bold text-foreground mb-2">Items Ordered</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-4 w-4 text-primary/50" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-xs font-semibold text-foreground truncate">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground font-body">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-xs font-bold text-primary flex items-center gap-0.5">
                            {item.price * item.quantity}
                            <img src={galleonImg} alt="G" className="h-3 w-3 object-contain" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Summary */}
                  <div className="mt-4 pt-3 border-t border-border/50 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-body text-muted-foreground">Subtotal</span>
                      <span className="font-display font-bold text-foreground flex items-center gap-0.5">
                        {order.subtotal} <img src={galleonImg} alt="G" className="h-3 w-3 object-contain" />
                      </span>
                    </div>
                    {order.spellDiscount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="font-body text-muted-foreground">⚡ Spell Quiz Discount</span>
                        <span className="font-display font-bold text-green-400">-{order.spellDiscount}%</span>
                      </div>
                    )}
                    {order.platformDiscount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="font-body text-muted-foreground">🚂 Platform 9¾ Discount</span>
                        <span className="font-display font-bold text-green-400">-{order.platformDiscount}%</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs pt-1.5 border-t border-border/30">
                      <span className="font-body text-muted-foreground">Total Paid</span>
                      <span className="font-display font-bold text-primary flex items-center gap-0.5">
                        {Math.round(order.finalTotal)} <img src={galleonImg} alt="G" className="h-3 w-3 object-contain" />
                        <span className="text-muted-foreground ml-1">(${galleonsToUSD(order.finalTotal)})</span>
                      </span>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <h4 className="font-display text-xs font-bold text-foreground mb-2">🦉 Delivery Address</h4>
                    <div className="text-xs text-muted-foreground font-body space-y-0.5 pl-2 border-l-2 border-primary/20">
                      <p className="text-foreground font-semibold">{order.deliveryAddress.fullName}</p>
                      <p>{order.deliveryAddress.houseNo}, {order.deliveryAddress.roadArea}</p>
                      <p>{order.deliveryAddress.pincode}</p>
                      <p>📞 {order.deliveryAddress.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:glow-gold-intense active:scale-95 transition-all"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping ✨
        </Link>
      </div>
    </div>
  );
};

export default OrdersPage;
