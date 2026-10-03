import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { WeightOption } from '../types';
import { 
  X, 
  MapPin, 
  Star, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Truck,
  Plus,
  Minus
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useStore();

  if (!selectedProduct) return null;

  const defaultOption = selectedProduct.weightOptions.find((w) => w.isPopular) || selectedProduct.weightOptions[0];
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(defaultOption);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync with live stock
  const currentVariant = selectedProduct.weightOptions.find((w) => w.id === selectedWeight.id) || selectedWeight;
  const isOutOfStock = currentVariant.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(selectedProduct, currentVariant, quantity);
    if (res.success) {
      setAddedAnimation(true);
      setErrorMsg(null);
      setTimeout(() => setAddedAnimation(false), 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const discountPercent = currentVariant.originalPrice
    ? Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100/60 px-2.5 py-1 rounded">
              {selectedProduct.categoryLabel}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              SKU: {selectedProduct.sku}
            </span>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left: Product Image & Highlights */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 aspect-square">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {selectedProduct.badge && (
                  <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow uppercase">
                    {selectedProduct.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedProduct.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-stone-100 text-stone-700 font-medium px-2.5 py-1 rounded-full border border-stone-200"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>

              {/* Cooking Tips / Pairings if available */}
              {selectedProduct.cookingTips && (
                <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Traditional Cooking & Aroma Notes:</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {selectedProduct.cookingTips}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Details & Buying options */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <span className="flex items-center gap-1 font-semibold text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    {selectedProduct.origin}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {selectedProduct.rating} ({selectedProduct.reviewCount} reviews)
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900 leading-tight">
                  {selectedProduct.name}
                </h2>
                {selectedProduct.hindiName && (
                  <p className="text-sm font-serif italic text-stone-600 mt-0.5">
                    {selectedProduct.hindiName}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {selectedProduct.longDescription || selectedProduct.description}
              </p>

              {/* Extra Rice / Heritage Spec details */}
              {(selectedProduct.grainLength || selectedProduct.aroma || selectedProduct.harvestSeason) && (
                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                  {selectedProduct.grainLength && (
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Grain Length</span>
                      <span className="font-semibold text-stone-800">{selectedProduct.grainLength}</span>
                    </div>
                  )}
                  {selectedProduct.aroma && (
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Aroma Profile</span>
                      <span className="font-semibold text-stone-800">{selectedProduct.aroma}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Weight / Pack Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">Select Packaging Weight:</span>
                  <span className="text-stone-500">
                    {isOutOfStock ? (
                      <span className="text-rose-600 font-bold">Out of stock</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">
                        {currentVariant.stock} units left in warehouse
                      </span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.weightOptions.map((opt) => {
                    const isSelected = opt.id === currentVariant.id;
                    const optOutOfStock = opt.stock === 0;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSelectedWeight(opt);
                          setQuantity(1);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20'
                            : optOutOfStock
                            ? 'border-stone-200 bg-stone-100 opacity-60 line-through'
                            : 'border-stone-200 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900">{opt.weightLabel}</span>
                          <span className="font-bold text-xs text-amber-800">₹{opt.price}</span>
                        </div>
                        {opt.originalPrice && (
                          <div className="text-[10px] text-stone-400 line-through mt-0.5">
                            ₹{opt.originalPrice}
                          </div>
                        )}
                        {opt.isPopular && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                            Most Popular
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Quantity Box */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/90 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold font-display text-stone-900">
                      ₹{currentVariant.price * quantity}
                    </span>
                    <span className="text-xs text-stone-500 ml-2">
                      (₹{currentVariant.price} × {quantity})
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="p-1.5 hover:bg-stone-100 text-stone-700 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-bold text-xs text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(currentVariant.stock, q + 1))}
                      disabled={quantity >= currentVariant.stock || isOutOfStock}
                      className="p-1.5 hover:bg-stone-100 text-stone-700 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${
                    isOutOfStock
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-stone-950 active:scale-[0.98]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5 text-white" />
                      <span>Added to Basket!</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Temporarily Out of Stock</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart (₹{currentVariant.price * quantity})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lab Tested & 100% Pure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ships within 24 Hours</span>
                </div>
              </div>
            </div>

          </div>

          {/* Nutritional Breakdown Table */}
          {selectedProduct.nutrition && (
            <div className="border-t border-stone-100 pt-5">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Nutritional Profile (per {selectedProduct.nutrition.servingSize})</span>
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Calories</span>
                  <span className="font-bold text-stone-800">{selectedProduct.nutrition.calories}</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Protein</span>
                  <span className="font-bold text-stone-800">{selectedProduct.nutrition.protein}</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Carbs</span>
                  <span className="font-bold text-stone-800">{selectedProduct.nutrition.carbs}</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Fat</span>
                  <span className="font-bold text-stone-800">{selectedProduct.nutrition.fat}</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 col-span-3 sm:col-span-1">
                  <span className="text-stone-400 block text-[10px]">Dietary Fiber</span>
                  <span className="font-bold text-stone-800">{selectedProduct.nutrition.fiber}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
