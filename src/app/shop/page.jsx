'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Minus, 
  Sparkles, 
  SlidersHorizontal, 
  Sun, 
  Moon, 
  Gift, 
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MACRO_CATEGORIES, SUB_CATEGORIES } from '@/lib/constants';
import PageHeroHeader from '@/components/layout/PageHeroHeader';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { addToCart, updateQuantity, getItemQuantity } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedMacro, setSelectedMacro] = useState(initialCategory);
  const [selectedSub, setSelectedSub] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('sNo-asc');
  const [priceRange, setPriceRange] = useState(20000);

  // Update selected macro if URL parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedMacro(cat);
      setSelectedSub('All');
    }
  }, [searchParams]);

  // Fetch full products catalog once on mount (cached in memory)
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/products?sort=sNo-asc');
        const data = await res.json();
        if (data.success && data.products) {
          setAllProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Instant in-memory filtering & sorting with zero server lag
  const displayedProducts = React.useMemo(() => {
    let result = allProducts.filter(p => {
      const matchMacro = selectedMacro === 'All' || p.macroCategory === selectedMacro;
      const matchSub = selectedSub === 'All' || p.category === selectedSub;
      const matchStock = !inStockOnly || (p.inStock && p.stock > 0);
      const matchPrice = p.price <= priceRange;
      
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        p.name.toLowerCase().includes(q) ||
        (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.sNo.toString() === q;

      return matchMacro && matchSub && matchStock && matchPrice && matchSearch;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'discount') result.sort((a, b) => b.discount - a.discount);
    else result.sort((a, b) => a.sNo - b.sNo);

    return result;
  }, [allProducts, selectedMacro, selectedSub, searchQuery, inStockOnly, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-slate-50/70 to-white pb-24">
      {/* 1. Full-Width Edge-to-Edge Hero Banner (Purple Theme & Sky Crackers) */}
      <PageHeroHeader
        theme="purple"
        bgImage="/images/alltype.jpeg"
        badge="139+ FIREWORKS • FLAT 80% MEGA DISCOUNT"
        badgeIcon={Sparkles}
        title="Diwali Crackers Catalog &"
        titleHighlight="Factory Rates"
        tamilTitle="சிவகாசி தரமான பட்டாசுகள் • 80% அதிரடி தள்ளுபடி"
        subtitle="Explore our certified direct Sivakasi outlet collection. Daylight sound crackers, sparkling fountains, and aerial repeating shots with instant cart ordering."
        breadcrumbs={[{ label: 'Crackers Catalog' }]}
      />

      {/* 2. Main Page Layout (Centered Max-W-7xl) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filters (Supporting Purple Theme) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel rounded-2xl p-5 border border-purple-200/80 shadow-sm space-y-6 bg-white/90">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                  <span>Filters & Options</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedMacro('All');
                    setSelectedSub('All');
                    setSearchQuery('');
                    setInStockOnly(false);
                    setPriceRange(20000);
                  }}
                  className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Search Crackers (English or தமிழ்)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Kuruvi, 30 Shot, பாம்..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
            </div>

            {/* Macro Category Filter Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Celebration Timing
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {MACRO_CATEGORIES.map((cat) => {
                  const isSelected = selectedMacro === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedMacro(cat.id);
                        setSelectedSub('All');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                          : 'bg-white hover:bg-purple-50 text-slate-700 border border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {cat.id === 'Daylight' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
                        {cat.id === 'Nightlight' && <Moon className="w-3.5 h-3.5 text-indigo-300" />}
                        {cat.id === 'Gift Boxes' && <Gift className="w-3.5 h-3.5 text-purple-300" />}
                        {cat.id === 'All' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{cat.label}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific Subcategory Dropdown / Accordion */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Cracker Type
              </label>
              <select
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-700 font-medium"
              >
                <option value="All">All Cracker Types ({SUB_CATEGORIES.length})</option>
                {SUB_CATEGORIES.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Max Net Price</span>
                <span className="text-purple-700 font-extrabold">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5"
                max="5000"
                step="25"
                value={priceRange > 5000 ? 5000 : priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹7</span>
                <span>₹5,000+</span>
              </div>
            </div>

            {/* Stock Status Toggle */}
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-slate-700">In Stock Items Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="glass-panel rounded-2xl p-4 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-slate-600 font-medium">
              Showing <strong className="text-slate-900 font-bold">{displayedProducts.length}</strong> items in catalog
            </p>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="sNo-asc">Price List Sequence (S.No)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-72 rounded-2xl skeleton-shimmer" />
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-sky-100">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No crackers match this criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search terms or expanding your price and category filters.
              </p>
              <button
                onClick={() => {
                  setSelectedMacro('All');
                  setSelectedSub('All');
                  setSearchQuery('');
                  setPriceRange(20000);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {displayedProducts.map((product) => {
                const qty = getItemQuantity(product.id);
                return (
                  <div
                    key={product.id}
                    className="glass-card rounded-2xl overflow-hidden p-3 flex flex-col justify-between group"
                  >
                    {/* Cracker Photo */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3">
                      <img
                        src={product.image || '/images/illustration-diwali-crackers.avif'}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* S.No Badge */}
                      <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                        #{product.sNo}
                      </div>

                      {/* 80% Discount Badge */}
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-sky-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        {product.discount}% OFF
                      </div>

                      {/* Stock Badge */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xs">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Cracker Details */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-sky-700 uppercase tracking-wide truncate max-w-[120px]">
                          {product.category}
                        </span>
                        <span className="text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                          {product.unit}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 line-clamp-1 group-hover:text-sky-900 transition-colors">
                        {product.name}
                      </h3>

                      {product.tamilName && (
                        <p className="text-[11px] text-slate-500 truncate font-tamil">
                          {product.tamilName}
                        </p>
                      )}

                      {/* Pricing & Stock */}
                      <div className="flex items-baseline justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-black text-sky-900">
                            ₹{product.price}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold ${product.inStock && product.stock > 0 ? (product.stock < 20 ? 'text-amber-600' : 'text-emerald-700') : 'text-rose-600'}`}>
                          {product.inStock && product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Counter Widget */}
                    <div>
                      {!product.inStock || product.stock <= 0 ? (
                        <button
                          disabled
                          className="w-full py-2 px-3 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      ) : qty === 0 ? (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs shadow-sm shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between border-2 border-purple-500 rounded-xl bg-purple-50 p-1">
                          <button
                            onClick={() => updateQuantity(product.id, qty - 1)}
                            className="w-7 h-7 rounded-lg bg-white shadow-xs text-purple-800 flex items-center justify-center hover:bg-purple-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-purple-950 px-2">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, qty + 1)}
                            className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs font-bold text-slate-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
