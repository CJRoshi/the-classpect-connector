/* =========================
   SHARED HEADER COMPONENT
   Include this file in any page that needs a header
   Usage: <script src="./components/header.js"></script>
   ========================= */

const Header = ({ onNavigate, theme }) => {
  const handleHomeClick = (e) => {
    e.preventDefault();
    // If we're on an external page (prospit.html, derse.html), go to index.html
    if (window.location.pathname.includes('prospit.html') || 
        window.location.pathname.includes('derse.html') ||
        window.location.pathname.includes('about.html')) {
      window.location.href = './index.html';
    } else {
      // On index.html - use React navigation and clear hash
      if (window.location.protocol !== 'file:') {
        window.location.hash = '/';
      }
      onNavigate('/');
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    window.location.href = './about.html';
  };

  // Choose logo based on theme
  const getLogo = () => {
    // Force regular logo for specific aspects
    const regularLogoAspects = ['Void', 'Doom', 'Rage'];
    
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
    
    // Use regular logo for specific aspects
    if (currentAspect && regularLogoAspects.includes(currentAspect)) {
      return './images/special/CCLogoRegular.png';
    }
    
    // Otherwise use dark/light based on theme
    if (theme?.isDark) {
      return './images/special/CCLogoLight.png';
    } else {
      return './images/special/CCLogoDark.png';
    }
  };

  return (
    <div style={{
      backgroundColor: theme?.headerBg || theme?.accentBg || '#a0a0a0',
      padding: '12px 24px',
      marginBottom: '16px',
      border: `2px solid ${theme?.accentBg || '#999'}`,
      position: 'relative',
      zIndex: 10
    }}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <img 
            src={getLogo()} 
            alt="Classpect Connector Logo" 
            style={{width: '48px', height: '48px'}}
          />
          <a 
            href="#/"
            onClick={handleHomeClick}
            className="font-typostuck-header"
            style={{color: theme?.textColor || '#000', textDecoration: 'none', cursor: 'pointer'}}
          >
            The Classpect Connector
          </a>
        </div>
        
        {/* Right: Buttons */}
        <div className="flex gap-4">
          <a
            href="#/"
            onClick={handleHomeClick}
            className="font-typostuck px-4 py-2 rounded hover:opacity-80"
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              color: theme?.textColor || '#000',
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            Home
          </a>
          <a
            href="./about.html"
            onClick={handleAboutClick}
            className="font-typostuck px-4 py-2 rounded hover:opacity-80"
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              color: theme?.textColor || '#000',
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            About
          </a>
        </div>
      </div>
    </div>
  );
};
