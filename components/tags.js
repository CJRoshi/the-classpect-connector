/* =========================
   TAGS UTILITY MODULE
   Handles tag computation and badge display
   ========================= */

// Tag priority order (lower number = higher priority)
const TAG_PRIORITY = {
  // Tier 1: Mathematical properties
  'balanced': 1,
  'symmetric': 2,
  
  // Tier 2: Canon status
  'canon': 3,
  
  // Tier 3: Session groups (in chronological order)
  'sburb-beta': 4,
  'sburb-alpha': 5,
  'sgrub-beta': 6,
  'sgrub-alpha': 7,
  'cherubs': 8,
  
  // Tier 4: Main sources
  'homestuck': 9,
  'beyond-canon': 10,
  'hiveswap': 11,
  'hauntswitch': 12,
  'pesterquest': 13,
  
  // Tier 5: Non-canon special tags
  'original-character': 100,
  'sweetbroandhellajeff': 101
};

// Sort tags by priority
const sortTagsByPriority = (tags) => {
  return [...tags].sort((a, b) => {
    const priorityA = TAG_PRIORITY[a] ?? 999;
    const priorityB = TAG_PRIORITY[b] ?? 999;
    return priorityA - priorityB;
  });
};

// Tag definitions and metadata
const TAG_METADATA = {
  // Auto-computed tags
  'canon': {
    label: 'Appears in Canon',
    color: '#000000',
    textColor: '#ffffff',
    route: '/canon',
    autoComputed: true
  },
  'balanced': {
    label: 'Balanced',
    color: '#4a90e2',
    route: '/balanced',
    autoComputed: true
  },
  'symmetric': {
    label: 'Symmetric',
    color: '#e24a90',
    route: '/symmetric',
    autoComputed: true
  },
  
  // Source tags (manual)
  'homestuck': {
    label: 'Homestuck',
    color: '#39d5f6',
    textColor: '#000000',
    route: '/tag/homestuck'
  },
  'beyond-canon': {
    label: 'Beyond Canon',
    color: '#f2a400',
    route: '/tag/beyond-canon'
  },
  'sburb-beta': {
    label: 'SBURB Beta',
    color: '#4ce24e',
    textColor: '#000000',
    route: '/tag/sburb-beta'
  },
  'sburb-alpha': {
    label: 'SBURB Alpha',
    color: '#ff0000',
    route: '/tag/sburb-alpha'
  },
  'sgrub-beta': {
    label: 'SGRUB Beta',
    color: '#900fff',
    route: '/tag/sgrub-beta'
  },
  'sgrub-alpha': {
    label: 'SGRUB Alpha',
    color: '#f7f72a',
    textColor: '#000000',
    route: '/tag/sgrub-alpha'
  },
  'cherubs': {
    label: 'Cherubs',
    color: '#008c45',
    route: '/tag/cherubs'
  },
  'hiveswap': {
    label: 'Hiveswap',
    color: '#000000',
    textColor: '#2ed73a',
    hoverColor: '#000000',
    hoverTextColor: '#ff0000',
    route: '/tag/hiveswap'
  },
  'hauntswitch': {
    label: 'Hauntswitch',
    color: '#ffffff',
    textColor: '#ff0000',
    hoverColor: '#ffffff',
    hoverTextColor: '#2ed73a',
    route: '/tag/hauntswitch'
  },
  'pesterquest': {
    label: 'Pesterquest',
    color: '#00c661',
    textColor: '#000000',
    route: '/tag/pesterquest'
  },
  'influencer': {
    label: 'The Influencers',
    color: '#6e11e6',
    route: null
  },
  
  // Non-canon special tags (no routes)
  'original-character': {
    label: 'Original Character',
    color: '#757575',
    route: '/tag/oc-session'
  },
  'sweetbroandhellajeff': {
    label: 'Sweet Bro and Hella Jeff',
    color: '#ff5722',
    route: null
  }
};

// Compute whether a classpect is balanced
const isBalanced = (classValue, aspectValue) => {
  return classValue + aspectValue === 0;
};

// Compute whether a classpect is symmetric
const isSymmetric = (classValue, aspectValue) => {
  return classValue === aspectValue;
};

// Get all tags for a character (both manual and computed)
const getCharacterTags = (character, isCanon, aspectsNumeric, classesNumeric) => {
  const tags = [];
  
  // Add "canon" tag if character is from canon list
  if (isCanon) {
    tags.push('canon');
  }
  
  // Compute balanced/symmetric if we have classpect data
  if (character.classpect && character.classpect.length === 2) {
    const [className, aspectName] = character.classpect;
    const classValue = classesNumeric[className];
    const aspectValue = aspectsNumeric[aspectName];
    
    if (classValue !== undefined && aspectValue !== undefined) {
      if (isBalanced(classValue, aspectValue)) {
        tags.push('balanced');
      }
      if (isSymmetric(classValue, aspectValue)) {
        tags.push('symmetric');
      }
    }
  }
  
  // Add manual tags from character data
  if (character.tags && Array.isArray(character.tags)) {
    tags.push(...character.tags);
  }
  
  return tags;
};

// Badge component
const TagBadge = ({ tag, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const metadata = TAG_METADATA[tag] || {
    label: tag,
    color: '#666666',
    route: null
  };
  
  const handleClick = () => {
    if (metadata.route && onClick) {
      onClick(metadata.route);
    }
  };
  
  const isClickable = metadata.route !== null;
  
  // Determine colors (with hover swap support)
  const bgColor = (isHovered && metadata.hoverColor) ? metadata.hoverColor : metadata.color;
  const textColor = (isHovered && metadata.hoverTextColor) ? metadata.hoverTextColor : 
                    (metadata.textColor || '#ffffff');
  
  return (
    <span
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        fontFamily: "'Courier New', monospace",
        cursor: isClickable ? 'pointer' : 'default',
        display: 'inline-block',
        margin: '2px',
        transition: 'all 0.2s',
        opacity: (isClickable && isHovered) ? 0.95 : 1,
        transform: (isClickable && isHovered) ? 'translateY(-1px)' : 'translateY(0)'
      }}
    >
      {metadata.label}
    </span>
  );
};

// Tags display component
const TagsDisplay = ({ tags, onTagClick }) => {
  if (!tags || tags.length === 0) {
    return null;
  }
  
  // Sort tags by priority
  const sortedTags = sortTagsByPriority(tags);
  
  return (
    <div style={{ marginTop: '12px', marginBottom: '12px' }}>
      {sortedTags.map((tag, index) => (
        <TagBadge key={index} tag={tag} onClick={onTagClick} />
      ))}
    </div>
  );
};