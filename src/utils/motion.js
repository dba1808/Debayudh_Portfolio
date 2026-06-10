// Premium spring easing for buttery-smooth feel
const smoothEase = [0.22, 1, 0.36, 1];

export const textVariant = (delay) => {
  return {
    hidden: {
      y: -30,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.4,
        delay: delay || 0,
        damping: 24,
        stiffness: 80,
      },
    },
  };
};

export const fadeIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type || "spring",
        delay: delay,
        duration: duration,
        ease: smoothEase,
        damping: 22,
        stiffness: 70,
      },
    },
  };
};

export const zoomIn = (delay, duration) => {
  return {
    hidden: {
      scale: 0.85,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        delay: delay,
        duration: duration,
        damping: 20,
        stiffness: 90,
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
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type || "spring",
        delay: delay,
        duration: duration,
        damping: 24,
        stiffness: 70,
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
