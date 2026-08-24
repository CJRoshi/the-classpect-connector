/* =========================
   LINK COMPONENTS
   Clickable navigation links for classes, aspects, and classpects.
   Requires: constants.js (aspectColors, aspectColorsDark)
   Requires: utility-functions.js (totalValue)

   Icon conventions (post-Hussie-class-symbol migration):
     ClassLink   — text + class icon (with-bg variant, gray tone).
                     showIcon=false suppresses the icon (used when the
                     surrounding layout supplies its own icon cluster,
                     e.g. the Classpect page header).
     AspectLink  — text + aspect icon (with-bg variant, aspect color).
                     showIcon=false same use case as ClassLink.
     ClasspectLink — text only by default. Pass
                     icons=true to append [class icon][aspect icon]
                     after the text, matching preferred
                     "[Class] of [Aspect] [class icon] [aspect icon]"
                     ordering.
   ========================= */

// Asset path helpers — one place to change if the asset layout ever moves.
const _classBgIconPath  = (c, base='./') => `${base}images/classes/bg/${c.toLowerCase()}.svg`;
const _aspectBgIconPath = (a, base='./') => `${base}images/aspects/with-bg/${a.toLowerCase()}bg.svg`;


const ClasspectLink = ({c, a, onClick, theme, icons = false}) => {
  const linkColor  = theme?.isDark ? "#6dd1f4" : "#0000ee";
  const hoverColor = theme?.isDark ? "#9ee4ff" : "#0000ff";

  // Polarity — sitewide sign convention.
  const [polarity, setPolarity] = React.useState(() => Settings.get('polarityMode'));
  React.useEffect(() => {
    const onChange = (ev) => {
      if (ev.detail?.name === 'polarityMode') setPolarity(Settings.get('polarityMode'));
    };
    window.addEventListener('cc-setting-change', onChange);
    return () => window.removeEventListener('cc-setting-change', onChange);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    onClick(`/classpect/${c.toLowerCase()}-of-${a.toLowerCase()}`);
  };

  // preferred structure when icons enabled:
  //   [Class] of [Aspect] [class icon] [aspect icon] (+N)
  return (
    <a
      href={`#/classpect/${c.toLowerCase()}-of-${a.toLowerCase()}`}
      className="font-courier-bold hover:underline transition-colors"
      style={{
        color: linkColor,
        textDecoration: 'none',
        display: icons ? 'inline-flex' : 'inline',
        alignItems: icons ? 'center' : undefined,
        gap: icons ? '0.35rem' : undefined,
      }}
      onClick={handleClick}
      onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
      onMouseLeave={(e) => e.currentTarget.style.color = linkColor}
    >
      <span>{c} of {a}</span>
      {icons && (
        <>
          <img
            src={_classBgIconPath(c)}
            alt=""
            style={{width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle'}}
            onError={(e) => e.target.style.display = 'none'}
          />
          <img
            src={_aspectBgIconPath(a)}
            alt=""
            style={{width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle'}}
            onError={(e) => e.target.style.display = 'none'}
          />
        </>
      )}
      <span> ({polarityValueString(totalValue(c, a), polarity)})</span>
    </a>
  );
};


const ClassLink = ({c, onClick, theme, isTitle, showIcon = true}) => {
  const linkColor  = theme?.isDark ? "#ffffff" : "#000000";
  const hoverColor = theme?.isDark ? "#6dd1f4" : "#0000ee";
  const iconSize   = isTitle ? "40px" : "20px";

  const handleClick = (e) => {
    e.preventDefault();
    onClick(`/class/${c.toLowerCase()}`);
  };

  return (
    <a
      href={`#/class/${c.toLowerCase()}`}
      className={isTitle
        ? "font-typostuck-title hover:underline transition-colors"
        : "font-typostuck hover:underline transition-colors"}
      style={{
        color: linkColor,
        textDecoration: 'none',
        display: showIcon ? 'inline-flex' : 'inline',
        alignItems: showIcon ? 'center' : undefined,
        gap: showIcon ? '0.5rem' : undefined,
      }}
      onClick={handleClick}
      onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
      onMouseLeave={(e) => e.currentTarget.style.color = linkColor}
    >
      <span>{c}</span>
      {showIcon && (
        <img
          src={_classBgIconPath(c)}
          alt=""
          style={{width: iconSize, height: iconSize, display: 'inline-block', verticalAlign: 'middle'}}
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
    </a>
  );
};


const AspectLink = ({a, onClick, theme, isTitle, showIcon = true}) => {
  const linkColor = theme?.aspectLinkColor === "dark" ? aspectColorsDark[a] : aspectColors[a];
  const iconSize  = isTitle ? "40px" : "20px";

  const handleClick = (e) => {
    e.preventDefault();
    onClick(`/aspect/${a.toLowerCase()}`);
  };

  return (
    <a
      href={`#/aspect/${a.toLowerCase()}`}
      className={isTitle ? "font-typostuck-title hover:underline" : "font-typostuck hover:underline"}
      onClick={handleClick}
      style={{
        color: linkColor,
        display: showIcon ? 'inline-flex' : 'inline',
        alignItems: showIcon ? 'center' : undefined,
        gap: showIcon ? '0.5rem' : undefined,
        textDecoration: 'none',
      }}
    >
      <span>{a}</span>
      {showIcon && (
        <img
          src={_aspectBgIconPath(a)}
          alt=""
          style={{width: iconSize, height: iconSize, display: 'inline-block', verticalAlign: 'middle'}}
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
    </a>
  );
};