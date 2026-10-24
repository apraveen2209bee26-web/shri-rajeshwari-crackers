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
  FileDown
} from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'About Us | Shri Rajeshwari Crackers Sivakasi',
  description: 'Learn about Shri Rajeshwari Crackers, Sivakasi\'s premier fireworks manufacturing outlet offering genuine green crackers with 80% flat factory discount.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* 1. Header Hero */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-sky-950 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIVAKASI FACTORY OUTLET • SINCE ESTABLISHMENT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black">
            About {STORE_CONFIG.name}
          </h1>
          <p className="text-xs sm:text-base text-sky-200 leading-relaxed">
            {STORE_CONFIG.tamilName} — Pioneering vibrant, safe, and world-class festive illuminations straight from the pyrotechnic capital of India — Sivakasi, Tamil Nadu.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
      </div>

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
            Founded in the heart of Sivakasi, <strong className="text-slate-800">{STORE_CONFIG.name}</strong> was born with a singular mission: to make premium, festive fireworks accessible directly to every household and community across India without exploitative middleman markups.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            For generations, Sivakasi has supplied over 90% of India&apos;s festive fireworks. At {STORE_CONFIG.name}, we combine time-tested traditional pyrotechnic craftsmanship with modern chemical safety engineering. Every sparkler, fountain, and aerial shell is manufactured under stringent quality oversight complying with the Petroleum and Explosives Safety Organisation (PESO).
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs space-y-1">
            <h4 className="font-extrabold flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-amber-600" />
              <span>Why We Provide A Transparent 80% Discount</span>
            </h4>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Standard retail cracker markets impose massive 300% to 500% profit margins through multi-layered distributor chains. Because you purchase directly from our Sivakasi manufacturing outlet at {STORE_CONFIG.address}, we pass factory savings directly to you with our genuine flat 80% mega discount.
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

      {/* 3. Core Pillars */}
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

      {/* 4. Contact & Factory Outlet Card with Official Visiting Card */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Visit Or Contact Our Factory Outlet
            </span>
            <h3 className="text-2xl font-black">
              {STORE_CONFIG.name}
            </h3>
            <p className="text-amber-300 font-tamil font-bold text-sm">
              {STORE_CONFIG.tamilName} • {STORE_CONFIG.tamilGreeting}
            </p>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400 shrink-0" />
                <span>WhatsApp: <strong className="text-white">{STORE_CONFIG.whatsappDisplay}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <span>24/7 Call: <strong className="text-white">{STORE_CONFIG.secondaryPhoneDisplay}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{STORE_CONFIG.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>Working Hours: 24/7 Available (Monday - Sunday)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/91${STORE_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                href="/shop"
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Explore Cracker Shop
              </Link>
            </div>
          </div>

          {/* Official Visiting Card Display */}
          <div className="space-y-3 flex flex-col items-center">
            <div className="rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-slate-950 p-2 max-w-sm w-full">
              <img
                src="/images/visiting-card.jpg"
                alt="Shri Rajeshwari Crackers Visiting Card"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
            <a
              href="/images/visiting-card.jpg"
              download="Shri_Rajeshwari_Crackers_Visiting_Card.jpg"
              className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 underline font-semibold"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Official Visiting Card</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
