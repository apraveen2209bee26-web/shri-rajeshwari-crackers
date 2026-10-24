'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Droplet, 
  Eye, 
  PhoneCall, 
  ChevronDown, 
  ChevronUp,
  Shirt,
  Footprints,
  Baby
} from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export default function SafetyTipsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [openFaq, setOpenFaq] = useState(0);

  const dosList = [
    {
      title: 'Always Buy Legitimate PESO Green Crackers',
      desc: `Purchase only genuine fireworks manufactured in licensed Sivakasi factories like ${STORE_CONFIG.name} bearing valid PESO QR marks and green chemical codes.`,
      icon: CheckCircle2,
    },
    {
      title: 'Keep Sand and Water Buckets Ready',
      desc: 'Always keep two buckets of clean water and dry sand nearby before igniting any fireworks to handle accidental flare-ups or extinguish burnt sparkler rods.',
      icon: Droplet,
    },
    {
      title: 'Wear Snug-Fitting Pure Cotton Clothes',
      desc: 'Loose synthetic or silk garments catch fire easily. Wear thick cotton trousers, full-sleeve shirts, and sturdy covered shoes while lighting crackers.',
      icon: Shirt,
    },
    {
      title: 'Maintain Safe Distance & Arm\'s Length',
      desc: 'Light crackers at full arm\'s length using incense sticks (agarbatti) or sparkler punk. Retreat immediately to a safe perimeter of at least 5 meters.',
      icon: Footprints,
    },
    {
      title: 'Supervise Children At All Times',
      desc: 'Never allow young children to ignite crackers alone. Always ensure responsible adult supervision, especially with sparklers, pencils, and flower pots.',
      icon: Baby,
    },
    {
      title: 'Light in Open Grounds & Outdoors Only',
      desc: 'Always burst crackers in wide-open, clear outdoor grounds free from dry grass, parked vehicles, petrol pumps, or electrical overhead wires.',
      icon: Eye,
    }
  ];

  const dontsList = [
    {
      title: 'Never Relight A Cracker That Failed To Fire',
      desc: 'If a cracker or shell does not ignite after lighting the fuse, never bend over it to inspect. Wait at least 15 minutes and pour a bucket of water over it.',
      icon: XCircle,
    },
    {
      title: 'Never Hold Fireworks in Your Hands While Lighting',
      desc: 'Never ignite rockets, bombs, or flower pots while holding them in your bare palms. Always place them flat on firm, non-flammable ground before lighting.',
      icon: AlertTriangle,
    },
    {
      title: 'Never Burst Crackers Inside Bottles or Metal Cans',
      desc: 'Never enclose crackers inside glass bottles, steel tumblers, or tin cans. Exploding containers create lethal flying shrapnel and severe injuries.',
      icon: XCircle,
    },
    {
      title: 'Never Store Fireworks in Pockets or Near Stoves',
      desc: 'Keep fireworks packed inside their original boxes in a cool, dry room away from kitchen gas stoves, matchboxes, candles, or electrical heaters.',
      icon: AlertTriangle,
    },
    {
      title: 'Never Throw Crackers Near Animals or Passersby',
      desc: 'Street animals and elderly citizens are extremely sensitive to loud blasts. Never throw lit fireworks at people, animals, or passing traffic.',
      icon: XCircle,
    },
    {
      title: 'Never Wear Synthetic, Flowing, or Loose Attire',
      desc: 'Avoid dupattas, sarees with loose pallus, or loose nylon outfits that can brush against accidental sparks during group celebrations.',
      icon: AlertTriangle,
    }
  ];

  const faqs = [
    {
      q: 'What should be done immediately in case of a minor firework burn?',
      a: 'Pour clean, cool running tap water continuously over the burned skin for at least 10 to 15 minutes. Do not apply ice directly, butter, toothpaste, or turmeric. Cover gently with a clean dry cotton bandage and consult a doctor immediately.'
    },
    {
      q: 'How should burnt sparkler rods and flower pot shells be disposed of?',
      a: 'Burnt sparklers retain extreme heat even after going dark. Immediately immerse all used sparkler wires and spent pots into a bucket of water before discarding into waste bins.'
    },
    {
      q: `Are ${STORE_CONFIG.name} fireworks environmentally certified?`,
      a: `Yes. All ${STORE_CONFIG.name} crackers comply with the Ministry of Environment and CSIR-NEERI green cracker formulation directives, reducing barium nitrate emissions and particulate matter by over 30%.`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SAFE CELEBRATION GUIDELINES • SIVAKASI PROTOCOLS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black">
            Diwali Safety Tips & Protocols
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 leading-relaxed">
            Festivals are best celebrated when happiness is paired with safety. Review our essential Do&apos;s and Don&apos;ts to safeguard your family and neighborhood.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      {/* Tabs Filter */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl glass-panel border border-sky-200/80 gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 hover:text-sky-900'
            }`}
          >
            All Guidelines
          </button>
          <button
            onClick={() => setActiveTab('dos')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dos' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Do&apos;s ({dosList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('donts')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'donts' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Don&apos;ts ({dontsList.length})</span>
          </button>
        </div>
      </div>

      {/* Grid: Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {(activeTab === 'all' || activeTab === 'dos') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Recommended Do&apos;s
              </h2>
            </div>

            <div className="space-y-3.5">
              {dosList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className="glass-card rounded-2xl p-4 border border-emerald-100 hover:border-emerald-300 transition-all flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'donts') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-rose-200">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <XCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Strict Don&apos;ts
              </h2>
            </div>

            <div className="space-y-3.5">
              {dontsList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className="glass-card rounded-2xl p-4 border border-rose-100 hover:border-rose-300 transition-all flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Emergency First Aid Box */}
      <div className="rounded-3xl glass-panel border border-sky-200/80 p-6 sm:p-8 bg-gradient-to-r from-sky-50/50 via-white to-blue-50/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 md:col-span-2">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider bg-rose-100 px-2.5 py-0.5 rounded-full">
              Emergency Preparedness
            </span>
            <h3 className="text-xl font-black text-slate-900">
              National Emergency Helplines
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Always save emergency numbers before starting celebrations:
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold">
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs text-rose-700">
                🚨 Fire Control: 101
              </span>
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs text-emerald-700">
                🚑 Ambulance: 108 / 102
              </span>
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs text-sky-700">
                📞 Police Emergency: 112 / 100
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm text-center space-y-2">
            <PhoneCall className="w-8 h-8 text-sky-600 mx-auto" />
            <h4 className="font-bold text-xs text-slate-800">{STORE_CONFIG.name} Support</h4>
            <p className="text-[11px] text-slate-500">Safe storage & product handling desk</p>
            <a
              href={`tel:${STORE_CONFIG.phone}`}
              className="inline-block px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-colors"
            >
              Call {STORE_CONFIG.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Accordion FAQ */}
      <div className="space-y-4 max-w-3xl mx-auto pt-4">
        <h3 className="text-xl font-black text-slate-900 text-center">
          Frequently Asked Safety Questions
        </h3>

        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="glass-card rounded-2xl overflow-hidden border border-slate-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between gap-3 hover:bg-sky-50/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-sky-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
