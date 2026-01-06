const TiledAspectBackground = ({ aspectName }) => {
  if (!aspectName) return null;
  
  // Different aspects need different sizes due to their varying aspect ratios
  const getIconSize = (aspect) => {
    const sizeMap = {
      'Hope': { height: '45px', spacing: 280 },      // Wide symbol, needs smaller height
      'Breath': { height: '45px', spacing: 260 },    // Wide symbol, needs smaller height
      'Light': { height: '50px', spacing: 250 },    // More square, good at default
      'Life': { height: '50px', spacing: 250 },
      'Mind': { height: '50px', spacing: 250 },
      'Rage': { height: '50px', spacing: 250 },
      'Time': { height: '50px', spacing: 250 },
      'Blood': { height: '50px', spacing: 250 },
      'Heart': { height: '50px', spacing: 250 },
      'Doom': { height: '50px', spacing: 250 },
      'Void': { height: '50px', spacing: 250 },
      'Space': { height: '50px', spacing: 250 }
    };
    
    return sizeMap[aspect] || { height: '55px', spacing: 250 };
  };
  
  const iconSize = getIconSize(aspectName);
  
  // Generate icon positions in a diagonal pattern
  const generateIconPositions = () => {
    const positions = [];
    const spacing = iconSize.spacing;
    const cols = Math.ceil(window.innerWidth / spacing) + 2;
    const rows = Math.ceil(window.innerHeight / spacing) + 2;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Create diagonal offset pattern
        const x = col * spacing - (row % 2) * (spacing / 2);
        const y = row * spacing;
        
        positions.push({
          x: x - spacing,
          y: y - spacing
        });
      }
    }
    
    return positions;
  };
  
  const positions = React.useMemo(() => generateIconPositions(), [iconSize.spacing]);
  const iconPath = `./images/aspects/no-bg/${aspectName.toLowerCase()}.webp`;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {positions.map((pos, idx) => (
        <img
          key={idx}
          src={iconPath}
          alt=""
          style={{
            position: 'absolute',
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            height: iconSize.height,
            width: 'auto',
            opacity: 0.7,
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  );
};
