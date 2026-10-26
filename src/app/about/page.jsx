'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Award, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  Percent, 
  Clock, 
  FileDown,
  Navigation,
  ExternalLink,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { STORE_CONFIG } from '@/lib/constants';
import PageHeroHeader from '@/components/layout/PageHeroHeader';
import FestiveBackgroundPattern from '@/components/effects/FestiveBackgroundPattern';

export default function AboutPage() {
  const { 
    settings, 
    branches, 
    whatsappUrl, 
    whatsappDisplay, 
    secondaryPhoneDisplay, 
    cleanWaNumber, 
    cleanSecPhone 
  } = useSettings();

  return (
    <div className="relative min-h-screen pb-24">
      {/* Authentic Sivakasi Pyrotechnic Watermark & Sapphire Heritage Atmospheric Glow */}
      <FestiveBackgroundPattern theme="sapphire" />

      {/* 1. Full-Width Edge-to-Edge Hero Banner (Sapphire Navy Theme & Sky Crackers) */}
      <PageHeroHeader
        theme="sapphire"
        bgImage="/images/alltype.jpeg"
        badge="ESTD. SIVAKASI • 100% PESO GREEN CERTIFIED"
        badgeIcon={Sparkles}
        title={`About ${settings.shop_name} &`}
        titleHighlight="Sivakasi Heritage"
        tamilTitle={`${STORE_CONFIG.tamilName} — நேரடி தொழிற்சாலை பட்டாசு விற்பனையகம்`}
        subtitle="Pioneering vibrant, safe, and world-class festive illuminations straight from the pyrotechnic capital of India — Sivakasi, Tamil Nadu. Direct manufacturer rates with no middleman markups."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* 2. Main Page Layout (Centered Max-W-7xl) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-16">

      {/* 2. Brand Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase bg-sky-100 px-3 py-1 rounded-full">
              Our Heritage & Craft
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Lighting Up Celebrations With Authentic Sivakasi Spark
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Founded in the heart of Sivakasi, <strong className="text-slate-800">{settings.shop_name}</strong> was born with a singular mission: to make premium, festive fireworks accessible directly to every household and community across India without middleman markups.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For generations, Sivakasi has supplied over 90% of India&apos;s festive fireworks. At {settings.shop_name}, we combine time-tested traditional pyrotechnic craftsmanship with modern chemical safety engineering. Every sparkler, fountain, and aerial shell is manufactured under stringent quality oversight complying with the Petroleum and Explosives Safety Organisation (PESO).
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs space-y-1">
            <h4 className="font-extrabold flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-amber-600" />
              <span>Why We Provide A Transparent 80% Discount</span>
            </h4>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Standard retail cracker markets impose massive profit margins through multi-layered distributor chains. Because you purchase directly from our Sivakasi outlet, we pass factory savings directly to you with our genuine flat 80% mega discount.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden glass-card p-2 shadow-lg">
              <img
                src="/images/sakkaram.jpeg"
                alt="Ground Chakkar Craftsmanship"
                className="w-full h-44 object-cover rounded-xl"
              />
              <p className="text-[11px] font-bold text-center mt-2 text-slate-700">Precision Ground Chakkars</p>
            </div>
            <div className="rounded-2xl overflow-hidden glass-card p-2 shadow-lg">
              <img
                src="/images/alltype.jpeg"
                alt="Curated Diwali Gift Boxes"
                className="w-full h-44 object-cover rounded-xl"
              />
              <p className="text-[11px] font-bold text-center mt-2 text-slate-700">Festival Gift Boxes</p>
            </div>
            <div className="rounded-2xl overflow-hidden glass-card p-2 shadow-lg col-span-2">
              <img
                src="/images/banner.jpeg"
                alt="Grand Sky Illuminations"
                className="w-full h-44 object-cover rounded-xl"
              />
              <p className="text-[11px] font-bold text-center mt-2 text-slate-700">Mega Sky Aerial Multi-Shots</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC BRANCH LOCATIONS & GOOGLE MAPS NAVIGATION */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
            Direct Sivakasi Store & Depots
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Our Shop & Branch Locations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Touch or click on any branch location below to navigate directly on Google Maps!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.length === 0 ? (
            /* Fallback to primary address if no branches added yet */
            <div className="col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
                  MAIN FACTORY OUTLET
                </span>
                <h3 className="text-xl font-black text-slate-900">{settings.shop_name}</h3>
                <p className="text-xs text-slate-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500 shrink-0" />
                  <span>WhatsApp: {whatsappDisplay} | Call: {secondaryPhoneDisplay}</span>
                </p>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${settings.shop_name}, ${settings.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto self-start px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          ) : (
            branches.map((branch) => (
              <div 
                key={branch.id} 
                className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col justify-between gap-6 transition-all hover:scale-[1.01] ${
                  branch.isMainBranch ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-sky-100'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${
                      branch.isMainBranch ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {branch.isMainBranch ? '★ Head Office & Factory' : 'Branch Location'}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{branch.city}</span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">{branch.name}</h3>
                    {branch.tamilName && (
                      <p className="text-xs font-bold text-sky-800">{branch.tamilName}</p>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-1">
                    <p className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{branch.address}, {branch.city} - {branch.pincode}</span>
                    </p>
                    {branch.phone && (
                      <p className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Phone / WhatsApp: <a href={`tel:${branch.phone}`} className="font-bold text-slate-800 hover:underline">{branch.phone}</a></span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Google Maps Interactive Navigation Button */}
                <a
                  href={branch.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${branch.name}, ${branch.address}, ${branch.city} ${branch.pincode}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 hover:from-sky-500 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>Open in Google Maps (Touch to Navigate)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-sky-100 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Highest Quality Standards</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict batch testing for fuse delay timing, height altitude lift, and vibrant color dispersion with zero misfires.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-emerald-100 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">100% Green PESO Compliant</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Produced in adherence to CSIR-NEERI green cracker formulation rules, significantly minimizing harmful heavy-metal emissions.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-amber-100 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Direct Transport Dispatch</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dedicated logistics partners ensuring safe, temperature-controlled, all-India delivery inside water-tight 5-ply cartons.
          </p>
        </div>
      </div>

      {/* 5. Contact & Visiting Card */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Visit Or Contact Our Direct Desk
            </span>
            <h3 className="text-2xl font-black">
              {settings.shop_name}
            </h3>
            <p className="text-amber-300 font-tamil font-bold text-sm">
              {STORE_CONFIG.tamilName} • {STORE_CONFIG.tamilGreeting}
            </p>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400 shrink-0" />
                <span>WhatsApp: <strong className="text-white">{whatsappDisplay}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <span>24/7 Call: <strong className="text-white">{secondaryPhoneDisplay}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{settings.email || STORE_CONFIG.email}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                href="/combo-offers"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4" />
                <span>View Combo Offers 🔥</span>
              </Link>
            </div>
          </div>

          {/* Official Visiting Card Display */}
          <div className="space-y-3 flex flex-col items-center">
            <div className="rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-slate-950 p-2 max-w-sm w-full">
              <img
                src="/images/visiting-card.jpg"
                alt="Sri Rajeshwari Crackers Visiting Card"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
            <a
              href="/images/visiting-card.jpg"
              download="Sri_Rajeshwari_Crackers_Visiting_Card.jpg"
              className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 underline font-semibold"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Official Visiting Card</span>
            </a>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
