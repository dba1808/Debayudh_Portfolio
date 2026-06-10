import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/**
 * ScrollProgressIndicator
 * Premium glowing neural pathway showing scroll progress
 */
const particles = [0, 1, 2];

const ScrollProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const viewBox = useMemo(
    () => `0 0 ${typeof window !== "undefined" ? window.innerWidth : 1200} 4`,
    []
  );

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        setScrollProgress((current) => (Math.abs(current - progress) > 0.15 ? progress : current));
        setIsVisible((current) => {
          const next = scrollTop > 100;
          return current === next ? current : next;
        });
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background track */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-accent/20 to-transparent" />

      {/* Progress bar with glow */}
      <motion.div
        className="absolute h-full bg-gradient-to-r from-violet-accent via-cyan-400 to-violet-accent"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: "0 0 20px rgba(145, 94, 255, 0.6), 0 0 40px rgba(0, 206, 168, 0.4)",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />

      {/* Leading glow effect */}
      <motion.div
        className="absolute h-full w-32 bg-gradient-to-l from-violet-accent/60 to-transparent blur-xl"
        style={{
          left: `calc(${scrollProgress}% - 128px)`,
        }}
        animate={{
          left: `calc(${scrollProgress}% - 128px)`,
        }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />

      {/* Animated particles along the path */}
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400 blur-sm"
          style={{
            left: `${scrollProgress}%`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -10 - i * 3, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}

      {/* SVG neural pathway for premium feel */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(145, 94, 255, 0)" />
            <stop offset={`${Math.max(5, scrollProgress - 5)}%`} stopColor="rgba(145, 94, 255, 0.8)" />
            <stop offset={`${scrollProgress}%`} stopColor="rgba(0, 206, 168, 1)" />
            <stop offset={`${Math.min(95, scrollProgress + 5)}%`} stopColor="rgba(145, 94, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(145, 94, 255, 0)" />
          </linearGradient>
          <filter id="progressGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line
          x1="0"
          y1="2"
          x2="100%"
          y2="2"
          stroke="url(#progressGradient)"
          strokeWidth="2"
          filter="url(#progressGlow)"
        />
      </svg>
    </motion.div>
  );
};

export default memo(ScrollProgressIndicator);
