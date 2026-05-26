/* =========================
   SHARED CONSTANTS
   Include this file in any page
   Usage: <script src="./components/constants.js"></script>
   ========================= */

const classesNumeric = {
  Lord: -7, Witch: -6, Prince: -5, Thief: -4,
  Knight: -3, Mage: -2, Sylph: -1, Maid: 1,
  Seer: 2, Page: 3, Rogue: 4, Bard: 5,
  Heir: 6, Muse: 7
};

const aspectsNumeric = {
  Hope: -6, Light: -5, Life: -4, Mind: -3,
  Breath: -2, Rage: -1, Time: 1, Blood: 2,
  Heart: 3, Doom: 4, Void: 5, Space: 6
};

// GRAPH COLORS (optimized for white background)
const aspectColors = {
  Hope: "#d69500",     // Darker gold (was #ffc331)
  Light: "#c9b000",    // Darker yellow (was #dfd527)
  Life: "#67b240", 
  Mind: "#36daa8", 
  Breath: "#36abc0", 
  Rage: "#b84ef5",
  Time: "#b70d0e", 
  Blood: "#3d1909", 
  Heart: "#bd1864",
  Doom: "#3f6b3f", 
  Void: "#001957", 
  Space: "#000000"
};

// Aspect colors for dark backgrounds (brighter/more visible)
const aspectColorsDark = {
  Hope: "#ffde55", Light: "#f6fa4e", Life: "#77c350",
  Mind: "#42f8c0", Breath: "#47dff9", Rage: "#b84ef5",
  Time: "#ff2106", Blood: "#ba1915", Heart: "#bd1864",
  Doom: "#666666", Void: "#104ea2", Space: "#ffffff"
};

/* =====================================================================
   LEADERSHIP TABLES (G.4)
   Implicit = positive, Explicit = negative; rank 1 strongest on each side.
   Per-classpect leadership score = class_lead + 2·aspect_lead.
   Ported from session-prototype/components/session-constants.js.
   ===================================================================== */
const CLASS_LEAD = {
  Muse:   +7, Heir:   +6, Rogue: +5, Mage:   +4, Maid:   +3, Page:   +2, Bard: +1,
  Witch:  -1, Knight: -2, Seer:  -3, Sylph:  -4, Thief:  -5, Prince: -6, Lord: -7
};
const ASPECT_LEAD = {
  Breath: +6, Void:   +5, Space: +4, Hope:   +3, Doom:   +2, Heart:  +1,
  Mind:   -1, Light:  -2, Time:  -3, Rage:   -4, Life:   -5, Blood:  -6
};

// Per-classpect-value leadership lookups. Explicit 0:0 entries so
// graph underlays can be drawn along the 0 axes (origin leadership
// is 0 + 2·0 = 0, the neutral midpoint of the colormap).
const CLASS_LEAD_BY_VAL = { 0: 0 };
Object.entries(classesNumeric).forEach(([name, val]) => {
  CLASS_LEAD_BY_VAL[val] = CLASS_LEAD[name];
});
const ASPECT_LEAD_BY_VAL = { 0: 0 };
Object.entries(aspectsNumeric).forEach(([name, val]) => {
  ASPECT_LEAD_BY_VAL[val] = ASPECT_LEAD[name];
});

// Convenience: raw leadership score for a classpect by name.
const leadershipFor = (className, aspectName) => {
  const c = CLASS_LEAD[className];
  const a = ASPECT_LEAD[aspectName];
  if (c === undefined || a === undefined) return null;
  return c + 2 * a;
};

/* =====================================================================
   RUNGS & BANDS
   The classpect lattice partitions into 26 concentric "rungs" by r² =
   c² + a², which group into 5 bands mirroring the Incipisphere.
   Ported from session-prototype/components/session-constants.js.
   ===================================================================== */
const RUNG_R2_ORDER = [
  // 1 .. 5  (Skaian band)
  2, 5, 8, 10, 13,
  // 6 ..10  (Gated band)
  17, 18, 20, 25, 26,
  //11 ..15  (Landed band)
  29, 32, 34, 37, 40,
  //16 ..20  (Veiled band)
  41, 45, 50, 52, 53,
  //21 ..26  (Furthest Rungs)
  58, 61, 65, 72, 74, 85
];
const RUNG_BY_R2 = {};
RUNG_R2_ORDER.forEach((r2, i) => { RUNG_BY_R2[r2] = i + 1; });

const RUNG_NAMES = [
  'Core of Creation',                   //  1, r²=2
  'The Battlefield',                    //  2, r²=5
  'The Net',                            //  3, r²=8
  'Hallowed Halls',                     //  4, r²=10
  'Center of Brilliance',               //  5, r²=13
  'Door To Destiny',                    //  6, r²=17
  'The Grist Rig',                      //  7, r²=18
  "Denizen's Lair",                     //  8, r²=20
  'The Battleships',                    //  9, r²=25
  'The Clock',                          // 10, r²=26
  'The Quest Bed',                      // 11, r²=29
  'The Village',                        // 12, r²=32
  'The Forge',                          // 13, r²=34
  'The Tadpole/The Scratch Construct',  // 14, r²=37
  'The Home',                           // 15, r²=40
  'The Meteors',                        // 16, r²=41
  'The Temple',                         // 17, r²=45
  'Ectobiology Lab',                    // 18, r²=50
  'Darkened Streets',                   // 19, r²=52
  'Core of Darkness',                   // 20, r²=53
  'The Fanontinuum',                    // 21, r²=58
  'The Secrets',                        // 22, r²=61
  'The Horrorterrors',                  // 23, r²=65
  'The Point/The Green Sun',            // 24, r²=72
  'The Map',                            // 25, r²=74
  'The Stage'                           // 26, r²=85
];

// 5 bands × 5–6 rungs each. `color` is a band-tinted swatch tuned for
// light-mode surfaces (tag badges, section headers); `textColor` is
// the contrast color to layer text on top of the swatch.
const BANDS = [
  { name: 'Skaian',         start:  1, end:  5, color: '#6dd1f4', textColor: '#0a3a52' },
  { name: 'Gated',          start:  6, end: 10, color: '#ffd966', textColor: '#5a4408' },
  { name: 'Landed',         start: 11, end: 15, color: '#8fba6a', textColor: '#1f4810' },
  { name: 'Veiled',         start: 16, end: 20, color: '#b57edc', textColor: '#3a1758' },
  { name: 'Furthest Rungs', start: 21, end: 26, color: '#8a5aa8', textColor: '#ffffff' }
];

const bandForRung = (rung) => {
  for (const b of BANDS) if (rung >= b.start && rung <= b.end) return b;
  return null;
};

// Compute { rung, band } for any (classVal, aspectVal). Returns null
// when (c, a) isn't on a known rung (e.g. fractional or on the 0 axes
// for the main lattice — the lattice excludes 0 columns/rows).
const rungForClasspect = (className, aspectName) => {
  const c = classesNumeric[className];
  const a = aspectsNumeric[aspectName];
  if (c === undefined || a === undefined) return null;
  const r2 = c * c + a * a;
  const rung = RUNG_BY_R2[r2];
  if (!rung) return null;
  return { rung, band: bandForRung(rung), r2 };
};

/* =====================================================================
   GRID OVERLAY COLORMAPS
   Two diverging colormaps for under-the-grid value washes:
     · Vanimo (dark theme): deep purple at -1 → near-black center →
       bright yellow at +1
     · PuY    (light theme): saturated purple at -1 → WHITE center →
       saturated yellow at +1
   Both are anchored at 0 = neutral; yellow = positive, purple =
   negative in either. Ported from session-prototype/components/
   session-constants.js. Pick `vanimoColor` on dark surfaces and
   `puyColor` on light surfaces.
   ===================================================================== */
function _lerp1(a, b, t) { return Math.round(a + (b - a) * t); }
function _hex2(n) { return n.toString(16).padStart(2, '0'); }
function _lerpStops(stops, t) {
  if (t <= stops[0].t) return stops[0];
  if (t >= stops[stops.length - 1].t) return stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i], b = stops[i + 1];
    if (t >= a.t && t <= b.t) {
      const f = (t - a.t) / (b.t - a.t);
      return { r: _lerp1(a.r, b.r, f), g: _lerp1(a.g, b.g, f), b: _lerp1(a.b, b.b, f) };
    }
  }
  return stops[stops.length - 1];
}
function _toHex(rgb) { return `#${_hex2(rgb.r)}${_hex2(rgb.g)}${_hex2(rgb.b)}`; }

const VANIMO_STOPS = [
  { t: -1.0, r:  20, g:   2, b:  80 },
  { t: -0.5, r: 120, g:  44, b: 146 },
  { t:  0.0, r:  22, g:  10, b:  30 },
  { t:  0.5, r: 220, g: 180, b: 100 },
  { t:  1.0, r: 250, g: 240, b: 110 }
];
const PUY_STOPS = [
  { t: -1.0, r: 102, g:  20, b: 130 },
  { t: -0.5, r: 184, g: 122, b: 204 },
  { t:  0.0, r: 250, g: 250, b: 250 },
  { t:  0.5, r: 240, g: 220, b: 120 },
  { t:  1.0, r: 230, g: 188, b:  30 }
];

const vanimoColor = (t) => _toHex(_lerpStops(VANIMO_STOPS, t));
const puyColor    = (t) => _toHex(_lerpStops(PUY_STOPS,    t));