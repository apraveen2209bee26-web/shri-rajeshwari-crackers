'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  ShoppingCart, 
  Phone, 
  Menu, 
  X, 
  Flame 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { STORE_CONFIG } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount, finalAmount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hidden keyboard shortcut for store owner: Ctrl + Shift + A
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = '/admin/login';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop Catalog' },
    { href: '/quick-order', label: 'Quick Order (Bulk)' },
    { href: '/price-list', label: 'Price List' },
    { href: '/safety-tips', label: 'Safety Tips' },
    { href: '/about', label: 'About Us' },
  ];

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-amber-400 text-sky-950 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide animate-pulse">
              MEGA SALE
            </span>
            <span>💥 FLAT 80% OFF on All Crackers Direct from Sivakasi Factory!</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sky-200">
            <a 
              href={`https://wa.me/91${STORE_CONFIG.whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-green-400" />
              <span>WhatsApp: <strong className="text-white">{STORE_CONFIG.whatsappDisplay}</strong></span>
            </a>
            <span className="hidden sm:inline text-sky-400">|</span>
            <a 
              href={`tel:${STORE_CONFIG.secondaryPhone}`} 
              className="hidden sm:flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <span>Call: <strong className="text-white">{STORE_CONFIG.secondaryPhoneDisplay}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navigation Bar */}
      <nav className="glass-nav py-3 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with Royal Crown R */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-sky-400/30 shadow-md group-hover:scale-105 transition-transform">
              <img 
                src="/images/logo.png" 
                alt="Shri Rajeshwari Crackers Logo" 
                className="w-full h-full object-contain p-0.5" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 bg-clip-text text-transparent">
                  SHRI RAJESHWARI
                </span>
                <span className="font-black text-lg sm:text-xl tracking-wider text-amber-500">
                  CRACKERS
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-sky-700 -mt-1">
                ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ் • சிவகாசி
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-sky-500/10 text-sky-900 shadow-sm border border-sky-300/40'
                      : 'text-slate-700 hover:text-sky-800 hover:bg-sky-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action: Cart Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              id="navbar-cart-button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-md shadow-sky-600/20 active:scale-95 transition-all"
              aria-label="View shopping cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-sky-950 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-bounce">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-sky-200 font-medium leading-none">Cart Total</span>
                <span className="text-xs font-bold leading-tight">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-sky-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-sky-100 pb-2 flex flex-col gap-1 animate-fadeIn">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
