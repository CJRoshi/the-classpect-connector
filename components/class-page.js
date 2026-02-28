/* =========================
   CLASS PAGE COMPONENT
   Individual class page showing all classpects for that class
   Requires: constants.js, utility-functions.js, links.js, section.js
   ========================= */

const ClassPage = ({className, onNavigate, theme}) => {
  // Access global data
  const characterData = window.characterData || { canon: {}, nonCanon: {} };
  const classesData = window.classesData || {};
  
  const value = getClassValue(className);
  const inverses = classInverses[className];
  
  // Get all classpects with this class
  const allClasspects = Object.keys(aspectsNumeric).map(a => [className, a]);
  
  // Get canon examples — exclude unlockable-only characters (no regular reaction)
  // so they don't appear as duplicates before being discovered on classpect pages
  const canonExamples = Object.entries(characterData.canon)
  .filter(([_, data]) => data.classpect[0] === className && data.reaction && data.reaction.length > 0)
  .map(([name, data]) => ({
    name,
    classpect: data.classpect
  }));
  
  // Get class-specific data
  const classInfo = classesData[className] || { blurb: '', links: [] };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-typostuck-title mb-2" style={{fontSize: "3rem"}}>{className}</h1>
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
              <ClassLink c={inv} onClick={onNavigate} theme={theme}/>
            </div>
          ))}
        </div>
      </div>
      
      {/* Read More Section */}
{(classInfo.blurb || (classInfo.links && classInfo.links.length > 0)) && (
  <div className="p-4 rounded" style={{backgroundColor: theme?.isDark ? "#1a1a1a" : "#ffffff"}}>
    <h2 className={theme?.isDark ? "homestuck-command-dark mb-2" : "homestuck-command mb-2"}>Read More</h2>
    
    {/* Blurb */}
    {classInfo.blurb && (
      <p className="mb-3 font-courier" style={{color: theme?.isDark ? "#cccccc" : "#333333"}}>
        {classInfo.blurb}
      </p>
    )}
    
    {/* Links */}
    {classInfo.links && classInfo.links.length > 0 && (
      <div className="space-y-1">
        {classInfo.links.map((link, idx) => (
          <div key={idx}>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-verdana hover:underline"
              style={{
                color: theme?.isDark ? "#6dd1f4" : "#0000ee",
                fontSize: "1.25rem"
              }}
            >
              {'>'} {link.label}
            </a>
          </div>
        ))}
      </div>
    )}
  </div>
)}
      
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
      <div>
        <h2 className={theme?.isDark ? "homestuck-command-dark mb-3" : "homestuck-command mb-3"}>
          All {className === "Witch" ? "Witches" : 
               className === "Thief" ? "Thieves" :
               className + "s"}
        </h2>
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