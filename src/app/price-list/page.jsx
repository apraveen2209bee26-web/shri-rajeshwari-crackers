'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, 
  Search, 
  Sparkles, 
  ShoppingBag,
  Flame,
  Phone,
  MapPin
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { STORE_CONFIG } from '@/lib/constants';
import PageHeroHeader from '@/components/layout/PageHeroHeader';

export default function PriceListPage() {
  const { setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch('/api/products?sort=sNo-asc');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error('Error fetching price list:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase().trim();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.tamilName && p.tamilName.includes(search.trim())) ||
      p.category.toLowerCase().includes(q) ||
      p.sNo.toString() === q
    );
  }, [products, search]);

  const grouped = useMemo(() => {
    const res = {};
    filtered.forEach(p => {
      if (!res[p.category]) res[p.category] = [];
      res[p.category].push(p);
    });
    return res;
  }, [filtered]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Non-print Header & Toolbar */}
      <div className="no-print space-y-6 mb-8">
        <PageHeroHeader
          theme="slate-gold"
          bgImage="/images/banner.jpeg"
          badge={`${STORE_CONFIG.name.toUpperCase()} • 80% MEGA DISCOUNT`}
          badgeIcon={Sparkles}
          title="Official 2026 Price List &"
          titleHighlight="Rate Matrix"
          tamilTitle="ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ் அதிகாரப்பூர்வ விலைப்பட்டியல் 2026"
          subtitle="Transparent factory rates for all 139 products with authentic photos, standard MRP, and 80% discounted rates. Print or save offline for community & family orders."
          breadcrumbs={[{ label: '2026 Price List' }]}
        >
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="px-5 py-3 rounded-full bg-white hover:bg-amber-50 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all border border-amber-400"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-1.5 active:scale-95 transition-all border border-sky-400"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart</span>
            </button>
          </div>
        </PageHeroHeader>

        {/* Search Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Product Name, Tamil Name, or S.No..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            />
          </div>

          <p className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-800">{filtered.length}</strong> of 139 items
          </p>
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print:block mb-6 text-center border-b-2 border-slate-900 pb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain inline-block" />
          <h1 className="text-2xl font-black text-slate-900 uppercase">
            {STORE_CONFIG.name}
          </h1>
        </div>
        <p className="text-xs font-bold text-slate-700">
          {STORE_CONFIG.tamilName} • {STORE_CONFIG.motto} • 80% MEGA DISCOUNT
        </p>
        <p className="text-[11px] text-slate-600">
          {STORE_CONFIG.address} • WhatsApp: {STORE_CONFIG.whatsappDisplay} | Phone: {STORE_CONFIG.secondaryPhoneDisplay}
        </p>
      </div>

      {/* Price Table Grouped by Category */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-slate-500 text-sm">
          No crackers found matching &ldquo;{search}&rdquo;.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([categoryName, items]) => (
            <div 
              key={categoryName}
              className="glass-panel rounded-2xl overflow-hidden border border-sky-100 shadow-sm print:border print:border-slate-400 print:rounded-none"
            >
              <div className="bg-sky-800 print:bg-slate-200 text-white print:text-slate-900 px-4 py-2 font-black text-xs sm:text-sm uppercase tracking-wider flex justify-between items-center">
                <span>{categoryName}</span>
                <span className="text-[11px] font-normal opacity-90 print:opacity-100">{items.length} items</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sky-50 print:bg-slate-100 border-b border-sky-100 print:border-slate-300 font-bold text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">S.NO</th>
                      <th className="py-2.5 px-2 w-14 text-center">PHOTO</th>
                      <th className="py-2.5 px-3">PRODUCTS NAME</th>
                      <th className="py-2.5 px-3">பட்டாசின் பெயர்</th>
                      <th className="py-2.5 px-3 w-20">PER</th>
                      <th className="py-2.5 px-3 w-24 text-right">RATE</th>
                      <th className="py-2.5 px-3 w-28 text-right font-black text-sky-950">NET RATE</th>
                      <th className="py-2.5 px-4 w-32 text-center">DISCOUNT & SAVINGS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                    {items.map((item) => {
                      const savings = Math.max(0, Math.round(item.originalPrice - item.price));
                      const discountPct = item.originalPrice > 0 ? Math.round((savings / item.originalPrice) * 100) : 80;

                      return (
                        <tr key={item.id} className="hover:bg-sky-50/50 print:hover:bg-transparent transition-colors">
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">
                            {item.sNo}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-sky-200/60 mx-auto flex items-center justify-center">
                              <img 
                                src={item.image || '/images/illustration-diwali-crackers.avif'} 
                                alt={item.name} 
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/images/illustration-diwali-crackers.avif'; }}
                              />
                            </div>
                          </td>
                          <td className="py-2 px-3 font-bold text-slate-800">
                            {item.name}
                          </td>
                          <td className="py-2 px-3 text-slate-500 font-tamil">
                            {item.tamilName || '-'}
                          </td>
                          <td className="py-2 px-3 font-medium text-slate-600">
                            {item.unit}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-400 line-through">
                            ₹{item.originalPrice.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right font-black text-sky-900 text-sm">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <span className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                {discountPct}% OFF
                              </span>
                              <span className="text-[11px] font-bold text-emerald-700 mt-0.5">
                                Save ₹{savings}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t-2 border-slate-900 text-center text-xs">
        <p className="font-bold">{STORE_CONFIG.name} • {STORE_CONFIG.address} • WhatsApp: {STORE_CONFIG.whatsappDisplay} • Call: {STORE_CONFIG.secondaryPhoneDisplay}</p>
        <p className="text-[10px] text-slate-500 mt-1">Manufactured & packed under strict PESO Indian Safety Standards.</p>
      </div>
    </div>
  );
}
