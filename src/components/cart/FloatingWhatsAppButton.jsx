'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function FloatingWhatsAppButton() {
  const { whatsappUrl, whatsappDisplay } = useSettings();

  return (
    <div className="fixed bottom-6 left-6 z-40 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Shri Rajeshwari Crackers on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 text-white shadow-2xl shadow-green-600/40 hover:scale-105 active:scale-95 transition-all border-2 border-white/60"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
        </div>
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-[10px] text-green-100 font-semibold uppercase tracking-wider">
            Quick Inquiry
          </span>
          <span className="text-xs font-black text-white">
            Chat on WhatsApp
          </span>
        </div>
      </a>
    </div>
  );
}
