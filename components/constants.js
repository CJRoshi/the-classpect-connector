/* =========================
   SHARED CONSTANTS
   Include this file in any page
   Usage: <script src="./components/constants.js"></script>
   ========================= */

const classesNumeric = {
  Lord: -7, Witch: -6, Prince: -5, Thief: -4,
  Knight: -3, Mage: -2, Sylph: -1, Maid: 1,
  Seer: 2, Page: 3, Rogue: 4, Bard: 5,
  Heir: 6, Muse: 7
};

const aspectsNumeric = {
  Hope: -6, Light: -5, Life: -4, Mind: -3,
  Breath: -2, Rage: -1, Time: 1, Blood: 2,
  Heart: 3, Doom: 4, Void: 5, Space: 6
};

// GRAPH COLORS (optimized for white background)
const aspectColors = {
  Hope: "#d69500",     // Darker gold (was #ffc331)
  Light: "#c9b000",    // Darker yellow (was #dfd527)
  Life: "#67b240", 
  Mind: "#36daa8", 
  Breath: "#36abc0", 
  Rage: "#b84ef5",
  Time: "#b70d0e", 
  Blood: "#3d1909", 
  Heart: "#bd1864",
  Doom: "#3f6b3f", 
  Void: "#001957", 
  Space: "#000000"
};

// Aspect colors for dark backgrounds (brighter/more visible)
const aspectColorsDark = {
  Hope: "#ffde55", Light: "#f6fa4e", Life: "#77c350",
  Mind: "#42f8c0", Breath: "#47dff9", Rage: "#b84ef5",
  Time: "#ff2106", Blood: "#ba1915", Heart: "#bd1864",
  Doom: "#666666", Void: "#104ea2", Space: "#ffffff"
};