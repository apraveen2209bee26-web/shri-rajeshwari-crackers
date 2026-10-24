'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import FireworksBurstCanvas from '@/components/effects/FireworksBurstCanvas';

/**
 * PageHeroHeader
 * Full-width edge-to-edge hero header designed to stretch 100% across the viewport
 * matching the Home page banner, featuring custom color palettes, custom photography,
 * and live bursting sky crackers tailored to each topic.
 */
export default function PageHeroHeader({
  badge = 'AUTHENTIC SIVAKASI FIREWORKS',
  badgeIcon: BadgeIcon = Sparkles,
  title = 'Page Title',
  titleHighlight = '',
  tamilTitle = '',
  subtitle = '',
  breadcrumbs = [],
  bgImage = '/images/banner.jpeg',
  theme = 'purple', // 'purple' | 'red' | 'gold' | 'emerald' | 'sapphire' | 'citrine' | 'light-blue'
  children
}) {
  // Theme gradients, borders, and fireworks palette maps
  const themeStyles = {
    'purple': {
      bg: 'bg-gradient-to-b from-[#100424] via-[#23094c] to-[#7c3aed]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(168,85,247,0.35)_0%,rgba(109,40,217,0.22)_45%,rgba(16,4,36,0.9)_100%)]',
      horizon: 'bg-purple-400/30',
      border: 'border-purple-500/30',
      palette: 'purple',
      badgeBg: 'bg-purple-400/20 border-purple-400/60 text-purple-200',
      badgeDot: 'text-amber-300',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-purple-100'
    },
    'red': {
      bg: 'bg-gradient-to-b from-[#1c0309] via-[#430915] to-[#b91c1c]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(244,63,94,0.35)_0%,rgba(185,28,28,0.22)_45%,rgba(28,3,9,0.9)_100%)]',
      horizon: 'bg-rose-500/30',
      border: 'border-rose-500/30',
      palette: 'red',
      badgeBg: 'bg-amber-400/20 border-amber-400/60 text-amber-300',
      badgeDot: 'text-amber-400',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-rose-100'
    },
    'gold': {
      bg: 'bg-gradient-to-b from-[#140e03] via-[#2a1d05] to-[#b45309]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.35)_0%,rgba(180,83,9,0.22)_45%,rgba(20,14,3,0.9)_100%)]',
      horizon: 'bg-amber-400/35',
      border: 'border-amber-400/40',
      palette: 'gold',
      badgeBg: 'bg-amber-400/20 border-amber-300/70 text-amber-300',
      badgeDot: 'text-yellow-300',
      highlightGradient: 'from-yellow-200 via-amber-300 to-yellow-400',
      subtitleColor: 'text-amber-100'
    },
    'emerald': {
      bg: 'bg-gradient-to-b from-[#021812] via-[#064232] to-[#059669]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.35)_0%,rgba(5,150,105,0.22)_45%,rgba(2,24,18,0.9)_100%)]',
      horizon: 'bg-emerald-400/30',
      border: 'border-emerald-500/30',
      palette: 'emerald',
      badgeBg: 'bg-amber-400/20 border-amber-400/60 text-amber-300',
      badgeDot: 'text-amber-400',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-emerald-100'
    },
    'sapphire': {
      bg: 'bg-gradient-to-b from-[#020b18] via-[#07244a] to-[#0284c7]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.35)_0%,rgba(3,105,161,0.22)_45%,rgba(2,11,24,0.9)_100%)]',
      horizon: 'bg-sky-400/35',
      border: 'border-sky-500/30',
      palette: 'blue',
      badgeBg: 'bg-amber-400/20 border-amber-400/70 text-amber-300',
      badgeDot: 'text-amber-400',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-sky-100'
    },
    'citrine': {
      bg: 'bg-gradient-to-b from-[#051821] via-[#0a3832] to-[#0f766e]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(20,184,166,0.30)_0%,rgba(15,118,110,0.20)_45%,rgba(5,24,33,0.9)_100%)]',
      horizon: 'bg-teal-400/30',
      border: 'border-teal-500/30',
      palette: 'all',
      badgeBg: 'bg-teal-400/20 border-teal-400/60 text-teal-200',
      badgeDot: 'text-amber-300',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-teal-100'
    },
    'light-blue': {
      bg: 'bg-gradient-to-b from-[#051329] via-[#092548] to-[#0284c7]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.35)_0%,rgba(14,116,144,0.20)_45%,rgba(5,19,41,0.9)_100%)]',
      horizon: 'bg-sky-400/30',
      border: 'border-sky-400/30',
      palette: 'blue',
      badgeBg: 'bg-amber-400/15 border-amber-400/60 text-amber-300',
      badgeDot: 'text-amber-400',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-sky-100'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles['purple'];

  return (
    <section className={`w-full relative overflow-hidden ${currentTheme.bg} text-white py-12 md:py-20 px-4 sm:px-6 shadow-2xl border-b ${currentTheme.border}`}>
      {/* Background Image Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 filter brightness-90 contrast-125 pointer-events-none transition-transform duration-1000 mix-blend-overlay"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Atmospheric Radial Aura */}
      <div className={`absolute inset-0 ${currentTheme.radial} pointer-events-none`} />

      {/* Radiant Horizon Glow */}
      <div className={`absolute -bottom-24 left-1/2 -translate-x-1/2 w-3/4 h-48 ${currentTheme.horizon} blur-3xl rounded-full pointer-events-none`} />

      {/* Real-time Bursting Sky Crackers (Canvas Fireworks matched to Palette) */}
      <FireworksBurstCanvas paletteType={currentTheme.palette} />

      {/* Content Container (Full Width Exterior, Max-W-7xl Interior) */}
      <div className="relative max-w-7xl mx-auto z-10 space-y-4 text-center md:text-left">
        {/* Breadcrumbs Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-white/70 font-semibold mb-2">
            <Link href="/" className="hover:text-amber-300 transition-colors">Home</Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-amber-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-amber-300 font-bold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Highlight Badge */}
        {badge && (
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black shadow-lg backdrop-blur-md ${currentTheme.badgeBg}`}>
            {BadgeIcon && <BadgeIcon className={`w-3.5 h-3.5 fill-current ${currentTheme.badgeDot}`} />}
            <span>{badge}</span>
          </div>
        )}

        {/* Dual-Tone Headline */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-xl">
            <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">{title}</span>
            {titleHighlight && (
              <>
                {' '}
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.highlightGradient} font-black drop-shadow-[0_4px_16px_rgba(245,158,11,0.6)]`}>
                  {titleHighlight}
                </span>
              </>
            )}
          </h1>

          {tamilTitle && (
            <p className="text-xs sm:text-sm font-bold text-sky-200 tracking-wide drop-shadow">
              {tamilTitle}
            </p>
          )}
        </div>

        {/* Subtitle Description */}
        {subtitle && (
          <p className={`text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-2xl drop-shadow-sm ${currentTheme.subtitleColor}`}>
            {subtitle}
          </p>
        )}

        {/* Optional Interactive Children (Action Buttons, Search, Stats) */}
        {children && (
          <div className="pt-2">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
