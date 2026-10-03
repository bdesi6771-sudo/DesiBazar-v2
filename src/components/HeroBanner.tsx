import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, Sparkles, Award, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveCategory } = useStore();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-stone-100 border-b border-stone-800">
      {/* Subtle decorative grain background overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Sourced from Himalayan Valleys & Gaushalas</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
              Aged Heritage Rice & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                Pure Desi Kitchen Essentials
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              From naturally 2-year cellar aged 1121 Basmati & GI-tagged Gobindobhog, to bilona wood-churned Gir Cow A2 ghee and cold-pressed kachi ghani oils. 100% unadulterated, stone-processed, and packaged fresh with real-time inventory tracking.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveCategory('rice')}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition transform active:scale-95"
              >
                <span>Explore Heritage Rice (1kg - 25kg)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveCategory('ghee_oil')}
                className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold px-5 py-3 rounded-xl text-sm border border-stone-700 transition"
              >
                <span>A2 Bilona Ghee & Cold-Pressed Oils</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-800/80">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>GI Tagged & Lab Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Polish & Chemicals</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Express Pan-India Dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <span className="text-emerald-400 font-bold">🔒</span>
                <span>PCI-DSS Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Right Featured Highlight Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-700/80 shadow-2xl bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
                alt="Aged Basmati Rice"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="bg-amber-500 text-stone-950 font-bold text-xs uppercase px-2.5 py-1 rounded shadow">
                  Aged 2 Years
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <span className="bg-stone-900/80 backdrop-blur border border-amber-500/30 text-amber-300 text-xs px-2.5 py-1 rounded-full font-medium">
                  🌾 8.4mm Grain
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  Signature Selection
                </p>
                <h3 className="text-lg font-bold text-white font-display">
                  Royal 1121 XXL Aged Basmati Rice
                </h3>
                <p className="text-stone-300 text-xs line-clamp-2">
                  Slow-cured 24 months in temperature regulated silos for non-sticky, fragrant biryani.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-amber-300 font-bold text-sm">
                    Starting from ₹185 / kg
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    ✓ Available in 1kg, 5kg, 10kg, 25kg
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
