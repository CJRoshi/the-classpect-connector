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
  const [showList, setShowList] = useState(false);

  const x = classesNumeric[className];
  const y = aspectsNumeric[aspectName];

  const scale = 30;
  const centerX = 250;
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

  return (
    <div className="p-4 rounded" style={{backgroundColor: theme?.isDark ? "#2a2a2a" : "#f9fafb", position: 'relative', zIndex: 1}}>
      <div className="flex gap-4 mb-2">
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
      </div>

      {/* Center the graph */}
      <div>
        <svg width="550" height="430" className="border border-gray-300" style={{backgroundColor: theme?.isDark ? '#0d0d0d' : '#e8e8e8', display: 'block', margin: '0 auto'}}>
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

          {/* Y-axis labels (Aspect icons inside SVG) */}
          {aspectOrder.map((asp) => {
            const aspValue = aspectsNumeric[asp];
            const needsOutline = theme?.isDark 
              ? (asp === 'Doom' || asp === 'Void')
              : (asp === 'Space' || asp === 'Hope' || asp === 'Light');
            
            return (
              <image
                key={`y-label-${asp}`}
                href={`./images/aspects/no-bg/${asp.toLowerCase()}.webp`}
                x={toSvgX(7) + 10}
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
              />
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

      {/* Tooltip on hover - positioned outside graph container with viewport coordinates */}
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

      {/* Collapsible list - Verdana for arrow and label, Courier for list */}
      <div className="mt-3">
        <button
          onClick={() => setShowList(!showList)}
          className="text-sm underline"
          style={{fontFamily: 'Verdana', fontWeight: 'bold', color: theme?.isDark ? "#6dd1f4" : "#0000ee"}}
        >
          {showList ? "∨" : ">"} Show all rotations and reflections.
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