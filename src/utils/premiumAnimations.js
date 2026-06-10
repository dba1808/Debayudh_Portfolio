/**
 * Premium Animation Library
 * High-end interaction patterns for Apple/Linear/Stripe aesthetic
 */

// ─── PREMIUM TEXT REVEALS ───
export const characterReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const gradientSweepReveal = {
  hidden: { 
    backgroundPosition: "200% 0",
    opacity: 0,
  },
  visible: {
    backgroundPosition: "0% 0",
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const blurToFocusReveal = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─── FLOATING & MAGNETIC EFFECTS ───
export const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 4,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

export const magneticPull = {
  x: 0,
  y: 0,
  transition: {
    type: "spring",
    damping: 20,
    stiffness: 150,
  },
};

// ─── GLOW INTENSITY PULSE ───
export const glowPulse = {
  boxShadow: [
    "0 0 20px rgba(145, 94, 255, 0.3), inset 0 0 20px rgba(145, 94, 255, 0.1)",
    "0 0 40px rgba(145, 94, 255, 0.6), inset 0 0 40px rgba(145, 94, 255, 0.2)",
    "0 0 20px rgba(145, 94, 255, 0.3), inset 0 0 20px rgba(145, 94, 255, 0.1)",
  ],
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

// ─── TILT & DEPTH EFFECT ───
export const tiltDepth = (x, y) => {
  const rotateX = (y - 0.5) * 10;
  const rotateY = (x - 0.5) * 10;
  
  return {
    rotateX,
    rotateY,
    z: 100,
  };
};

// ─── STAGGER CONTAINERS ───
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─── MORPH ANIMATIONS ───
export const morphShapeVariants = {
  animate: {
    borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 30% 30% 70% 70%", "30% 30% 70% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// ─── SCROLL TRIGGERED ANIMATIONS ───
export const scrollReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─── RIPPLE ON CLICK ───
export const rippleVariants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2.5,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// ─── SPOTLIGHT EFFECT ───
export const spotlightVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// ─── NEURON PATHWAY ANIMATION ───
export const neuralPathwayVariants = {
  animate: {
    strokeDashoffset: [1000, 0],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

// ─── CARD HOVER WITH DEPTH ───
export const cardDepthVariants = {
  rest: {
    y: 0,
    boxShadow: "0 10px 30px rgba(145, 94, 255, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 50px rgba(145, 94, 255, 0.25), 0 0 40px rgba(145, 94, 255, 0.15)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─── NAVBAR COMPRESS ON SCROLL ───
export const navbarCompressVariants = (isScrolled) => ({
  y: 0,
  backdropFilter: isScrolled ? "blur(20px)" : "blur(12px)",
  backgroundColor: isScrolled 
    ? "rgba(5, 8, 22, 0.8)" 
    : "rgba(5, 8, 22, 0.5)",
  boxShadow: isScrolled 
    ? "0 8px 32px rgba(145, 94, 255, 0.1)" 
    : "0 4px 16px rgba(145, 94, 255, 0.05)",
  transition: {
    duration: 0.4,
    ease: "easeOut",
  },
});

// ─── SMOOTH EASING PRESETS ───
export const easings = {
  smooth: [0.22, 1, 0.36, 1],
  snappy: [0.34, 1.56, 0.64, 1],
  gentle: [0.4, 0, 0.2, 1],
  elastic: [0.175, 0.885, 0.32, 1.275],
};
