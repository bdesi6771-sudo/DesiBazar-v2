import React, { useState } from 'react';
import { Product, WeightOption } from '../types';
import { useStore } from '../context/StoreContext';
import { MapPin, Star, ShoppingBag, Check, AlertCircle, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();

  // Selected weight variant, default to first or popular
  const defaultOption = product.weightOptions.find((w) => w.isPopular) || product.weightOptions[0];
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(defaultOption);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync selectedWeight with current store variant stock (as orders are made)
  const currentVariant = product.weightOptions.find((w) => w.id === selectedWeight.id) || selectedWeight;
  const isOutOfStock = currentVariant.stock === 0;
  const isLowStock = currentVariant.stock > 0 && currentVariant.stock <= 8;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const res = addToCart(product, currentVariant, 1);
    if (res.success) {
      setAddedAnimation(true);
      setErrorMsg(null);
      setTimeout(() => setAddedAnimation(false), 1500);
    } else {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const discountPercent = currentVariant.originalPrice
    ? Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Image & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur text-stone-700 hover:text-amber-600 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="View product details & cooking tips"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Category Pill at bottom of image */}
        <div className="absolute bottom-2 left-2.5">
          <span className="bg-stone-900/80 backdrop-blur text-stone-200 text-[10px] font-medium px-2 py-0.5 rounded-full border border-stone-700">
            {product.categoryLabel}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Origin & Rating */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="flex items-center gap-1 font-medium text-stone-600 truncate max-w-[65%]">
              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate">{product.origin}</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-stone-900 text-base group-hover:text-amber-700 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Hindi / Regional name */}
          {product.hindiName && (
            <p className="text-xs text-stone-500 font-serif italic line-clamp-1 mb-1.5">
              {product.hindiName}
            </p>
          )}

          {/* Short Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Weight Options Selector */}
        <div className="space-y-1.5 pt-1 border-t border-stone-100">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-stone-700">Select Pack Size:</span>
            <span className="text-stone-400 font-mono text-[10px]">
              SKU: {product.sku}-{currentVariant.skuModifier}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.weightOptions.map((opt) => {
              const isSelected = opt.id === currentVariant.id;
              const optOutOfStock = opt.stock === 0;

              return (
                <button
                  key={opt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWeight(opt);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm font-semibold'
                      : optOutOfStock
                      ? 'bg-stone-100 text-stone-400 border-stone-200 line-through opacity-60'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-stone-100'
                  }`}
                >
                  {opt.weightLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Real-time Stock Display */}
        <div className="pt-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-stone-900 font-display">
                ₹{currentVariant.price}
              </span>
              {currentVariant.originalPrice && (
                <span className="text-xs text-stone-400 line-through font-medium">
                  ₹{currentVariant.originalPrice}
                </span>
              )}
            </div>

            {/* Live Inventory Stock Warning */}
            <div>
              {isOutOfStock ? (
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                  Only {currentVariant.stock} left!
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  In Stock ({currentVariant.stock})
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-600 font-medium">
              <AlertCircle className="w-3 h-3" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full mt-3 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-stone-900 hover:bg-amber-600 text-white hover:text-stone-950 active:scale-[0.98]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Added to Basket!</span>
              </>
            ) : isOutOfStock ? (
              <span>Notify When Available</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add {currentVariant.weightLabel} to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
