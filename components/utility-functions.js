/* =========================
   UTILITY FUNCTIONS
   All helper functions for classpect analysis
   Requires: constants.js (classesNumeric, aspectsNumeric)
   Requires: characterData, classInverses, aspectInverses (loaded in main app)
   ========================= */

/* =========================
   CHARACTER LOOKUP
   ========================= */

const getCharacterByClasspect = (className, aspectName) => {
  // Check canon characters first
  const canonEntry = Object.entries(characterData.canon).find(([name, data]) => 
    data.classpect[0] === className && data.classpect[1] === aspectName
  );
  
  if (canonEntry) {
    return {
      name: canonEntry[0],
      color: canonEntry[1].color,
      reaction: canonEntry[1].reaction,
      isCanon: true
    };
  }
  
  // Check non-canon characters
  const nonCanonEntry = Object.entries(characterData.nonCanon).find(([name, data]) => 
    data.classpect[0] === className && data.classpect[1] === aspectName
  );
  
  if (nonCanonEntry) {
    return {
      name: nonCanonEntry[0],
      color: nonCanonEntry[1].color,
      reaction: nonCanonEntry[1].reaction,
      isCanon: false
    };
  }
  
  return null;
};

// Check if classpect appears in canon
const isCanonClasspect = (className, aspectName) => {
  const character = getCharacterByClasspect(className, aspectName);
  return character && character.isCanon;
};

const getCharactersByClasspect = (className, aspectName) => {
  const matches = (data) =>
    data.classpect[0] === className && data.classpect[1] === aspectName;

  const canon = Object.entries(characterData.canon)
    .filter(([_, data]) => matches(data))
    .map(([name, data]) => ({ name, ...data }));

  const nonCanon = Object.entries(characterData.nonCanon || {})
    .filter(([_, data]) => matches(data))
    .map(([name, data]) => ({ name, ...data }));

  return { canon, nonCanon };
};

/* =========================
   NUMERIC UTILITIES
   ========================= */

const getClassValue = c => classesNumeric[c];
const getAspectValue = a => aspectsNumeric[a];
const totalValue = (c,a) => getClassValue(c) + getAspectValue(a);

const getClassByNumeric = (val) => {
  return Object.keys(classesNumeric).find(c => classesNumeric[c] === val);
};

const getAspectByNumeric = (val) => {
  return Object.keys(aspectsNumeric).find(a => aspectsNumeric[a] === val);
};

const getClasspectsByValue = (value) => {
  const result = [];
  Object.keys(classesNumeric).forEach(c => {
    Object.keys(aspectsNumeric).forEach(a => {
      if (classesNumeric[c] + aspectsNumeric[a] === value) {
        result.push([c, a]);
      }
    });
  });
  return result;
};

/* =========================
   ROTATION & REFLECTION
   ========================= */

const rotateCoords = (x, y, degrees) => {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [Math.round(x * cos - y * sin), Math.round(x * sin + y * cos)];
};

const getRotation = (className, aspectName, degrees) => {
  const x = classesNumeric[className];
  const y = aspectsNumeric[aspectName];
  const [nx, ny] = rotateCoords(x, y, degrees);
  const nc = getClassByNumeric(nx);
  const na = getAspectByNumeric(ny);
  return nc && na ? [nc, na] : null;
};

const getReflection = (className, aspectName) => {
  const x = classesNumeric[className];
  const y = aspectsNumeric[aspectName];
  const nc = getClassByNumeric(y);
  const na = getAspectByNumeric(x);
  return nc && na ? [nc, na] : null;
};

/* =========================
   CLASSPECT ANALYSIS
   ========================= */

const analyzeClasspect = (className, aspectName) => {
  if(!classesNumeric[className] || !aspectsNumeric[aspectName]) return {valid:false};

  const originalTotal = totalValue(className, aspectName);

  // Inversions shown upfront
  const classInv = classInverses[className];
  const aspectInv = aspectInverses[aspectName];

  // 24-table computation
  const table = [];
  const classTypes = ["Pair","Quasipair","Antipair","Numeric"];
  const aspectTypes = ["Pair","Quasipair","Antipair","Numeric","Preserve","Invert"];

  classTypes.forEach((cType,i)=>{
    const newClass = classInv[i];
    aspectTypes.forEach((aType,j)=>{
      let newAspect = null;
      let valid = true;
      if(aType==="Numeric") newAspect = aspectInv[3];
      else if(aType==="Pair") newAspect = aspectInv[0];
      else if(aType==="Quasipair") newAspect = aspectInv[1];
      else if(aType==="Antipair") newAspect = aspectInv[2];
      else if(aType==="Preserve") {
        const desired = originalTotal - getClassValue(newClass);
        const found = Object.keys(aspectsNumeric).find(a=>aspectsNumeric[a]===desired);
        if(found) newAspect = found;
        else valid=false;
      } else if(aType==="Invert") {
        const desired = -originalTotal - getClassValue(newClass);
        const found = Object.keys(aspectsNumeric).find(a=>aspectsNumeric[a]===desired);
        if(found) newAspect = found;
        else valid=false;
      }
      table.push({
        classType:cType,
        aspectType:aType,
        className:newClass,
        aspectName:newAspect,
        valid
      });
    });
  });

  // Section extraction
  const numericInverse = table.find(e=>e.classType==="Numeric" && e.aspectType==="Numeric");
  
  // For pairwise, siblings, and shadows - deduplicate by creating unique keys
  const deduplicate = (entries) => {
    const seen = new Set();
    return entries.filter(e => {
      if (!e || !e.valid) return false;
      const key = `${e.className}-${e.aspectName}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  
  const pairwiseInverses = deduplicate(
    ["Pair","Quasipair","Antipair"].map(t=>table.find(e=>e.classType===t && e.aspectType===t))
  );
  
  const siblings = deduplicate(
    ["Pair","Quasipair","Antipair"].map(t=>table.find(e=>e.classType===t && e.aspectType==="Preserve"))
  );
  
  const shadows = deduplicate(
    ["Pair","Quasipair","Antipair"].map(t=>table.find(e=>e.classType===t && e.aspectType==="Invert"))
  );

  // Rotations (every 30 degrees)
  const rotations = [];
  for (let deg = 30; deg < 360; deg += 30) {
    const rot = getRotation(className, aspectName, deg);
    if (rot) {
      rotations.push({ degrees: deg, classpect: rot });
    }
  }

  // Reflection
  const reflection = getReflection(className, aspectName);

  // Same/Opposite value
  const sameValue = getClasspectsByValue(originalTotal);
  const oppositeValue = getClasspectsByValue(-originalTotal);

  // Badges
  const isBalanced = originalTotal === 0;
  const isSymmetric = classesNumeric[className] === aspectsNumeric[aspectName];
  const { canon, nonCanon } = getCharactersByClasspect(className, aspectName);

  return {
    valid:true, 
    table, 
    numericInverse, 
    pairwiseInverses, 
    siblings, 
    shadows, 
    originalTotal,
    classInv,
    aspectInv,
    rotations,
    reflection,
    sameValue,
    oppositeValue,
    isBalanced,
    isSymmetric,
    canonCharacters: canon,
    nonCanonCharacters: nonCanon
  };
};
