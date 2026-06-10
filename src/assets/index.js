// Generate intricate, glowing geometric mandala SVG data URLs
const createMandalaIcon = (name, color1, color2, typeIndex) => {
  let content = "";
  
  if (typeIndex === 0) {
    // Type 0: Solar / Spiked Mandala (HTML, CSS, Git, Docker)
    let spikes = "";
    for (let i = 0; i < 16; i++) {
      const angle = i * (360 / 16);
      spikes += `<polygon points="50,10 47,24 53,24" fill="${color1}" opacity="0.8" transform="rotate(${angle} 50 50)" />`;
    }
    let diamonds = "";
    for (let i = 0; i < 12; i++) {
      const angle = i * (360 / 12);
      diamonds += `<polygon points="50,26 45,34 50,42 55,34" fill="none" stroke="${color2}" stroke-width="0.75" opacity="0.9" transform="rotate(${angle} 50 50)" />`;
    }
    let star = "";
    for (let i = 0; i < 8; i++) {
      const angle = i * (360 / 8);
      star += `<polygon points="50,34 48,50 52,50" fill="${color1}" transform="rotate(${angle} 50 50)" />`;
    }
    content = `
      ${spikes}
      ${diamonds}
      <circle cx="50" cy="50" r="42" fill="none" stroke="${color1}" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.7" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="${color2}" stroke-width="0.5" stroke-dasharray="1,3" opacity="0.8" />
      ${star}
      <circle cx="50" cy="50" r="8" fill="${color2}" filter="url(#glow)" />
      <circle cx="50" cy="50" r="4" fill="#ffffff" />
    `;
  } else if (typeIndex === 1) {
    // Type 1: Quantum / Orbital Mandala (JS, TS, React, Redux, Tailwind)
    let orbits = "";
    for (let i = 0; i < 6; i++) {
      const angle = i * 30;
      orbits += `<ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="${color2}" stroke-width="0.75" opacity="0.7" transform="rotate(${angle} 50 50)" />`;
    }
    let webs = "";
    for (let i = 0; i < 12; i++) {
      const angle = i * (360 / 12);
      webs += `<line x1="50" y1="50" x2="50" y2="8" stroke="${color1}" stroke-width="0.25" opacity="0.3" transform="rotate(${angle} 50 50)" />`;
    }
    const sq1 = `<rect x="30" y="30" width="40" height="40" fill="none" stroke="${color1}" stroke-width="0.75" opacity="0.8" transform="rotate(15 50 50)" />`;
    const sq2 = `<rect x="30" y="30" width="40" height="40" fill="none" stroke="${color2}" stroke-width="0.75" opacity="0.8" transform="rotate(45 50 50)" />`;
    const sq3 = `<rect x="30" y="30" width="40" height="40" fill="none" stroke="${color1}" stroke-width="0.75" opacity="0.8" transform="rotate(75 50 50)" />`;

    content = `
      ${orbits}
      ${webs}
      <circle cx="50" cy="50" r="44" fill="none" stroke="${color1}" stroke-width="0.5" opacity="0.5" />
      ${sq1}
      ${sq2}
      ${sq3}
      <circle cx="50" cy="50" r="12" fill="none" stroke="${color2}" stroke-width="0.75" stroke-dasharray="2,1" />
      <circle cx="50" cy="50" r="6" fill="${color1}" filter="url(#glow)" />
      <circle cx="50" cy="50" r="2" fill="#ffffff" />
    `;
  } else if (typeIndex === 2) {
    // Type 2: Floral / Lotus Mandala (Node, MongoDB, Figma)
    let dots = "";
    for (let i = 0; i < 32; i++) {
      const angle = i * (360 / 32);
      dots += `<circle cx="50" cy="8" r="1.5" fill="${color1}" opacity="0.8" transform="rotate(${angle} 50 50)" />`;
    }
    let petals = "";
    for (let i = 0; i < 12; i++) {
      const angle = i * (360 / 12);
      petals += `<path d="M50,50 Q40,22 50,12 Q60,22 50,50" fill="none" stroke="${color2}" stroke-width="0.85" opacity="0.95" transform="rotate(${angle} 50 50)" />`;
    }
    let innerPetals = "";
    for (let i = 0; i < 8; i++) {
      const angle = i * (360 / 8);
      innerPetals += `<path d="M50,50 Q44,30 50,24 Q56,30 50,50" fill="none" stroke="${color1}" stroke-width="0.75" opacity="0.8" transform="rotate(${angle} 50 50)" />`;
    }
    content = `
      ${dots}
      <circle cx="50" cy="50" r="40" fill="none" stroke="${color1}" stroke-width="0.5" opacity="0.6" />
      ${petals}
      ${innerPetals}
      <circle cx="50" cy="50" r="10" fill="none" stroke="${color2}" stroke-width="0.5" />
      <circle cx="50" cy="50" r="5" fill="${color2}" filter="url(#glow)" />
    `;
  } else {
    // Type 3: Sacred Vector / Seed of Life Mandala (Three JS)
    let circles = "";
    for (let i = 0; i < 6; i++) {
      const angle = i * (360 / 6);
      circles += `<circle cx="50" cy="34" r="16" fill="none" stroke="${color2}" stroke-width="0.75" opacity="0.85" transform="rotate(${angle} 50 50)" />`;
    }
    let points = [];
    for (let i = 0; i < 6; i++) {
      const angle = i * (2 * Math.PI) / 6 - Math.PI / 2;
      const x = 50 + 42 * Math.cos(angle);
      const y = 50 + 42 * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    const hexagon = `<polygon points="${points.join(" ")}" fill="none" stroke="${color1}" stroke-width="0.75" opacity="0.8" />`;
    
    let spokes = "";
    for (let i = 0; i < 6; i++) {
      const angle = i * (360 / 6);
      spokes += `<line x1="50" y1="50" x2="50" y2="8" stroke="${color1}" stroke-width="0.5" opacity="0.4" transform="rotate(${angle} 50 50)" />`;
    }
    const starOfDavid = `
      <polygon points="50,24 35,50 65,50" fill="none" stroke="${color2}" stroke-width="0.75" opacity="0.9" />
      <polygon points="50,56 35,30 65,30" fill="none" stroke="${color2}" stroke-width="0.75" opacity="0.9" transform="rotate(180 50 50)" />
    `;

    content = `
      ${spokes}
      ${hexagon}
      ${circles}
      ${starOfDavid}
      <circle cx="50" cy="50" r="6" fill="${color2}" filter="url(#glow)" />
      <circle cx="50" cy="50" r="3" fill="#ffffff" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="100" height="100" rx="50" fill="rgba(21,16,48,0.2)" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
    ${content}
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Tech stack icons as inline SVG data URLs (Mandalas)
export const techIcons = {
  html: createMandalaIcon("HTML5", "#E44D26", "#F16529", 0),
  css: createMandalaIcon("CSS3", "#1572B6", "#33A9DC", 0),
  javascript: createMandalaIcon("JavaScript", "#F7DF1E", "#E8D44D", 1),
  typescript: createMandalaIcon("TypeScript", "#007ACC", "#3178C6", 1),
  react: createMandalaIcon("React", "#61DAFB", "#21a1f1", 1),
  redux: createMandalaIcon("Redux", "#764ABC", "#9B6DD7", 1),
  tailwind: createMandalaIcon("Tailwind", "#06B6D4", "#38BDF8", 1),
  nodejs: createMandalaIcon("NodeJS", "#339933", "#6CC24A", 2),
  mongodb: createMandalaIcon("MongoDB", "#47A248", "#4DB33D", 2),
  threejs: createMandalaIcon("ThreeJS", "#915eff", "#bf61ff", 3),
  git: createMandalaIcon("Git", "#F05032", "#DE4C36", 0),
  figma: createMandalaIcon("Figma", "#F24E1E", "#A259FF", 2),
  docker: createMandalaIcon("Docker", "#2496ED", "#0DB7ED", 0),
};

// GitHub icon SVG
export const github = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>')}`;
