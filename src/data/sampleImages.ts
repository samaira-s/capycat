export interface SampleImage {
  id: string;
  name: string;
  category: string;
  url: string;
}

// Crisp, detailed self-contained SVG images with specific visual cues for Gemini to analyze
export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'corporate-cat',
    name: 'Suspicious Office Cat',
    category: 'Animals',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="desk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#bg)"/>
        <!-- Office elements -->
        <rect x="0" y="420" width="800" height="180" fill="url(#desk)"/>
        <!-- Laptop -->
        <rect x="180" y="320" width="220" height="140" rx="6" fill="#334155" stroke="#64748b" stroke-width="4"/>
        <rect x="195" y="335" width="190" height="110" fill="#0284c7" opacity="0.8"/>
        <!-- Spreadsheet lines on screen -->
        <line x1="210" y1="360" x2="370" y2="360" stroke="#bae6fd" stroke-width="3"/>
        <line x1="210" y1="385" x2="370" y2="385" stroke="#bae6fd" stroke-width="3"/>
        <line x1="210" y1="410" x2="370" y2="410" stroke="#bae6fd" stroke-width="3"/>
        <!-- Coffee Mug -->
        <rect x="100" y="380" width="55" height="70" rx="6" fill="#ef4444"/>
        <path d="M 155 395 C 175 395, 175 435, 155 435" fill="none" stroke="#ef4444" stroke-width="6"/>
        <text x="127" y="420" font-family="sans-serif" font-size="12" fill="#ffffff" text-anchor="middle" font-weight="bold">#1 BOSS</text>
        <!-- Cat sitting behind laptop -->
        <!-- Cat Body -->
        <ellipse cx="500" cy="400" rx="140" ry="120" fill="#f97316"/>
        <ellipse cx="500" cy="380" rx="90" ry="100" fill="#ffedd5"/>
        <!-- Little blue tie -->
        <polygon points="500,320 485,340 515,340" fill="#2563eb"/>
        <polygon points="492,340 508,340 515,410 500,430 485,410" fill="#2563eb"/>
        <!-- Cat Head -->
        <circle cx="500" cy="270" r="100" fill="#f97316"/>
        <!-- Cat Ears -->
        <polygon points="430,230 410,140 480,190" fill="#ea580c"/>
        <polygon points="435,220 425,160 470,195" fill="#fecdd3"/>
        <polygon points="570,230 590,140 520,190" fill="#ea580c"/>
        <polygon points="565,220 575,160 530,195" fill="#fecdd3"/>
        <!-- Cat Eyes - Judgemental Squint -->
        <ellipse cx="460" cy="265" rx="22" ry="12" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        <ellipse cx="460" cy="265" rx="5" ry="11" fill="#0f172a"/>
        <ellipse cx="540" cy="265" rx="22" ry="12" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        <ellipse cx="540" cy="265" rx="5" ry="11" fill="#0f172a"/>
        <!-- Eyebrows / Furrowed brow -->
        <path d="M 440 245 Q 465 255 480 248" fill="none" stroke="#9a3412" stroke-width="4" stroke-linecap="round"/>
        <path d="M 560 245 Q 535 255 520 248" fill="none" stroke="#9a3412" stroke-width="4" stroke-linecap="round"/>
        <!-- Nose and mouth -->
        <polygon points="500,285 492,295 508,295" fill="#fb7185"/>
        <path d="M 492 295 Q 480 305 470 300 M 508 295 Q 520 305 530 300" fill="none" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/>
        <!-- Whiskers -->
        <line x1="440" y1="285" x2="380" y2="280" stroke="#fed7aa" stroke-width="2"/>
        <line x1="440" y1="295" x2="375" y2="300" stroke="#fed7aa" stroke-width="2"/>
        <line x1="560" y1="285" x2="620" y2="280" stroke="#fed7aa" stroke-width="2"/>
        <line x1="560" y1="295" x2="625" y2="300" stroke="#fed7aa" stroke-width="2"/>
        <!-- Sticky notes on wall -->
        <rect x="80" y="80" width="70" height="70" fill="#fef08a" transform="rotate(-6 80 80)"/>
        <text x="95" y="120" font-family="sans-serif" font-size="11" fill="#854d0e" font-weight="bold">Q4 PANIC</text>
        <rect x="650" y="90" width="75" height="75" fill="#fbcfe8" transform="rotate(8 650 90)"/>
        <text x="660" y="130" font-family="sans-serif" font-size="11" fill="#9d174d" font-weight="bold">FEED ME</text>
      </svg>
    `)}`,
  },
  {
    id: 'spilled-coffee',
    name: 'Monday Morning Disaster',
    category: 'Relatable',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#wall)"/>
        <rect y="400" width="800" height="200" fill="url(#floor)"/>
        <!-- Wall Clock showing 8:58 AM -->
        <circle cx="400" cy="140" r="70" fill="#ffffff" stroke="#94a3b8" stroke-width="6"/>
        <line x1="400" y1="140" x2="400" y2="90" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
        <line x1="400" y1="140" x2="445" y2="140" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
        <circle cx="400" cy="140" r="5" fill="#ef4444"/>
        <text x="400" y="240" font-family="sans-serif" font-size="18" fill="#f8fafc" text-anchor="middle" font-weight="bold">STANDUP IN 2 MINS</text>
        <!-- Tipped Over Travel Mug -->
        <g transform="translate(320, 440) rotate(78)">
          <rect x="-40" y="-80" width="80" height="150" rx="14" fill="#0284c7" stroke="#0369a1" stroke-width="4"/>
          <rect x="-35" y="-100" width="70" height="25" rx="5" fill="#0f172a"/>
        </g>
        <!-- Spilled Dark Coffee Puddle spreading across papers -->
        <path d="M 280 470 C 200 450, 160 520, 240 560 C 320 590, 480 570, 560 540 C 620 510, 520 460, 440 470 C 380 460, 320 480, 280 470 Z" fill="#451a03" opacity="0.9"/>
        <!-- Soaked White Paper with "URGENT REPORT" -->
        <rect x="420" y="470" width="130" height="90" fill="#f1f5f9" transform="rotate(-12 420 470)" stroke="#94a3b8" stroke-width="2"/>
        <text x="440" y="510" font-family="sans-serif" font-size="12" fill="#b91c1c" font-weight="bold" transform="rotate(-12 420 470)">TOP SECRET</text>
        <line x1="435" y1="525" x2="520" y2="505" stroke="#78350f" stroke-width="4"/>
        <line x1="435" y1="535" x2="500" y2="520" stroke="#78350f" stroke-width="3"/>
      </svg>
    `)}`,
  },
  {
    id: 'gym-dog',
    name: 'Over-Ambitious Workout Pup',
    category: 'Fitness',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="gymBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#27272a"/>
          </linearGradient>
          <linearGradient id="mat" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#06b6d4"/>
            <stop offset="100%" stop-color="#0891b2"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#gymBg)"/>
        <!-- Neon sign in background -->
        <text x="400" y="100" font-family="sans-serif" font-size="34" fill="#a855f7" text-anchor="middle" font-weight="900" letter-spacing="4">NO PAIN NO GAIN</text>
        <!-- Blue gym mat -->
        <polygon points="120,440 680,440 760,560 40,560" fill="url(#mat)"/>
        <!-- Giant barbell weights -->
        <rect x="180" y="360" width="40" height="130" rx="8" fill="#52525b" stroke="#71717a" stroke-width="3"/>
        <rect x="580" y="360" width="40" height="130" rx="8" fill="#52525b" stroke="#71717a" stroke-width="3"/>
        <line x1="200" y1="425" x2="600" y2="425" stroke="#a1a1aa" stroke-width="14" stroke-linecap="round"/>
        <text x="200" y="435" font-family="sans-serif" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="bold">100KG</text>
        <text x="600" y="435" font-family="sans-serif" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="bold">100KG</text>
        <!-- Cute Golden Retriever pup sitting under barbell wearing sweatband -->
        <!-- Dog Body -->
        <ellipse cx="400" cy="410" rx="90" ry="110" fill="#f59e0b"/>
        <!-- Dog Paws resting on mat -->
        <ellipse cx="360" cy="490" rx="28" ry="18" fill="#fbbf24"/>
        <ellipse cx="440" cy="490" rx="28" ry="18" fill="#fbbf24"/>
        <!-- Dog Head -->
        <circle cx="400" cy="280" r="75" fill="#f59e0b"/>
        <!-- Droopy Dog Ears -->
        <ellipse cx="320" cy="280" rx="25" ry="55" fill="#d97706" transform="rotate(15 320 280)"/>
        <ellipse cx="480" cy="280" rx="25" ry="55" fill="#d97706" transform="rotate(-15 480 280)"/>
        <!-- Red Sweatband on forehead -->
        <rect x="330" y="225" width="140" height="26" rx="8" fill="#ef4444"/>
        <line x1="335" y1="238" x2="465" y2="238" stroke="#ffffff" stroke-width="4"/>
        <!-- Big Round Innocent Eyes looking up at heavy bar -->
        <circle cx="375" cy="275" r="14" fill="#1c1917"/>
        <circle cx="370" cy="270" r="5" fill="#ffffff"/>
        <circle cx="425" cy="275" r="14" fill="#1c1917"/>
        <circle cx="420" cy="270" r="5" fill="#ffffff"/>
        <!-- Snout and tongue panting -->
        <ellipse cx="400" cy="315" rx="30" ry="24" fill="#fde68a"/>
        <ellipse cx="400" cy="305" rx="14" ry="10" fill="#1c1917"/>
        <path d="M 400 325 C 390 350, 410 350, 400 325" fill="#f43f5e"/>
      </svg>
    `)}`,
  },
  {
    id: 'burnt-toast',
    name: 'Culinary Masterpiece',
    category: 'Food',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="kitchen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="marble" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#kitchen)"/>
        <!-- Countertop -->
        <rect y="380" width="800" height="220" fill="url(#marble)"/>
        <!-- Smoke detector blinking red on ceiling -->
        <rect x="360" y="20" width="80" height="30" rx="8" fill="#e2e8f0"/>
        <circle cx="400" cy="35" r="7" fill="#ef4444"/>
        <!-- Smoke wafting -->
        <path d="M 390 300 Q 360 220 410 160 T 395 70" fill="none" stroke="#94a3b8" stroke-width="12" stroke-linecap="round" opacity="0.4"/>
        <path d="M 420 310 Q 450 210 390 140 T 410 60" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" opacity="0.5"/>
        <!-- Fancy Porcelain Plate with Michelin stars garnish -->
        <ellipse cx="400" cy="460" rx="220" ry="90" fill="#f8fafc" stroke="#cbd5e1" stroke-width="6"/>
        <ellipse cx="400" cy="460" rx="170" ry="65" fill="#f1f5f9"/>
        <!-- Pitch Black Charred Slice of Bread -->
        <path d="M 330 400 C 330 370, 470 370, 470 400 L 480 480 C 480 495, 320 495, 320 480 Z" fill="#18181b" stroke="#09090b" stroke-width="4"/>
        <!-- A tiny single parsley leaf on top of burnt toast -->
        <circle cx="400" cy="425" r="9" fill="#22c55e"/>
        <line x1="400" y1="434" x2="400" y2="442" stroke="#15803d" stroke-width="3"/>
        <!-- Tiny smear of balsamic vinegar dot -->
        <circle cx="300" cy="460" r="5" fill="#450a0a"/>
        <circle cx="315" cy="470" r="4" fill="#450a0a"/>
        <circle cx="330" cy="478" r="3" fill="#450a0a"/>
        <text x="400" y="570" font-family="sans-serif" font-size="16" fill="#fbbf24" text-anchor="middle" font-weight="bold">"Artisanal Deconstructed Carbon Toast - $42"</text>
      </svg>
    `)}`,
  },
];
