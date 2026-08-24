/* =========================================================================
   SITEWIDE SETTINGS
   Settings are keyed under the 'cc.setting.<name>' namespace to
   avoid collisions with any future non-setting localStorage use.

   Storage format is always a plain string. Enum settings use their
   string label directly; boolean settings use 'true'/'false'.
   ========================================================================= */

const SETTING_NS = 'cc.setting.';

/* Registry — one entry per setting.
     kind:    'enum' | 'bool'
     default: canonical default value (returned when unset/invalid)
     values:  (enum only) allowed string values
     label:   human-readable name for the settings UI
     description: shown under the control in the settings UI
*/
const SETTINGS_REGISTRY = {
  /* Sitewide polarity — sign convention for classes + aspects.
       Huss (default): + = Active / Explicit
       Cal:            − = Active / Explicit  (site's original) */
  polarityMode: {
    kind:        'enum',
    default:     'huss',
    values:      ['huss', 'cal'],
    valueLabels: { huss: 'Huss', cal: 'Cal' },
    label:       'Polarity',
    description: "Huss: + = Active / Explicit. Cal: − = Active / Explicit.",
  },

  graphXAxisLabels: {
    kind:        'enum',
    default:     'text',
    values:      ['text', 'icon'],
    valueLabels: { text: 'Text', icon: 'Icon' },
    label:       'X-axis labels',
    description: "Text abbreviations (Ld, Wi, …) or class-icon tiles.",
  },
  graphYAxisLabels: {
    kind:        'enum',
    default:     'icon',
    values:      ['text', 'icon'],
    valueLabels: { text: 'Text', icon: 'Icon' },
    label:       'Y-axis labels',
    description: "Text abbreviations (SPC, VD, …) or aspect symbols.",
  },

  /* Classpect-glyph render style. Mirrors the four modes from the
     Python generator tool (generate_classpect_glyphs.py). */
  glyphRingMode: {
    kind:        'enum',
    default:     'canonical',
    values:      ['canonical', 'background', 'gradient', 'grayscale'],
    valueLabels: {
      canonical:  'Canonical',
      background: 'Background',
      gradient:   'Gradient',
      grayscale:  'Grayscale',
    },
    label:       'Ring color',
    description: "How the class ring is colored.",
  },
  glyphOutlineMode: {
    kind:        'enum',
    default:     'none',
    values:      ['none', 'automatic', 'prospit', 'derse', 'neutral'],
    valueLabels: {
      none:      'Off',
      automatic: 'Auto',
      prospit:   'Prospit',
      derse:     'Derse',
      neutral:   'Neutral',
    },
    label:       'Outline',
    description: "Lunar-sway stroke on the ring & disc edges.",
  },
};


function _key(name) {
  return SETTING_NS + name;
}

const Settings = {
  registry: SETTINGS_REGISTRY,

  get(name) {
    const spec = SETTINGS_REGISTRY[name];
    if (!spec) {
      console.warn(`[settings] unknown setting: ${name}`);
      return undefined;
    }
    let stored;
    try {
      stored = window.localStorage.getItem(_key(name));
    } catch (_) {
      // Private-mode / storage-disabled fallback: silently use default.
      return spec.default;
    }
    if (stored === null) return spec.default;

    if (spec.kind === 'enum') {
      return spec.values.includes(stored) ? stored : spec.default;
    }
    if (spec.kind === 'bool') {
      if (stored === 'true')  return true;
      if (stored === 'false') return false;
      return spec.default;
    }
    return spec.default;
  },

  set(name, value) {
    const spec = SETTINGS_REGISTRY[name];
    if (!spec) {
      console.warn(`[settings] unknown setting: ${name}`);
      return;
    }
    // Validate before persisting.
    if (spec.kind === 'enum' && !spec.values.includes(value)) {
      console.warn(`[settings] invalid value for ${name}: ${value} (allowed: ${spec.values.join(', ')})`);
      return;
    }
    if (spec.kind === 'bool' && typeof value !== 'boolean') {
      console.warn(`[settings] ${name} requires boolean, got ${typeof value}`);
      return;
    }
    const stored = spec.kind === 'bool' ? String(value) : value;
    try {
      window.localStorage.setItem(_key(name), stored);
    } catch (_) {
      // Storage disabled — the change won't persist but shouldn't crash.
    }
    // Broadcast so any live consumers can re-render.
    try {
      window.dispatchEvent(new CustomEvent('cc-setting-change', {
        detail: { name, value },
      }));
    } catch (_) { /* ignore */ }
  },

  reset(name) {
    try {
      window.localStorage.removeItem(_key(name));
    } catch (_) { /* ignore */ }
    try {
      const spec = SETTINGS_REGISTRY[name];
      window.dispatchEvent(new CustomEvent('cc-setting-change', {
        detail: { name, value: spec ? spec.default : undefined },
      }));
    } catch (_) { /* ignore */ }
  },
};

// Expose on window so plain-HTML pages (like settings.html) can use it
// without React-style imports.
if (typeof window !== 'undefined') {
  window.Settings = Settings;
}
