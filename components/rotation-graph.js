/* =========================
   ROTATION GRAPH COMPONENT
   Visualizes classpect rotations and reflections on a coordinate grid
   Requires: constants.js (classesNumeric, aspectsNumeric, aspectColors, aspectColorsDark)
   Requires: utility-functions.js (totalValue)
   ========================= */

const RotationGraph = ({ className, aspectName, rotations, reflection, onNavigate, theme }) => {
  const [showRotations, setShowRotations] = useState(true);
  const [showReflection, setShowReflection] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  // Default list open on mobile so small-screen users don't need to squint at a tiny graph
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const [showList, setShowList] = useState(isMobile);
  const [graphCollapsed, setGraphCollapsed] = useState(isMobile);
  const [exportStatus, setExportStatus] = useState(null); // null | 'saving' | 'saved' | 'copying' | 'copied' | 'error'

  /* Underlay overlay state — mutually exclusive ('none' | 'value' |
     'leadership'). Renders a diverging colormap wash under the grid
     lines so the reader can see at a glance where each classpect
     falls on the sum-value or leadership scale. Picks Vanimo on dark
     theme, PuY on light theme. Disabled by default (no visual noise
     unless asked for). */
  const [tintMode, setTintMode] = useState('none');
  const colormap = (theme?.isDark ? vanimoColor : puyColor);
  const tintFn = useMemo(() => {
    if (tintMode === 'value') {
      // Sum value normalized by max magnitude 13 (Lord/Hope or Muse/Space).
      return (cv, av) => colormap((cv + av) / 13);
    }
    if (tintMode === 'leadership') {
      // Leadership normalized by max magnitude 19 (Muse/Breath or Lord/Blood).
      return (cv, av) => {
        const c = CLASS_LEAD_BY_VAL[cv];
        const a = ASPECT_LEAD_BY_VAL[av];
        if (c === undefined || a === undefined) return null;
        return colormap((c + 2 * a) / 19);
      };
    }
    return null;
  }, [tintMode, theme?.isDark]);

  const svgRef = useRef(null);

  const x = classesNumeric[className];
  const y = aspectsNumeric[aspectName];

  const scale = 30;
  const centerX = 280;
  const centerY = 200;

  const toSvgX = (val) => centerX + val * scale;
  const toSvgY = (val) => centerY - val * scale;

  // Helper to get total value
  const totalValue = (c, a) => classesNumeric[c] + aspectsNumeric[a];

  // Class abbreviations (X-axis)
  const classAbbrev = {
    "Lord": "Ld", "Witch": "Wi", "Prince": "Pc", "Thief": "Tf",
    "Knight": "Nt", "Mage": "Mg", "Sylph": "Sy",
    "Maid": "Md", "Seer": "Sr", "Page": "Pg",
    "Rogue": "Rg", "Bard": "Bd", "Heir": "Hr", "Muse": "Ms"
  };

  // Aspect abbreviations — used as fallback text when image fails to load
  const aspectAbbrev = {
    "Space": "SPC", "Void": "VD",  "Doom": "DM",  "Heart": "HRT",
    "Blood": "BLD", "Time": "TME", "Rage": "RGE", "Breath": "BTH",
    "Mind":  "MND", "Life": "LFE", "Light": "LGT", "Hope": "HPE"
  };

  const [failedAspectImages, setFailedAspectImages] = useState(new Set());

  // Aspect order (Y-axis, from +6 to -6)
  const aspectOrder = ["Space", "Void", "Doom", "Heart", "Blood", "Time", "Rage", "Breath", "Mind", "Life", "Light", "Hope"];

  const handleMouseEnter = (label, event) => {
    setHoveredPoint(label);
    const rect = event.target.getBoundingClientRect();
    setHoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  // ── Image export helpers ──────────────────────────────────────────────────

  /** Build the filename from current state.
      Trickle-back: when an underlay is active, append a tag so saved
      PNGs remember which wash was visible (otherwise two exports of
      the same classpect with/without an underlay would collide on
      disk). Theme also baked in since PuY vs Vanimo changes the look
      meaningfully. */
  const getFilename = (ext) => {
    const c = className.toLowerCase().replace(/\s+/g, '-');
    const a = aspectName.toLowerCase().replace(/\s+/g, '-');
    const rots = showRotations ? 'yes' : 'no';
    const refl = showReflection ? 'yes' : 'no';
    const tintTag = tintMode === 'none'
      ? ''
      : `_underlay_${tintMode}_${theme?.isDark ? 'vanimo' : 'puy'}`;
    return `${c}_of_${a}_showrots_${rots}_showreflxn_${refl}${tintTag}.${ext}`;
  };

  /**
   * Clone the SVG and inline all <image> hrefs as base64 data URLs.
   *
   * When an SVG is loaded as <img src="blob:..."> (which is how we rasterise it),
   * browsers block ALL external resource loading inside the SVG — including
   * same-origin <image> hrefs — as a security measure.  The only way to get
   * those images into the exported PNG is to embed them as data: URLs first.
   */
  const prepareSvgForExport = async (svgEl) => {
    const clone = svgEl.cloneNode(true);
    clone.setAttribute('width', '550');
    clone.setAttribute('height', '430');

    // Build a same-origin base URL, ignoring the hash fragment.
    // e.g. "http://localhost:8080/index.html#/classpect/knight-of-time"
    //   →  baseUrl = "http://localhost:8080/"
    const baseUrl = (window.location.origin + window.location.pathname).replace(/\/[^/]*$/, '/');

    const imageEls = Array.from(clone.querySelectorAll('image'));
    await Promise.all(imageEls.map(async (img) => {
      const href = img.getAttribute('href') || img.getAttribute('xlink:href') || '';
      if (!href || href.startsWith('data:')) return;

      const abs = href.startsWith('http') ? href : baseUrl + href.replace(/^\.\//, '');
      try {
        const resp = await fetch(abs);
        const blob = await resp.blob();
        const dataUrl = await new Promise((res) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.readAsDataURL(blob);
        });
        img.setAttribute('href', dataUrl);
      } catch {
        // If a particular image can't be fetched, remove it rather than
        // leaving a broken reference that would taint the canvas.
        img.remove();
      }
    }));

    return clone;
  };

  /**
   * Render the SVG to a canvas and return a Promise<Blob>.
   * bgColor: the background fill to apply before drawing.
   */
  const svgToCanvas = async (svgEl, bgColor) => {
    return new Promise(async (resolve, reject) => {
      const cloned = await prepareSvgForExport(svgEl);
      const svgStr = new XMLSerializer().serializeToString(cloned);
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 550;
        canvas.height = 430;
        const ctx = canvas.getContext('2d');
        // Fill background
        ctx.fillStyle = bgColor || (theme?.isDark ? '#0d0d0d' : '#e8e8e8');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob(resolve, 'image/png');
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  /** Download PNG to device */
  const handleSaveImage = async () => {
    const svg = svgRef.current;
    if (!svg) {
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 2500);
      return;
    }
    setExportStatus('saving');
    try {
      const blob = await svgToCanvas(svg);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getFilename('png');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setExportStatus('saved');
    } catch (err) {
      console.error('Save failed:', err);
      setExportStatus('error');
    }
    setTimeout(() => setExportStatus(null), 2500);
  };

  /** Copy PNG to clipboard */
  const handleCopyImage = async () => {
    const svg = svgRef.current;
    if (!svg) {
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 2500);
      return;
    }
    if (!navigator.clipboard?.write) {
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 2500);
      return;
    }
    setExportStatus('copying');
    try {
      const blob = await svgToCanvas(svg);
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setExportStatus('copied');
    } catch (err) {
      console.error('Copy failed:', err);
      setExportStatus('error');
    }
    setTimeout(() => setExportStatus(null), 2500);
  };

  // Status label for feedback
  const exportStatusLabel = {
    saving: 'Saving…',
    saved: 'Saved!',
    copying: 'Copying…',
    copied: 'Copied!',
    error: 'Failed (needs HTTPS or graph visible)',
  }[exportStatus] || null;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 rounded" style={{backgroundColor: theme?.isDark ? "#2a2a2a" : "#f9fafb", position: 'relative', zIndex: 1}}>
      {/* Controls row */}
      <div className="flex flex-wrap gap-4 mb-2 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showRotations}
            onChange={(e) => setShowRotations(e.target.checked)}
          />
          <span className="text-sm">Show Rotations</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showReflection}
            onChange={(e) => setShowReflection(e.target.checked)}
          />
          <span className="text-sm">Show Reflection</span>
        </label>
        {/* Underlay toggles — mutually exclusive (only one wash at a
            time). Off by default; the wash sits behind the grid lines
            so it doesn't fight the rotation overlays. Vanimo on dark
            theme, PuY on light theme. */}
        <span className="text-xs uppercase tracking-wider opacity-60"
              style={{fontFamily: 'Verdana, sans-serif'}}>
          Underlay:
        </span>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={tintMode === 'value'}
            onChange={() => setTintMode(tintMode === 'value' ? 'none' : 'value')}
          />
          <span className="text-sm">Sum value</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={tintMode === 'leadership'}
            onChange={() => setTintMode(tintMode === 'leadership' ? 'none' : 'leadership')}
          />
          <span className="text-sm">Leadership</span>
        </label>
        {/* Tiny gradient legend so the colormap reads at a glance.
            Purple = negative, yellow = positive, near-neutral center. */}
        <span className="flex items-center gap-1" style={{opacity: tintMode === 'none' ? 0.4 : 1}}>
          <span className="text-xs" style={{color: theme?.isDark ? '#888' : '#666'}}>−</span>
          <span style={{
            display: 'inline-block', width: '52px', height: '8px',
            border: `1px solid ${theme?.isDark ? '#555' : '#999'}`,
            background: theme?.isDark
              ? 'linear-gradient(to right, #14025a 0%, #782c92 25%, #160a1e 50%, #dcb464 75%, #faf06e 100%)'
              : 'linear-gradient(to right, #661482 0%, #b87acc 25%, #fafafa 50%, #f0dc78 75%, #e6bc1e 100%)'
          }}/>
          <span className="text-xs" style={{color: theme?.isDark ? '#888' : '#666'}}>+</span>
        </span>

        {/* Export buttons */}
        <div className="flex gap-2 items-center ml-auto flex-wrap">
          <button
            onClick={handleSaveImage}
            disabled={!!exportStatus}
            title={`Save graph as PNG\n(${getFilename('png')})`}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:opacity-80"
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              border: `1px solid ${theme?.isDark ? '#555' : '#bbb'}`,
              color: theme?.isDark ? '#ccc' : '#333',
              fontFamily: 'Verdana, sans-serif',
              cursor: exportStatus ? 'default' : 'pointer',
              opacity: exportStatus ? 0.6 : 1,
            }}
          >
            {/* Download icon */}
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 3v12M8 11l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" strokeLinecap="round"/>
            </svg>
            Save PNG
          </button>

          <button
            onClick={handleCopyImage}
            disabled={!!exportStatus}
            title="Copy graph image to clipboard"
            className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:opacity-80"
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              border: `1px solid ${theme?.isDark ? '#555' : '#bbb'}`,
              color: theme?.isDark ? '#ccc' : '#333',
              fontFamily: 'Verdana, sans-serif',
              cursor: exportStatus ? 'default' : 'pointer',
              opacity: exportStatus ? 0.6 : 1,
            }}
          >
            {/* Clipboard icon */}
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="9" y="2" width="6" height="4" rx="1"/>
              <path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2"/>
            </svg>
            Copy
          </button>

          {exportStatusLabel && (
            <span className="text-xs" style={{fontFamily: 'Verdana, sans-serif', color: theme?.isDark ? '#6dd1f4' : '#555'}}>
              {exportStatusLabel}
            </span>
          )}
        </div>
      </div>

      {/* Toggle graph visibility on mobile */}
      {isMobile && (
        <div className="mb-2">
          <button
            onClick={() => setGraphCollapsed(!graphCollapsed)}
            className="text-sm underline"
            style={{fontFamily: 'Verdana', fontWeight: 'bold', color: theme?.isDark ? "#6dd1f4" : "#0000ee"}}
          >
            {graphCollapsed ? '> Show graph view.' : '∨ Hide graph view.'}
          </button>
        </div>
      )}

      {/* Graph — hidden by default on mobile until expanded */}
      {!graphCollapsed && (
        <div style={{overflowX: 'auto', WebkitOverflowScrolling: 'touch'}}>
          <svg
            ref={svgRef}
            viewBox="0 0 550 430"
            className="border border-gray-300"
            style={{
              backgroundColor: theme?.isDark ? '#0d0d0d' : '#e8e8e8',
              display: 'block',
              margin: '0 auto',
              width: '100%',
              maxWidth: '550px',
              height: 'auto',
            }}>
            {/* Trickle-back: cell-tint underlay (Sum value / Leadership).
                Each integer cell gets an oversized rect (1.35× cell
                width) so neighbours overlap and the Gaussian blur
                paints a continuous diverging gradient. Renders BEFORE
                the grid lines + axes so the wash sits underneath.
                Includes the 0 axes for visual continuity even though
                no classpect lives there. */}
            {tintFn && (
              <defs>
                <clipPath id="rg-grid-clip">
                  <rect x={toSvgX(-7)} y={toSvgY(6)}
                        width={14 * scale} height={12 * scale}/>
                </clipPath>
                <filter id="rg-tint-blur" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="11"/>
                </filter>
              </defs>
            )}
            {tintFn && (
              <g clipPath="url(#rg-grid-clip)" opacity="0.30" pointerEvents="none">
                <g filter="url(#rg-tint-blur)">
                  {[-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7].flatMap(cv =>
                    [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map(av => {
                      const color = tintFn(cv, av);
                      if (!color) return null;
                      const half = scale * 0.675;
                      return (
                        <rect key={`rg-tint-${cv}-${av}`}
                              x={toSvgX(cv) - half}
                              y={toSvgY(av) - half}
                              width={half * 2} height={half * 2}
                              fill={color} stroke="none"/>
                      );
                    })
                  )}
                </g>
              </g>
            )}
            {/* Vertical grid lines */}
            {[-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7].map(val => (
              <line
                key={`vline-${val}`}
                x1={toSvgX(val)}
                y1={toSvgY(-6)}
                x2={toSvgX(val)}
                y2={toSvgY(6)}
                stroke={theme?.isDark ? "#444444" : "#d0d0d0"}
                strokeWidth="1"
              />
            ))}

            {/* Horizontal grid lines */}
            {[-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map(val => (
              <line
                key={`hline-${val}`}
                x1={toSvgX(-7)}
                y1={toSvgY(val)}
                x2={toSvgX(7)}
                y2={toSvgY(val)}
                stroke={theme?.isDark ? "#444444" : "#d0d0d0"}
                strokeWidth="1"
              />
            ))}

            {/* Main axes */}
            <line x1={toSvgX(-7)} y1={toSvgY(0)} x2={toSvgX(7)} y2={toSvgY(0)} stroke={theme?.isDark ? "#888888" : "#666666"} strokeWidth="2" />
            <line x1={toSvgX(0)} y1={toSvgY(-6)} x2={toSvgX(0)} y2={toSvgY(6)} stroke={theme?.isDark ? "#888888" : "#666666"} strokeWidth="2" />

            {/* Y-axis labels (Aspect icons inside SVG, text abbrev fallback on load failure) */}
            {aspectOrder.map((asp) => {
              const aspValue = aspectsNumeric[asp];
              const needsOutline = theme?.isDark
                ? (asp === 'Doom' || asp === 'Void')
                : (asp === 'Space' || asp === 'Hope' || asp === 'Light');
              const imgFailed = failedAspectImages.has(asp);

              return (
                <g key={`y-label-${asp}`}>
                  {!imgFailed ? (
                    <image
                      href={`./images/aspects/no-bg/${asp.toLowerCase()}.webp`}
                      x={toSvgX(-7) - 34}
                      y={toSvgY(aspValue) - 12}
                      width="24"
                      height="24"
                      style={{
                        filter: needsOutline
                          ? (theme?.isDark
                              ? 'drop-shadow(0 0 2px rgba(255,255,255,0.8))'
                              : 'drop-shadow(0 0 2px rgba(0,0,0,0.8))')
                          : 'none'
                      }}
                      onError={() => setFailedAspectImages(prev => new Set([...prev, asp]))}
                    />
                  ) : (
                    <text
                      x={toSvgX(-7) - 22}
                      y={toSvgY(aspValue) + 4}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="Courier New"
                      fontWeight="bold"
                      fill={theme?.isDark ? "#cccccc" : "#333333"}
                    >
                      {aspectAbbrev[asp]}
                    </text>
                  )}
                </g>
              );
            })}

            {/* X-axis labels (below graph, inside box) */}
            {Object.entries(classesNumeric).map(([cls, val]) => (
              <text
                key={`x-label-${cls}`}
                x={toSvgX(val)}
                y={toSvgY(-6) + 25}
                textAnchor="middle"
                fontSize="11"
                fontFamily="Courier New"
                fontWeight="bold"
                fill={theme?.isDark ? "#cccccc" : "#333333"}
              >
                {classAbbrev[cls]}
              </text>
            ))}

            {/* Original classpect vector */}
            <line
              x1={toSvgX(0)}
              y1={toSvgY(0)}
              x2={toSvgX(x)}
              y2={toSvgY(y)}
              stroke={theme?.isDark ? aspectColorsDark[aspectName] : aspectColors[aspectName]}
              strokeWidth="3"
            />
            <circle
              cx={toSvgX(x)}
              cy={toSvgY(y)}
              r="6"
              fill={theme?.isDark ? aspectColorsDark[aspectName] : aspectColors[aspectName]}
              stroke="black"
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => handleMouseEnter(`${className} of ${aspectName}`, e)}
              onMouseLeave={() => setHoveredPoint(null)}
              onClick={() => onNavigate(`/classpect/${className.toLowerCase()}-of-${aspectName.toLowerCase()}`)}
            />

            {/* Rotations */}
            {showRotations && rotations.map(({ degrees, classpect }) => {
              const [rc, ra] = classpect;
              const rx = classesNumeric[rc];
              const ry = aspectsNumeric[ra];
              return (
                <g key={degrees}>
                  <line
                    x1={toSvgX(0)}
                    y1={toSvgY(0)}
                    x2={toSvgX(rx)}
                    y2={toSvgY(ry)}
                    stroke={theme?.isDark ? aspectColorsDark[ra] : aspectColors[ra]}
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <circle
                    cx={toSvgX(rx)}
                    cy={toSvgY(ry)}
                    r="4"
                    fill={theme?.isDark ? aspectColorsDark[ra] : aspectColors[ra]}
                    stroke="black"
                    strokeWidth="1"
                    opacity="0.7"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => handleMouseEnter(`${rc} of ${ra} (${degrees}°)`, e)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => onNavigate(`/classpect/${rc.toLowerCase()}-of-${ra.toLowerCase()}`)}
                  />
                </g>
              );
            })}

            {/* Reflection */}
            {showReflection && reflection && (() => {
              const [refC, refA] = reflection;
              const refX = classesNumeric[refC];
              const refY = aspectsNumeric[refA];
              return (
                <g key="reflection">
                  <line
                    x1={toSvgX(0)}
                    y1={toSvgY(0)}
                    x2={toSvgX(refX)}
                    y2={toSvgY(refY)}
                    stroke={theme?.isDark ? aspectColorsDark[refA] : aspectColors[refA]}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.6"
                  />
                  <circle
                    cx={toSvgX(refX)}
                    cy={toSvgY(refY)}
                    r="5"
                    fill={theme?.isDark ? aspectColorsDark[refA] : aspectColors[refA]}
                    stroke="black"
                    strokeWidth="1.5"
                    opacity="0.8"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => handleMouseEnter(`${refC} of ${refA} (Rflxn.)`, e)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => onNavigate(`/classpect/${refC.toLowerCase()}-of-${refA.toLowerCase()}`)}
                  />
                </g>
              );
            })()}
          </svg>
        </div>
      )}

      {/* Tooltip on hover */}
      {hoveredPoint && (
        <div style={{
          position: 'fixed',
          left: hoverPosition.x + 'px',
          top: (hoverPosition.y - 40) + 'px',
          backgroundColor: theme?.isDark ? '#1a1a1a' : '#eeeeee',
          border: '1px solid ' + (theme?.isDark ? '#555' : '#ccc'),
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'Courier New',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {hoveredPoint}
        </div>
      )}

      {/* Collapsible list */}
      <div className="mt-3">
        <button
          onClick={() => setShowList(!showList)}
          className="text-sm underline"
          style={{fontFamily: 'Verdana', fontWeight: 'bold', color: theme?.isDark ? "#6dd1f4" : "#0000ee", minHeight: '44px'}}
        >
          {showList ? "∨ Hide rotations and reflections list." : "> Show all rotations and reflections."}
        </button>
      </div>

      {showList && (
        <div className="mt-2 text-sm font-courier" style={{color: theme?.isDark ? "#6dd1f4" : "#0000ee"}}>
          {rotations.map(({ degrees, classpect }) => {
            const [c, a] = classpect;
            const total = totalValue(c, a);
            return (
              <div key={degrees} style={{marginBottom: '2px'}}>
                <button
                  onClick={() => onNavigate(`/classpect/${c.toLowerCase()}-of-${a.toLowerCase()}`)}
                  className="underline"
                  style={{color: 'inherit'}}
                >
                  {c} of {a}
                </button>
                {' '}
                <span style={{color: theme?.isDark ? "#cccccc" : "#333333"}}>
                  ({total>=0?'+':''}{total}) ({degrees}°)
                </span>
              </div>
            );
          })}
          {reflection && (
            <div style={{marginBottom: '2px'}}>
              <button
                onClick={() => onNavigate(`/classpect/${reflection[0].toLowerCase()}-of-${reflection[1].toLowerCase()}`)}
                className="underline"
                style={{color: 'inherit'}}
              >
                {reflection[0]} of {reflection[1]}
              </button>
              {' '}
              <span style={{color: theme?.isDark ? "#cccccc" : "#333333"}}>
                ({totalValue(reflection[0], reflection[1])>=0?'+':''}{totalValue(reflection[0], reflection[1])}) (Rflxn.)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};