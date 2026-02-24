/* =========================
   ASPECT PAGE COMPONENT
   Individual aspect page showing all classpects for that aspect
   Requires: constants.js, utility-functions.js, links.js, section.js
   ========================= */

const AspectPage = ({aspectName, onNavigate, theme}) => {
  // Collapse the long description on mobile by default
  const isMobileInit = typeof window !== 'undefined' && window.innerWidth < 640;
  const [descOpen, setDescOpen] = React.useState(!isMobileInit);

  // Access global data
  const aspectsData = window.aspectsData || {};
  const characterData = window.characterData || { canon: {}, nonCanon: {} };
  
  // Get Extended Zodiac description
  const ezDescription = aspectsData[aspectName] || "Description not available.";
  
  const value = getAspectValue(aspectName);
  const inverses = aspectInverses[aspectName];
  
  // Get all classpects with this aspect
  const allClasspects = Object.keys(classesNumeric).map(c => [c, aspectName]);
  
  // Get canon examples
  const canonExamples = Object.entries(characterData.canon)
  .filter(([_, data]) => data.classpect[1] === aspectName)
  .map(([name, data]) => ({
    name,
    classpect: data.classpect
  }));
  
  const aspectColor = theme?.aspectLinkColor === "dark" ? aspectColorsDark[aspectName] : aspectColors[aspectName];
  
  return (
    <div className="space-y-6">
      {/* Title with aspect icons */}
      <div className="text-center">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
          <img 
            src={`./images/aspects/with-bg/${aspectName.toLowerCase()}bg.png`} 
            alt={`${aspectName} icon`}
            style={{width: '48px', height: '48px'}}
            onError={(e) => e.target.style.display = 'none'}
          />
          <h1 className="font-typostuck-title" style={{color: aspectColor, fontSize: "3rem"}}>
            {aspectName.toUpperCase()}
          </h1>
          <img 
            src={`./images/aspects/with-bg/${aspectName.toLowerCase()}bg.png`} 
            alt={`${aspectName} icon`}
            style={{width: '48px', height: '48px'}}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
        <p className="font-courier" style={{color: theme?.isDark ? "#cccccc" : "#4b5563"}}>Numeric Value: {value>=0?"+":""}{value}</p>
      </div>
      
      {/* Inversions Table */}
      <div className="p-4 rounded" style={{backgroundColor: theme?.isDark ? "#1a1a1a" : "#ffffff"}}>
        <h2 className={theme?.isDark ? "homestuck-command-dark mb-3 text-center" : "homestuck-command mb-3 text-center"}>Inversions</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
          {[
            ['Pair',      inverses[0]],
            ['Quasipair', inverses[1]],
            ['Antipair',  inverses[2]],
            ['Numeric',   inverses[3]],
          ].map(([label, inv]) => (
            <div key={label} style={{
              padding:'8px 12px',
              border:`1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`,
              borderRadius:'4px',
              background: theme?.isDark ? "rgba(255,255,255,0.04)" : "#f9f9f9"
            }}>
              <div style={{
                color: theme?.isDark ? "#888888" : "#777777",
                fontSize:'0.7rem', fontFamily:'Courier New',
                marginBottom:'3px', textTransform:'uppercase', letterSpacing:'0.06em'
              }}>{label}</div>
              <AspectLink a={inv} onClick={onNavigate} theme={theme}/>
            </div>
          ))}
        </div>
      </div>

      {/* Extended Zodiac Description — collapsible on mobile */}
      <div className="p-4 rounded" style={{backgroundColor: theme?.isDark ? "#1a1a1a" : "#ffffff"}}>
        <button
          onClick={() => setDescOpen(o => !o)}
          style={{
            display:'flex', alignItems:'center', gap:'6px', cursor:'pointer',
            background:'none', border:'none', padding:0, marginBottom: descOpen ? '0.75rem' : 0,
            width:'100%', textAlign:'left'
          }}
        >
          <span className={theme?.isDark ? "homestuck-command-dark" : "homestuck-command"}>
            &gt; Read Extended Zodiac Description.
          </span>
          <span style={{
            fontSize:'0.8rem', color: theme?.isDark ? "#888" : "#666",
            fontFamily:'Courier New', marginLeft:'auto', flexShrink:0
          }}>
            [{descOpen ? 'hide' : 'show'}]
          </span>
        </button>
        {descOpen && (
          <p className="font-courier" style={{color: theme?.isDark ? "#cccccc" : "#000000", whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>
            {ezDescription}
          </p>
        )}
      </div>
      
      {/* Canon Examples */}
      {canonExamples.length > 0 && (
        <div>
          <h2 className={theme?.isDark ? "homestuck-command-dark mb-2" : "homestuck-command mb-2"}>Canon Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            {canonExamples.map(({ name, classpect }) => {
              const [c, a] = classpect;
              return (
                <div key={name} className="font-courier">
                  {name} (<ClasspectLink c={c} a={a} onClick={onNavigate} theme={theme}/>)
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* All Classpects */}
      <div>
        <h2 className={theme?.isDark ? "homestuck-command-dark mb-3" : "homestuck-command mb-3"}>All {aspectName}bound</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {allClasspects.map(([c,a]) => (
            <div key={`${c}-${a}`}>
              <ClasspectLink c={c} a={a} onClick={onNavigate} theme={theme}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};