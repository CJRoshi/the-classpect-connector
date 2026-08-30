/* =========================
   CLASSPECT PAGE COMPONENT
   Individual classpect page with full analysis, inversions, rotations, etc.
   Requires: constants.js, utility-functions.js, links.js, section.js, rotation-graph.js, tags.js
   ========================= */

const renderReactionText = (text, color) => {
  // Rendering helper
  const parts = text.split(/(<a\b[^>]*>.*?<\/a>)/gis);
  return parts.map((part, idx) => {
    const match = part.match(/^<a\b([^>]*)>(.*?)<\/a>$/is);
    if (!match) return <React.Fragment key={idx}>{part}</React.Fragment>;

    const attrs = match[1];
    const href = (attrs.match(/\bhref=["']([^"']+)["']/i) || [])[1];
    const target = (attrs.match(/\btarget=["']([^"']+)["']/i) || [])[1];
    const rel = (attrs.match(/\brel=["']([^"']+)["']/i) || [])[1];

    return (
      <a
        key={idx}
        href={href}
        target={target}
        rel={rel}
        className="underline"
        style={{ color }}
      >
        {match[2]}
      </a>
    );
  });
};

const ClasspectPage = ({className, aspectName, onNavigate, theme})=>{
  const analysis = analyzeClasspect(className, aspectName);
  if(!analysis.valid) return <div className="text-red-600">Invalid classpect.</div>;

  const { 
    originalTotal, 
    classInv, 
    aspectInv, 
    numericInverse, 
    pairwiseInverses, 
    siblings, 
    shadows,
    rotations,
    reflection,
    sameValue,
    oppositeValue,
    isBalanced,
    isSymmetric,
    canonCharacters,
    nonCanonCharacters,
    table
  } = analysis;

  // ── Unlock system ──────────────────────────────────────────────────────────
  // Read which conditions have been met from localStorage (once, at render time).
  const [unlockedSet] = React.useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('cc_unlocks') || '[]'));
    } catch { return new Set(); }
  });

  // Polarity mode — subscribes to the sitewide sign-convention setting.
  const [polarity, setPolarity] = React.useState(() => Settings.get('polarityMode'));
  React.useEffect(() => {
    const onChange = (ev) => {
      if (ev.detail?.name === 'polarityMode') setPolarity(Settings.get('polarityMode'));
    };
    window.addEventListener('cc-setting-change', onChange);
    return () => window.removeEventListener('cc-setting-change', onChange);
  }, []);

  // Build the effective render lists:
  // - Characters with a regular reaction always appear.
  // - Characters with an unlockable reaction appear (using that reaction) only
  //   when their condition is met — indistinguishable from a normal card.
  // - Characters with ONLY an unlockable reaction are invisible until unlocked.
  const buildList = (chars) => {
    const result = [];
    chars.forEach(ch => {
      if (ch.reaction && ch.reaction.length > 0) result.push(ch);
      if (ch.unlockable && unlockedSet.has(ch.unlockable.condition)) {
        result.push({ ...ch, reaction: ch.unlockable.reaction });
      }
    });
    return result;
  };

  const visibleCanon    = buildList(canonCharacters);
  const visibleNonCanon = buildList(nonCanonCharacters);
  // ───────────────────────────────────────────────────────────────────────────

  // "canon" tag: only count characters that have a visible regular reaction
  const isCanon = canonCharacters.some(ch => ch.reaction && ch.reaction.length > 0);

  // Collect all tags from characters with this classpect
  const allTags = new Set();

  // Add auto-computed tags
  if (isBalanced) allTags.add('balanced');
  if (isSymmetric) allTags.add('symmetric');
  if (isCanon) allTags.add('canon');

  // Auto-computed rung tag — every classpect on the integer lattice
  // sits on a rung (1..26). Tag color = band swatch; clicking opens
  // ./rungs.html#rung-N (handled via TagBadge's `href` field).
  const rungInfo = (typeof rungForClasspect === 'function')
    ? rungForClasspect(className, aspectName)
    : null;
  if (rungInfo) allTags.add(`rung-${rungInfo.rung}`);

  // Add manual tags from all characters (including unlockable-only ones)
  [...canonCharacters, ...nonCanonCharacters].forEach(char => {
    if (char.tags && Array.isArray(char.tags)) {
      char.tags.forEach(tag => allTags.add(tag));
    }
  });

  // Convert to array (TagsDisplay will handle sorting)
  const tags = Array.from(allTags);

  // Raw leadership score (G.4): class_lead + 2·aspect_lead. Sits
  // alongside the sum value at the top of the page as a sibling stat
  // line. `leadershipFor` lives in constants.js.
  const leadership = (typeof leadershipFor === 'function')
    ? leadershipFor(className, aspectName)
    : null;

  // Handler for tag clicks
  const handleTagClick = (route) => {
    if (route) {
      // Use a relative path (leading '.') so it works under any deployment
      // subdirectory (e.g. GitHub Pages at /the-classpect-connector/).
      // '/tag/sburb-beta' → './tag/sburb-beta.html'
      // '/balanced'       → './balanced.html'
      window.location.href = '.' + route + '.html';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section — stacks vertically on mobile, side-by-side on md+ */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-6">
        {/* Title block */}
        <div style={{minWidth: 0}}>
          <h1 className="mb-2" style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
            {/* Discord-preferred layout: [Class] of [Aspect] then both
                icons at the end. Class/AspectLink render text-only via
                showIcon=false; the class + aspect bg tiles trail after. */}
            <ClassLink c={className} onClick={onNavigate} theme={theme} isTitle={true} showIcon={false}/>
            <span className="font-typostuck-title">of</span>
            <AspectLink a={aspectName} onClick={onNavigate} theme={theme} isTitle={true} showIcon={false}/>
            <img
              src={`./images/classes/bg/${className.toLowerCase()}.svg`}
              alt=""
              style={{width: '40px', height: '40px', display: 'inline-block', verticalAlign: 'middle'}}
              onError={(e) => e.target.style.display = 'none'}
            />
            <img
              src={`./images/aspects/with-bg/${aspectName.toLowerCase()}bg.svg`}
              alt=""
              style={{width: '40px', height: '40px', display: 'inline-block', verticalAlign: 'middle'}}
              onError={(e) => e.target.style.display = 'none'}
            />
          </h1>

          <p className="font-courier" style={{color: theme?.isDark ? "#cccccc" : "#4b5563", wordBreak: 'break-word'}}>
            [{className} ({polarityValueString(getClassValue(className), polarity)}) + {aspectName} ({polarityValueString(getAspectValue(aspectName), polarity)}) = {polarityValueString(originalTotal, polarity)}]
          </p>

          {/* Raw leadership score. */}
          {leadership !== null && (
            <p className="font-courier" style={{color: theme?.isDark ? "#cccccc" : "#4b5563", wordBreak: 'break-word'}}>
              [Leadership = {polarityValueString(CLASS_LEAD[className], polarity)} + 2·({polarityValueString(ASPECT_LEAD[aspectName], polarity)}) = {polarityValueString(leadership, polarity)}{' '}
              <span style={{opacity: 0.75}}>
                ({leadership > 0 ? 'Implicit' : leadership < 0 ? 'Explicit' : 'Balanced'})
              </span>]
            </p>
          )}

          {/* Tags Display */}
          <TagsDisplay tags={tags} onTagClick={handleTagClick} />

          {/* Reactions — kept in the left column beneath the tags so
              there's no dead space next to the glyph box. */}
          <div className="flex flex-col gap-4 w-full mt-4">
          {/* Canon reactions */}
          {visibleCanon && visibleCanon.map((ch) => (
            <div
              key={ch.name}
              style={{backgroundColor: "#eeeeee", borderLeft: "4px solid #f59e0b", padding: "0.75rem", fontSize: "0.875rem", fontFamily: "Courier New"}}
            >
              <div className="mb-1" style={{ color: ch.color }}>
                Shared with {ch.name}!
              </div>

              {ch.reaction && (
                <div className="whitespace-pre-wrap font-bold">
                  {ch.reaction.map((line, idx) => (
                  <div key={idx}>
                    {line.image ? (
                      /* Image quote (e.g. Mizzlebip's pleading emoji).
                         `scale` multiplies a 32-px baseline; keep aspect
                         ratio so a non-square source doesn't get squashed. */
                      <img
                        src={line.image}
                        alt={line.alt || ''}
                        style={{
                          width: (line.scale || 1) * 32 + 'px',
                          height: 'auto',
                          display: 'inline-block',
                          verticalAlign: 'middle',
                        }}
                      />
                    ) : line.link ? (
                      <a
                        href={line.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: line.color }}
                      >
                        {line.text}
                      </a>
                    ) : (
                      <span style={{ color: line.color }}>
                        {renderReactionText(line.text, line.color)}
                      </span>
                    )}
                  </div>
                ))}
                </div>
              )}
            </div>
          ))}

          {/* Non-canon reactions */}
          {visibleNonCanon && visibleNonCanon.length > 0 && (
            <>
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Non-Canon Reactions
              </div>

              {visibleNonCanon.map((ch) => (
                <div
                  key={ch.name}
                  className="bg-yellow-50 border-l-4 border-gray-400 p-3 text-sm"
                  style={{ fontFamily: "Courier New" }}
                >
                  <div className="mb-1" style={{ color: ch.color }}>
                    Shared with {ch.name}!
                  </div>

                  {ch.reaction && (
                    <div className="whitespace-pre-wrap font-bold">
                      {ch.reaction.map((line, idx) => (
                        <div key={idx}>
                          {line.image ? (
                            <img
                              src={line.image}
                              alt={line.alt || ''}
                              style={{
                                width: (line.scale || 1) * 32 + 'px',
                                height: 'auto',
                                display: 'inline-block',
                                verticalAlign: 'middle',
                              }}
                            />
                          ) : line.link ? (
                            <a
                              href={line.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                              style={{ color: line.color }}
                            >
                              {line.text}
                            </a>
                          ) : (
                            <span style={{ color: line.color }}>
                              {renderReactionText(line.text, line.color)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          </div>
        </div>

        {/* Glyph box. */}
        <ClasspectGlyph
          className={className}
          aspectName={aspectName}
          theme={theme}
          /* Pass the VISIBLE lists (post-unlock filter), not the raw
             character rosters — this way Automatic outlines only pick
             up characters the user can actually see on the page. */
          canonCharacters={visibleCanon}
          nonCanonCharacters={visibleNonCanon}
        />
      </div>


      {/* Numeric Inverse */}
      <Section 
        title="Numeric Inverse" 
        entries={numericInverse && numericInverse.valid ? [numericInverse] : []} 
        onNavigate={onNavigate}
        theme={theme}
      />

      {/* Pairwise Related */}
      <Section 
        title="Pairwise Related" 
        entries={pairwiseInverses} 
        onNavigate={onNavigate}
        theme={theme}
      />

      {/* Siblings */}
      <Section 
        title="Siblings (Pairwise Preserving)" 
        entries={siblings} 
        emptyMessage="This classpect has no valid sibling classpects!"
        onNavigate={onNavigate}
        theme={theme}
      />

      {/* Shadows */}
      <Section 
        title="Shadows (Pairwise Inverting)" 
        entries={shadows} 
        emptyMessage="This classpect has no valid shadow classpects!"
        onNavigate={onNavigate}
        theme={theme}
      />

      {/* Rotation Graph */}
      <div>
        <h2 className={theme?.isDark ? "homestuck-command-dark mb-3" : "homestuck-command mb-3"}>Rotations & Reflections</h2>
        <RotationGraph 
          className={className} 
          aspectName={aspectName} 
          rotations={rotations}
          reflection={reflection}
          onNavigate={onNavigate}
        theme={theme}
        />
      </div>

      {/* Same/Opposite Value Tables */}
      <div>
        <h2 className={theme?.isDark ? "homestuck-command-dark mb-3" : "homestuck-command mb-3"}>Classpects by Numeric Value</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Same Value ({polarityValueString(originalTotal, polarity)})</h3>
            <div className="space-y-1">
              {sameValue.map(([c,a])=>(
                <div key={`${c}-${a}`}>
                  <ClasspectLink c={c} a={a} onClick={onNavigate} theme={theme}/>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Opposite Value ({polarityValueString(-originalTotal, polarity)})</h3>
            <div className="space-y-1">
              {oppositeValue.map(([c,a])=>(
                <div key={`${c}-${a}`}>
                  <ClasspectLink c={c} a={a} onClick={onNavigate} theme={theme}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Boring Results Table */}
      <div>
        <h2 className={theme?.isDark ? "homestuck-command-dark mb-3" : "homestuck-command mb-3"}>Boring Results Table</h2>
        <div className="overflow-x-auto table-scroll-mobile" style={{WebkitOverflowScrolling: 'touch'}}>
          <table className="border-collapse text-sm boring-table" style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, minWidth: '100%'}}>
            <thead>
              <tr style={{backgroundColor: theme?.isDark ? "#2a2a2a" : "#f3f4f6"}}>
                <th style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, padding: "0.5rem"}}>Class Type</th>
                <th style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, padding: "0.5rem"}}>Numeric</th>
                <th style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, padding: "0.5rem"}}>Pair</th>
                <th style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, padding: "0.5rem"}}>Quasipair</th>
                <th style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, padding: "0.5rem"}}>Antipair</th>
                <th style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, padding: "0.5rem"}}>Preserve</th>
                <th style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, padding: "0.5rem"}}>Invert</th>
              </tr>
            </thead>
            <tbody>
              {["Numeric", "Pair", "Quasipair", "Antipair"].map(cType => {
                const row = table.filter(e => e.classType === cType);
                return (
                  <tr key={cType}>
                    <td style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, padding: "0.5rem", fontWeight: "500"}}>{cType}</td>
                    {["Numeric", "Pair", "Quasipair", "Antipair", "Preserve", "Invert"].map(aType => {
                      const entry = row.find(e => e.aspectType === aType);
                      return (
                        <td key={aType} style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`, padding: "0.5rem"}}>
                          {entry && entry.valid ? (
                            <ClasspectLink c={entry.className} a={entry.aspectName} onClick={onNavigate} theme={theme}/>
                          ) : 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};