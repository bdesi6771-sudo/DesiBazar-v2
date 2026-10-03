import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  ShieldCheck, 
  Plus, 
  Minus,
  Sparkles,
  Truck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotalDiscount,
    cartShippingFee,
    cartTaxAmount,
    cartFinalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveCategory,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    const res = applyCoupon(code);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const freeDeliveryThreshold = 800;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-stone-900 text-lg">Your Desi Basket</h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200/60 text-xs">
          {remainingForFreeDelivery === 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Check className="w-4 h-4" />
              <span>You have unlocked FREE Express Delivery!</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-stone-700 font-medium">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  Add ₹{remainingForFreeDelivery} more for <strong>FREE Delivery</strong>
                </span>
                <span className="font-bold text-amber-800">{freeDeliveryProgress}%</span>
              </div>
              <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-stone-800 text-base">Your basket is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Discover our 2-year aged Basmati rice, Vedic Gir Cow A2 ghee, and unpolished dals.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveCategory('rice');
                }}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow transition"
              >
                Browse Heritage Rice
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-stone-50/80 rounded-xl border border-stone-200/80 hover:border-amber-200 transition"
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-16 h-16 rounded-lg object-cover bg-white border border-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-stone-900 text-xs truncate">
                      {item.productName}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-0.5 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded">
                      {item.weightLabel}
                    </span>
                    <span className="font-mono text-[10px] text-stone-400">
                      {item.sku}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-xs text-stone-900">
                      ₹{item.price * item.quantity}
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center border border-stone-300 rounded-md bg-white overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/80 space-y-3">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{cartTotalDiscount})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Promo Code (e.g. DESI10)"
                      className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium uppercase placeholder:normal-case focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="bg-stone-900 hover:bg-amber-600 text-white hover:text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApplyCoupon('DESI10')}
                      className="text-[10px] text-amber-800 bg-amber-100/70 hover:bg-amber-200 px-2 py-0.5 rounded font-medium transition"
                    >
                      🏷️ DESI10 (10% OFF)
                    </button>
                    <button
                      onClick={() => handleApplyCoupon('BASMATI50')}
                      className="text-[10px] text-amber-800 bg-amber-100/70 hover:bg-amber-200 px-2 py-0.5 rounded font-medium transition"
                    >
                      🏷️ BASMATI50 (₹150 OFF)
                    </button>
                  </div>
                </div>
              )}

              {couponFeedback && (
                <p
                  className={`text-[11px] font-medium ${
                    couponFeedback.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {couponFeedback.message}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1 text-xs text-stone-600 border-t border-stone-200 pt-2.5">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-800">₹{cartSubtotal}</span>
              </div>
              {cartTotalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount</span>
                  <span>-₹{cartTotalDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping (Express Safe Packaging)</span>
                <span className="font-semibold text-stone-800">
                  {cartShippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
                  ) : (
                    `₹${cartShippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Food GST (5%)</span>
                <span className="font-semibold text-stone-800">₹{cartTaxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-2">
                <span>Total Amount</span>
                <span className="text-amber-700 font-display text-lg">
                  ₹{cartFinalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Seal */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted | UPI, Cards, NetBanking, COD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
