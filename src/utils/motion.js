// Premium spring easing for buttery-smooth feel
const smoothEase = [0.22, 1, 0.36, 1];

export const textVariant = (delay) => {
  return {
    hidden: {
      y: -25,
      opacity: 0,
      filter: "blur(6px)",
    },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay || 0,
        damping: 20,
        stiffness: 90,
      },
    },
  };
};

export const fadeIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      opacity: 0,
      filter: "blur(6px)",
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: type || "spring",
        delay: delay,
        duration: duration,
        ease: smoothEase,
        damping: 22,
        stiffness: 80,
      },
    },
  };
};

export const zoomIn = (delay, duration) => {
  return {
    hidden: {
      scale: 0.88,
      opacity: 0,
      filter: "blur(6px)",
    },
    show: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        delay: delay,
        duration: duration,
        damping: 22,
        stiffness: 95,
        ease: smoothEase,
      },
    },
  };
};

export const slideIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
      opacity: 0,
      filter: "blur(4px)",
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: type || "spring",
        delay: delay,
        duration: duration,
        damping: 24,
        stiffness: 75,
        ease: smoothEase,
      },
    },
  };
};

export const staggerContainer = (staggerChildren, delayChildren) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren || 0.12,
        delayChildren: delayChildren || 0,
      },
    },
  };
};

// Stagger children for scroll-triggered lists
export const staggerFadeIn = {
  hidden: { opacity: 0, y: 25 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      delay: i * 0.12,
      damping: 22,
      stiffness: 80,
    },
  }),
};

// Premium card hover variant
export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 24 },
  },
  hover: {
    y: -6,
    scale: 1.015,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// Page reveal animation
export const pageReveal = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};
