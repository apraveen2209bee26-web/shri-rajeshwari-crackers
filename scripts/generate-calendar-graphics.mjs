import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public', 'images', 'calendars');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Wirebound Spiral Flip Wall Calendar SVG
const spiralSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="bgWall" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021c17"/>
      <stop offset="50%" stop-color="#04382e"/>
      <stop offset="100%" stop-color="#011410"/>
    </linearGradient>
    <linearGradient id="paperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="85%" stop-color="#fdfbf7"/>
      <stop offset="100%" stop-color="#f5ede0"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f9d423"/>
      <stop offset="50%" stop-color="#ff4e50"/>
      <stop offset="100%" stop-color="#f9d423"/>
    </linearGradient>
    <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#bf953f"/>
      <stop offset="25%" stop-color="#fcf6ba"/>
      <stop offset="50%" stop-color="#b38728"/>
      <stop offset="75%" stop-color="#fbf5b7"/>
      <stop offset="100%" stop-color="#aa771c"/>
    </linearGradient>
    <linearGradient id="spiralRing" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#d1d5db"/>
      <stop offset="70%" stop-color="#4b5563"/>
      <stop offset="100%" stop-color="#1f2937"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Studio Atmosphere -->
  <rect width="800" height="1000" fill="url(#bgWall)" />
  <circle cx="400" cy="300" r="350" fill="#059669" opacity="0.15" filter="url(#glow)"/>

  <!-- Wall Hanging Nail & Wire -->
  <circle cx="400" cy="40" r="12" fill="#71717a" stroke="#d4d4d8" stroke-width="3"/>
  <path d="M400 40 L340 100 M400 40 L460 100" stroke="#a1a1aa" stroke-width="2.5" stroke-dasharray="4,2"/>

  <!-- Main Calendar Sheet (with shadow) -->
  <rect x="100" y="90" width="600" height="840" rx="14" fill="url(#paperGrad)" filter="url(#shadow)" stroke="#e5e7eb" stroke-width="2"/>

  <!-- Top Hanging Wire Hook Bar -->
  <rect x="140" y="90" width="520" height="24" rx="4" fill="url(#goldMetallic)" opacity="0.9"/>
  <path d="M380 90 Q400 68 420 90" fill="none" stroke="url(#goldMetallic)" stroke-width="6" stroke-linecap="round"/>

  <!-- Wire-O Spiral Rings (Repeated Loops) -->
  ${Array.from({ length: 22 }).map((_, i) => {
    const x = 145 + i * 23.5;
    return `
      <rect x="${x}" y="80" width="8" height="28" rx="4" fill="url(#spiralRing)" stroke="#374151" stroke-width="0.8"/>
      <ellipse cx="${x + 4}" cy="84" rx="3" ry="2" fill="#ffffff" opacity="0.8"/>
    `;
  }).join('')}

  <!-- Calendar Header Poster Image Zone (Rich Spiritual Sivakasi Print) -->
  <rect x="120" y="125" width="560" height="360" rx="8" fill="#7f1d1d"/>
  <rect x="120" y="125" width="560" height="360" rx="8" fill="url(#goldGrad)" opacity="0.3"/>
  <rect x="126" y="131" width="548" height="348" rx="6" fill="none" stroke="url(#goldMetallic)" stroke-width="3"/>

  <!-- Decorative Border Corners -->
  <circle cx="140" cy="145" r="8" fill="none" stroke="url(#goldMetallic)" stroke-width="2"/>
  <circle cx="660" cy="145" r="8" fill="none" stroke="url(#goldMetallic)" stroke-width="2"/>
  <circle cx="140" cy="465" r="8" fill="none" stroke="url(#goldMetallic)" stroke-width="2"/>
  <circle cx="660" cy="465" r="8" fill="none" stroke="url(#goldMetallic)" stroke-width="2"/>

  <!-- Deity / Festive Motif Graphic in Gold -->
  <g transform="translate(400, 270)">
    <!-- Sunburst Radiance -->
    ${Array.from({ length: 16 }).map((_, i) => `
      <line x1="0" y1="0" x2="${Math.cos(i * Math.PI / 8) * 110}" y2="${Math.sin(i * Math.PI / 8) * 110}" stroke="url(#goldMetallic)" stroke-width="2" opacity="0.4"/>
    `).join('')}
    <!-- Gold Aura Circle -->
    <circle cx="0" cy="0" r="75" fill="#991b1b" stroke="url(#goldMetallic)" stroke-width="4"/>
    <circle cx="0" cy="0" r="68" fill="none" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="5,3"/>
    
    <!-- Lord Ganesha / Om Iconography -->
    <text x="0" y="24" font-family="'Noto Sans Tamil', 'Inter', sans-serif" font-size="70" font-weight="900" fill="url(#goldMetallic)" text-anchor="middle">🕉</text>
  </g>

  <!-- Header Branding Banner -->
  <rect x="180" y="380" width="440" height="42" rx="21" fill="#1e1b4b" stroke="url(#goldMetallic)" stroke-width="2"/>
  <text x="400" y="407" font-family="'Inter', sans-serif" font-size="16" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="2">SRI RAJESHWARI CALENDARS • SIVAKASI</text>

  <text x="400" y="450" font-family="'Noto Sans Tamil', sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">ஸ்ரீ ராஜேஸ்வரி பிரீமியம் மாத காலண்டர் 2026</text>

  <!-- Month Grid Section (130-170 GSM Gloss Paper Look) -->
  <rect x="120" y="500" width="560" height="410" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>

  <!-- Month Bar -->
  <rect x="120" y="500" width="560" height="52" fill="#0f766e"/>
  <text x="145" y="534" font-family="'Inter', sans-serif" font-size="24" font-weight="900" fill="#ffffff">JANUARY 2026</text>
  <text x="655" y="534" font-family="'Noto Sans Tamil', sans-serif" font-size="19" font-weight="800" fill="#fef08a" text-anchor="end">தை / மாசி மாதம்</text>

  <!-- Weekday Columns Header -->
  <g transform="translate(120, 552)">
    <rect width="560" height="32" fill="#f1f5f9"/>
    <text x="40" y="22" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#dc2626" text-anchor="middle">SUN</text>
    <text x="120" y="22" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#334155" text-anchor="middle">MON</text>
    <text x="200" y="22" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#334155" text-anchor="middle">TUE</text>
    <text x="280" y="22" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#334155" text-anchor="middle">WED</text>
    <text x="360" y="22" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#334155" text-anchor="middle">THU</text>
    <text x="440" y="22" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#334155" text-anchor="middle">FRI</text>
    <text x="520" y="22" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#0284c7" text-anchor="middle">SAT</text>
  </g>

  <!-- Date Matrix (Sample Grid Rows) -->
  <g transform="translate(120, 595)">
    <!-- Row 1 -->
    <text x="280" y="28" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">1</text>
    <text x="360" y="28" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">2</text>
    <text x="440" y="28" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">3</text>
    <text x="520" y="28" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#0369a1" text-anchor="middle">4</text>

    <!-- Row 2 -->
    <text x="40" y="78" font-family="'Inter', sans-serif" font-size="20" font-weight="800" fill="#dc2626" text-anchor="middle">5</text>
    <text x="120" y="78" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">6</text>
    <text x="200" y="78" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">7</text>
    <text x="280" y="78" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">8</text>
    <text x="360" y="78" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">9</text>
    <text x="440" y="78" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">10</text>
    <text x="520" y="78" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#0369a1" text-anchor="middle">11</text>

    <!-- Row 3 - Pongal Special Highlight -->
    <text x="40" y="128" font-family="'Inter', sans-serif" font-size="20" font-weight="800" fill="#dc2626" text-anchor="middle">12</text>
    <text x="120" y="128" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">13</text>
    
    <!-- Jan 14 Pongal Highlight Box -->
    <rect x="175" y="103" width="50" height="36" rx="6" fill="#fef08a" stroke="#eab308" stroke-width="1.5"/>
    <text x="200" y="128" font-family="'Inter', sans-serif" font-size="20" font-weight="900" fill="#b45309" text-anchor="middle">14</text>
    <text x="200" y="146" font-family="'Noto Sans Tamil', sans-serif" font-size="9" font-weight="700" fill="#b45309" text-anchor="middle">பொங்கல்</text>

    <text x="280" y="128" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">15</text>
    <text x="360" y="128" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">16</text>
    <text x="440" y="128" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">17</text>
    <text x="520" y="128" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#0369a1" text-anchor="middle">18</text>

    <!-- Row 4 -->
    <text x="40" y="178" font-family="'Inter', sans-serif" font-size="20" font-weight="800" fill="#dc2626" text-anchor="middle">19</text>
    <text x="120" y="178" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">20</text>
    <text x="200" y="178" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">21</text>
    <text x="280" y="178" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">22</text>
    <text x="360" y="178" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">23</text>
    <text x="440" y="178" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">24</text>
    <text x="520" y="178" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#0369a1" text-anchor="middle">25</text>

    <!-- Row 5 - Republic Day -->
    <rect x="15" y="203" width="50" height="36" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
    <text x="40" y="228" font-family="'Inter', sans-serif" font-size="20" font-weight="900" fill="#dc2626" text-anchor="middle">26</text>
    <text x="120" y="228" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">27</text>
    <text x="200" y="228" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">28</text>
    <text x="280" y="228" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">29</text>
    <text x="360" y="228" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">30</text>
    <text x="440" y="228" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#1e293b" text-anchor="middle">31</text>
  </g>

  <!-- Bottom Spec Foil Badge -->
  <g transform="translate(140, 870)">
    <rect width="520" height="28" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
    <text x="260" y="19" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">
      170 GSM IMPORTED GLOSS ART PAPER • 12-PAGE FLIP • SIVAKASI OFFSET PRINT
    </text>
  </g>

  <!-- Gold Stamp in Bottom Right -->
  <circle cx="680" cy="880" r="38" fill="url(#goldMetallic)" stroke="#92400e" stroke-width="2" filter="url(#shadow)"/>
  <circle cx="680" cy="880" r="32" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,2"/>
  <text x="680" y="874" font-family="'Inter', sans-serif" font-size="10" font-weight="900" fill="#78350f" text-anchor="middle">100% SIVAKASI</text>
  <text x="680" y="888" font-family="'Inter', sans-serif" font-size="9" font-weight="800" fill="#78350f" text-anchor="middle">QUALITY</text>
  <text x="680" y="898" font-family="'Inter', sans-serif" font-size="8" font-weight="900" fill="#78350f" text-anchor="middle">2026</text>
</svg>`;

// 2. Single-Sheet Poster Planner SVG
const posterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="posterBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0b1120"/>
    </linearGradient>
    <linearGradient id="posterSheet" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="goldBanner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="royalMaroon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#831843"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </linearGradient>
    <filter id="pShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <rect width="800" height="1000" fill="url(#posterBg)"/>

  <!-- Metal Tin Top & Bottom Binding Bars (Traditional Sivakasi Poster style) -->
  <g filter="url(#pShadow)">
    <rect x="90" y="60" width="620" height="880" fill="url(#posterSheet)" rx="4" stroke="#e2e8f0" stroke-width="2"/>
    <!-- Top Tin Rim Bar -->
    <rect x="85" y="55" width="630" height="18" rx="3" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
    <circle cx="400" cy="64" r="5" fill="#334155"/>
    <path d="M400 59 L400 35" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="400" cy="35" r="4" fill="#cbd5e1"/>
    <!-- Bottom Tin Rim Bar -->
    <rect x="85" y="930" width="630" height="18" rx="3" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
  </g>

  <!-- Poster Header Graphic & Deities -->
  <rect x="110" y="85" width="580" height="230" fill="url(#royalMaroon)" rx="6"/>
  <rect x="115" y="90" width="570" height="220" fill="none" stroke="url(#goldBanner)" stroke-width="2.5" rx="4"/>

  <!-- Gold Traditional Header -->
  <text x="400" y="125" font-family="'Noto Sans Tamil', sans-serif" font-size="24" font-weight="900" fill="#fef08a" text-anchor="middle">ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ் &amp; பிரிண்டிங் சிவகாசி</text>
  <text x="400" y="155" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="4">2026 ANNUAL YEAR PLANNER • SINGLE-SHEET POSTER</text>

  <!-- Central Auspicious Emblem -->
  <circle cx="400" cy="215" r="45" fill="#9f1239" stroke="url(#goldBanner)" stroke-width="3"/>
  <text x="400" y="228" font-family="'Inter', sans-serif" font-size="34" font-weight="900" fill="#fbbf24" text-anchor="middle">2026</text>

  <!-- Tamil Quote / Auspicious Tag -->
  <text x="400" y="285" font-family="'Noto Sans Tamil', sans-serif" font-size="16" font-weight="700" fill="#fef9c3" text-anchor="middle">அனைத்து சுபமுகூர்த்த தினங்கள் &amp; அரசு விடுமுறை நாட்கள் அடங்கியது</text>

  <!-- 12-Month Grid (4 Columns x 3 Rows) -->
  ${(() => {
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    let gridXml = '';
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const idx = row * 4 + col;
        const x = 110 + col * 148;
        const y = 330 + row * 190;
        gridXml += `
          <g transform="translate(${x}, ${y})">
            <rect width="138" height="175" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <rect width="138" height="26" rx="4" fill="#1e3a8a"/>
            <text x="69" y="18" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">${months[idx]}</text>
            <!-- Miniature Date Grid -->
            <g transform="translate(6, 32)">
              ${Array.from({ length: 28 }).map((_, d) => {
                const dx = (d % 7) * 18;
                const dy = Math.floor(d / 7) * 26 + 16;
                const isSun = d % 7 === 0;
                return `<text x="${dx + 8}" y="${dy}" font-family="'Inter', sans-serif" font-size="9" font-weight="${isSun ? '800' : '500'}" fill="${isSun ? '#dc2626' : '#334155'}" text-anchor="middle">${d + 1}</text>`;
              }).join('')}
            </g>
          </g>
        `;
      }
    }
    return gridXml;
  })()}

  <!-- Bottom Sivakasi Press Details -->
  <rect x="110" y="905" width="580" height="25" rx="3" fill="#f1f5f9"/>
  <text x="400" y="921" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">
    A2 / A3 SIZE • REAL TIME PROJECT &amp; OFFICE SCHEDULING • SIVAKASI HIGH QUALITY ART PAPER
  </text>
</svg>`;

// 3. Desk & Tabletop Tent Calendar SVG
const deskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" width="1000" height="800">
  <defs>
    <linearGradient id="deskWood" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b18"/>
      <stop offset="60%" stop-color="#141210"/>
      <stop offset="100%" stop-color="#0a0908"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="tentStand" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="emeraldBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="deskShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Workstation Tabletop Surface -->
  <rect width="1000" height="800" fill="url(#deskWood)"/>
  
  <!-- Desk Calendar Tent Stand Shadow -->
  <ellipse cx="500" cy="680" rx="420" ry="40" fill="#000000" opacity="0.6"/>

  <!-- 3D Triangular Tent Base (300 GSM Heavy Art Card) -->
  <path d="M120 660 L880 660 L840 690 L160 690 Z" fill="#090d16" stroke="#1e293b"/>
  <path d="M150 160 L850 160 L880 660 L120 660 Z" fill="url(#tentStand)" filter="url(#deskShadow)"/>

  <!-- Calendar Leaf Sheet Mounted on Stand -->
  <rect x="160" y="180" width="680" height="460" rx="8" fill="url(#cardGrad)" stroke="#e2e8f0" stroke-width="2"/>

  <!-- Wire-O Top Loops on Desk Calendar -->
  ${Array.from({ length: 18 }).map((_, i) => {
    const x = 200 + i * 35;
    return `
      <rect x="${x}" y="165" width="10" height="30" rx="5" fill="#e5e7eb" stroke="#475569" stroke-width="1"/>
      <line x1="${x+3}" y1="170" x2="${x+3}" y2="190" stroke="#ffffff" stroke-width="2"/>
    `;
  }).join('')}

  <!-- Left Side: Month Grid & Dates -->
  <g transform="translate(190, 220)">
    <rect width="360" height="40" rx="6" fill="url(#emeraldBar)"/>
    <text x="20" y="26" font-family="'Inter', sans-serif" font-size="18" font-weight="900" fill="#ffffff">OCTOBER 2026</text>
    <text x="340" y="26" font-family="'Noto Sans Tamil', sans-serif" font-size="14" font-weight="700" fill="#fef08a" text-anchor="end">ஐப்பசி மாதம்</text>

    <!-- Days Table -->
    <g transform="translate(0, 55)">
      ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => `
        <text x="${i * 51 + 25}" y="15" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="${i === 0 ? '#dc2626' : '#475569'}" text-anchor="middle">${d}</text>
      `).join('')}
      <line x1="0" y1="25" x2="360" y2="25" stroke="#e2e8f0" stroke-width="1.5"/>

      <!-- Date Matrix -->
      ${Array.from({ length: 31 }).map((_, i) => {
        const col = (i + 4) % 7;
        const row = Math.floor((i + 4) / 7);
        const x = col * 51 + 25;
        const y = row * 38 + 50;
        const isDiwali = i + 1 === 20; // Diwali day
        return `
          ${isDiwali ? `<circle cx="${x}" cy="${y - 5}" r="16" fill="#fef08a" stroke="#f59e0b" stroke-width="1.5"/>` : ''}
          <text x="${x}" y="${y}" font-family="'Inter', sans-serif" font-size="15" font-weight="${isDiwali ? '900' : (col === 0 ? '800' : '600')}" fill="${isDiwali ? '#b45309' : (col === 0 ? '#dc2626' : '#1e293b')}" text-anchor="middle">${i + 1}</text>
        `;
      }).join('')}
    </g>
  </g>

  <!-- Right Side: Festive Artwork & Company Branding -->
  <g transform="translate(580, 220)">
    <rect width="230" height="300" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="1"/>
    
    <!-- Mini Brand Logo -->
    <rect x="25" y="25" width="180" height="110" rx="6" fill="#064e3b"/>
    <text x="115" y="65" font-family="'Noto Sans Tamil', sans-serif" font-size="14" font-weight="900" fill="#fef08a" text-anchor="middle">ஸ்ரீ ராஜேஸ்வரி</text>
    <text x="115" y="85" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">CALENDARS &amp; CRACKERS</text>
    <text x="115" y="105" font-family="'Inter', sans-serif" font-size="9" font-weight="600" fill="#a7f3d0" text-anchor="middle">SIVAKASI • TAMIL NADU</text>

    <!-- Notes & Target Checklist Section -->
    <g transform="translate(25, 155)">
      <text x="0" y="15" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#1e293b">MONTHLY GOALS / NOTES:</text>
      <line x1="0" y1="35" x2="180" y2="35" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="0" y1="60" x2="180" y2="60" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="0" y1="85" x2="180" y2="85" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="0" y1="110" x2="180" y2="110" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
    </g>

    <!-- Specification Badge -->
    <rect x="25" y="295" width="180" height="24" rx="4" fill="#047857"/>
    <text x="115" y="311" font-family="'Inter', sans-serif" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle">300 GSM RIGID TENT ART CARD</text>
  </g>

  <!-- Bottom Brand Footnote -->
  <text x="500" y="615" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#64748b" text-anchor="middle">
    COMPACT TABLETOP FORMAT • EXECUTIVE CORPORATE GIFTING • SHIPPED DIRECT FROM SIVAKASI PRESS
  </text>
</svg>`;

fs.writeFileSync(path.join(outDir, 'spiral-wall-calendar.svg'), spiralSvg);
fs.writeFileSync(path.join(outDir, 'poster-wall-calendar.svg'), posterSvg);
fs.writeFileSync(path.join(outDir, 'desk-tent-calendar.svg'), deskSvg);

console.log('Successfully generated calendar visual assets in:', outDir);
