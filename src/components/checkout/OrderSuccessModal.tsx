import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Printer, 
  PackageCheck, 
  ShoppingBag, 
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  MapPin,
  X
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const {
    activeOrderSuccess,
    setActiveOrderSuccess,
    setIsOrderTrackingOpen,
    setCurrentView,
  } = useStore();

  useEffect(() => {
    if (activeOrderSuccess) {
      // Fire confetti celebratory burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d97706', '#059669', '#f59e0b', '#b45309'],
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [activeOrderSuccess]);

  if (!activeOrderSuccess) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-6 sm:p-8 text-center relative print:hidden">
          <button
            onClick={() => setActiveOrderSuccess(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="bg-emerald-400/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Payment Verified & Inventory Allocated
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-2">
            Order Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto mt-1">
            Thank you, {activeOrderSuccess.shippingAddress.fullName}. Your order{' '}
            <strong className="text-white underline decoration-emerald-400 font-mono">
              #{activeOrderSuccess.id}
            </strong>{' '}
            has been placed and stock has been reserved in our central warehouse.
          </p>
        </div>

        {/* Printable Invoice & Order Details */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Order Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Order ID</span>
              <span className="font-mono font-bold text-stone-900 text-sm">
                #{activeOrderSuccess.id}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Placed Date</span>
              <span className="font-semibold text-stone-800">
                {new Date(activeOrderSuccess.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Payment Method</span>
              <span className="font-semibold text-stone-800 uppercase">
                {activeOrderSuccess.payment.method} ({activeOrderSuccess.payment.status})
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Est. Delivery</span>
              <span className="font-bold text-emerald-700">
                {activeOrderSuccess.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Delivery & Billing Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-stone-800 uppercase text-[10px] flex items-center gap-1 text-amber-700">
                <MapPin className="w-3.5 h-3.5" /> Shipping Address
              </span>
              <p className="font-bold text-stone-900">{activeOrderSuccess.shippingAddress.fullName}</p>
              <p className="text-stone-600">{activeOrderSuccess.shippingAddress.streetAddress}</p>
              <p className="text-stone-600">
                {activeOrderSuccess.shippingAddress.city}, {activeOrderSuccess.shippingAddress.state} - {activeOrderSuccess.shippingAddress.pinCode}
              </p>
              <p className="text-stone-500 font-mono">Ph: {activeOrderSuccess.shippingAddress.phone}</p>
            </div>

            <div className="border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-stone-800 uppercase text-[10px] flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Transaction Receipt
              </span>
              <p className="text-stone-700">
                Txn ID: <strong className="font-mono text-stone-900">{activeOrderSuccess.payment.transactionId}</strong>
              </p>
              <p className="text-stone-600">
                Tracking: <strong className="font-mono text-amber-800">{activeOrderSuccess.trackingNumber}</strong>
              </p>
              <p className="text-stone-500">
                Courier: Delhivery / BlueDart Express Grain Parcel
              </p>
            </div>
          </div>

          {/* Ordered Line Items Table */}
          <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-stone-100/80 px-4 py-2 font-bold text-stone-700 flex justify-between">
              <span>Item & Variant</span>
              <span>Total</span>
            </div>
            <div className="divide-y divide-stone-100">
              {activeOrderSuccess.items.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900">{item.productName}</h4>
                      <p className="text-[11px] text-stone-500">
                        Pack: <span className="font-semibold text-amber-800">{item.weightLabel}</span> • Qty: {item.quantity} × ₹{item.price}
                      </p>
                      <p className="text-[10px] font-mono text-stone-400">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-stone-50/90 p-4 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{activeOrderSuccess.subtotal}</span>
              </div>
              {activeOrderSuccess.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Discount ({activeOrderSuccess.couponCode})</span>
                  <span>-₹{activeOrderSuccess.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Grain Safe Delivery</span>
                <span>{activeOrderSuccess.shippingFee === 0 ? 'FREE' : `₹${activeOrderSuccess.shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5% Food & Staples)</span>
                <span>₹{activeOrderSuccess.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-2">
                <span>Total Paid</span>
                <span className="text-amber-800 font-display text-lg">
                  ₹{activeOrderSuccess.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-2.5 pt-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>

            <button
              onClick={() => {
                setActiveOrderSuccess(null);
                setIsOrderTrackingOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition"
            >
              <PackageCheck className="w-4 h-4 text-amber-400" />
              <span>Track Live Delivery Status</span>
            </button>

            <button
              onClick={() => {
                setActiveOrderSuccess(null);
                setCurrentView('admin');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition ml-auto"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>View Live Inventory Deduction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
