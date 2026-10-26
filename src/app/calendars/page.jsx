'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  ShoppingCart, 
  Check, 
  Plus, 
  Minus, 
  Printer, 
  Layers, 
  FileText, 
  Award, 
  PhoneCall, 
  MessageCircle, 
  ChevronRight, 
  Flame, 
  CheckCircle2, 
  Info,
  SlidersHorizontal,
  PackageCheck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import FireworksBurstCanvas from '@/components/effects/FireworksBurstCanvas';

export default function CalendarsPage() {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCalendarForDetails, setSelectedCalendarForDetails] = useState(null);

  const { addToCart, updateQuantity, getItemQuantity, setIsCartOpen } = useCart();
  const { settings, whatsappUrl } = useSettings();

  useEffect(() => {
    async function loadCalendars() {
      try {
        setLoading(true);
        const res = await fetch('/api/calendars');
        const data = await res.json();
        if (data.success && Array.isArray(data.calendars)) {
          setCalendars(data.calendars);
        }
      } catch (err) {
        console.error('Failed to load calendars:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCalendars();
  }, []);

  const calendarTypes = [
    { id: 'ALL', label: 'All Calendars', icon: CalendarIcon },
    { id: 'Wirebound / Spiral Flip Wall', label: 'Spiral Wall Flip', icon: Layers },
    { id: 'Tear-Off / Daily Slip', label: 'Daily Slip (தினசரி)', icon: FileText },
    { id: 'Single-Sheet Poster Planner', label: 'Poster Planners (A2/A3)', icon: Printer },
    { id: 'Desk & Tabletop', label: 'Desk & Tabletop', icon: Award }
  ];

  const filteredCalendars = calendars.filter(cal => {
    if (selectedType === 'ALL') return true;
    return cal.type === selectedType;
  });

  const handleAddToCart = (cal) => {
    const cartItemId = `cal-${cal.id}`;
    const cartProduct = {
      id: cartItemId,
      sNo: cal.id,
      name: cal.name,
      tamilName: cal.tamilName,
      category: 'Calendars',
      unit: cal.size || '1 Piece',
      originalPrice: Number(cal.originalPrice) || Number(cal.price),
      price: Number(cal.price),
      image: cal.image,
      stock: cal.stock
    };
    addToCart(cartProduct, 1);
  };

  return (
    <div className="min-h-screen bg-[#021c17] text-slate-100 pb-24 selection:bg-emerald-500 selection:text-white">
      {/* Decorative Festive Canvas */}
      <FireworksBurstCanvas />

      {/* Hero Header - Deep Regal Emerald & 24K Gold Aesthetic */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#011a15] via-[#043e32] to-[#021c17] border-b border-emerald-500/30 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-bold tracking-wider uppercase mb-5 shadow-lg shadow-emerald-950/60 backdrop-blur-md">
            <Printer className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Sivakasi Direct Offset Printing • 2026 Collection</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-amber-300">ஸ்ரீ ராஜேஸ்வரி பிரஸ்</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Sivakasi Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">Calendars 2026</span>
          </h1>

          <p className="text-lg sm:text-xl text-emerald-200 font-medium max-w-3xl mx-auto mb-2">
            தினசரி &amp; மாத காலண்டர்கள் • சுபமுகூர்த்த தினங்கள் • ராசி பலன் • அரசு விடுமுறைகள்
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8">
            Manufactured with high-GSM imported gloss art paper, gold foil stamping, and authentic Sivakasi offset printing precision. Seamlessly combine calendars and crackers in a single order cart!
          </p>

          {/* Quick Stats / Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="bg-[#032920]/80 border border-emerald-500/30 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="text-amber-400 font-extrabold text-lg sm:text-xl">130 - 300 GSM</div>
              <div className="text-xs text-emerald-200/80">Premium Imported Art Paper</div>
            </div>
            <div className="bg-[#032920]/80 border border-emerald-500/30 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="text-emerald-300 font-extrabold text-lg sm:text-xl">Tamil Panchangam</div>
              <div className="text-xs text-emerald-200/80">Nalla Neram &amp; Rasi Palan</div>
            </div>
            <div className="bg-[#032920]/80 border border-emerald-500/30 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="text-amber-400 font-extrabold text-lg sm:text-xl">Unified Cart</div>
              <div className="text-xs text-emerald-200/80">Order with Diwali Crackers</div>
            </div>
            <div className="bg-[#032920]/80 border border-emerald-500/30 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="text-emerald-300 font-extrabold text-lg sm:text-xl">Bulk Printing</div>
              <div className="text-xs text-emerald-200/80">Custom Logo for Brands</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Category Filters Bar */}
        <div className="bg-[#042d24]/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-2.5 sm:p-3 shadow-xl mb-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {calendarTypes.map(type => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-emerald-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60 hover:text-white border border-emerald-500/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-950' : 'text-amber-400'}`} />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#03261f] border border-emerald-500/20 rounded-2xl p-5 animate-pulse h-96" />
            ))}
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalendars.map(cal => {
              const cartItemId = `cal-${cal.id}`;
              const qtyInCart = getItemQuantity(cartItemId);
              const discountPercent = cal.originalPrice && cal.originalPrice > cal.price
                ? Math.round(((cal.originalPrice - cal.price) / cal.originalPrice) * 100)
                : 0;

              let parsedFeatures = [];
              try {
                parsedFeatures = typeof cal.features === 'string' ? JSON.parse(cal.features) : (cal.features || []);
              } catch (e) {
                parsedFeatures = [];
              }

              return (
                <div 
                  key={cal.id}
                  className="group bg-gradient-to-b from-[#032b23] to-[#021f19] border border-emerald-500/30 hover:border-amber-400/70 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-950/70 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Preview */}
                  <div className="relative aspect-[4/3] bg-[#011410] overflow-hidden border-b border-emerald-500/20 flex items-center justify-center p-3">
                    <img 
                      src={cal.image || '/images/calendars/daily-slip-calendar.jpg'} 
                      alt={cal.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-lg drop-shadow-xl"
                    />

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-lg border border-red-400/50">
                        {discountPercent}% OFF
                      </div>
                    )}

                    {/* Paper GSM Pill */}
                    <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-md shadow">
                      {cal.paperGsm || 'High GSM'}
                    </div>

                    {/* Calendar Type Pill */}
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded">
                      {cal.type}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Tamil Name */}
                      {cal.tamilName && (
                        <div className="text-amber-300 font-bold text-sm mb-1 tracking-wide">
                          {cal.tamilName}
                        </div>
                      )}

                      {/* Main English Name */}
                      <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-amber-200 transition-colors">
                        {cal.name}
                      </h3>

                      {/* Description */}
                      {cal.description && (
                        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                          {cal.description}
                        </p>
                      )}

                      {/* Specifications Pills */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
                        <div className="bg-[#021f18] border border-emerald-500/20 rounded-lg p-2">
                          <span className="text-emerald-400/80 block text-[10px] uppercase font-bold">Size Format</span>
                          <span className="text-slate-200 font-medium truncate block">{cal.size || 'Standard'}</span>
                        </div>
                        <div className="bg-[#021f18] border border-emerald-500/20 rounded-lg p-2">
                          <span className="text-emerald-400/80 block text-[10px] uppercase font-bold">Paper Quality</span>
                          <span className="text-slate-200 font-medium truncate block">{cal.paperGsm || 'Art Paper'}</span>
                        </div>
                      </div>

                      {/* Features List (Top 2) */}
                      {parsedFeatures.length > 0 && (
                        <div className="space-y-1.5 mb-5">
                          {parsedFeatures.slice(0, 2).map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-emerald-100/90">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                              <span className="line-clamp-1">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing & Add to Cart Section */}
                    <div className="pt-4 border-t border-emerald-500/20 mt-auto">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-amber-400">
                              ₹{cal.price}
                            </span>
                            {cal.originalPrice > cal.price && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{cal.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-300/80 block font-semibold">
                            Direct Sivakasi Press Price
                          </span>
                        </div>

                        {/* Stock Badge */}
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            In Stock
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Unified Cart */}
                      {qtyInCart === 0 ? (
                        <button
                          onClick={() => handleAddToCart(cal)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-emerald-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-200 active:scale-95"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-[#011410] border border-emerald-400/50 rounded-xl overflow-hidden shadow-inner flex-1 justify-between p-1">
                            <button
                              onClick={() => updateQuantity(cartItemId, qtyInCart - 1)}
                              className="w-8 h-8 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white flex items-center justify-center font-bold transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black text-amber-300 text-sm px-2">
                              {qtyInCart} in Cart
                            </span>
                            <button
                              onClick={() => updateQuantity(cartItemId, qtyInCart + 1)}
                              className="w-8 h-8 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white flex items-center justify-center font-bold transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => setIsCartOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors whitespace-nowrap"
                          >
                            View Cart
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCalendars.length === 0 && (
          <div className="bg-[#03261f] border border-emerald-500/30 rounded-2xl p-12 text-center max-w-xl mx-auto my-12">
            <CalendarIcon className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-xl font-bold text-white mb-2">No calendars found in this category</h3>
            <p className="text-sm text-slate-300 mb-6">Explore our other calendar formats or browse all varieties.</p>
            <button
              onClick={() => setSelectedType('ALL')}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-6 py-2.5 rounded-xl text-sm"
            >
              Show All Calendars
            </button>
          </div>
        )}

        {/* Custom Corporate & Bulk Printing Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#033429] via-[#054b3c] to-[#033429] border border-emerald-400/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Printer className="w-3.5 h-3.5" />
                Custom Corporate Printing
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                Want Your Company Name &amp; Logo Printed on Calendars?
              </h2>
              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-2xl">
                We manufacture and custom-print thousands of calendars annually for corporate gifts, retail shops, temples, trusts, and business promotions across Tamil Nadu and all of India. Special wholesale prices available for 100+ copies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href={`${whatsappUrl}?text=${encodeURIComponent('Hello Shri Rajeshwari Press, I am interested in ordering Custom Printed Calendars 2026 for my business. Please share bulk wholesale pricing and designs.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-emerald-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-amber-500/20 transition-all duration-200 text-center"
              >
                <MessageCircle className="w-5 h-5 text-emerald-950 fill-current" />
                <span>Bulk Inquiry on WhatsApp</span>
              </a>

              <Link
                href="/about"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-emerald-200 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-400/40 transition-colors text-center text-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300" />
                <span>Contact Sivakasi Office</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Informational Accordion / Specifications from User Screenshots */}
        <div className="mt-12 bg-[#02241e] border border-emerald-500/20 rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-400" />
            <span>Standard Printing Paper Thickness (GSM) &amp; Formats Guide</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-emerald-100/80">
            <div className="p-4 rounded-xl bg-[#011b16] border border-emerald-500/20">
              <div className="font-bold text-amber-300 mb-1 text-sm">Wall Calendar Sheets</div>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white">130 to 170 GSM Art Paper:</strong> Thicker sheets prevent paper curling and allow pages to hang perfectly flat month after month.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#011b16] border border-emerald-500/20">
              <div className="font-bold text-amber-300 mb-1 text-sm">Desk &amp; Tabletop Sheets</div>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white">250 to 300 GSM Heavy Art Card:</strong> Essential for leaves to stand straight on triangular tent stands without drooping.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#011b16] border border-emerald-500/20">
              <div className="font-bold text-amber-300 mb-1 text-sm">Daily Tear-Off Slips</div>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white">Glazed Slip Pad with Gold Mount:</strong> Easy tear-off perforated edges with daily Rasi Palan, Nalla Neram, and festival highlights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
