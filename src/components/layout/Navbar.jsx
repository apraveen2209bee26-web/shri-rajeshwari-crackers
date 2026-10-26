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

  // Smart Headroom / Auto-hide on scroll down, show on scroll up
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // If mobile menu drawer is open, keep header visible
          if (mobileMenuOpen) {
            setShowHeader(true);
            setLastScrollY(currentScrollY);
            ticking = false;
            return;
          }

          // Near top of page, always show header
          if (currentScrollY <= 25) {
            setShowHeader(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
            // Scrolling Down -> Hide Header
            setShowHeader(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling Up -> Show Header
            setShowHeader(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

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
    { 
      href: '/', 
      label: 'Home',
      desktopActive: 'bg-sky-500/15 text-sky-950 border-sky-400',
      mobileActive: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-sky-600/25'
    },
    { 
      href: '/shop', 
      label: 'Shop Catalog',
      desktopActive: 'bg-purple-500/15 text-purple-950 border-purple-400',
      mobileActive: 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-purple-600/25'
    },
    { 
      href: '/combo-offers', 
      label: 'Combo Offers', 
      badge: 'HOT',
      desktopActive: 'bg-amber-500/20 text-amber-950 border-amber-400',
      mobileActive: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black shadow-amber-500/30'
    },
    { 
      href: '/calendars', 
      label: 'Calendars', 
      desktopActive: 'bg-emerald-500/20 text-emerald-950 border-emerald-400 font-bold',
      mobileActive: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-600/30 font-bold'
    },
    { 
      href: '/quick-order', 
      label: 'Quick Order (Bulk)',
      desktopActive: 'bg-rose-500/15 text-rose-950 border-rose-400',
      mobileActive: 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-rose-600/25'
    },
    { 
      href: '/price-list', 
      label: 'Price List',
      desktopActive: 'bg-emerald-500/15 text-emerald-950 border-emerald-400',
      mobileActive: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-600/25'
    },
    { 
      href: '/safety-tips', 
      label: 'Safety Tips',
      desktopActive: 'bg-teal-500/15 text-teal-950 border-teal-400',
      mobileActive: 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-teal-600/25'
    },
    { 
      href: '/about', 
      label: 'About & Branches',
      desktopActive: 'bg-sky-500/15 text-sky-950 border-sky-400',
      mobileActive: 'bg-gradient-to-r from-sky-600 to-indigo-700 text-white shadow-sky-600/25'
    },
  ];

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  // Dynamic color theme matching the active page's hero header
  const getPageTheme = () => {
    if (pathname.startsWith('/calendars')) {
      return {
        bg: 'bg-gradient-to-r from-[#02241e] via-[#04483c] to-[#02241e]',
        border: 'border-b border-emerald-400/50',
        badge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-emerald-950 shadow-emerald-950/50 border border-amber-300/80',
        textColor: 'text-emerald-100',
        highlightColor: 'text-amber-300',
        pillBg: 'bg-emerald-950/80 hover:bg-emerald-900/90 border-emerald-400/50 text-emerald-200 hover:text-white',
        phoneIcon: 'text-emerald-300',
        waIcon: 'text-emerald-400',
        glow: 'from-emerald-500/20 via-amber-400/15 to-emerald-500/20'
      };
    }
    if (pathname.startsWith('/shop')) {
      return {
        bg: 'bg-gradient-to-r from-[#100424] via-[#23094c] to-[#100424]',
        border: 'border-b border-purple-500/40',
        badge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-purple-950 shadow-purple-950/50 border border-amber-300/80',
        textColor: 'text-purple-100',
        highlightColor: 'text-amber-300',
        pillBg: 'bg-purple-950/70 hover:bg-purple-900/90 border-purple-400/40 text-purple-200 hover:text-white',
        phoneIcon: 'text-purple-300',
        waIcon: 'text-emerald-400',
        glow: 'from-purple-500/15 via-amber-500/10 to-purple-500/15'
      };
    }
    if (pathname.startsWith('/quick-order')) {
      return {
        bg: 'bg-gradient-to-r from-[#1c0309] via-[#430915] to-[#1c0309]',
        border: 'border-b border-rose-500/40',
        badge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-rose-950 shadow-rose-950/50 border border-amber-300/80',
        textColor: 'text-rose-100',
        highlightColor: 'text-amber-300',
        pillBg: 'bg-rose-950/70 hover:bg-rose-900/90 border-rose-400/40 text-rose-200 hover:text-white',
        phoneIcon: 'text-rose-300',
        waIcon: 'text-emerald-400',
        glow: 'from-rose-500/15 via-amber-500/10 to-rose-500/15'
      };
    }
    if (pathname.startsWith('/combo-offers')) {
      return {
        bg: 'bg-gradient-to-r from-[#140e03] via-[#2f2005] to-[#140e03]',
        border: 'border-b border-amber-500/40',
        badge: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-400 text-amber-950 shadow-amber-950/50 border border-yellow-200',
        textColor: 'text-amber-100',
        highlightColor: 'text-yellow-300',
        pillBg: 'bg-amber-950/70 hover:bg-amber-900/90 border-amber-400/50 text-amber-200 hover:text-white',
        phoneIcon: 'text-amber-300',
        waIcon: 'text-emerald-400',
        glow: 'from-amber-500/20 via-yellow-400/15 to-amber-500/20'
      };
    }
    if (pathname.startsWith('/price-list')) {
      return {
        bg: 'bg-gradient-to-r from-[#021812] via-[#064232] to-[#021812]',
        border: 'border-b border-emerald-500/40',
        badge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-emerald-950 shadow-emerald-950/50 border border-amber-300/80',
        textColor: 'text-emerald-100',
        highlightColor: 'text-amber-300',
        pillBg: 'bg-emerald-950/70 hover:bg-emerald-900/90 border-emerald-400/40 text-emerald-200 hover:text-white',
        phoneIcon: 'text-emerald-300',
        waIcon: 'text-emerald-400',
        glow: 'from-emerald-500/15 via-amber-500/10 to-emerald-500/15'
      };
    }
    if (pathname.startsWith('/about')) {
      return {
        bg: 'bg-gradient-to-r from-[#020b18] via-[#07244a] to-[#020b18]',
        border: 'border-b border-sky-500/40',
        badge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-sky-950 shadow-sky-950/50 border border-amber-300/80',
        textColor: 'text-sky-100',
        highlightColor: 'text-amber-300',
        pillBg: 'bg-sky-950/70 hover:bg-sky-900/90 border-sky-400/40 text-sky-200 hover:text-white',
        phoneIcon: 'text-sky-300',
        waIcon: 'text-emerald-400',
        glow: 'from-sky-500/15 via-amber-500/10 to-sky-500/15'
      };
    }
    if (pathname.startsWith('/safety-tips')) {
      return {
        bg: 'bg-gradient-to-r from-[#051821] via-[#0a3832] to-[#051821]',
        border: 'border-b border-teal-500/40',
        badge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-teal-950 shadow-teal-950/50 border border-amber-300/80',
        textColor: 'text-teal-100',
        highlightColor: 'text-amber-300',
        pillBg: 'bg-teal-950/70 hover:bg-teal-900/90 border-teal-400/40 text-teal-200 hover:text-white',
        phoneIcon: 'text-teal-300',
        waIcon: 'text-emerald-400',
        glow: 'from-teal-500/15 via-amber-500/10 to-teal-500/15'
      };
    }
    // Default / Home:
    return {
      bg: 'bg-gradient-to-r from-[#051329] via-[#092548] to-[#051329]',
      border: 'border-b border-sky-500/40',
      badge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-sky-950 shadow-sky-950/50 border border-amber-300/80',
      textColor: 'text-sky-100',
      highlightColor: 'text-amber-300',
      pillBg: 'bg-sky-950/70 hover:bg-sky-900/90 border-sky-400/40 text-sky-200 hover:text-white',
      phoneIcon: 'text-sky-300',
      waIcon: 'text-emerald-400',
      glow: 'from-sky-500/15 via-amber-500/10 to-sky-500/15'
    };
  };

  const topTheme = getPageTheme();

  return (
    <header className={`sticky top-0 z-40 w-full shadow-md transition-transform duration-300 ease-in-out will-change-transform ${
      showHeader ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Top Notification Bar - Dynamic Color Theme per Page with Luxury Glassmorphism */}
      <div className={`relative overflow-hidden ${topTheme.bg} text-white text-xs py-2 px-3 sm:px-6 ${topTheme.border} transition-colors duration-500 shadow-sm`}>
        {/* Subtle Ambient Shimmer Glow */}
        <div className={`absolute inset-0 bg-gradient-to-r ${topTheme.glow} pointer-events-none opacity-80`} />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Mega Sale Pill & Offer Text with Icons */}
          <div className="flex items-center gap-2.5 font-medium text-center sm:text-left text-[11px] sm:text-xs">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider shadow-md backdrop-blur-md ${topTheme.badge} shrink-0`}>
              <Flame className="w-3 h-3 fill-current animate-pulse" />
              <span>MEGA SALE</span>
            </span>
            <span className={`${topTheme.textColor} truncate drop-shadow-sm`}>
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-300 shrink-0" />
              <strong className={topTheme.highlightColor}>FLAT 80% OFF</strong> on All Crackers Direct from Sivakasi Factory!
            </span>
          </div>

          {/* Right: WhatsApp & Call Glass Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm backdrop-blur-md transition-all active:scale-95 ${topTheme.pillBg}`}
            >
              <Phone className={`w-3.5 h-3.5 ${topTheme.waIcon} shrink-0`} />
              <span>WhatsApp: <strong className="text-white drop-shadow font-extrabold">{whatsappDisplay}</strong></span>
            </a>

            <a 
              href={`tel:${cleanSecPhone}`} 
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm backdrop-blur-md transition-all active:scale-95 ${topTheme.pillBg}`}
            >
              <Phone className={`w-3.5 h-3.5 ${topTheme.phoneIcon} shrink-0`} />
              <span>Call: <strong className="text-white drop-shadow font-extrabold">{secondaryPhoneDisplay}</strong></span>
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
                alt="Sri Rajeshwari Crackers Logo" 
                className="w-full h-full object-contain p-0.5" 
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 leading-tight">
                <span className="font-extrabold text-xs sm:text-lg tracking-tight bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 bg-clip-text text-transparent whitespace-nowrap">
                  SRI RAJESHWARI
                </span>
                <span className="font-black text-xs sm:text-lg tracking-wider text-amber-500 whitespace-nowrap">
                  CRACKERS
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-sky-700 truncate">
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
                      ? `${link.desktopActive || 'bg-sky-500/15 text-sky-950 border-sky-300'} shadow-sm border`
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
                      ? `${link.mobileActive || 'bg-sky-600 text-white shadow-sm'}`
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
                className="py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </a>
              <a
                href={`tel:${cleanSecPhone}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
