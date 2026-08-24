/* =========================================================================
   CLASSPECT GLYPH
   Live-composited classpect sigil for the classpect page.
   Three z-ordered layers inside a rounded #121314 box:
     1. Disc (colored CSS circle, aspect BG color)
     2. Aspect symbol (aspects/no-bg/*.svg centered on the disc)
     3. Ring (classes/rings/*.svg, colored via mask-image on a
        colored div, animated with a CSS keyframe spin)

   Rotation timing mirrors the animate_classpect_glyphs.py tool:
     ~15° per second per unit of |class-sign|
       Sylph/Maid (|sign|=1) → 24 sec per full turn
       Lord/Muse  (|sign|=7) → ~3.4 sec per full turn
   Direction: active classes clockwise, passive counterclockwise.

   Assets expected at:
     ./images/classes/rings/{class}.svg           — ring silhouette
     ./images/aspects/no-bg/{aspect}.svg          — aspect symbol
     (colors come from RING_COLORS / BG_COLORS below)

   Requires: constants.js (classesNumeric, aspectsNumeric)
   ========================================================================= */

/* Ring color per aspect — Hussie's "lightest color" rule (icon color
   for most aspects, bg color for Void & Doom since their icons are
   darker than their canvases). Also used as the ring color in the
   glyph rendering tools. */
const RING_COLORS = {
  breath: '#47dff9', blood:  '#ba1016', doom:  '#306800', heart:  '#bd1864',
  hope:   '#fdfdfd', life:   '#72eb34', light: '#f6fa4e', mind:   '#06ffc9',
  rage:   '#9c4dad', space:  '#ffffff', time:  '#ff2106', void:   '#104ea2',
};

/* Aspect BG colors. */
const BG_COLORS = {
  breath: '#4379e6', blood:  '#3e1601', doom:  '#306800', heart:  '#55142a',
  hope:   '#ffde55', life:   '#a49787', light: '#f0840c', mind:   '#00923d',
  rage:   '#520c61', space:  '#000000', time:  '#b70d0e', void:   '#104ea2',
};

/* Aspect MAIN colors */
const FG_COLORS = {
  breath: '#47dff9', blood:  '#ba1016', doom:  '#000000', heart:  '#bd1864',
  hope:   '#fdfdfd', life:   '#72eb34', light: '#f6fa4e', mind:   '#06ffc9',
  rage:   '#9c4dad', space:  '#ffffff', time:  '#ff2106', void:   '#001957',
};

/* Mapping */
const GLYPH_CLASS_SIGN = {
  Lord:  -7, Witch: -6, Prince: -5, Thief: -4,
  Knight:-3, Mage:  -2, Sylph:  -1, Maid:   1,
  Seer:   2, Page:   3, Rogue:   4, Bard:   5,
  Heir:   6, Muse:   7,
};

/* Grayscale endpoints — Lord/Muse are the darkest/lightest. */
const GS_LORD_DARK  = '#3F3F3F';
const GS_MUSE_LIGHT = '#929292';

/* Outline stroke color per lunar sway. Matches the tool's OUTLINE_COLORS
   with an extra 'neutral' alias (the tool called it 'dual'). */
const OUTLINE_COLORS = {
  prospit: '#ffff01',
  derse:   '#ff01fe',
  neutral: '#808080',
};

/* Gradient inner-darken factor. */
const GRADIENT_DARKEN = 0.85;

/* Hex color helpers. */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex(r, g, b) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}
function darkenHex(hex, factor) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - factor), g * (1 - factor), b * (1 - factor));
}
function interpHex(a, b, t) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

/* Resolve the ring color for a (mode, class, aspect) tuple. */
function resolveRingColor(mode, className, aspectName) {
  const asp = aspectName.toLowerCase();
  const cls = className;   // GLYPH_CLASS_SIGN is keyed by TitleCase

  if (mode === 'canonical') {
    return { kind: 'solid', color: RING_COLORS[asp] };
  }
  if (mode === 'background') {
    // Space special case
    if (asp === 'space') return { kind: 'solid', color: '#ffffff' };
    return { kind: 'solid', color: BG_COLORS[asp] };
  }
  if (mode === 'grayscale') {
    // Site sign convention: Muse=+7 (lightest), Lord=−7 (darkest).
    // Interp t=0 at Lord (dark), t=1 at Muse (light).
    const sign = GLYPH_CLASS_SIGN[cls] || 0;
    const t = (sign - (-7)) / 14;
    return { kind: 'solid', color: interpHex(GS_LORD_DARK, GS_MUSE_LIGHT, t) };
  }
  if (mode === 'gradient') {
    // Bright stop = FG, dark stop = FG darkened.
    let bright = FG_COLORS[asp];
    const [r, g, b] = hexToRgb(bright);
    if (r + g + b < 90) bright = RING_COLORS[asp];
    const dark = darkenHex(bright, GRADIENT_DARKEN);
    return { kind: 'gradient', inner: dark, outer: bright };
  }
  // Unknown mode — fall back to canonical.
  return { kind: 'solid', color: RING_COLORS[asp] };
}

/* Resolve outline mode + character list into a concrete stroke color. */
function resolveOutlineColor(mode, canonChars, nonCanonChars) {
  if (mode === 'none' || !mode) return null;
  if (mode === 'automatic') {
    const SWAY_TO_KEY = { prospit: 'prospit', derse: 'derse', dual: 'neutral' };
    const pickKey = (list) => {
      if (!list) return null;
      for (const ch of list) {
        if (ch && ch.lunarsway) {
          const key = SWAY_TO_KEY[ch.lunarsway.toLowerCase()];
          if (key) return key;
        }
      }
      return null;
    };
    const key = pickKey(canonChars) || pickKey(nonCanonChars);
    return key ? OUTLINE_COLORS[key] : null;
  }
  return OUTLINE_COLORS[mode] || null;
}

/* Aspect sizing constants.
     DISC_OVERSHOOT — disc drawn slightly larger than the ring's inner
       hole so it caps the ring's inner outline stroke.
     DISC_INSET     — the aspect's bbox-diagonal fits inside
       disc_diameter × DISC_INSET, guaranteeing corners don't intrude
       into the ring's inner spokes. */
const DISC_OVERSHOOT = 1.05;
const DISC_INSET     = 0.92;

/* Module-level cache of bbox-cropped aspect assets. */
const aspectAssetCache = {};

/* Module-level cache of ring geometry. */
const ringGeometryCache = {};

/* Raw ring SVG text. */
const ringSvgTextCache = {};

async function fetchRingSvgText(className) {
  if (ringSvgTextCache[className]) return ringSvgTextCache[className];
  const resp = await fetch(`./images/classes/rings/${className}.svg`);
  const text = await resp.text();
  ringSvgTextCache[className] = text;
  return text;
}

const ringStrokeCache = {};

async function loadRingStrokeOverlay(className, outlineColor) {
  const key = `${className}|${outlineColor}`;
  if (ringStrokeCache[key]) return ringStrokeCache[key];

  const text = await fetchRingSvgText(className);
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svgEl = doc.documentElement;

  // Strip any embedded <style> blocks so their fill classes don't
  // override fill=none stroke=color.
  svgEl.querySelectorAll('style').forEach((s) => s.remove());

  
  const SHAPE_SEL = 'path, ellipse, circle, rect, polygon, polyline, line';
  const shapes = Array.from(svgEl.querySelectorAll(SHAPE_SEL));

  const holder = document.createElement('div');
  holder.style.cssText = 'position:absolute;left:-99999px;top:-99999px;visibility:hidden;pointer-events:none;';
  holder.appendChild(svgEl);
  document.body.appendChild(holder);

  const bboxes = shapes.map((s) => {
    try { return s.getBBox(); } catch { return { width: 0, height: 0 }; }
  });
  const maxExtent = bboxes.reduce(
    (m, b) => Math.max(m, b.width, b.height), 0);
  const KEEP_THRESHOLD = 0.02;

  const SUBPATH_EXTENT_THRESHOLD = 0.005;
  const SUBPATH_AREA_THRESHOLD   = 0.0001;
  const maxArea = maxExtent * maxExtent;

  const scratchPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svgEl.appendChild(scratchPath);

  shapes.forEach((s, i) => {
    const b = bboxes[i];
    const extent = Math.max(b.width, b.height);
    if (extent < maxExtent * KEEP_THRESHOLD) { s.remove(); return; }

    s.removeAttribute('class');

    if (s.tagName === 'path') {
      const d = s.getAttribute('d');
      if (d) {
        const parts = d.match(/M[^M]*/g) || [d];
        if (parts.length > 1) {
          const kept = parts.filter((part) => {
            scratchPath.setAttribute('d', part);
            try {
              const bb = scratchPath.getBBox();
              const spExtent = Math.max(bb.width, bb.height);
              const spArea   = bb.width * bb.height;
              return spExtent >= maxExtent * SUBPATH_EXTENT_THRESHOLD
                  || spArea   >= maxArea   * SUBPATH_AREA_THRESHOLD;
            } catch {
              return true;
            }
          });
          s.setAttribute('d', kept.join(''));
        }
      }
    }

    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', outlineColor);
    s.setAttribute('stroke-width', '1');
    s.setAttribute('vector-effect', 'non-scaling-stroke');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('stroke-linecap',  'round');
  });

  svgEl.removeChild(scratchPath);
  document.body.removeChild(holder);

  const serialized = new XMLSerializer().serializeToString(svgEl);
  const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialized);

  // Preload as an <img> so the canvas composer can blit it synchronously.
  const img = new Image();
  await new Promise((resolve) => {
    img.onload  = resolve;
    img.onerror = resolve;
    img.src = dataUrl;
  });

  const result = { dataUrl, img };
  ringStrokeCache[key] = result;
  return result;
}

/* Rasterize a URL to an off-screen canvas at `resPx` × `resPx`. */
async function rasterize(url, resPx) {
  const img = new Image();
  try {
    await new Promise((resolve, reject) => {
      img.onload  = resolve;
      img.onerror = () => reject(new Error(`Failed to load ${url}`));
      img.src = url;
    });
  } catch (err) {
    console.error(err);
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width  = resPx;
  canvas.height = resPx;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, resPx, resPx);
  return { img, rgba: ctx.getImageData(0, 0, resPx, resPx).data, size: resPx };
}

/* Full-image bbox of non-transparent pixels, expressed as unit-square
   fractions (x, y, w, h). Returns null if the raster is empty. */
function pixelBboxFraction(rgba, size, alphaThresh = 32) {
  let minX = size, maxX = -1, minY = size, maxY = -1;
  for (let y = 0; y < size; y++) {
    const row = y * size;
    for (let x = 0; x < size; x++) {
      if (rgba[(row + x) * 4 + 3] >= alphaThresh) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return {
    xFrac: minX / size,
    yFrac: minY / size,
    wFrac: (maxX - minX + 1) / size,
    hFrac: (maxY - minY + 1) / size,
  };
}

async function loadRingGeometry(className) {
  if (ringGeometryCache[className]) return ringGeometryCache[className];

  const url = `./images/classes/rings/${className}.svg`;
  const raster = await rasterize(url, 400);
  if (!raster) {
    // Fallback proportions if load fails — mostly for visibility.
    return { outerFrac: 0.9, holeFrac: 0.46, holeCxFrac: 0.5, holeCyFrac: 0.5, img: null, url };
  }

  const { rgba, size } = raster;
  const A = 32;   // opacity threshold

  // Outer geometry = pixel bbox of the whole ring silhouette.
  const outerBbox = pixelBboxFraction(rgba, size, A);
  if (!outerBbox) {
    return { outerFrac: 0.9, holeFrac: 0.46, holeCxFrac: 0.5, holeCyFrac: 0.5, img: raster.img, url };
  }
  const outerCxFrac = outerBbox.xFrac + outerBbox.wFrac / 2;
  const outerCyFrac = outerBbox.yFrac + outerBbox.hFrac / 2;
  const outerFrac   = Math.max(outerBbox.wFrac, outerBbox.hFrac) / 2 * 2;
                   // = max(w, h) as a fraction of raster width.

  // Inner-hole geometry — find the tight bbox of the central transparent region.
  const cxPx = Math.round(outerCxFrac * size);
  const cyPx = Math.round(outerCyFrac * size);

  // BFS flood-fill through transparent pixels (alpha < threshold).
  const visited = new Uint8Array(size * size);
  const stack = [cyPx * size + cxPx];
  let hMinX = size, hMaxX = -1, hMinY = size, hMaxY = -1;
  const xMin = Math.floor(outerBbox.xFrac * size);
  const xMax = Math.ceil((outerBbox.xFrac + outerBbox.wFrac) * size);
  const yMin = Math.floor(outerBbox.yFrac * size);
  const yMax = Math.ceil((outerBbox.yFrac + outerBbox.hFrac) * size);
  while (stack.length) {
    const p = stack.pop();
    if (visited[p]) continue;
    visited[p] = 1;
    const x = p % size, y = (p - x) / size;
    if (x < xMin || x >= xMax || y < yMin || y >= yMax) continue;
    if (rgba[p * 4 + 3] >= A) continue;          // hit a ring pixel — stop.
    if (x < hMinX) hMinX = x;
    if (x > hMaxX) hMaxX = x;
    if (y < hMinY) hMinY = y;
    if (y > hMaxY) hMaxY = y;
    if (x + 1 < size) stack.push(p + 1);
    if (x - 1 >= 0)   stack.push(p - 1);
    if (y + 1 < size) stack.push(p + size);
    if (y - 1 >= 0)   stack.push(p - size);
  }

  const holeCxFrac = ((hMinX + hMaxX) / 2) / size;
  const holeCyFrac = ((hMinY + hMaxY) / 2) / size;
  // Hole "radius" as an average of half-width and half-height, so a
  // slightly-oval hole gets a matching disc rather than the max of
  // the two axes.
  const holeFrac = ((hMaxX - hMinX + 1) + (hMaxY - hMinY + 1)) / (4 * size);

  const result = {
    outerFrac,        // ring outer diameter / raster width
    holeFrac,         // ring inner hole radius / raster half-width
    holeCxFrac,       // hole center X as fraction of raster width
    holeCyFrac,       // hole center Y as fraction of raster height
    outerCxFrac,      // outer content center X (for mask-position calc)
    outerCyFrac,
    img: raster.img,  // reusable HTMLImageElement for canvas re-blit
    url,
  };
  ringGeometryCache[className] = result;
  return result;
}

async function loadAspectBboxCropped(aspect) {
  if (aspectAssetCache[aspect]) return aspectAssetCache[aspect];

  const url = `./images/aspects/no-bg/${aspect}.svg`;
  const raster = await rasterize(url, 400);
  if (!raster) return null;
  const bboxFrac = pixelBboxFraction(raster.rgba, raster.size);
  if (!bboxFrac) return null;

  const resp = await fetch(url);
  const svgText = await resp.text();
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svgEl = doc.documentElement;
  const vbAttr = svgEl.getAttribute('viewBox');
  let vbX = 0, vbY = 0, vbW = 100, vbH = 100;
  if (vbAttr) {
    const p = vbAttr.split(/[\s,]+/).map(Number);
    if (p.length === 4) [vbX, vbY, vbW, vbH] = p;
  } else {
    vbW = parseFloat(svgEl.getAttribute('width'))  || 100;
    vbH = parseFloat(svgEl.getAttribute('height')) || 100;
  }
  const cropX = vbX + bboxFrac.xFrac * vbW;
  const cropY = vbY + bboxFrac.yFrac * vbH;
  const cropW = bboxFrac.wFrac * vbW;
  const cropH = bboxFrac.hFrac * vbH;

  svgEl.setAttribute('viewBox', `${cropX} ${cropY} ${cropW} ${cropH}`);
  svgEl.removeAttribute('width');
  svgEl.removeAttribute('height');

  const serialized = new XMLSerializer().serializeToString(svgEl);
  const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialized);

  // Also keep an <img> handle for canvas re-blit during Copy/Download.
  const finalImg = new Image();
  await new Promise((resolve) => {
    finalImg.onload  = resolve;
    finalImg.onerror = resolve;   // resolve either way; caller checks
    finalImg.src = dataUrl;
  });

  const result = {
    dataUrl,
    bboxW: cropW,
    bboxH: cropH,
    img: finalImg,
  };
  aspectAssetCache[aspect] = result;
  return result;
}

/* Rotation speed: 7.5° per second per unit of |sign|. Matches the
   animate_classpect_glyphs.py tool exactly:
     dpf_per_sign=0.3125 × fps=24 = 7.5°/sec/sign
   i.e. one 15° spoke pass every 2 sec for Sylph (|sign|=1), seven
   spoke passes every 2 sec for Lord (|sign|=7).
     Sylph/Maid (|sign|=1) → 48 sec/rev
     Lord/Muse  (|sign|=7) → ~6.9 sec/rev */
const DEG_PER_SEC_PER_SIGN = 7.5;

/* Font-embedding cache. SVGs loaded via data-URL can't resolve
   @font-face fonts from external URLs (browser security), so custom
   fonts get base64-encoded and embedded IN the SVG itself. One-time
   fetch per font, then reused across every PNG export. */
const embeddedFontCache = {};

async function loadEmbeddedFont(fontName, url) {
  if (embeddedFontCache[fontName]) return embeddedFontCache[fontName];
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Font fetch failed: ${resp.status}`);
    const blob = await resp.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload  = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    embeddedFontCache[fontName] = dataUrl;
    return dataUrl;
  } catch (err) {
    console.error(`[classpect-glyph] failed to load embedded font ${fontName}:`, err);
    return null;
  }
}

/* Keyframes + button styles injected once at module load. */
if (typeof document !== 'undefined' && !document.getElementById('classpect-glyph-keyframes')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'classpect-glyph-keyframes';
  styleEl.textContent = `
    @keyframes classpect-glyph-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .classpect-glyph-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      background: #f4f4f4;
      border: 1px solid rgba(0, 0, 0, 0.25);
      border-radius: 3px;
      color: #1a1a1a;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
      transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
    }
    .classpect-glyph-btn:hover:not(:disabled) {
      background: #ffffff;
      border-color: rgba(0, 0, 0, 0.5);
      color: #000;
      box-shadow: 0 3px 10px rgba(109, 209, 244, 0.35);
    }
  `;
  document.head.appendChild(styleEl);
}


const ClasspectGlyph = React.forwardRef(({
  className, aspectName, theme, size = 240,
  // Optional overrides — if omitted, values are read from Settings
  // and kept in sync via the cc-setting-change event. Passing them
  // explicitly is how the settings-page preview grid pins each
  // preview to a specific mode/outline without touching global state.
  ringMode:        ringModeProp,
  outlineMode:     outlineModeProp,
  canonCharacters,      // [{ lunarsway, ... }] — for automatic outline
  nonCanonCharacters,
  // Show the Copy/Save PNG buttons? Preview grids set this false.
  showButtons = true,
  // Rotate the ring? Preview grids set this false for a still image.
  animate = true,
  // Optional substance layer — text + icons overlaid on the clear
  // band between the disc and the ring's outer spoke tips. Renders
  // on top of the rotating ring, itself non-rotating. Shape:
  //   {
  //     top?: string,                    // text curved along top arc
  //     left?: string,                   // text curved along left arc
  //     right?: string,                  // text curved along right arc
  //     bottomIcons?: [                  // icons along the bottom arc
  //       { kind: 'image', src, size? },
  //       { kind: 'text',  char, color? },
  //     ],
  //     color?: string,                  // text/base color override
  //     fontFamily?: string,             // font override
  //   }
  substance = null,
}, ref) => {
  const cls  = className.toLowerCase();
  const asp  = aspectName.toLowerCase();
  const sign = classesNumeric[className];
  const absSign = Math.abs(sign);
  const secPerTurn = 360 / (DEG_PER_SEC_PER_SIGN * absSign);

  const isActive = sign < 0;
  const direction = isActive ? 'normal' : 'reverse';    // CSS spins CW at 'normal'

  // Live settings — subscribe to change events so the glyph re-renders
  // when the user tweaks the settings page in another tab. 
  const [ringModeSetting,    setRingModeSetting]    = React.useState(() => Settings.get('glyphRingMode'));
  const [outlineModeSetting, setOutlineModeSetting] = React.useState(() => Settings.get('glyphOutlineMode'));
  React.useEffect(() => {
    const onChange = (ev) => {
      if (ev.detail?.name === 'glyphRingMode')    setRingModeSetting(Settings.get('glyphRingMode'));
      if (ev.detail?.name === 'glyphOutlineMode') setOutlineModeSetting(Settings.get('glyphOutlineMode'));
    };
    window.addEventListener('cc-setting-change', onChange);
    return () => window.removeEventListener('cc-setting-change', onChange);
  }, []);
  const ringMode    = ringModeProp    ?? ringModeSetting;
  const outlineMode = outlineModeProp ?? outlineModeSetting;

  // Ring paint (solid color OR gradient stops) + outline stroke color.
  const ringPaint         = resolveRingColor(ringMode, className, aspectName);
  const glyphOutlineColor = resolveOutlineColor(outlineMode, canonCharacters, nonCanonCharacters);
  const bgColor           = BG_COLORS[asp] || '#000000';

  // Interior "breathe" padding around the composited glyph so it
  // doesn't touch the box border.
  const BORDER    = 2;
  const padding   = Math.round(size * 0.09);
  const innerSize = size - 2 * padding - 2 * BORDER;

  // Load the ring geometry on mount / class change. 
  const [ringGeom, setRingGeom] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    loadRingGeometry(cls).then((g) => {
      if (!cancelled) setRingGeom(g);
    });
    return () => { cancelled = true; };
  }, [cls]);

  // Ring geometry (with sane fallbacks while loading).
  const ringOuterFrac  = ringGeom?.outerFrac  ?? 0.9;
  const ringHoleFrac   = ringGeom?.holeFrac   ?? 0.46;
  const outerCxFrac    = ringGeom?.outerCxFrac ?? 0.5;
  const outerCyFrac    = ringGeom?.outerCyFrac ?? 0.5;
  const holeCxFrac     = ringGeom?.holeCxFrac  ?? 0.5;
  const holeCyFrac     = ringGeom?.holeCyFrac  ?? 0.5;

  // Mask-size scaling: render the SVG so its OUTER ring content spans
  // the container edge-to-edge. If the ring occupies 90% of its
  // viewBox, we render at 1/0.9 ≈ 111%.
  const ringScale    = 1 / ringOuterFrac;
  const ringScalePct = (100 * ringScale).toFixed(2) + '%';

  // Mask-position: compensate for any offset between the ring's
  // content center and its viewBox center, so the ring's outer-content-
  // center lands on the container's center. 
  const mxPct = ringScale > 1
    ? (100 * (outerCxFrac * ringScale - 0.5) / (ringScale - 1)).toFixed(2) + '%'
    : '50%';
  const myPct = ringScale > 1
    ? (100 * (outerCyFrac * ringScale - 0.5) / (ringScale - 1)).toFixed(2) + '%'
    : '50%';

  // Disc geometry — sized off the measured hole radius, positioned
  // at the measured hole center (which after the mask-position fix
  // above should coincide with the container center, but computed
  // it independently as a safety belt for asymmetric rings).
  const holeSize = innerSize * (ringHoleFrac / ringOuterFrac) * 2;
                  // holeFrac is a half-width fraction; convert to
                  // a diameter fraction of the rescaled ring.
  const discSize = Math.round(holeSize * DISC_OVERSHOOT);
  const discCxPx = innerSize * ((holeCxFrac - outerCxFrac) * ringScale + 0.5);
  const discCyPx = innerSize * ((holeCyFrac - outerCyFrac) * ringScale + 0.5);

  // The colored ring silhouette. Background is either a solid color
  // OR a radial gradient (for the "gradient" mode). The ring SVG's
  // alpha is used as a mask so only ring-shaped pixels are painted.
  const ringMaskUrl = `./images/classes/rings/${cls}.svg`;

  // Gradient goes from the ring's inner hole (dark stop) out to its
  // visible outer edge (bright stop). 
  const holeRadiusPct = (holeSize / innerSize) * 100;
  const ringBackground = ringPaint.kind === 'gradient'
    ? `radial-gradient(circle closest-side at 50% 50%, ${ringPaint.inner} ${holeRadiusPct.toFixed(2)}%, ${ringPaint.outer} 100%)`
    : ringPaint.color;

  // Rotating wrapper — carries the spin animation for BOTH the fill
  // and the outline overlay so they can never phase-drift.
  const ringRotatorStyle = {
    position: 'absolute',
    inset: 0,
    animation: animate ? `classpect-glyph-spin ${secPerTurn}s linear infinite` : 'none',
    animationDirection: direction,
    pointerEvents: 'none',
  };

  // Ring fill layer (mask + colored bg) — no animation of its own now;
  // the rotator above spins the whole group.
  const ringStyle = {
    position: 'absolute',
    inset: 0,
    background: ringBackground,
    maskImage: `url(${ringMaskUrl})`,
    WebkitMaskImage: `url(${ringMaskUrl})`,
    maskSize: ringScalePct,
    WebkitMaskSize: ringScalePct,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: `${mxPct} ${myPct}`,
    WebkitMaskPosition: `${mxPct} ${myPct}`,
    pointerEvents: 'none',
  };

  // Load the stroke overlay lazily when outline mode is active. Same
  // load/cache pattern as ringGeom + aspectAsset.
  const [ringStroke, setRingStroke] = React.useState(null);
  React.useEffect(() => {
    if (!glyphOutlineColor) { setRingStroke(null); return; }
    let cancelled = false;
    loadRingStrokeOverlay(cls, glyphOutlineColor).then((s) => {
      if (!cancelled) setRingStroke(s);
    });
    return () => { cancelled = true; };
  }, [cls, glyphOutlineColor]);

  // Overlay geometry mirrors the fill ring: scaled up by ringScale so
  // its outer content edge lands on the container edge. non-scaling-
  // stroke keeps the stroke a crisp 1 device pixel regardless of
  // this scale.
  const strokeOverlayWrapperStyle = {
    position: 'absolute',
    inset: 0,
    transform: `scale(${ringScale})`,
    transformOrigin: `${(outerCxFrac * 100).toFixed(2)}% ${(outerCyFrac * 100).toFixed(2)}%`,
    pointerEvents: 'none',
  };
  const strokeOverlayImgStyle = {
    display: 'block',
    width:  '100%',
    height: '100%',
  };

  const boxBorderColor = theme?.accentBg || '#a0a0a0';

  // Ref used by the copy/download handlers to know what to rasterize.
  const glyphInnerRef = React.useRef(null);
  const [copied, setCopied]         = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);

  // Load the bbox-cropped aspect asset on mount / aspect change.
  const [aspectAsset, setAspectAsset] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    loadAspectBboxCropped(asp).then((asset) => {
      if (!cancelled) setAspectAsset(asset);
    });
    return () => { cancelled = true; };
  }, [asp]);

  // Aspect render size uses the tool's dual-constraint math:
  //   diag_target = hole_diameter × DISC_INSET
  //   scale       = diag_target / bbox_diagonal
  //   renderW/H   = bbox × scale
  let aspectRenderW = 0, aspectRenderH = 0;
  if (aspectAsset) {
    const { bboxW, bboxH } = aspectAsset;
    const bboxDiag = Math.sqrt(bboxW * bboxW + bboxH * bboxH);
    const scale = (holeSize * DISC_INSET) / bboxDiag;
    aspectRenderW = bboxW * scale;
    aspectRenderH = bboxH * scale;
  }

  // Compose the glyph — disc + aspect + ring + substance — into a
  // transparent-background PNG blob at the requested outputSize. No
  // box background or border, just the glyph on transparent.
  // Default is 2× innerSize
  const composeStaticPng = async (outputSize = innerSize * 2) => {
    if (!ringGeom || !aspectAsset) return null;

    const OUT     = outputSize;
    const scaleUp = OUT / innerSize;
    const canvas  = document.createElement('canvas');
    canvas.width  = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext('2d');

    const cs = (v) => v * scaleUp;

    // 1. Disc + optional outline stroke.
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(cs(discCxPx), cs(discCyPx), cs(discSize / 2), 0, Math.PI * 2);
    ctx.fill();
    if (glyphOutlineColor) {
      ctx.strokeStyle = glyphOutlineColor;
      ctx.lineWidth   = 1 * scaleUp;
      ctx.stroke();
    }

    // 2. Aspect symbol.
    if (aspectAsset.img && aspectAsset.img.complete) {
      const aw = cs(aspectRenderW);
      const ah = cs(aspectRenderH);
      ctx.drawImage(aspectAsset.img, cs(discCxPx) - aw / 2, cs(discCyPx) - ah / 2, aw, ah);
    }

    // 3. Ring — tint via scratch canvas + source-in.
    if (ringGeom.img) {
      const scratch = document.createElement('canvas');
      scratch.width  = OUT;
      scratch.height = OUT;
      const sctx = scratch.getContext('2d');
      const ringDrawSize = OUT * ringScale;
      const rx = OUT / 2 - outerCxFrac * ringDrawSize;
      const ry = OUT / 2 - outerCyFrac * ringDrawSize;
      sctx.drawImage(ringGeom.img, rx, ry, ringDrawSize, ringDrawSize);
      sctx.globalCompositeOperation = 'source-in';
      if (ringPaint.kind === 'gradient') {
        const grad = sctx.createRadialGradient(
          OUT / 2, OUT / 2, cs(holeSize / 2),
          OUT / 2, OUT / 2, OUT / 2,
        );
        grad.addColorStop(0, ringPaint.inner);
        grad.addColorStop(1, ringPaint.outer);
        sctx.fillStyle = grad;
      } else {
        sctx.fillStyle = ringPaint.color;
      }
      sctx.fillRect(0, 0, OUT, OUT);
      ctx.drawImage(scratch, 0, 0);

      // 4. Ring stroke overlay.
      if (glyphOutlineColor && ringStroke?.img && ringStroke.img.complete) {
        ctx.drawImage(ringStroke.img, rx, ry, ringDrawSize, ringDrawSize);
      }
    }

    // 5. Substance layer — serialized from the live DOM SVG. Any
    //    referenced <image> is fetched and inlined as base64.
    if (substance) {
      const substanceSvg = glyphInnerRef.current?.querySelector('svg[data-substance]');
      if (substanceSvg) {
        const clone = substanceSvg.cloneNode(true);

        const usesTypostuck = Array.from(clone.querySelectorAll('text')).some(
          (t) => ((t.getAttribute('style') || '') + (t.style?.fontFamily || ''))
                    .includes('Typostuck')
        );
        if (usesTypostuck) {
          const fontDataUrl = await loadEmbeddedFont('Typostuck', './fonts/TYPOSTUCK.ttf');
          if (fontDataUrl) {
            const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
            styleEl.textContent =
              `@font-face { font-family: 'Typostuck'; ` +
              `src: url('${fontDataUrl}') format('truetype'); }`;
            clone.insertBefore(styleEl, clone.firstChild);
          }
        }

        const imgs = Array.from(clone.querySelectorAll('image'));
        await Promise.all(imgs.map(async (img) => {
          const href = img.getAttribute('href') || img.getAttribute('xlink:href');
          if (!href || /^data:/.test(href)) return;
          try {
            const absUrl = new URL(href, document.baseURI).href;
            const resp = await fetch(absUrl);
            const blob = await resp.blob();
            const dataUrl = await new Promise((resolve, reject) => {
              const r = new FileReader();
              r.onload  = () => resolve(r.result);
              r.onerror = reject;
              r.readAsDataURL(blob);
            });
            img.setAttribute('href', dataUrl);
            img.removeAttribute('xlink:href');
          } catch (err) {
            console.error(`Failed to inline substance image ${href}:`, err);
          }
        }));
        const svgString = new XMLSerializer().serializeToString(clone);
        const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
        const subImg = new Image();
        await new Promise((resolve) => {
          subImg.onload  = resolve;
          subImg.onerror = resolve;
          subImg.src = dataUrl;
        });
        if (subImg.complete && subImg.naturalWidth > 0) {
          ctx.drawImage(subImg, 0, 0, OUT, OUT);
        }
      }
    }

    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  };

  const handleDownload = async () => {
    const blob = await composeStaticPng();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cls}-of-${asp}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1200);
  };

  const handleCopy = async () => {
    const blob = await composeStaticPng();
    if (!blob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      alert('Copy failed — your browser may not support image clipboard writes. Try the Download button instead.');
      console.error(err);
    }
  };

  // Unique id for SVG <defs> arc paths — one per component instance
  // so multiple glyphs on the same page (e.g. the beta-kids preview
  // grid) don't fight over the same href="#topArc".
  React.useImperativeHandle(ref, () => ({
    composeStaticPng: (outputSize) => composeStaticPng(outputSize),
    isReady:          () => Boolean(ringGeom && aspectAsset),
  }));

  const substanceUid = React.useId();

  // Substance layer geometry. 
  const substanceLayer = (substance && ringGeom) ? (() => {
    const cx = discCxPx;
    const cy = discCyPx;
    const discR  = discSize / 2;
    const outerR = innerSize / 2;
    const bandThickness = Math.max(4, outerR - discR);
    const subBand = bandThickness / 7;
    const arcR    = discR + subBand / 2;
    const fontPx  = Math.max(5, subBand * 0.9);
    const iconPx  = Math.max(6, subBand);
    
    const font    = substance.fontFamily || "'Courier New', 'Courier', monospace";
    const color   = substance.color || '#ffffff';
    
    const stroke  = '#121314';
    const strokeW = Math.max(1, fontPx * 0.14);

    
    const pt = (deg) => {
      const r = deg * Math.PI / 180;
      return [cx + arcR * Math.cos(r), cy - arcR * Math.sin(r)];
    };

    // Three half-circle arc paths — one each for top, left, right.
    const arcAt = (ax, ay, bx, by, sweep) =>
      `M ${ax.toFixed(2)},${ay.toFixed(2)} ` +
      `A ${arcR.toFixed(2)},${arcR.toFixed(2)} 0 0 ${sweep} ` +
      `${bx.toFixed(2)},${by.toFixed(2)}`;

    const topArcD   = arcAt(cx - arcR, cy,        cx + arcR, cy,        1); // 9→3 via 12 (CW, reads L→R)
    const leftArcD  = arcAt(cx,        cy + arcR, cx,        cy - arcR, 1); // 6→12 via 9  (CW,  reads B→T)
    const rightArcD = arcAt(cx,        cy - arcR, cx,        cy + arcR, 1); // 12→6 via 3  (CW,  reads T→B)

    const bottomIcons = substance.bottomIcons || [];

    const arcTextStyle = {
      fontFamily:    font,
      fontSize:      `${fontPx}px`,
      fontWeight:    'bold',
      fill:          color,
      stroke:        stroke,
      strokeWidth:   `${strokeW}px`,
      paintOrder:    'stroke fill',
      letterSpacing: '1px',
      dominantBaseline: 'central',
    };

    return (
      <svg
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
        viewBox={`0 0 ${innerSize} ${innerSize}`}
        xmlns="http://www.w3.org/2000/svg"
        data-substance="true"
      >
        <defs>
          <path id={`sub-top-${substanceUid}`}   d={topArcD}   fill="none"/>
          <path id={`sub-left-${substanceUid}`}  d={leftArcD}  fill="none"/>
          <path id={`sub-right-${substanceUid}`} d={rightArcD} fill="none"/>
        </defs>

        {substance.top && (
          <text style={arcTextStyle}>
            <textPath href={`#sub-top-${substanceUid}`} startOffset="50%" textAnchor="middle">
              {substance.top}
            </textPath>
          </text>
        )}
        {substance.left && (
          <text style={arcTextStyle}>
            {/* Left-arc path runs 6→12 (bottom-to-top) */}
            <textPath href={`#sub-left-${substanceUid}`} startOffset="50%" textAnchor="middle">
              {substance.left}
            </textPath>
          </text>
        )}
        {substance.right && (
          <text style={arcTextStyle}>
            <textPath href={`#sub-right-${substanceUid}`} startOffset="50%" textAnchor="middle">
              {substance.right}
            </textPath>
          </text>
        )}

        {/* Bottom-arc icons — clustered at 6 o'clock (270° math) with
            fixed 22° inter-icon spacing rather than stretched across
            a wide arc. */}
        {(() => {
          const ICON_SPACING_DEG = 22;
          const n = bottomIcons.length;
          const totalSpan = (n - 1) * ICON_SPACING_DEG;
          const firstAngle = 270 - totalSpan / 2;
          return bottomIcons.map((icon, i) => {
            const angleDeg = firstAngle + i * ICON_SPACING_DEG;
            const [ix, iy] = pt(angleDeg);
            const scale = icon.scale || 1;
            if (icon.kind === 'image') {
              const s = (icon.size || iconPx) * scale;
              // 4-cardinal drop-shadow chain — crisp 1px dark halo so
              // pixel-art icons read on any ring color.
              const iconOutline =
                'drop-shadow(1px 0 0 #000)'  +
                ' drop-shadow(-1px 0 0 #000)' +
                ' drop-shadow(0 1px 0 #000)'  +
                ' drop-shadow(0 -1px 0 #000)';
              return (
                <image key={i} href={icon.src}
                       x={ix - s / 2} y={iy - s / 2}
                       width={s} height={s}
                       preserveAspectRatio="xMidYMid meet"
                       style={{filter: iconOutline}}/>
              );
            }
            if (icon.kind === 'text') {
              return (
                <text key={i} x={ix} y={iy} dy="0.35em"
                      textAnchor="middle"
                      style={{
                        fontFamily: font, fontSize: `${fontPx * 1.35 * scale}px`,
                        fontWeight: 'bold', fill: icon.color || color,
                        stroke: stroke, strokeWidth: `${strokeW}px`,
                        paintOrder: 'stroke fill',
                      }}>
                  {icon.char}
                </text>
              );
            }
            return null;
          });
        })()}
      </svg>
    );
  })() : null;

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flexShrink: 0}}>
      {/* Rounded box, VSCode-dark bg, page-theme accent outline. */}
      <div
        style={{
          width:  `${size}px`,
          height: `${size}px`,
          background: '#121314',
          border: `${BORDER}px solid ${boxBorderColor}`,
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          padding: `${padding}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Glyph inner */}
        <div
          ref={glyphInnerRef}
          style={{position: 'relative', width: '100%', height: '100%'}}
        >
          {/* 1. Colored disc. Sized off the measured ring hole so it
                 fits inside the ring's inner opening. */}
          {ringGeom && (
            <div
              style={{
                position: 'absolute',
                // Border added when outline mode is on
                top:  `${discCyPx - discSize / 2 - (glyphOutlineColor ? 1 : 0)}px`,
                left: `${discCxPx - discSize / 2 - (glyphOutlineColor ? 1 : 0)}px`,
                width:  `${discSize + (glyphOutlineColor ? 2 : 0)}px`,
                height: `${discSize + (glyphOutlineColor ? 2 : 0)}px`,
                borderRadius: '50%',
                background: bgColor,
                boxSizing: 'border-box',
                border: glyphOutlineColor ? `1px solid ${glyphOutlineColor}` : 'none',
              }}
            />
          )}

          {/* 2. Aspect symbol, bbox-cropped + centered on the disc. */}
          {aspectAsset && ringGeom && (
            <img
              src={aspectAsset.dataUrl}
              alt=""
              style={{
                position: 'absolute',
                top:  `${discCyPx - aspectRenderH / 2}px`,
                left: `${discCxPx - aspectRenderW / 2}px`,
                width:  `${aspectRenderW}px`,
                height: `${aspectRenderH}px`,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* 3. Rotating ring group — ONE animation, both layers inside. */}
          <div key={`ring-rotator-${cls}-${direction}`} style={ringRotatorStyle}>
            {/* Ring fill — colored silhouette via mask. */}
            <div style={ringStyle}/>

            {/* Ring stroke overlay — only when outline mode is on. */}
            {ringStroke && (
              <div style={strokeOverlayWrapperStyle}>
                <img src={ringStroke.dataUrl} alt="" style={strokeOverlayImgStyle}/>
              </div>
            )}
          </div>

          {/* 4. Substance layer — SVG overlay with curved text and
                 icons in the clear band between the disc and the ring's
                 outer spoke tips. */}
          {substanceLayer}
        </div>
      </div>

      {/* Copy / Save PNG buttons . */}
      {showButtons && (
        <div style={{display: 'flex', gap: '10px'}}>
          <button
            className="classpect-glyph-btn"
            onClick={handleCopy}
            title="Copy static PNG to clipboard"
          >
            {/* Clipboard icon. */}
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="9" y="2" width="6" height="4" rx="1"/>
              <path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2"/>
            </svg>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            className="classpect-glyph-btn"
            onClick={handleDownload}
            title="Download static PNG"
          >
            {/* Download arrow icon. */}
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v10m0 0l-4-4m4 4l4-4" strokeLinecap="round"/>
              <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" strokeLinecap="round"/>
            </svg>
            {downloaded ? '✓ Saved' : 'Save PNG'}
          </button>
        </div>
      )}
    </div>
  );
});
