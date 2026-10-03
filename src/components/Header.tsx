import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  SlidersHorizontal, 
  Truck, 
  ShieldCheck, 
  Store, 
  AlertTriangle,
  PackageCheck,
  Wheat
} from 'lucide-react';
import { ProductCategory } from '../types';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    setIsOrderTrackingOpen,
    totalCartItemCount,
    cartFinalTotal,
    lowStockCount,
    outOfStockCount,
  } = useStore();

  const categories: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Products', icon: '🌾' },
    { id: 'rice', label: 'Heritage Rice', icon: '🍚' },
    { id: 'ghee_oil', label: 'A2 Ghee & Oils', icon: '🧈' },
    { id: 'pulses_daal', label: 'Organic Dals', icon: '🥣' },
    { id: 'flours_atta', label: 'Chakki Atta', icon: '🌾' },
    { id: 'spices_masala', label: 'Stone Spices', icon: '🌶️' },
    { id: 'jaggery_sweets', label: 'Desi Gur', icon: '🍯' },
    { id: 'pickles_chutneys', label: 'Artisan Pickles', icon: '🏺' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-amber-600 text-stone-950 font-medium text-xs sm:text-sm py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Truck className="w-3.5 h-3.5" />
          <span>
            <strong>Free Express Delivery</strong> on orders above ₹800 | Use code{' '}
            <span className="font-bold underline decoration-stone-900">DESI10</span> for 10% OFF
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-900" /> 100% Pure & Lab Tested
          </span>
          <span>•</span>
          <span>Direct From Farmers</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-900/30 group-hover:scale-105 transition-transform">
              <Wheat className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  DesiBazaar
                </span>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">
                  Heritage
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block tracking-wide">
                Pure Rice, A2 Ghee & Traditional Staples
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Aged Basmati, Gir Ghee, Sona Masoori, Atta..."
              className="w-full bg-stone-800/90 text-stone-100 placeholder-stone-400 pl-9 pr-4 py-2 rounded-lg text-sm border border-stone-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Track Order Button */}
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800 hover:border-stone-700 transition"
              title="Track your order delivery status"
            >
              <PackageCheck className="w-4 h-4 text-amber-400" />
              <span>Track Order</span>
            </button>

            {/* Admin & Inventory Toggle Button */}
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                currentView === 'admin'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm'
                  : 'bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700 hover:text-white'
              }`}
            >
              {currentView === 'admin' ? (
                <>
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">Storefront View</span>
                </>
              ) : (
                <>
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Inventory & Admin</span>
                  {(lowStockCount > 0 || outOfStockCount > 0) && (
                    <span 
                      className="flex items-center gap-0.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse"
                      title={`${lowStockCount} items low in stock, ${outOfStockCount} out of stock`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{lowStockCount + outOfStockCount}</span>
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition transform active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCartItemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-stone-950 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-500">
                    {totalCartItemCount}
                  </span>
                )}
              </div>
              <span className="text-xs hidden md:inline">
                {cartFinalTotal > 0 ? `₹${cartFinalTotal.toFixed(0)}` : 'Cart'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rice, ghee, spices, pulses..."
              className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 pl-9 pr-4 py-2 rounded-lg text-sm border border-stone-700 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroll Bar (Only in store view) */}
      {currentView === 'store' && (
        <div className="border-t border-stone-800/80 bg-stone-950/60 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
