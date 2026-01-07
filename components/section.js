/* =========================
   SECTION COMPONENT
   Generic section renderer for displaying lists of classpects
   Used in class pages, aspect pages, and classpect pages
   Requires: links.js (ClasspectLink)
   ========================= */

const Section = ({title, entries, emptyMessage, onNavigate, theme})=>{
  if(!entries || entries.length===0) {
    return (
      <div className="mb-6">
        <h2 className={theme?.isDark ? "homestuck-command-dark mb-2" : "homestuck-command mb-2"}>{title}</h2>
        {emptyMessage && <p className="text-gray-500 italic">{emptyMessage}</p>}
      </div>
    );
  }
  return (
    <div className="mb-6">
      <h2 className={theme?.isDark ? "homestuck-command-dark mb-2" : "homestuck-command mb-2"}>{title}</h2>
      <div className="space-y-1">
        {entries.map((e,i)=>(
          <div key={i}>
            <ClasspectLink c={e.className} a={e.aspectName} onClick={onNavigate} theme={theme}/>
          </div>
        ))}
      </div>
    </div>
  );
};