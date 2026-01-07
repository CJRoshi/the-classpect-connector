/* =========================
   LINK COMPONENTS
   Clickable navigation links for classes, aspects, and classpects
   Requires: constants.js (aspectColors, aspectColorsDark)
   Requires: utility-functions.js (totalValue)
   ========================= */

const ClasspectLink = ({c,a,onClick,theme})=>{
  const linkColor = theme?.isDark ? "#6dd1f4" : "#0000ee";
  const hoverColor = theme?.isDark ? "#9ee4ff" : "#0000ff";
  
  const handleClick = (e) => {
    e.preventDefault();
    onClick(`/classpect/${c.toLowerCase()}-of-${a.toLowerCase()}`);
  };
  
  return (
    <a
      href={`#/classpect/${c.toLowerCase()}-of-${a.toLowerCase()}`}
      className="font-courier-bold hover:underline transition-colors" 
      style={{color: linkColor, textDecoration: 'none'}}
      onClick={handleClick}
      onMouseEnter={(e) => e.target.style.color = hoverColor}
      onMouseLeave={(e) => e.target.style.color = linkColor}
    >
      {c} of {a} ({totalValue(c,a)>=0?"+":""}{totalValue(c,a)})
    </a>
  );
};

const ClassLink = ({c,onClick,theme,isTitle})=>{
  const linkColor = theme?.isDark ? "#ffffff" : "#000000";
  const hoverColor = theme?.isDark ? "#6dd1f4" : "#0000ee";
  
  const handleClick = (e) => {
    e.preventDefault();
    onClick(`/class/${c.toLowerCase()}`);
  };
  
  return (
    <a
      href={`#/class/${c.toLowerCase()}`}
      className={isTitle ? "font-typostuck-title hover:underline transition-colors" : "font-typostuck hover:underline transition-colors"}
      style={{color: linkColor, textDecoration: 'none'}}
      onClick={handleClick}
      onMouseEnter={(e) => e.target.style.color = hoverColor}
      onMouseLeave={(e) => e.target.style.color = linkColor}
    >
      {c}
    </a>
  );
};

const AspectLink = ({a,onClick,theme,isTitle})=>{
  const linkColor = theme?.aspectLinkColor === "dark" ? aspectColorsDark[a] : aspectColors[a];
  const iconSize = isTitle ? "40px" : "20px";
  
  const handleClick = (e) => {
    e.preventDefault();
    onClick(`/aspect/${a.toLowerCase()}`);
  };
  
  return (
    <a
      href={`#/aspect/${a.toLowerCase()}`}
      className={isTitle ? "font-typostuck-title hover:underline" : "font-typostuck hover:underline"}
      onClick={handleClick}
      style={{color: linkColor, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none'}}
    >
      <span>{a}</span>
      <img 
        src={`./images/aspects/with-bg/${a.toLowerCase()}bg.png`}
        alt=""
        style={{width: iconSize, height: iconSize, display: 'inline-block', verticalAlign: 'middle'}}
        onError={(e) => e.target.style.display = 'none'}
      />
    </a>
  );
};