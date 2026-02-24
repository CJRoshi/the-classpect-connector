/* =========================
   SHARED HEADER COMPONENT
   Include this file in any page that needs a header
   Usage: <script src="./components/header.js"></script>
   ========================= */

const Header = ({ onNavigate, theme }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleHomeClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    // Detect if we're in a subdirectory
    const isInSubdirectory = window.location.pathname.includes('/tag/') ||
                             window.location.pathname.split('/').filter(p => p).length > 1;

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

  // Detect if we're in subdirectory for relative paths
  const isInSubdirectory = window.location.pathname.includes('/tag/') ||
                           window.location.pathname.split('/').filter(p => p).length > 1;
  const pathPrefix = isInSubdirectory ? '../' : './';

  // Choose logo based on theme and current location
  const getLogo = () => {
    // Detect if we're in a subdirectory (like /tag/)
    const isInSubdirectory = window.location.pathname.includes('/tag/') ||
                             window.location.pathname.split('/').filter(p => p).length > 1;
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

  const navLinks = [
    { label: 'Home', href: '#/', isHome: true },
    { label: 'About', href: pathPrefix + 'about.html' },
    { label: 'FAQ', href: pathPrefix + 'faq.html' },
    { label: 'Theory', href: pathPrefix + 'theory.html' },
    { label: 'Credits', href: pathPrefix + 'credits.html' },
  ];

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
            onClick={handleHomeClick}
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
          <a
            href="https://www.fruityrumpus.com/forums/t/classpecting-with-graphs-rotations-and-groups"
            target="_blank"
            rel="noopener noreferrer"
            className="font-typostuck px-3 py-2 rounded hover:opacity-80"
            style={frafStyle}
          >
            FRAFpost
          </a>
        </div>

        {/* Hamburger Button — wrapper div controls visibility; inline display on button must not be overridden */}
        <div className="md:hidden" style={{flexShrink: 0}}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            style={{
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
            }}
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
    </div>
  );
};
