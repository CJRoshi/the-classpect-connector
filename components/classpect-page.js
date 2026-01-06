/* =========================
   CLASSPECT PAGE COMPONENT
   Individual classpect page with full analysis, inversions, rotations, etc.
   Requires: constants.js, utility-functions.js, links.js, section.js, rotation-graph.js
   ========================= */

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

  const isCanon = (canonCharacters && canonCharacters.length > 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start gap-6">
        {/* Left: Title */}
        <div>
          <h1 className="mb-2" style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            <ClassLink c={className} onClick={onNavigate} theme={theme} isTitle={true}/>
            <span className="font-typostuck-title">of</span>
            <AspectLink a={aspectName} onClick={onNavigate} theme={theme} isTitle={true}/>
          </h1>

          <p className="font-courier" style={{color: theme?.isDark ? "#cccccc" : "#4b5563"}}>
            [{className} ({getClassValue(className)>=0?"+":""}{getClassValue(className)}) + {aspectName} ({getAspectValue(aspectName)>=0?"+":""}{getAspectValue(aspectName)}) = {originalTotal>=0?"+":""}{originalTotal}]
          </p>

          <div className="flex gap-2 mt-2">
            {isBalanced && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                Balanced
              </span>
            )}
            {isSymmetric && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                Symmetric
              </span>
            )}
            {isCanon && (
              <a href="./canon.html" onClick={(e) => { e.preventDefault(); window.location.href = "./canon.html"; }} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded hover:bg-purple-200 cursor-pointer" style={{textDecoration: "none", display: "inline-block"}}>
                Appears in Canon
              </a>
            )}
          </div>
        </div>

        {/* Right: Reactions */}
        <div className="flex flex-col gap-4 max-w-md">
          {/* Canon reactions */}
          {canonCharacters && canonCharacters.map((ch) => (
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
                    {line.link ? (
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
                        {line.text}
                      </span>
                    )}
                  </div>
                ))}
                </div>
              )}
            </div>
          ))}

          {/* Non-canon reactions */}
          {nonCanonCharacters && nonCanonCharacters.length > 0 && (
            <>
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Non-Canon Reactions
              </div>

              {nonCanonCharacters.map((ch) => (
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
                          {line.link ? (
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
                              {line.text}
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


      {/* Numeric Inverse */}
      <Section 
        title="Numeric Inverse" 
        entries={numericInverse && numericInverse.valid ? [numericInverse] : []} 
        onNavigate={onNavigate}
        theme={theme}
      />

      {/* Pairwise Inverses */}
      <Section 
        title="Pairwise Inverses" 
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
            <h3 className="font-semibold mb-2">Same Value ({originalTotal>=0?"+":""}{originalTotal})</h3>
            <div className="space-y-1">
              {sameValue.map(([c,a])=>(
                <div key={`${c}-${a}`}>
                  <ClasspectLink c={c} a={a} onClick={onNavigate} theme={theme}/>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Opposite Value ({-originalTotal>=0?"+":""}{-originalTotal})</h3>
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" style={{border: `1px solid ${theme?.isDark ? "#555555" : "#d1d5db"}`}}>
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

// BG COMPONENT
