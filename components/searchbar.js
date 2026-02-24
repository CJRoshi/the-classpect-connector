/* =========================
   SHARED SEARCHBAR COMPONENT
   Include this file in any page that needs a searchbar
   Usage: <script src="./components/searchbar.js"></script>
   Requires: classesNumeric, aspectsNumeric constants to be defined
   ========================= */

const SearchBar = ({ onNavigate, theme }) => {
  const [searchText, setSearchText] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const searchRef = React.useRef(null);

  // Generate all searchable pages
  const getAllPages = () => {
    const pages = [];
    
    // Add classes
    Object.keys(classesNumeric).forEach(cls => {
      pages.push({
        type: 'class',
        display: cls,
        path: `/class/${cls.toLowerCase()}`,
        searchTerms: [cls.toLowerCase()],
        isExternal: false
      });
    });
    
    // Add aspects
    Object.keys(aspectsNumeric).forEach(asp => {
      pages.push({
        type: 'aspect',
        display: asp,
        path: `/aspect/${asp.toLowerCase()}`,
        searchTerms: [asp.toLowerCase()],
        isExternal: false
      });
    });
    
    // Add classpects
    Object.keys(classesNumeric).forEach(cls => {
      Object.keys(aspectsNumeric).forEach(asp => {
        const display = `${cls} of ${asp}`;
        const path = `/classpect/${cls.toLowerCase()}-of-${asp.toLowerCase()}`;
        pages.push({
          type: 'classpect',
          display,
          path,
          searchTerms: [
            display.toLowerCase(),
            `${cls.toLowerCase()} of ${asp.toLowerCase()}`,
            `${cls.toLowerCase()}of${asp.toLowerCase()}`,
            `${cls.toLowerCase()} ${asp.toLowerCase()}`
          ],
          isExternal: false
        });
      });
    });
    
    // Add special pages (external HTML files)
    pages.push({
      type: 'special',
      display: 'Prospit',
      path: './prospit.html',
      searchTerms: ['prospit'],
      isExternal: true
    });
    pages.push({
      type: 'special',
      display: 'Derse',
      path: './derse.html',
      searchTerms: ['derse'],
      isExternal: true
    });
    pages.push({
      type: 'special',
      display: 'Canon Characters',
      path: './canon.html',
      searchTerms: ['canon', 'characters', 'canon characters'],
      isExternal: true
    });
    
    // Add tag pages
    pages.push({
      type: 'tag',
      display: 'Cherubs',
      path: './tag/cherubs.html',
      searchTerms: ['cherubs', 'earth c', 'earthc', 'earth-c', 'caliborn', 'calliope'],
      isExternal: true
    });
    pages.push({
      type: 'tag',
      display: 'SBURB Beta',
      path: './tag/sburb-beta.html',
      searchTerms: ['sburb beta', 'sburbbeta', 'sburb-beta', 'beta kids', 'betakids', 'beta session', 'earth a', 'eartha', 'earth-a'],
      isExternal: true
    });
    pages.push({
      type: 'tag',
      display: 'SBURB Alpha',
      path: './tag/sburb-alpha.html',
      searchTerms: ['sburb alpha', 'sburbalpha', 'sburb-alpha', 'alpha kids', 'alphakids', 'alpha session', 'earth b', 'earthb', 'earth-b'],
      isExternal: true
    });
    pages.push({
      type: 'tag',
      display: 'SGRUB Beta',
      path: './tag/sgrub-beta.html',
      searchTerms: ['sgrub beta', 'sgrubbeta', 'sgrub-beta', 'beta trolls', 'betatrolls', 'alternian trolls'],
      isExternal: true
    });
    pages.push({
      type: 'tag',
      display: 'SGRUB Alpha',
      path: './tag/sgrub-alpha.html',
      searchTerms: ['sgrub alpha', 'sgrubalpha', 'sgrub-alpha', 'alpha trolls', 'alphatrolls', 'beforan trolls', 'dancestors'],
      isExternal: true
    });
    pages.push({
      type: 'tag',
      display: 'Homestuck',
      path: './tag/homestuck.html',
      searchTerms: ['homestuck', 'hs', 'hs1'],
      isExternal: true
    });
    pages.push({
      type: 'tag',
      display: 'Beyond Canon',
      path: './tag/beyond-canon.html',
      searchTerms: ['beyond canon', 'beyondcanon', 'beyond-canon', 'epilogues', 'meat', 'candy', 'the prince', 'the muse'],
      isExternal: true
    });
    pages.push({
      type: 'tag',
      display: 'Hiveswap & Hauntswitch',
      path: './tag/hiveswap.html',
      searchTerms: ['hiveswap', 'hauntswitch'],
      isExternal: true
    });
    pages.push({
      type: 'tag',
      display: 'Balanced Classpects',
      path: './balanced.html',
      searchTerms: ['balanced', 'balance', 'zero value', 'zero-sum', 'zero sum'],
      isExternal: true
    });
    pages.push({
      type: 'tag',
      display: 'Symmetric Classpects',
      path: './symmetric.html',
      searchTerms: ['symmetric', 'symmetry', 'extreme'],
      isExternal: true
    });
    
    return pages;
  };

  const allPages = React.useMemo(() => getAllPages(), []);

  // Secret redirect pages definition
  const secretRedirects = [
    {
      searchTerms: ['mutt of slop', 'dog of oil', 'muttofslop', 'dogofoil'],
      url: 'https://youtu.be/EUELs5Uzn3I?si=Um6uBy0XDC3qenal'
    },
    {
      searchTerms: ['waste of space', 'huss of lips', 'wasteofspace', 'hussoflips'],
      url: () => {
        // Random choice between two URLs -- Homoerotic interest in viewer OR Hussie barging in and interrupting Doc Scratch
        const urls = [
          'https://homestuck.com/problemsleuth/000458',
          'https://homestuck.com/005973'
        ];
        return urls[Math.floor(Math.random() * urls.length)];
      }
    },
    {
      searchTerms: ['douche of tears', 'doucheoftears'],
      url: 'https://homestuck.com/001951'
    },
    {
      searchTerms: ['gent of piss', 'gentofpiss'],
      url: 'https://homestuck.com/005854'
    },
    {
      searchTerms: ['trash of time', 'trashoftime'],
      url: 'https://deltarune.com/'
    },
    {
      searchTerms: ['nic of time', 'nick of time', 'nicoftime', 'nickoftime'],
      url: 'https://www.homestuck.com/004687'
    },
    {
      searchTerms: ['champion of pulchritude', 'championofpulchritude'],
      url: 'https://homestuck.com/problemsleuth/001760'
    },
    {
      searchTerms: ['nogue of noid', 'gent of time', 'nogueofnoid', 'gentoftime'],
      url: () => {
        // Random choice between two URLs -- The first page of Noxyquest or Nascade
        const urls2 = [
          'https://youtu.be/jeQWXKajnxw?si=8GTjEzO4HhPXiMcA',
          'https://mspfa.com/?s=65765&p=1'
        ];
        return urls2[Math.floor(Math.random() * urls2.length)];
      }
    },
    {
      searchTerms: ['email of equius', 'emailofequius'],
      url: './email-of-equius.html'
    },
    {
      searchTerms: ['dave of guy', 'daveofguy'],
      url: "./index.html#/classpect/knight-of-time"
    },
    {
      searchTerms: ['son of god', 'sonofgod', 'seer of any', 'seerofany', 'seer of all', 'seerofall', 'christ of jesus', 'christofjesus', 'jesus of christ', 'jesusofchrist', 'lord of lords', 'lordoflords'],
      url: "https://youtu.be/GTh5J0HsIAg?si=gpAQLAj0UMtSq-md" // Several euphemisms for "Jesus" redirecting to that video of Morshu reading the whole Bible
    },
    {
      searchTerms: ['mybcmetas'],
      url: './tag/predictions.html'
    },
    {
      searchTerms: ['myocdonotsteal', 'stera', 'stera2', 'sterahalf', 'loredump', 'counterquest', 'cqc'],
      url: './tag/oc-session.html'
    }
  ];

  // Detect if we're on an external page or in a subdirectory
  const isExternalPage = window.location.pathname.includes('prospit.html') || 
                         window.location.pathname.includes('derse.html') ||
                         window.location.pathname.includes('canon.html') ||
                         window.location.pathname.includes('about.html') ||
                         window.location.pathname.includes('balanced.html') ||
                         window.location.pathname.includes('symmetric.html') ||
                         window.location.pathname.includes('predictions.html') ||
                         window.location.pathname.includes('oc-session.html') ||
                         window.location.pathname.includes('/tag/');
                         
  const isInSubdirectory = window.location.pathname.includes('/tag/');
  const pathPrefix = isInSubdirectory ? '../' : './';

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    
    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Find matching pages
    const searchLower = value.toLowerCase().trim();
    const matches = allPages.filter(page =>
      page.searchTerms.some(term => term.includes(searchLower))
    ).slice(0, 10); // Limit to 10 suggestions
    
    setSuggestions(matches);
    setShowSuggestions(true);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e?.preventDefault();
    
    if (searchText.trim().length === 0) {
      if (isExternalPage) {
        window.location.href = pathPrefix + 'index.html';
      } else {
        onNavigate('/');
      }
      setShowSuggestions(false);
      return;
    }
    
    // Check for secret redirects first
    const searchLower = searchText.toLowerCase().trim();
    const secretMatch = secretRedirects.find(redirect =>
      redirect.searchTerms.some(term => term === searchLower || term.replace(/\s+/g, '') === searchLower.replace(/\s+/g, ''))
    );
    
    if (secretMatch) {
      let url = typeof secretMatch.url === 'function' ? secretMatch.url() : secretMatch.url;
      // Fix relative paths when in a subdirectory
      if (isInSubdirectory && url.startsWith('./')) {
        url = '../' + url.slice(2);
      }
      window.location.href = url;
      setSearchText('');
      setShowSuggestions(false);
      return;
    }
    
    // Try to find best match in regular pages
    const exactMatch = allPages.find(page =>
      page.searchTerms.some(term => term === searchLower)
    );
    
    if (exactMatch) {
      if (exactMatch.isExternal) {
        window.location.href = isInSubdirectory ? '../' + exactMatch.path.replace('./', '') : exactMatch.path;
      } else if (isExternalPage) {
        window.location.href = `${pathPrefix}index.html#${exactMatch.path}`;
      } else {
        onNavigate(exactMatch.path);
      }
      setSearchText('');
      setShowSuggestions(false);
    } else if (suggestions.length > 0) {
      // Navigate to first suggestion
      if (suggestions[0].isExternal) {
        window.location.href = isInSubdirectory ? '../' + suggestions[0].path.replace('./', '') : suggestions[0].path;
      } else if (isExternalPage) {
        window.location.href = `${pathPrefix}index.html#${suggestions[0].path}`;
      } else {
        onNavigate(suggestions[0].path);
      }
      setSearchText('');
      setShowSuggestions(false);
    } else {
      // Invalid search, go to homepage
      if (isExternalPage) {
        window.location.href = pathPrefix + 'index.html';
      } else {
        onNavigate('/');
      }
      setSearchText('');
      setShowSuggestions(false);
    }
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = (page) => {
    if (page.isExternal) {
      window.location.href = isInSubdirectory ? '../' + page.path.replace('./', '') : page.path;
    } else if (isExternalPage) {
      window.location.href = `${pathPrefix}index.html#${page.path}`;
    } else {
      onNavigate(page.path);
    }
    setSearchText('');
    setShowSuggestions(false);
  };

  // Handle random page
  const handleRandom = () => {
    // Random from classes, aspects, classpects, prospit, derse
    const randomOptions = [...allPages];
    const random = randomOptions[Math.floor(Math.random() * randomOptions.length)];
    
    if (random.isExternal) {
      window.location.href = isInSubdirectory ? '../' + random.path.replace('./', '') : random.path;
    } else if (isExternalPage) {
      window.location.href = `${pathPrefix}index.html#${random.path}`;
    } else {
      onNavigate(random.path);
    }
  };

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative mb-4">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <div className="flex items-center" style={{
            backgroundColor: theme?.isDark ? '#2a2a2a' : '#f0f0f0',
            borderRadius: '9999px',
            border: `2px solid ${theme?.isDark ? '#555' : '#ccc'}`,
            overflow: 'hidden'
          }}>
            {/* Search icon */}
            <button
              type="submit"
              className="px-3 py-2 hover:opacity-80"
              style={{color: theme?.isDark ? '#aaa' : '#666'}}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            
            {/* Input */}
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder={window.innerWidth < 640 ? "Search classpects..." : "Search classpects, classes, or aspects..."}
              className="flex-1 px-2 py-2 font-courier bg-transparent outline-none"
              style={{color: theme?.textColor || '#000', fontSize: '1rem'}}
            />
            
            {/* Random button */}
            <button
              type="button"
              onClick={handleRandom}
              className="px-3 py-2 hover:opacity-80"
              style={{color: theme?.isDark ? '#aaa' : '#666'}}
              title="Random page"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8" cy="8" r="1" fill="currentColor"/>
                <circle cx="16" cy="8" r="1" fill="currentColor"/>
                <circle cx="8" cy="16" r="1" fill="currentColor"/>
                <circle cx="16" cy="16" r="1" fill="currentColor"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className="absolute z-50 w-full mt-1 rounded shadow-lg"
              style={{
                backgroundColor: theme?.isDark ? '#2a2a2a' : '#fff',
                border: `1px solid ${theme?.isDark ? '#555' : '#ddd'}`,
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              {suggestions.map((page, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSuggestionClick(page)}
                  className="px-4 py-2 cursor-pointer font-courier-bold"
                  style={{
                    color: theme?.textColor || '#000',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme?.isDark ? '#3a3a3a' : '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {page.display}
                  <span className="text-xs ml-2 opacity-60">({page.type})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};