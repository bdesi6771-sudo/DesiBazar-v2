import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, Award, Wheat, Lock, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveCategory, setCurrentView } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      {/* Trust Banner */}
      <div className="border-b border-stone-800 py-8 bg-stone-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">GI Tagged & Authenticated</h4>
              <p className="text-stone-400 text-[11px]">Direct geographical origin from Himalayan & regional basins.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Zero Adulteration Guarantee</h4>
              <p className="text-stone-400 text-[11px]">Lab certified pure grains, raw unpolished dals, bilona ghee.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Moisture Barrier Packaging</h4>
              <p className="text-stone-400 text-[11px]">Double-walled safe bags to preserve natural oils & aroma.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">256-Bit SSL Secured</h4>
              <p className="text-stone-400 text-[11px]">PCI-DSS compliant payment gateway: Cards, UPI, NetBanking & COD.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
                <Wheat className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold font-display text-white">DesiBazaar</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Preserving India’s culinary heritage through authentic aged rice varieties, wood-churned A2 bilona ghee, cold-pressed oils, and farm-fresh staples.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setCurrentView('admin')}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold"
              >
                Access Warehouse Inventory Management →
              </button>
            </div>
          </div>

          {/* Rice Varieties */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Heritage Rice Varieties
            </h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button onClick={() => setActiveCategory('rice')} className="hover:text-amber-400 transition">
                  Royal 1121 XXL Aged Basmati (24 Mo)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('rice')} className="hover:text-amber-400 transition">
                  Kurnool Andhra Sona Masoori
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('rice')} className="hover:text-amber-400 transition">
                  Bengal GI Gobindobhog Rice
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('rice')} className="hover:text-amber-400 transition">
                  Wayanad Jeerakasala (Kaima Biryani)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('rice')} className="hover:text-amber-400 transition">
                  Himalayan Glacial Red Rice
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('rice')} className="hover:text-amber-400 transition">
                  Manipur Chak-Hao Organic Black Rice
                </button>
              </li>
            </ul>
          </div>

          {/* Desi Pantry */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Desi Kitchen Pantry
            </h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button onClick={() => setActiveCategory('ghee_oil')} className="hover:text-amber-400 transition">
                  Gir Cow Vedic A2 Bilona Ghee
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('ghee_oil')} className="hover:text-amber-400 transition">
                  Cold-Pressed Kachi Ghani Mustard Oil
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('flours_atta')} className="hover:text-amber-400 transition">
                  Chakki Fresh Sharbati MP Atta
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('pulses_daal')} className="hover:text-amber-400 transition">
                  Unpolished Native Toor & Chana Dal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('jaggery_sweets')} className="hover:text-amber-400 transition">
                  Kolhapur Chemical-Free Natural Gur
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('spices_masala')} className="hover:text-amber-400 transition">
                  Stone-Ground Shahi Kashmiri Masala
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Certifications */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Quality & Warehouse
            </h4>
            <div className="space-y-2 text-stone-400 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Central Hub: GT Karnal Road, Grain Terminal, New Delhi</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Customer Care: +91 1800-419-DESI (9 AM - 7 PM IST)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>orders@desibazaar-heritage.com</span>
              </p>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-stone-500 font-mono block">
                FSSAI Lic. No: 10022011000842
              </span>
              <span className="text-[10px] text-stone-500 font-mono block">
                GSTIN: 07AAECD8921P1Z4
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-stone-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} DesiBazaar Heritage Grains & Pantry Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
