'use client';

import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  Sparkles, 
  Percent, 
  ShieldCheck 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    totalCount,
    totalMrp,
    finalAmount,
    totalSavings,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-sky-100 animate-slideLeft">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-sky-950 flex items-center justify-center font-bold">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base">Your Festive Cart</h3>
                <p className="text-xs text-sky-200">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 80% Discount Highlight Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900 font-medium">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Mega 80% Discount Applied!</span>
            </div>
            <span className="font-bold text-amber-800">Direct Sivakasi Rates</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-400 mx-auto flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our Daylight, Nightlight, and Gift Box cracker selections at flat 80% off!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-sky-50 border border-sky-100 overflow-hidden relative shrink-0">
                    <img
                      src={item.image || '/images/illustration-diwali-crackers.avif'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs truncate leading-snug">
                          {item.name}
                        </h4>
                        {item.tamilName && (
                          <p className="text-[11px] text-slate-500 truncate">{item.tamilName}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price per unit */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-sky-900 text-sm">
                          ₹{item.price}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{item.originalPrice}
                        </span>
                        <span className="text-[10px] text-slate-500">/ {item.unit}</span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden shadow-inner">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-sky-100 text-slate-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-sky-100 text-slate-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Bill Breakdown */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-sky-100 bg-sky-50/50 space-y-3.5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total MRP Value</span>
                  <span className="line-through">₹{totalMrp.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Mega Discount (80% Off)
                  </span>
                  <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Net Payable Total</span>
                  <span className="text-base text-sky-900">₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleProceedCheckout}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-lg shadow-green-600/25 active:scale-98 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Orders sent directly to WhatsApp for verification & dispatch
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
