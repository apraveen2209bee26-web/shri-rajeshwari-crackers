'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function FloatingCartButton() {
  const { totalCount, finalAmount, setIsCartOpen } = useCart();

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce">
      <button
        id="floating-cart-button"
        onClick={() => setIsCartOpen(true)}
        className="flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-900 text-white shadow-2xl shadow-sky-600/40 hover:scale-105 active:scale-95 transition-all border-2 border-white/60"
        aria-label="View shopping cart"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-yellow-300" />
          <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-sky-950 text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow-md border-2 border-sky-900">
            {totalCount}
          </span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-sky-200 uppercase font-semibold tracking-wider leading-none">
            Checkout
          </span>
          <span className="text-sm font-extrabold text-white leading-tight">
            ₹{finalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </button>
    </div>
  );
}
