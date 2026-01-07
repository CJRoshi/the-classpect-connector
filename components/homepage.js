/* =========================
   HOMEPAGE COMPONENT
   Main landing page showing all classes and aspects
   Requires: constants.js (classesNumeric, aspectsNumeric)
   Requires: links.js (ClassLink, AspectLink)
   ========================= */

const Homepage = ({ onNavigate, theme }) => {
  const classes = Object.keys(classesNumeric);
  
  // Force order of activity rather than wheel order
  const aspectWheelOrder = [
    'Space',    // Top (12 o'clock)
    'Void',     // 11 o'clock
    'Doom',     // 10 o'clock
    'Heart',    // 9 o'clock
    'Blood',     // 8 o'clock
    'Time',    // 7 o'clock
    'Rage',     // 6 o'clock (bottom)
    'Breath',    // 5 o'clock
    'Mind',     // 4 o'clock
    'Life',   // 3 o'clock
    'Light',     // 2 o'clock
    'Hope'      // 1 o'clock
  ];

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="text-center mb-8">
        <h1 className="font-verdana-title mb-2">The Classpect Connector</h1>
        <p className="font-verdana-subtitle opacity-80">
          A web-based tool for searching numerically and/or geometrically related classpects.
        </p>
      </div>

      {/* Classes and Aspects Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Classes */}
        <div>
          <h2 className="font-verdana mb-4" style={{fontSize: "1.5rem"}}>
            All Classes
          </h2>
          <div className="space-y-2">
            {classes.map(cls => (
              <div key={cls} className="flex items-center gap-2">
                <span className="font-courier" style={{color: theme?.textColor || '#000'}}>{'>'}</span>
                <ClassLink c={cls} onClick={onNavigate} theme={theme} />
              </div>
            ))}
          </div>
        </div>

        {/* Aspects */}
        <div>
          <h2 className="font-verdana mb-4" style={{fontSize: "1.5rem"}}>
            All Aspects
          </h2>
          <div className="space-y-2">
            {aspectWheelOrder.map(asp => (
              <div key={asp} className="flex items-center gap-2">
                <span className="font-courier" style={{color: theme?.textColor || '#000'}}>{'>'}</span>
                <AspectLink a={asp} onClick={onNavigate} theme={theme} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prospit and Derse Links */}
      <div className="mt-8 pt-6 border-t-2" style={{borderColor: theme?.accentBg || '#a0a0a0'}}>
        <h2 className="font-typostuck mb-4 text-center" style={{fontSize: "1.5rem"}}>
          {'>'} Lunar Sway
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center">
            <a
              href="./prospit.html"
              className="font-typostuck hover:underline inline-block"
              style={{color: '#d69500', fontSize: '2rem'}}
            >
              Prospit
            </a>
          </div>
          <div className="text-center">
            <a
              href="./derse.html"
              className="font-typostuck hover:underline inline-block"
              style={{color: '#9954cf', fontSize: '2rem'}}
            >
              Derse
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};