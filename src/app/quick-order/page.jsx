'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Search, 
  ShoppingCart, 
  ArrowRight, 
  Plus, 
  Minus, 
  FileSpreadsheet
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import PageHeroHeader from '@/components/layout/PageHeroHeader';

export default function QuickOrderPage() {
  const { 
    cartItems, 
    addToCart, 
    updateQuantity, 
    getItemQuantity, 
    totalCount, 
    totalMrp, 
    finalAmount, 
    totalSavings,
    setIsCartOpen,
    setIsCheckoutOpen 
  } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products?sort=sNo-asc');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Error fetching quick order catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = searchQuery.trim() === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tamilName && p.tamilName.includes(searchQuery.trim())) ||
        p.sNo.toString() === searchQuery.trim();

      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const groupedProducts = useMemo(() => {
    const groups = {};
    filteredProducts.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [filteredProducts]);

  const categoriesList = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const handleInputChange = (product, val) => {
    const qty = parseInt(val, 10);
    if (isNaN(qty) || qty <= 0) {
      updateQuantity(product.id, 0);
    } else {
      const current = getItemQuantity(product.id);
      if (current === 0) {
        addToCart(product, qty);
      } else {
        updateQuantity(product.id, qty);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32">
      {/* Title & Banner with Bursting Sky Crackers */}
      <PageHeroHeader
        theme="royal-blue"
        bgImage="/images/sakkaram.jpeg"
        badge="BULK PURCHASE MODE • SPEED ORDERING MATRIX"
        badgeIcon={Zap}
        title="Quick Bulk Order Sheet &"
        titleHighlight="Speed Matrix"
        tamilTitle="விரைவு மொத்த ஆர்டர் படிவம் • நேரடி கணக்கீடு"
        subtitle="Rapid spreadsheet entry built for families, marriages, communities, and resellers. Live discount calculation and one-tap WhatsApp checkout."
        breadcrumbs={[{ label: 'Quick Order' }]}
      />

      {/* Control Bar: Search & Category Jump */}
      <div className="sticky top-20 z-30 mb-6 glass-panel rounded-2xl p-4 border border-sky-200/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type S.No, Name, or தமிழ் பெயர்..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          />
        </div>

        {/* Category Jump Buttons / Selector */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-200'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categoriesList.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          {categoriesList.length > 5 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-700"
            >
              <option value="All">More...</option>
              {categoriesList.slice(5).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Spreadsheet Tables Grouped by Category */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      ) : Object.keys(groupedProducts).length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No crackers match your search</h3>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([categoryName, items]) => (
            <div key={categoryName} className="glass-panel rounded-2xl overflow-hidden border border-sky-100 shadow-sm">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <h3 className="font-black text-sm tracking-wide uppercase">
                    {categoryName}
                  </h3>
                </div>
                <span className="text-xs text-sky-200 font-semibold bg-sky-950/40 px-2.5 py-0.5 rounded-full">
                  {items.length} items
                </span>
              </div>

              {/* Table Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sky-50/70 border-b border-sky-100 text-slate-700 font-bold">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                      <th className="py-2.5 px-2 w-14 text-center">Photo</th>
                      <th className="py-2.5 px-3">Products Name</th>
                      <th className="py-2.5 px-3">பட்டாசின் பெயர்</th>
                      <th className="py-2.5 px-3 w-20">Unit</th>
                      <th className="py-2.5 px-3 w-24 text-right">Rate (MRP)</th>
                      <th className="py-2.5 px-3 w-32 text-right font-black text-sky-950">Net Rate & Stock</th>
                      <th className="py-2.5 px-3 w-36 text-center">Quantity</th>
                      <th className="py-2.5 px-3 w-28 text-right font-black">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((product) => {
                      const qty = getItemQuantity(product.id);
                      const rowTotal = qty * product.price;
                      const isOutOfStock = !product.inStock || product.stock <= 0;

                      return (
                        <tr 
                          key={product.id}
                          className={`hover:bg-sky-50/50 transition-colors ${qty > 0 ? 'bg-amber-50/40' : ''}`}
                        >
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">
                            {product.sNo}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-sky-100 mx-auto flex items-center justify-center">
                              <img 
                                src={product.image || '/images/illustration-diwali-crackers.avif'} 
                                alt={product.name} 
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/images/illustration-diwali-crackers.avif'; }}
                              />
                            </div>
                          </td>
                          <td className="py-2 px-3 font-bold text-slate-800">
                            {product.name}
                          </td>
                          <td className="py-2 px-3 text-slate-500 font-tamil">
                            {product.tamilName || '-'}
                          </td>
                          <td className="py-2 px-3 text-slate-500 font-medium">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {product.unit}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right text-slate-400 line-through">
                            ₹{product.originalPrice}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <span className="font-black text-sky-900 text-sm block">₹{product.price}</span>
                            <span className={`text-[10px] font-bold block ${!isOutOfStock ? (product.stock < 20 ? 'text-amber-600' : 'text-emerald-600') : 'text-rose-600'}`}>
                              {!isOutOfStock ? `${product.stock} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            {isOutOfStock ? (
                              <div className="text-center">
                                <span className="bg-rose-50 text-rose-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-rose-200">
                                  Out of Stock
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => updateQuantity(product.id, Math.max(0, qty - 1))}
                                  disabled={qty === 0}
                                  className="w-6 h-6 rounded-md bg-slate-100 hover:bg-sky-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
                                  aria-label="Decrease"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>

                                <input
                                  type="number"
                                  min="0"
                                  max={product.stock || 999}
                                  value={qty === 0 ? '' : qty}
                                  onChange={(e) => handleInputChange(product, e.target.value)}
                                  placeholder="0"
                                  className="w-14 text-center py-1 text-xs font-black rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                                />

                                <button
                                  onClick={() => {
                                    if (qty === 0) addToCart(product, 1);
                                    else updateQuantity(product.id, qty + 1);
                                  }}
                                  disabled={qty >= (product.stock || 999)}
                                  className="w-6 h-6 rounded-md bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition-colors disabled:opacity-40"
                                  aria-label="Increase"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-black text-slate-800">
                            {rowTotal > 0 ? (
                              <span className="text-emerald-700 font-black">
                                ₹{rowTotal.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
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

      {/* Bottom Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sky-200 shadow-2xl py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-6 text-xs w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Items</span>
              <strong className="text-slate-800 text-sm font-black">{totalCount} items</strong>
            </div>

            <div className="hidden md:block">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total MRP</span>
              <span className="line-through text-slate-500 font-medium">₹{totalMrp.toLocaleString('en-IN')}</span>
            </div>

            <div>
              <span className="text-emerald-600 block text-[10px] uppercase font-black">80% Savings</span>
              <span className="font-extrabold text-emerald-700 text-sm">-₹{totalSavings.toLocaleString('en-IN')}</span>
            </div>

            <div className="border-l border-slate-200 pl-4">
              <span className="text-sky-900 block text-[10px] uppercase font-black">Net Payable Total</span>
              <strong className="text-base sm:text-xl font-black text-sky-950">₹{finalAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-sky-300 text-sky-800 hover:bg-sky-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Review Cart ({totalCount})</span>
            </button>

            <button
              disabled={totalCount === 0}
              onClick={() => setIsCheckoutOpen(true)}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all"
            >
              <span>WhatsApp Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
