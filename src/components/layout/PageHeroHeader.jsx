'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import FireworksBurstCanvas from '@/components/effects/FireworksBurstCanvas';

/**
 * PageHeroHeader
 * A unified, ultra-premium hero header banner designed for every page in the application.
 * Supports distinct photo backdrops, theme palettes (gold, light-blue, royal-blue, etc.),
 * and active real-time bursting sky crackers animation.
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
  theme = 'light-blue', // 'light-blue' | 'gold' | 'royal-blue' | 'slate-gold' | 'navy-azure' | 'emerald-gold'
  children
}) {
  // Theme gradients & glow maps
  const themeStyles = {
    'light-blue': {
      bg: 'bg-gradient-to-b from-[#051329] via-[#092548] to-[#0284c7]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.32)_0%,rgba(14,116,144,0.18)_45%,rgba(5,19,41,0.85)_100%)]',
      horizon: 'bg-sky-400/25',
      badgeBg: 'bg-amber-400/15 border-amber-400/60 text-amber-300',
      badgeDot: 'text-amber-400',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-sky-100'
    },
    'gold': {
      bg: 'bg-gradient-to-b from-[#0b1424] via-[#1f1908] to-[#b45309]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.30)_0%,rgba(180,83,9,0.18)_45%,rgba(11,20,36,0.9)_100%)]',
      horizon: 'bg-amber-400/30',
      badgeBg: 'bg-amber-400/20 border-amber-300/70 text-amber-300',
      badgeDot: 'text-yellow-300',
      highlightGradient: 'from-yellow-200 via-amber-300 to-yellow-400',
      subtitleColor: 'text-amber-100'
    },
    'royal-blue': {
      bg: 'bg-gradient-to-b from-[#040e21] via-[#0a2754] to-[#1d4ed8]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.32)_0%,rgba(29,78,216,0.20)_45%,rgba(4,14,33,0.9)_100%)]',
      horizon: 'bg-blue-400/25',
      badgeBg: 'bg-sky-400/20 border-sky-400/60 text-sky-200',
      badgeDot: 'text-sky-300',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-blue-100'
    },
    'slate-gold': {
      bg: 'bg-gradient-to-b from-[#081324] via-[#152336] to-[#d97706]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(217,119,6,0.28)_0%,rgba(30,58,138,0.20)_45%,rgba(8,19,36,0.9)_100%)]',
      horizon: 'bg-amber-500/25',
      badgeBg: 'bg-amber-400/15 border-amber-400/60 text-amber-300',
      badgeDot: 'text-amber-400',
      highlightGradient: 'from-amber-200 via-yellow-300 to-amber-400',
      subtitleColor: 'text-slate-200'
    },
    'navy-azure': {
      bg: 'bg-gradient-to-b from-[#020b18] via-[#072244] to-[#0284c7]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.32)_0%,rgba(3,105,161,0.20)_45%,rgba(2,11,24,0.9)_100%)]',
      horizon: 'bg-sky-400/30',
      badgeBg: 'bg-amber-400/20 border-amber-400/70 text-amber-300',
      badgeDot: 'text-amber-400',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-sky-100'
    },
    'emerald-gold': {
      bg: 'bg-gradient-to-b from-[#031524] via-[#052b22] to-[#047857]',
      radial: 'bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.30)_0%,rgba(4,120,87,0.20)_45%,rgba(3,21,36,0.9)_100%)]',
      horizon: 'bg-emerald-400/25',
      badgeBg: 'bg-emerald-400/20 border-emerald-400/60 text-emerald-200',
      badgeDot: 'text-emerald-300',
      highlightGradient: 'from-amber-300 via-yellow-200 to-amber-400',
      subtitleColor: 'text-emerald-100'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles['light-blue'];

  return (
    <div className={`relative overflow-hidden ${currentTheme.bg} text-white rounded-3xl p-6 sm:p-10 md:p-14 mb-8 shadow-2xl border border-sky-400/20`}>
      {/* Background Image Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 filter brightness-90 contrast-125 pointer-events-none transition-transform duration-1000 mix-blend-overlay"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Atmospheric Radial Aura */}
      <div className={`absolute inset-0 ${currentTheme.radial} pointer-events-none`} />

      {/* Radiant Horizon Glow */}
      <div className={`absolute -bottom-24 left-1/2 -translate-x-1/2 w-3/4 h-48 ${currentTheme.horizon} blur-3xl rounded-full pointer-events-none`} />

      {/* Real-time Bursting Sky Crackers (Canvas Fireworks) */}
      <FireworksBurstCanvas />

      {/* Content Layer */}
      <div className="relative z-10 max-w-4xl mx-auto md:mx-0 space-y-4 text-center md:text-left">
        {/* Breadcrumbs (if provided) */}
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

        {/* Badge */}
        {badge && (
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black shadow-lg backdrop-blur-md ${currentTheme.badgeBg}`}>
            {BadgeIcon && <BadgeIcon className={`w-3.5 h-3.5 fill-current ${currentTheme.badgeDot}`} />}
            <span>{badge}</span>
          </div>
        )}

        {/* Headline */}
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

        {/* Subtitle */}
        {subtitle && (
          <p className={`text-xs sm:text-sm md:text-base leading-relaxed font-medium max-w-2xl drop-shadow-sm ${currentTheme.subtitleColor}`}>
            {subtitle}
          </p>
        )}

        {/* Optional Interactive Children (Search input, action buttons, counters) */}
        {children && (
          <div className="pt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
