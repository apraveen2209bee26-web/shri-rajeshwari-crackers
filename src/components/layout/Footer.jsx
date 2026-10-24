'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Phone, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Award, 
  Truck, 
  Clock,
  MessageCircle
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { STORE_CONFIG } from '@/lib/constants';

export default function Footer() {
  const { 
    settings, 
    whatsappUrl, 
    whatsappDisplay, 
    secondaryPhoneDisplay, 
    cleanWaNumber, 
    cleanSecPhone 
  } = useSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Features Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Best Quality</h4>
              <p className="text-xs text-slate-400">Direct Sivakasi Fireworks</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-400/10 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Safe</h4>
              <p className="text-xs text-slate-400">Green & Eco-Friendly PESO</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast Dispatch</h4>
              <p className="text-xs text-slate-400">Safe All-India Transport</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-400/10 flex items-center justify-center text-rose-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Lowest Price</h4>
              <p className="text-xs text-slate-400">Flat 80% Mega Discount</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-sky-400/30">
                <img 
                  src="/images/logo.png" 
                  alt={`${settings.shop_name} Logo`} 
                  className="w-full h-full object-contain p-0.5" 
                />
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-wide uppercase">
                  {settings.shop_name || 'SHRI RAJESHWARI CRACKERS'}
                </span>
                <p className="text-[10px] text-sky-300 font-semibold">ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ் • {STORE_CONFIG.motto}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leading wholesale and direct factory fireworks outlet in Sivakasi. 24/7 service delivering authentic, high-quality, and 100% safe eco-friendly crackers directly to families across India at 80% factory discount.
            </p>
            <div className="pt-2 text-xs text-amber-300 font-medium bg-amber-950/40 border border-amber-800/40 p-3 rounded-lg">
              ✨ <em>&ldquo;{STORE_CONFIG.tamilGreeting}&rdquo;</em>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-amber-400 transition-colors">Home Page</Link></li>
              <li><Link href="/shop" className="hover:text-amber-400 transition-colors">Full Shop Catalog</Link></li>
              <li><Link href="/quick-order" className="hover:text-amber-400 transition-colors">Quick Order (Spreadsheet)</Link></li>
              <li><Link href="/price-list" className="hover:text-amber-400 transition-colors">Download Price List</Link></li>
              <li><Link href="/safety-tips" className="hover:text-amber-400 transition-colors">Safety Guidelines</Link></li>
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us & Visiting Card</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Popular Categories</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop?category=Daylight" className="hover:text-sky-400 transition-colors">Daylight Crackers (Sparklers & Chakkars)</Link></li>
              <li><Link href="/shop?category=Nightlight" className="hover:text-sky-400 transition-colors">Nightlight Crackers (Aerial & Sky Shots)</Link></li>
              <li><Link href="/shop" className="hover:text-sky-400 transition-colors">Festival Gift Boxes (20-60 Items)</Link></li>
              <li><Link href="/shop?category=Nightlight" className="hover:text-sky-400 transition-colors">Multi Colour Shots (7 to 240 Shots)</Link></li>
              <li><Link href="/shop?category=Daylight" className="hover:text-sky-400 transition-colors">Marriage Series & Garlands</Link></li>
            </ul>
          </div>

          {/* Dynamic Contact Details & Chat on WhatsApp */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Direct Factory & Support</h5>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-green-400 shrink-0" />
                <a href={`tel:${cleanWaNumber}`} className="text-slate-300 hover:text-white font-medium">
                  {whatsappDisplay} (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${cleanSecPhone}`} className="text-slate-300 hover:text-white font-medium">
                  {secondaryPhoneDisplay} (Call 24/7)
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-lg shadow-green-900/30 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            <Link href="/admin/login" className="hover:text-slate-400 transition-colors" title="Owner Portal">©</Link> {new Date().getFullYear()} {settings.shop_name}. All Rights Reserved. Sivakasi, Tamil Nadu.
          </p>
          <p className="flex items-center gap-1">
            Manufactured & packed under strict PESO Indian Safety Standards
          </p>
        </div>
      </div>
    </footer>
  );
}
