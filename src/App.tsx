import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentGatewayModal } from './components/checkout/PaymentGatewayModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { InventoryDashboard } from './components/admin/InventoryDashboard';
import { Footer } from './components/Footer';
import { 
  ArrowUpDown, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Wheat, 
  Check, 
  SlidersHorizontal,
  SearchX
} from 'lucide-react';
import { ProductCategory } from './types';

const StoreContent: React.FC = () => {
  const {
    products,
    currentView,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setCurrentView,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');

  // Filter products by category & search query
  let filtered = products.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchHindi = p.hindiName ? p.hindiName.toLowerCase().includes(q) : false;
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchOrigin = p.origin.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchHindi && !matchDesc && !matchOrigin && !matchTags && !matchSku) {
        return false;
      }
    }
    return true;
  });

  // Sort products
  filtered = [...filtered].sort((a, b) => {
    const minPriceA = Math.min(...a.weightOptions.map((w) => w.price));
    const minPriceB = Math.min(...b.weightOptions.map((w) => w.price));

    if (sortBy === 'price_asc') return minPriceA - minPriceB;
    if (sortBy === 'price_desc') return minPriceB - minPriceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    // default featured
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const categoryTitles: Record<ProductCategory | 'all', { title: string; subtitle: string }> = {
    all: {
      title: 'Heritage Rice & Authentic Desi Harvest',
      subtitle: 'Cellar-aged Basmati, A2 Gir cow ghee, stone-ground flours, and unpolished native dals.',
    },
    rice: {
      title: 'Sacred & Aged Heritage Rice Varieties',
      subtitle: 'From 24-month aged 1121 Basmati to GI-tagged Gobindobhog, Wayanad Jeerakasala & Red Rice.',
    },
    ghee_oil: {
      title: 'Vedic Gir Cow A2 Ghee & Wood-Pressed Oils',
      subtitle: 'Hand-churned wooden bilona ghee and slow cold-pressed unrefined oils.',
    },
    pulses_daal: {
      title: 'Unpolished Organic Dals & Pulses',
      subtitle: 'Zero synthetic polishing, stone-split pigeon peas, chickpeas, and native lentils.',
    },
    flours_atta: {
      title: 'Stone Chakki Fresh Whole Grain Flours',
      subtitle: 'Sehore Sharbati golden wheat stone-ground at low RPM to preserve bran and wheat germ.',
    },
    spices_masala: {
      title: 'Artisan Stone-Pounded Spices & Masalas',
      subtitle: 'Whole roasted spice blends with unadulterated oils and authentic regional punch.',
    },
    jaggery_sweets: {
      title: 'Kolhapur Chemical-Free Natural Gur & Sweeteners',
      subtitle: 'Naturally clarified with okra plant extracts. Mineral rich, zero sulphur, unrefined.',
    },
    pickles_chutneys: {
      title: 'Traditional Barni-Aged Pickles & Achar',
      subtitle: 'Sun-cured for 21 days in ceramic pots using pure cold-pressed mustard oil.',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Header />

      {currentView === 'admin' ? (
        <InventoryDashboard />
      ) : (
        <main className="flex-1">
          <HeroBanner />

          {/* Catalog Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Section Heading & Sort Options */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                    Direct From Origin
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500 font-medium">
                    {filtered.length} products available
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
                  {categoryTitles[activeCategory].title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                  {categoryTitles[activeCategory].subtitle}
                </p>
              </div>

              {/* Sort Bar */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 shadow-xs"
                >
                  <option value="featured">Featured & Curated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <SearchX className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-stone-800 text-lg">
                  No matching desi products found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  We couldn't find any products matching "{searchQuery}". Try searching for "Basmati", "Ghee", "Atta" or "Kashmiri".
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="bg-stone-900 hover:bg-amber-600 text-white hover:text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                  >
                    Clear Filters & Show All
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 mt-8">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Heritage Grain Knowledge & Sourcing Story */}
            <div className="mt-16 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-10 border border-stone-800 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                <Wheat className="w-96 h-96 -mb-16 -mr-16 text-amber-400" />
              </div>

              <div className="max-w-2xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Desi Standard</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Why 2-Year Aged Basmati & Bilona Ghee Transform Your Kitchen
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  Unlike industrial rice processed with water-glaze polishing, naturally aged Basmati has moisture reduced below 12% through seasons of hot summers and Himalayan winters. This crystalizes the amylose inside each grain, ensuring every cooked grain fluffs up to 24mm without breaking or sticking.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                    <span className="text-amber-400 font-bold text-sm block">1:2.5 Elongation</span>
                    <span className="text-[11px] text-stone-400">Slender grains stretch gracefully during dum cooking.</span>
                  </div>
                  <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                    <span className="text-amber-400 font-bold text-sm block">Cultured Curd Ghee</span>
                    <span className="text-[11px] text-stone-400">Churned from whole curd, never from industrial cream.</span>
                  </div>
                  <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                    <span className="text-amber-400 font-bold text-sm block">Cold Chakki Milling</span>
                    <span className="text-[11px] text-stone-400">Low RPM natural emery stones retain living enzymes.</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setActiveCategory('rice')}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                  >
                    Taste The Difference
                  </button>
                  <button
                    onClick={() => setCurrentView('admin')}
                    className="text-stone-400 hover:text-white text-xs underline font-semibold"
                  >
                    View Real-time Warehouse Stock Status →
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Persistent Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <PaymentGatewayModal />
      <OrderSuccessModal />
      <OrderTrackingModal />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
