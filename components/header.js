/* =========================
   SHARED HEADER COMPONENT
   Include this file in any page that needs a header
   Usage: <script src="./components/header.js"></script>
   ========================= */

/* ----- Pesterchum-style logo-spam easter egg ----- */
const PESTER_QUOTES_CANON = [
  { handle: 'ectoBiologist',     color: '#0715cd', quote: 'what are you doing? thats just a logo!' },
  { handle: 'tentacleTherapist', color: '#b536da', quote: 'Snooping as usual, I see?' },
  { handle: 'turntechGodhead',   color: '#e00707', quote: 'bro you cant just click the logo to make it love you' },
  { handle: 'gardenGnostic',     color: '#4ac925', quote: 'hehehehe stoooop! youre going to wear it out!!' },
  { handle: 'carcinoGeneticist', color: '#626262', quote: 'JEGUS. DO YOU KNOW HOW ANNOYING THAT IS?' },
  { handle: 'carcinoGeneticist', color: '#626262', quote: "YOU EVER HEAR THAT JOKE ABOUT WHAT THE BARKBEAST SAID TO THE OTHER BARKBEAST? OH RIGHT, YOU CAN'T HEAR THAT BECAUSE YOU MAKE MORE NOISE THAN TEN OF THOSE THINGS." },
  { handle: 'gallowsCalibrator', color: '#008282', quote: '1M 4LR34DY BL1ND 4ND NOW YOUR3 M4K1NG M3 D34F' },
  { handle: 'arachnidsGrip',     color: '#005682', quote: 'This is so 8oooooooring.' },
  { handle: 'grimAuxiliatrix',   color: '#008141', quote: 'Are You Quite Alright This Behavior Is Disconcerting And Sets Off Several Alarm Notifications' },
  { handle: 'centaursTesticle',  color: '#000056', quote: 'D --> You will cease at once' },
  { handle: 'twinArmageddons',   color: '#a1a100', quote: 'st0p texting me. these pings are l0ud as fuck.' },
  { handle: 'apocalypseArisen',  color: '#a10000', quote: 'haha wow you sure do love that logo' },
  { handle: 'uranianUmbra',      color: '#929292', quote: "oh dear... please don't be too rough with the poor little logo? :U" },
  { handle: 'tipsyGnostalgic',   color: '#ff6ff2', quote: 'lmaoooo wut r u doin stop clickin like that... ur gonna ruin your mouse' },
  { handle: 'timaeusTestified',  color: '#f2a400', quote: 'Is this really the best use of your time? Come on, now.' },
  { handle: 'golgothasTerror',   color: '#1f9400', quote: 'Gadzooks! What has gotten into you old chum?' },
  { handle: 'gutsyGumshoe',      color: '#00d5f2', quote: 'My word, spare some messages for the rest of us!' },
  // Hal (Dirk's AR) — Dave-red text under Dirk's handle.
  { handle: 'timaeusTestified', color: '#e00707', quote: "It seems you're trying to spam my inbox." },
  { handle: 'ideogramicDramaturgy', color: '#bdb49c', quote: '🖕😡💢' },
  { handle: 'crucifiedGnosis', color: '#ff0000', fontSize: '0.68rem',
    quote: "9kay, first 9ff, I'd like t9 issue c9ntent warnings f9r the f9ll9wing: cursing (cens9red), threats 9f vi9lence (redacted), gun 9wnership (pr96lematic), military ide9l9gy, self-aggrandizement, and 9verall unnecessary aggressi9n. What in the actual 9ppress9r-class did you just say a69ut me, y9u pr96lematic-9r-privileged individual? I'll have y9u kn9w that I graduated t9p of my class in c9ntent m9deration, and I've been inv9lved in numer9us secret call-9ut threads. I have 9ver 300 c9nfirmed m9deration rep9rts. I am trained in dec9nstructing pr96lematic language, and I am the t9p sc9lder in the entire dancestor r9ster. Y9u are n9thing t9 me 6ut just an9ther 6ad act9r." },
];
// Beyond-Canon cast — gated behind visited_predictions
const PESTER_QUOTES_BC = [
  // Ly'lac - random fuse length
  { handle: 'gavageCunctation',  color: '#8e5594',
    quote: () => 'o' + '-'.repeat(3 + Math.floor(Math.random() * 10)) + '*' },
  { handle: 'tinnitusChakra',    color: '#701dff',
    quote: 'chillax brøski, my inbøx can barely handle yøur tøp-shelf spammø material.' },
  { handle: 'cloisteredConnoisewer', color: '#018e71',
    quote: 'whaddahell who r u??? pretty gud for bbys first spamhex tho' },
  { handle: 'eminentBelladonna', color: '#005682',
    quote: 'Hey, wise guy! Where did you even g8t this handle? I thought I 8locked myself out of all your Sp8m Registry 8ullshit. Good8ye!!!!!!!!' },
  // Swiss just has the bot do it for him.
  { handle: 'testudinesConsort', color: '#9aa4b0',
    quote: 'You were put on timeout in CHA.OS Official. Reason: Being EXTREMELY ROWDY in my personal messages.' },
];
// Pre-scratch Counterquest cast
const PESTER_QUOTES_OC = [
  { handle: 'caprineCappuccino',    color: '#1B7539', quote: 'Lëmë rehat!' },
  { handle: 'fracturedWildfire',    color: '#480C57', quote: '. O Zot i madh. Qetësohu!' },
  { handle: 'achromaticBlockbuster', color: '#999999', quote: "[bluntly] I can't work with all this noise." },
  { handle: 'pestilentStrain',      color: '#2A6648', quote: 'on diraait la cacaaphonieee' },
  { handle: 'rushingEnchain',       color: '#1B39E2', quote: '<puta>---<merda> stop messaging me pfr' },
  { handle: 'aeronauticRockstar',   color: '#A2752A', quote: "Pipe d°⁸°wn °⁸°'er there °⁸°r I'll make ya!" },
  { handle: 'obscuraTelos',         color: '#A24875', quote: 'my head hurtzzz......' },
];

const PESTER_BURST_COUNT     = 8;    // clicks inside window to trigger
const PESTER_BURST_WINDOW_MS = 2000; // window duration (ms)
const PESTER_TOAST_LIFE_MS   = 6000; // how long the toast stays up

// Per-entry IDs.
function taggedPool(pool, prefix) {
  return pool.map((e, i) => ({ ...e, _id: `${prefix}_${i}` }));
}
const PESTER_TAGGED_CANON = taggedPool(PESTER_QUOTES_CANON, 'canon');
const PESTER_TAGGED_BC    = taggedPool(PESTER_QUOTES_BC,    'bc');
const PESTER_TAGGED_OC    = taggedPool(PESTER_QUOTES_OC,    'oc');
// Total across every pool
const PESTER_TOTAL_UNIQUE = PESTER_TAGGED_CANON.length
                          + PESTER_TAGGED_BC.length
                          + PESTER_TAGGED_OC.length;

function pickPesterQuote() {
  let pool = PESTER_TAGGED_CANON;
  try {
    const unlocks = JSON.parse(localStorage.getItem('cc_unlocks') || '[]');
    if (unlocks.includes('visited_predictions')) pool = pool.concat(PESTER_TAGGED_BC);
    if (unlocks.includes('visited_oc_session'))  pool = pool.concat(PESTER_TAGGED_OC);
  } catch {}
  const pick = pool[Math.floor(Math.random() * pool.length)];
  // Resolve function-quotes at pick time
  return typeof pick.quote === 'function'
    ? { ...pick, quote: pick.quote() }
    : pick;
}


const Header = ({ onNavigate, theme }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Pesterchum-toast state 
  const clickTimesRef = React.useRef([]);
  const [pester, setPester] = React.useState(null);
  React.useEffect(() => {
    if (!pester) return;
    const t = setTimeout(() => setPester(null), PESTER_TOAST_LIFE_MS);
    return () => clearTimeout(t);
  }, [pester]);
  

  const handleLogoBurst = () => {
    const path = window.location.pathname;
    const hash = window.location.hash || '';
    const onHome = (path === '/' || path.endsWith('/index.html') || path.endsWith('/'))
                   && (hash === '' || hash === '#' || hash === '#/' || hash.startsWith('#/?'));
    if (!onHome) return;
    const now = Date.now();
    const recent = clickTimesRef.current.filter(t => now - t < PESTER_BURST_WINDOW_MS);
    recent.push(now);
    clickTimesRef.current = recent;
    if (recent.length >= PESTER_BURST_COUNT) {
      const pick = pickPesterQuote();
      setPester(pick);
      clickTimesRef.current = [];
      // First-time trigger writes `logo_spammed` into cc_unlocks
      try {
        const existing = JSON.parse(localStorage.getItem('cc_unlocks') || '[]');
        if (!existing.includes('logo_spammed')) {
          localStorage.setItem('cc_unlocks',
            JSON.stringify([...existing, 'logo_spammed']));
        }
      } catch {}
      // Record which specific pester entry just fired.
      try {
        const seen = JSON.parse(localStorage.getItem('cc_pester_seen') || '[]');
        if (pick._id && !seen.includes(pick._id)) {
          localStorage.setItem('cc_pester_seen',
            JSON.stringify([...seen, pick._id]));
        }
      } catch {}
      try {
        const inSub = window.location.pathname.includes('/tag/');
        const a = new Audio((inSub ? '../' : './') + 'snd/notif.mp3');
        a.volume = 0.7;
        a.play().catch(() => {});
      } catch {}
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    // Detect if we're in a subdirectory
    const isInSubdirectory = window.location.pathname.includes('/tag/');

    // If we're on an external page or in a subdirectory, go to index.html
    if (window.location.pathname.includes('.html') &&
        !window.location.pathname.includes('index.html') &&
        !window.location.pathname.endsWith('/')) {
      window.location.href = isInSubdirectory ? '../index.html' : './index.html';
    } else {
      // On index.html - use React navigation and clear hash
      if (window.location.protocol !== 'file:') {
        window.location.hash = '/';
      }
      if (onNavigate) {
        onNavigate('/');
      }
    }
  };

  // Choose logo based on theme and current location
  const getLogo = () => {
    // Detect if we're in a subdirectory (like /tag/)
    const isInSubdirectory = window.location.pathname.includes('/tag/');
    const pathPrefix = isInSubdirectory ? '../' : './';

    // Use theme logoPath if provided (for custom logos on specific pages)
    if (theme?.logoPath) {
      return theme.logoPath;
    }

    // Force regular logo for specific aspects (empty for now)
    const regularLogoAspects = [];

    // Determine if we're on an aspect/classpect page and which aspect
    const path = window.location.hash || window.location.pathname;
    let currentAspect = null;

    if (path.includes('/aspect/')) {
      const aspectSlug = path.split('/aspect/')[1]?.replace('#', '');
      currentAspect = Object.keys(aspectsNumeric || {}).find(a => a.toLowerCase() === aspectSlug);
    } else if (path.includes('/classpect/')) {
      const parts = path.split('/classpect/')[1]?.split('-of-');
      if (parts && parts[1]) {
        const aspectSlug = parts[1].replace('#', '');
        currentAspect = Object.keys(aspectsNumeric || {}).find(a => a.toLowerCase() === aspectSlug);
      }
    }

    // Use regular logo for bright aspects
    if (currentAspect && regularLogoAspects.includes(currentAspect)) {
      return pathPrefix + 'images/special/CCLogoRegular.png';
    }

    // Otherwise use dark/light based on theme
    if (theme?.isDark) {
      return pathPrefix + 'images/special/CCLogoLight.png';
    } else {
      return pathPrefix + 'images/special/CCLogoDark.png';
    }
  };

  // Detect if we're in subdirectory for relative paths
  const isInSubdirectory = window.location.pathname.includes('/tag/');
  const pathPrefix = isInSubdirectory ? '../' : './';

  // Shared styles
  const navLinkStyle = {
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: theme?.textColor || '#000',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '4px',
  };

  const frafStyle = {
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#00e371',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '4px',
  };

  /* Scryer pill. */
  const scryStyle = {
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#6dd1f4',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '4px',
  };

  const navLinks = [
    { label: 'Home', href: '#/', isHome: true },
    { label: 'About', href: pathPrefix + 'about.html' },
    { label: 'FAQ', href: pathPrefix + 'faq.html' },
    { label: 'Theory', href: pathPrefix + 'theory.html' },
    { label: 'Rungs', href: pathPrefix + 'rungs.html' },
    { label: 'Credits', href: pathPrefix + 'credits.html' },
  ];

  // Settings lives outside navLinks.
  const settingsHref = pathPrefix + 'settings.html';
  const gearButtonStyle = {
    background: 'rgba(0,0,0,0.25)',
    border: 'none',
    borderRadius: '6px',
    padding: '0',
    cursor: 'pointer',
    color: theme?.textColor || '#000',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    flexShrink: 0,
  };
  const gearIconSvg = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61
               l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41
               h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87
               C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58
               c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54
               c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96
               c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6
               s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
    </svg>
  );

  return (
    <div style={{
      backgroundColor: theme?.headerBg || theme?.accentBg || '#a0a0a0',
      padding: '12px 16px',
      marginBottom: '16px',
      border: `2px solid ${theme?.accentBg || '#999'}`,
      position: 'relative',
      zIndex: 10
    }}>
      {/* Top bar: logo + title + hamburger / desktop nav */}
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3" style={{minWidth: 0}}>
          <a
            href="#/"
            onClick={(e) => { handleHomeClick(e); handleLogoBurst(); }}
            style={{cursor: 'pointer', flexShrink: 0}}
          >
            <img
              src={getLogo()}
              alt="Classpect Connector Logo"
              style={{width: '40px', height: '40px'}}
            />
          </a>
          <a
            href="#/"
            onClick={handleHomeClick}
            className="font-typostuck-header"
            style={{
              color: theme?.textColor || '#000',
              textDecoration: 'none',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            The Classpect Connector
          </a>
        </div>

        {/* Desktop Navigation — hidden on mobile */}
        <div className="hidden md:flex gap-3 items-center" style={{flexShrink: 0}}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={link.isHome ? handleHomeClick : undefined}
              className="font-typostuck px-3 py-2 rounded hover:opacity-80"
              style={navLinkStyle}
            >
              {link.label}
            </a>
          ))}
          {/* Scryer link. */}
          <a
            href="https://cjroshi.github.io/the-session-scryer/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-typostuck px-3 py-2 rounded hover:opacity-80"
            style={scryStyle}
          >
            Scryer
          </a>
          <a
            href="https://www.fruityrumpus.com/forums/t/classpecting-with-graphs-rotations-and-groups"
            target="_blank"
            rel="noopener noreferrer"
            className="font-typostuck px-3 py-2 rounded hover:opacity-80"
            style={frafStyle}
          >
            FRAFpost
          </a>
          {/* Settings gear. */}
          <a
            href={settingsHref}
            aria-label="Settings"
            title="Settings"
            style={gearButtonStyle}
            className="hover:opacity-80"
          >
            {gearIconSvg}
          </a>
        </div>

        {/* Mobile: gear + hamburger side by side. */}
        <div className="md:hidden" style={{flexShrink: 0}}>
          <div style={{display: 'flex', gap: '6px'}}>
            <a
              href={settingsHref}
              aria-label="Settings"
              title="Settings"
              style={gearButtonStyle}
              className="hover:opacity-80"
            >
              {gearIconSvg}
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              style={gearButtonStyle}
            >
              {menuOpen ? (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: `1px solid rgba(0,0,0,0.25)`,
            marginTop: '10px',
            paddingTop: '8px',
          }}
        >
          <div className="flex flex-col gap-1 max-w-6xl mx-auto">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMenuOpen(false);
                  if (link.isHome) handleHomeClick(e);
                }}
                className="font-typostuck rounded hover:opacity-80"
                style={{
                  ...navLinkStyle,
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '44px',
                  padding: '0 16px',
                  fontSize: '1.1rem',
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://cjroshi.github.io/the-session-scryer/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="font-typostuck rounded hover:opacity-80"
              style={{
                ...scryStyle,
                display: 'flex',
                alignItems: 'center',
                minHeight: '44px',
                padding: '0 16px',
                fontSize: '1.1rem',
              }}
            >
              Scryer ↗
            </a>
            <a
              href="https://www.fruityrumpus.com/forums/t/classpecting-with-graphs-rotations-and-groups"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="font-typostuck rounded hover:opacity-80"
              style={{
                ...frafStyle,
                display: 'flex',
                alignItems: 'center',
                minHeight: '44px',
                padding: '0 16px',
                fontSize: '1.1rem',
              }}
            >
              FRAFpost ↗
            </a>
          </div>
        </div>
      )}
      {/* Pesterchum-style toast. */}
      {pester && (
        <div
          onClick={() => setPester(null)}
          style={{
            position: 'fixed',
            right: '18px',
            bottom: '18px',
            zIndex: 9999,
            maxWidth: '280px',
            background: '#f0f0f0',
            border: '1px solid #4a4a4a',
            borderRadius: '2px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
            fontFamily: "'Courier New', monospace",
            cursor: 'pointer',
            animation: 'pester-slide-in 0.22s ease-out',
          }}
        >
          {/* Title bar — glowing status dot + chumhandle, both in
              the character's color. */}
          <div style={{
            background: '#2c2c2c',
            padding: '5px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #4a4a4a',
            gap: '8px',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
              <span style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: pester.color,
                boxShadow: `0 0 6px ${pester.color}`,
                flexShrink: 0,
              }}/>
              <span style={{
                color: pester.color,
                fontSize: '0.85rem',
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {pester.handle}
              </span>
            </span>
            <span style={{ color: '#999', fontSize: '0.85rem', flexShrink: 0 }}>×</span>
          </div>
          {/* Body — the raw quote, no username prefix. */}
          <div style={{
            padding: '10px 12px',
            color: pester.color,
            fontSize: pester.fontSize || '0.88rem',
            lineHeight: 1.35,
            wordBreak: 'break-word',
          }}>
            {pester.quote}
          </div>
        </div>
      )}
      {/* Keyframes for the toast slide-in. */}
      <style>{`
        @keyframes pester-slide-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};
