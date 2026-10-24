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
  Flame,
  Gift,
  FileSpreadsheet,
  FileDown,
  ShieldCheck,
  Building2,
  Lock
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { STORE_CONFIG } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount, finalAmount, setIsCartOpen } = useCart();
  const { 
    settings, 
    whatsappUrl, 
    whatsappDisplay, 
    secondaryPhoneDisplay, 
    cleanWaNumber, 
    cleanSecPhone 
  } = useSettings();
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
    { href: '/combo-offers', label: 'Combo Offers', badge: 'HOT' },
    { href: '/quick-order', label: 'Quick Order (Bulk)' },
    { href: '/price-list', label: 'Price List' },
    { href: '/safety-tips', label: 'Safety Tips' },
    { href: '/about', label: 'About & Branches' },
  ];

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-indigo-950 text-white text-xs py-2 px-3 sm:px-4 border-b border-sky-800/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 font-medium text-center sm:text-left text-[11px] sm:text-xs">
            <span className="bg-amber-400 text-sky-950 px-2 py-0.5 rounded-full font-black text-[9px] tracking-wide animate-pulse shrink-0">
              MEGA SALE
            </span>
            <span className="truncate">💥 FLAT 80% OFF on All Crackers Direct from Sivakasi Factory!</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-sky-200 text-[11px] sm:text-xs">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-green-400 shrink-0" />
              <span>WhatsApp: <strong className="text-white">{whatsappDisplay}</strong></span>
            </a>
            <span className="hidden sm:inline text-sky-400">|</span>
            <a 
              href={`tel:${cleanSecPhone}`} 
              className="hidden sm:flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <span>Call: <strong className="text-white">{secondaryPhoneDisplay}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navigation Bar */}
      <nav className="glass-nav py-2.5 sm:py-3 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo with Responsive Text Truncation to never crowd buttons */}
          <Link href="/" className="flex items-center gap-2 group min-w-0 shrink">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-sky-400/30 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <img 
                src="/images/logo.png" 
                alt="Shri Rajeshwari Crackers Logo" 
                className="w-full h-full object-contain p-0.5" 
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 bg-clip-text text-transparent truncate">
                  SHRI RAJESHWARI
                </span>
                <span className="font-black text-sm sm:text-lg tracking-wider text-amber-500 shrink-0">
                  CRACKERS
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-sky-700 -mt-0.5 truncate">
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
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative flex items-center gap-1.5 ${
                    active
                      ? 'bg-sky-500/15 text-sky-950 shadow-sm border border-sky-300'
                      : 'text-slate-700 hover:text-sky-900 hover:bg-sky-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action: Cart Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="navbar-cart-button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-md shadow-sky-600/20 active:scale-95 transition-all shrink-0"
              aria-label="View shopping cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                {totalCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-sky-950 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-bounce border border-sky-900">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-sky-200 font-medium leading-none">Cart</span>
                <span className="text-xs font-black leading-tight">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </button>

            {/* Mobile Hamburger 3-Bar Toggle - Prominent, High-Contrast & Always Visible */}
            <button
              id="mobile-nav-toggle-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-sky-50 text-slate-800 border-2 border-sky-300 hover:bg-sky-100 flex items-center justify-center shadow-sm shrink-0 transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-900" />
              ) : (
                <Menu className="w-5 h-5 text-slate-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-sky-100 pb-3 flex flex-col gap-1.5 animate-fadeIn bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-sky-200">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                    active
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      active ? 'bg-amber-400 text-slate-950' : 'bg-rose-600 text-white'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Mobile Drawer Bottom Quick Contact */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 mt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-green-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner Login</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
