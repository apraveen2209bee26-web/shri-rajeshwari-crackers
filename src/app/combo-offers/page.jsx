'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  ShoppingCart, 
  Download, 
  Phone, 
  Search, 
  ShieldCheck, 
  Award, 
  Percent, 
  Eye, 
  Plus, 
  Minus,
  FileSpreadsheet,
  ArrowRight,
  Flame,
  Printer
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import PageHeroHeader from '@/components/layout/PageHeroHeader';

export default function ComboOffersPage() {
  const { addToCart } = useCart();
  const { settings, whatsappUrl } = useSettings();

  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [comboQty, setComboQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    async function loadCombos() {
      try {
        const res = await fetch('/api/combos', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.combos) && data.combos.length > 0) {
          setCombos(data.combos);
          setSelectedSlug(data.combos[0].slug);
        }
      } catch (err) {
        console.error('Failed to load combo offers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCombos();
  }, []);

  const activeCombo = useMemo(() => {
    return combos.find(c => c.slug === selectedSlug) || combos[0] || null;
  }, [combos, selectedSlug]);

  // Parse items from JSON
  const parsedItems = useMemo(() => {
    if (!activeCombo || !activeCombo.itemsJson) return [];
    try {
      const items = typeof activeCombo.itemsJson === 'string' 
        ? JSON.parse(activeCombo.itemsJson) 
        : activeCombo.itemsJson;
      return Array.isArray(items) ? items : [];
    } catch (e) {
      return [];
    }
  }, [activeCombo]);

  // Parse highlights
  const parsedHighlights = useMemo(() => {
    if (!activeCombo || !activeCombo.highlights) return [];
    try {
      const h = typeof activeCombo.highlights === 'string' 
        ? JSON.parse(activeCombo.highlights) 
        : activeCombo.highlights;
      return Array.isArray(h) ? h : [];
    } catch (e) {
      return [];
    }
  }, [activeCombo]);

  // Filter package contents by user search
  const filteredPackageItems = useMemo(() => {
    if (!searchItem.trim()) return parsedItems;
    const q = searchItem.toLowerCase().trim();
    return parsedItems.filter(item => 
      (item.name || '').toLowerCase().includes(q) ||
      (item.tamilName || '').toLowerCase().includes(q) ||
      (item.unit || '').toLowerCase().includes(q)
    );
  }, [parsedItems, searchItem]);

  const handleAddToCart = () => {
    if (!activeCombo) return;
    addToCart({
      id: `combo-${activeCombo.id}`,
      name: `${activeCombo.title} (${activeCombo.itemsCount} Items)`,
      tamilName: activeCombo.tamilTitle || 'மெகா காம்போ பேக்',
      category: 'Combo Offers',
      macroCategory: 'Gift Boxes',
      unit: '1 Mega Bundle',
      originalPrice: activeCombo.totalMarketPrice || activeCombo.offerPrice * 2.5,
      price: activeCombo.offerPrice,
      discount: activeCombo.totalMarketPrice > 0 
        ? Math.round(((activeCombo.totalMarketPrice - activeCombo.offerPrice) / activeCombo.totalMarketPrice) * 100) 
        : 80,
      image: activeCombo.image || '/images/illustration-diwali-crackers.avif'
    }, comboQty);

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // Download Combo Itemized PDF/Brochure format or Trigger Clean Print
  const handlePrintBrochure = () => {
    window.print();
  };

  // Download CSV of combo contents
  const handleDownloadCsv = () => {
    if (!parsedItems.length) return;
    const headers = ['Item No', 'Product Name', 'Tamil Name', 'Quantity', 'Packing Unit', 'Standard MRP (INR)'];
    const rows = parsedItems.map((item, idx) => [
      idx + 1,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.tamilName || '').replace(/"/g, '""')}"`,
      item.quantity || 1,
      `"${item.unit || 'BOX'}"`,
      item.originalPrice || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeCombo.slug}_contents_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const savingsAmount = activeCombo 
    ? Math.max(0, (activeCombo.totalMarketPrice || activeCombo.offerPrice * 2.5) - activeCombo.offerPrice) 
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-bold text-sm">Loading Exclusive Festival Combo Packs...</p>
      </div>
    );
  }

  if (combos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Gift className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
        <h2 className="text-2xl font-black text-slate-900">Combo Offers Updating!</h2>
        <p className="text-slate-600 text-sm">Our fireworks masters are crafting grand Diwali celebration combo bundles. Check back shortly!</p>
        <Link href="/shop" className="inline-block px-6 py-3 rounded-xl bg-sky-600 text-white font-bold text-sm">
          Browse Regular Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* 1. FESTIVE TOP BANNER WITH GOLD THEME & BURSTING SKY CRACKERS */}
        <PageHeroHeader
          theme="gold"
          bgImage="/images/banner.jpeg"
          badge="FESTIVAL MEGA BUNDLES • SAVE UP TO 80%"
          badgeIcon={Flame}
          title="Mega Combo Offers &"
          titleHighlight="Value Packs"
          tamilTitle="தரமான பட்டாசுகள் குறைந்த விலையில்! குடும்பத்திற்கான பிரம்மாண்ட காம்போ"
          subtitle="Curated cracker assortments packed with up to 62 premium fireworks items. Enjoy verified Sivakasi quality and instant savings up to ₹19,900!"
          breadcrumbs={[{ label: 'Festival Combos' }]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 z-20 relative space-y-8">
        {/* 2. DYNAMIC COMBO OFFER TAB SELECTOR PILLS */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {combos.map((combo) => {
            const isSelected = combo.slug === activeCombo?.slug;
            return (
              <button
                key={combo.id}
                onClick={() => {
                  setSelectedSlug(combo.slug);
                  setSearchItem('');
                  setComboQty(1);
                }}
                className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-center font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-600/30 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span className="block text-[10px] uppercase tracking-wider font-extrabold opacity-90">
                  {combo.badge || 'MEGA SAVER'}
                </span>
                <span className="text-base sm:text-lg font-black tracking-tight">
                  ₹{combo.offerPrice.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-medium opacity-85">({combo.itemsCount})</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. COMBO OFFER HERO SHOWCASE CARD */}
        {activeCombo && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Poster Image with Zoom & Download Button */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md group">
                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md z-10 shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{activeCombo.badge}</span>
                  </span>

                  <img
                    src={activeCombo.image || '/images/illustration-diwali-crackers.avif'}
                    alt={activeCombo.title}
                    className="w-full h-auto max-h-[500px] object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                  />

                  <button
                    onClick={() => setImageModalOpen(true)}
                    className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Zoom View</span>
                  </button>
                </div>

                {/* PDF Brochure / Print Download Button */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrintBrochure}
                    className="flex-1 py-3 px-4 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-700 font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Printer className="w-4 h-4 text-rose-600" />
                    <span>Print Rate Brochure</span>
                  </button>
                  <button
                    onClick={handleDownloadCsv}
                    className="flex-1 py-3 px-4 rounded-xl border border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Download CSV List</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Pricing, Badges, Highlights & Add to Cart */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-black text-xs flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      <span>{activeCombo.itemsCount} Fireworks Items</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5" />
                      <span>80% MEGA DISCOUNT</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>100% Sivakasi Standard</span>
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {activeCombo.title}
                  </h2>
                  {activeCombo.tamilTitle && (
                    <p className="text-xs sm:text-sm font-bold text-rose-700">
                      {activeCombo.tamilTitle}
                    </p>
                  )}
                </div>

                {/* PRICING BOX */}
                <div className="bg-amber-50/70 border-2 border-amber-200/90 rounded-2xl p-5 space-y-2">
                  <div className="text-xs text-slate-500 font-medium line-through">
                    Standard Market MRP: ₹{(activeCombo.totalMarketPrice || activeCombo.offerPrice * 2.5).toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      ₹{activeCombo.offerPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-xs tracking-wider">
                      FESTIVAL RATE
                    </span>
                  </div>
                  {savingsAmount > 0 && (
                    <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>You Save ₹{savingsAmount.toLocaleString('en-IN')} instantly on this family mega bundle!</span>
                    </p>
                  )}
                </div>

                {/* Description */}
                {activeCombo.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeCombo.description}
                  </p>
                )}

                {/* Package Highlights Grid */}
                {parsedHighlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      PACKAGE HIGHLIGHTS:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {parsedHighlights.map((hl, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QUANTITY STEPPER & ADD TO CART CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl bg-slate-50 p-1 w-full sm:w-36 shrink-0">
                    <button
                      onClick={() => setComboQty(prev => Math.max(1, prev - 1))}
                      className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black text-sm text-slate-900 px-3">
                      {comboQty}
                    </span>
                    <button
                      onClick={() => setComboQty(prev => prev + 1)}
                      className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold active:scale-95"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 ${
                      addedAnimation
                        ? 'bg-emerald-600 text-white scale-105'
                        : 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-600/30'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{addedAnimation ? '✓ Combo Added to Cart!' : `Add to Cart • ₹${(activeCombo.offerPrice * comboQty).toLocaleString('en-IN')}`}</span>
                  </button>

                  <a
                    href={`${whatsappUrl}&text=${encodeURIComponent(`Hello ${settings.shop_name}, I want to order ${comboQty}x ${activeCombo.title} at Festival Rate ₹${activeCombo.offerPrice * comboQty}. Please confirm packing!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 4. PACKAGE CONTENTS TABLE (Searchable 3-Column Layout from Screenshot 3) */}
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                      <span>Package Contents</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                        {parsedItems.length} Items
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Complete verified list of fireworks packed inside {activeCombo.title}
                    </p>
                  </div>
                </div>

                {/* Search Bar for Package Contents */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    placeholder="Search item (e.g. shot, flower, sparkler)..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                </div>
              </div>

              {filteredPackageItems.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl text-xs text-slate-500">
                  No items in this combo pack matching &ldquo;{searchItem}&rdquo;.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {filteredPackageItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/90 hover:bg-rose-50/40 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-500 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {item.name}
                          </p>
                          {item.tamilName && (
                            <p className="text-[10px] text-slate-500 truncate">
                              {item.tamilName}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 font-black text-[11px] shrink-0 border border-rose-200 uppercase">
                        {item.unit || `${item.quantity || 1} PKT`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ZOOM MODAL FOR COMBO POSTER */}
      {imageModalOpen && activeCombo && (
        <div 
          className="fixed inset-0 bg-slate-950/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-auto">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 bg-slate-900 text-white rounded-full p-2 z-10 hover:bg-slate-800"
            >
              ✕
            </button>
            <img
              src={activeCombo.image || '/images/illustration-diwali-crackers.avif'}
              alt={activeCombo.title}
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
