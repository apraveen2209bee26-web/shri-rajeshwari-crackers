'use client';

import React from 'react';

/**
 * FestiveBackgroundPattern
 * Luxury background ornamentation specifically crafted for Sri Rajeshwari Crackers.
 * Transforms the plain empty background of every page into a rich, authentic Sivakasi
 * celebration canvas with pyrotechnic watermarks, radial aura orbs, and twinkling sparkles.
 */
export default function FestiveBackgroundPattern({ theme = 'blue' }) {
  // Theme palette for ambient radiant glows and watermark strokes
  const themeConfigs = {
    'blue': {
      bgGradient: 'from-sky-50/60 via-slate-50/70 to-sky-50/40',
      orb1: 'rgba(56, 189, 248, 0.16)', // Sky Blue
      orb2: 'rgba(245, 158, 11, 0.10)', // Festive Amber
      orb3: 'rgba(99, 102, 241, 0.12)', // Royal Indigo
      stroke: 'rgba(2, 132, 199, 0.14)',
      accentStroke: 'rgba(245, 158, 11, 0.22)',
      goldFill: 'rgba(245, 158, 11, 0.08)'
    },
    'purple': {
      bgGradient: 'from-purple-50/70 via-slate-50/70 to-purple-50/50',
      orb1: 'rgba(168, 85, 247, 0.18)', // Royal Violet
      orb2: 'rgba(245, 158, 11, 0.12)', // Gold Accent
      orb3: 'rgba(124, 58, 237, 0.14)', // Deep Purple
      stroke: 'rgba(147, 51, 234, 0.15)',
      accentStroke: 'rgba(245, 158, 11, 0.24)',
      goldFill: 'rgba(168, 85, 247, 0.08)'
    },
    'red': {
      bgGradient: 'from-rose-50/70 via-slate-50/70 to-rose-50/50',
      orb1: 'rgba(244, 63, 94, 0.18)', // Crimson Rose
      orb2: 'rgba(245, 158, 11, 0.12)', // Amber Gold
      orb3: 'rgba(225, 29, 72, 0.14)', // Deep Ruby
      stroke: 'rgba(225, 29, 72, 0.15)',
      accentStroke: 'rgba(245, 158, 11, 0.24)',
      goldFill: 'rgba(244, 63, 94, 0.08)'
    },
    'gold': {
      bgGradient: 'from-amber-50/75 via-slate-50/70 to-yellow-50/50',
      orb1: 'rgba(245, 158, 11, 0.20)', // Rich Amber
      orb2: 'rgba(234, 88, 12, 0.12)', // Saffron Flame
      orb3: 'rgba(250, 204, 21, 0.16)', // Golden Sunburst
      stroke: 'rgba(217, 119, 6, 0.18)',
      accentStroke: 'rgba(245, 158, 11, 0.28)',
      goldFill: 'rgba(245, 158, 11, 0.10)'
    },
    'emerald': {
      bgGradient: 'from-emerald-50/70 via-slate-50/70 to-emerald-50/50',
      orb1: 'rgba(16, 185, 129, 0.18)', // Green Certified Emerald
      orb2: 'rgba(245, 158, 11, 0.12)', // Gold Star
      orb3: 'rgba(5, 150, 105, 0.14)', // Jade Green
      stroke: 'rgba(5, 150, 105, 0.15)',
      accentStroke: 'rgba(245, 158, 11, 0.24)',
      goldFill: 'rgba(16, 185, 129, 0.08)'
    },
    'sapphire': {
      bgGradient: 'from-sky-50/70 via-slate-50/70 to-sky-50/50',
      orb1: 'rgba(3, 105, 161, 0.18)', // Deep Sapphire
      orb2: 'rgba(245, 158, 11, 0.12)', // Amber Spark
      orb3: 'rgba(14, 165, 233, 0.14)', // Sky Blue
      stroke: 'rgba(2, 132, 199, 0.15)',
      accentStroke: 'rgba(245, 158, 11, 0.24)',
      goldFill: 'rgba(2, 132, 199, 0.08)'
    },
    'teal': {
      bgGradient: 'from-teal-50/70 via-slate-50/70 to-teal-50/50',
      orb1: 'rgba(20, 184, 166, 0.18)', // Ocean Teal
      orb2: 'rgba(245, 158, 11, 0.12)', // Amber Shield
      orb3: 'rgba(13, 148, 136, 0.14)', // Deep Teal
      stroke: 'rgba(13, 148, 136, 0.15)',
      accentStroke: 'rgba(245, 158, 11, 0.24)',
      goldFill: 'rgba(20, 184, 166, 0.08)'
    }
  };

  const c = themeConfigs[theme] || themeConfigs['blue'];

  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Underlying Atmospheric Theme Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${c.bgGradient}`} />

      {/* 2. Soft Ambient Radiant Glow Orbs (Diffused Fireworks Atmospheric Lighting) */}
      <div 
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full blur-[110px] opacity-75"
        style={{ backgroundColor: c.orb1 }} 
      />
      <div 
        className="absolute top-[28%] -right-40 w-[650px] h-[650px] rounded-full blur-[130px] opacity-70"
        style={{ backgroundColor: c.orb2 }} 
      />
      <div 
        className="absolute top-[65%] -left-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-70"
        style={{ backgroundColor: c.orb3 }} 
      />
      <div 
        className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-65"
        style={{ backgroundColor: c.orb1 }} 
      />

      {/* 3. Tiled SVG Fireworks & Cracker Motifs Lattice (Crisp Vector Watermark) */}
      <svg 
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id={`cracker-lattice-${theme}`} 
            width="220" 
            height="220" 
            patternUnits="userSpaceOnUse"
          >
            {/* --- MOTIF 1: Ground Chakkar (சுழல் சக்கரம்) at (50, 50) --- */}
            <g transform="translate(50, 50)">
              {/* Outer spark ring */}
              <circle cx="0" cy="0" r="28" fill="none" stroke={c.stroke} strokeWidth="1" strokeDasharray="3 4" />
              <circle cx="0" cy="0" r="18" fill="none" stroke={c.stroke} strokeWidth="1.2" />
              <circle cx="0" cy="0" r="7" fill={c.goldFill} stroke={c.accentStroke} strokeWidth="1" />
              {/* Radiating Curved Spiral Sparks */}
              <path d="M 0 -18 Q 12 -18 16 -30" fill="none" stroke={c.accentStroke} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 18 0 Q 18 12 30 16" fill="none" stroke={c.accentStroke} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 0 18 Q -12 18 -16 30" fill="none" stroke={c.accentStroke} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M -18 0 Q -18 -12 -30 -16" fill="none" stroke={c.accentStroke} strokeWidth="1.2" strokeLinecap="round" />
              {/* Mini Spark Dots */}
              <circle cx="18" cy="-18" r="1.5" fill={c.accentStroke} />
              <circle cx="18" cy="18" r="1.5" fill={c.accentStroke} />
              <circle cx="-18" cy="18" r="1.5" fill={c.accentStroke} />
              <circle cx="-18" cy="-18" r="1.5" fill={c.accentStroke} />
            </g>

            {/* --- MOTIF 2: Flower Pot / Anar (பூந்தொட்டி Fountain) at (165, 55) --- */}
            <g transform="translate(165, 55)">
              {/* Pot Base */}
              <polygon points="-10,18 10,18 6,2 -6,2" fill={c.goldFill} stroke={c.stroke} strokeWidth="1.2" />
              <line x1="-10" y1="18" x2="10" y2="18" stroke={c.stroke} strokeWidth="1.5" />
              {/* Fountain Sparks spraying upward */}
              <path d="M 0 2 Q -12 -15 -18 -26" fill="none" stroke={c.accentStroke} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 0 2 Q -4 -20 -6 -32" fill="none" stroke={c.stroke} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 0 2 Q 0 -22 0 -36" fill="none" stroke={c.accentStroke} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 0 2 Q 4 -20 6 -32" fill="none" stroke={c.stroke} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 0 2 Q 12 -15 18 -26" fill="none" stroke={c.accentStroke} strokeWidth="1.2" strokeLinecap="round" />
              {/* Spark Star at Apex */}
              <circle cx="0" cy="-38" r="1.8" fill={c.accentStroke} />
              <circle cx="-19" cy="-28" r="1.5" fill={c.accentStroke} />
              <circle cx="19" cy="-28" r="1.5" fill={c.accentStroke} />
            </g>

            {/* --- MOTIF 3: Traditional Festive Diya (அகல் விளக்கு) at (55, 160) --- */}
            <g transform="translate(55, 160)">
              {/* Diya Bowl */}
              <path d="M -16 6 Q 0 22 16 6 Q 20 0 0 0 Q -20 0 -16 6 Z" fill={c.goldFill} stroke={c.stroke} strokeWidth="1.2" />
              {/* Sacred Flame */}
              <path d="M 0 0 Q 5 -12 0 -20 Q -5 -12 0 0 Z" fill={c.accentStroke} />
              {/* Radiating Light Rays */}
              <line x1="-7" y1="-14" x2="-13" y2="-18" stroke={c.stroke} strokeWidth="1" strokeLinecap="round" />
              <line x1="7" y1="-14" x2="13" y2="-18" stroke={c.stroke} strokeWidth="1" strokeLinecap="round" />
              <line x1="0" y1="-23" x2="0" y2="-28" stroke={c.accentStroke} strokeWidth="1" strokeLinecap="round" />
            </g>

            {/* --- MOTIF 4: Aerial Sky Rocket (வானவெடி ராக்கெட்) at (165, 165) --- */}
            <g transform="translate(165, 165)">
              {/* Rocket Body */}
              <rect x="-3" y="-12" width="6" height="24" rx="1.5" transform="rotate(40)" fill={c.goldFill} stroke={c.stroke} strokeWidth="1.2" />
              {/* Rocket Conical Nose */}
              <polygon points="0,-16 -5,-7 5,-7" transform="rotate(40) translate(0,-5)" fill={c.accentStroke} stroke={c.accentStroke} strokeWidth="0.8" />
              {/* Guide Stick */}
              <line x1="-8" y1="10" x2="-22" y2="28" stroke={c.stroke} strokeWidth="1.2" strokeLinecap="round" />
              {/* Spark Exhaust Trail */}
              <path d="M -6 8 Q -16 16 -12 24" fill="none" stroke={c.accentStroke} strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* --- MOTIF 5: 8-Point Sparkler Starbursts (மத்தாப்பு தீப்பொறி) in center --- */}
            <g transform="translate(110, 110)">
              <line x1="0" y1="-14" x2="0" y2="14" stroke={c.accentStroke} strokeWidth="1.2" strokeLinecap="round" />
              <line x1="-14" y1="0" x2="14" y2="0" stroke={c.accentStroke} strokeWidth="1.2" strokeLinecap="round" />
              <line x1="-10" y1="-10" x2="10" y2="10" stroke={c.stroke} strokeWidth="1" strokeLinecap="round" />
              <line x1="-10" y1="10" x2="10" y2="-10" stroke={c.stroke} strokeWidth="1" strokeLinecap="round" />
              <circle cx="0" cy="0" r="2.5" fill={c.accentStroke} />
            </g>

            {/* Decorative Corner Rangoli Accent Dots */}
            <circle cx="8" cy="8" r="1.5" fill={c.stroke} />
            <circle cx="212" cy="8" r="1.5" fill={c.stroke} />
            <circle cx="8" cy="212" r="1.5" fill={c.stroke} />
            <circle cx="212" cy="212" r="1.5" fill={c.stroke} />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#cracker-lattice-${theme})`} />
      </svg>

      {/* 4. Large Floating Showcase Cracker Watermark Silhouettes */}
      {/* Top Right Huge Chakkar (Slow Ambient Spin) */}
      <div 
        className="absolute top-24 -right-20 w-80 h-80 opacity-60 animate-[spin_120s_linear_infinite]"
        style={{ color: c.accentStroke }}
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="10" fill="currentColor" opacity="0.3" />
          <path d="M 100 40 Q 140 40 160 10 M 160 100 Q 160 140 190 160 M 100 160 Q 60 160 40 190 M 40 100 Q 40 60 10 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Mid Left Grand Anar Fountain Spray */}
      <div 
        className="absolute top-[48%] -left-16 w-72 h-80 opacity-50"
        style={{ color: c.stroke }}
      >
        <svg viewBox="0 0 200 240" fill="none" className="w-full h-full">
          <polygon points="70,220 130,220 115,160 85,160" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
          <path d="M 100 160 Q 40 90 20 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M 100 160 Q 70 80 60 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M 100 160 Q 100 70 100 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 100 160 Q 130 80 140 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M 100 160 Q 160 90 180 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="5" r="4" fill="currentColor" />
          <circle cx="60" cy="15" r="3" fill="currentColor" />
          <circle cx="140" cy="15" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* Bottom Right Floating Starburst Cluster */}
      <div 
        className="absolute -bottom-10 right-8 w-64 h-64 opacity-50"
        style={{ color: c.accentStroke }}
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="45" y1="45" x2="155" y2="155" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="45" y1="155" x2="155" y2="45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.4" />
        </svg>
      </div>

      {/* 5. Delicate Floating Twinkling Sparkles (Ambient Life) */}
      <div className="absolute top-1/4 left-[15%] w-2.5 h-2.5 rounded-full bg-amber-400/40 blur-[1px] animate-pulse" />
      <div className="absolute top-1/3 right-[20%] w-2 h-2 rounded-full bg-yellow-300/45 blur-[1px] animate-ping" style={{ animationDuration: '4s' }} />
      <div className="absolute top-[60%] left-[8%] w-3 h-3 rounded-full bg-amber-400/35 blur-[1px] animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute top-[75%] right-[12%] w-2 h-2 rounded-full bg-yellow-300/40 blur-[1px] animate-ping" style={{ animationDuration: '5s' }} />
    </div>
  );
}
