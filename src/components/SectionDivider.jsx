import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

/**
 * SectionDivider
 * Dynamic neural pathway transitions with scroll-aware interactivity
 * Energy flows through connections, nodes pulse near sections, parallax motion creates depth
 */
const SectionDivider = ({ variant = "neural" }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [visibilityRef, isInView] = useInView({ rootMargin: "250px 0px" });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [nearbyNode, setNearbyNode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const positions = useMemo(() => [0.15, 0.5, 0.85], []);

  useEffect(() => {
    const checkMobile = () => {
      const match = window.matchMedia("(max-width: 768px)").matches || 
                    ('ontouchstart' in window) || 
                    (navigator.maxTouchPoints > 0);
      setIsMobile(match);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distance = rect.top - viewportCenter;
      const maxDistance = window.innerHeight;
      
      // Calculate scroll progress (-1 to 1, 0 at center)
      const progress = Math.max(-1, Math.min(1, -distance / maxDistance));
      setScrollProgress(progress);
      
      // Determine which node should be highlighted based on proximity
      const absProgress = Math.abs(progress);
      if (absProgress < 0.3) {
        setNearbyNode(1); // Center node
      } else if (progress < -0.3) {
        setNearbyNode(0); // Left node
      } else if (progress > 0.3) {
        setNearbyNode(2); // Right node
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (variant !== "particles") return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 60;

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 2.5 + 1;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08; // gravity
        this.pulsePhase += 0.05;

        // Proximity magnetic repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 14400) { // 120px radius
          const dist = Math.sqrt(distSq);
          if (dist > 0) {
            const force = (120 - dist) / 120;
            this.vx += (dx / dist) * force * 0.45;
            this.vy += (dy / dist) * force * 0.45;
          }
        }

        // Limit speed to maintain organic flow
        const speedSq = this.vx * this.vx + this.vy * this.vy;
        if (speedSq > 9) {
          const speed = Math.sqrt(speedSq);
          this.vx = (this.vx / speed) * 3;
          this.vy = (this.vy / speed) * 3;
        }

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }

        this.opacity = Math.max(0, this.opacity - 0.0015);
      }

      draw(ctx) {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(145, 94, 255, ${this.opacity * pulse})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.fillStyle = `rgba(145, 94, 255, ${this.opacity * 0.2})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulse * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId = null;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);

        // Regenerate if faded
        if (p.opacity <= 0) {
          particles[particles.indexOf(p)] = new Particle();
        }
      });

      // Draw connections between nearby particles with enhanced glow
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 32400) { // 180^2
            const distance = Math.sqrt(distSq);
            const connection = 1 - distance / 180;
            const baseOpacity = 0.15 * connection * p1.opacity;
            
            // Outer glow layer
            ctx.strokeStyle = `rgba(145, 94, 255, ${baseOpacity * 0.4})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Inner bright line
            ctx.strokeStyle = `rgba(145, 94, 255, ${baseOpacity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [variant]);

  if (variant === "particles") {
    return (
      <motion.div 
        ref={containerRef}
        className="relative w-full h-40 flex items-center justify-center bg-gradient-to-b from-transparent via-violet-accent/8 to-transparent overflow-hidden"
        style={{
          opacity: 1 - Math.abs(scrollProgress) * 0.75,
          scale: 0.95 + (1 - Math.abs(scrollProgress)) * 0.05,
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            y: scrollProgress * 20,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>
      </motion.div>
    );
  }

  // Neural pathway variant with scroll interactivity
  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full h-40 flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent via-violet-accent/8 to-transparent"
      style={{
        opacity: 1 - Math.abs(scrollProgress) * 0.75,
        scale: 0.95 + (1 - Math.abs(scrollProgress)) * 0.05,
      }}
    >
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1200 240"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Enhanced gradient with more vibrant colors */}
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(145, 94, 255, 0)" />
            <stop offset="20%" stopColor="rgba(145, 94, 255, 0.4)" />
            <stop offset="30%" stopColor="rgba(145, 94, 255, 0.8)" />
            <stop offset="50%" stopColor="rgba(0, 206, 168, 1)" />
            <stop offset="70%" stopColor="rgba(145, 94, 255, 0.8)" />
            <stop offset="80%" stopColor="rgba(145, 94, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(145, 94, 255, 0)" />
          </linearGradient>

          {/* Enhanced bloom filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation={isMobile ? "2" : "4"} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Super glow for nodes */}
          <filter id="superGlow">
            <feGaussianBlur stdDeviation={isMobile ? "3" : "6"} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Parallax layer 1: Background pathways */}
        <motion.g
          animate={{
            y: scrollProgress * 15,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          {/* Main neural pathway - thicker and more vibrant */}
          <motion.path
            d="M 0 120 Q 300 60 600 120 T 1200 120"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            fill="none"
            filter="url(#glow)"
            initial={{ strokeDasharray: 1200, strokeDashoffset: 1200 }}
            animate={{ 
              strokeDashoffset: [1200, 0],
              opacity: [0.6, 1],
            }}
            transition={{
              strokeDashoffset: {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.5,
              },
              opacity: {
                duration: 1.5,
                ease: "easeInOut",
              },
            }}
          />

          {/* Secondary pathways - more visible */}
          <motion.path
            d="M 100 120 L 200 80 L 300 120 L 400 160"
            stroke="rgba(145, 94, 255, 0.5)"
            strokeWidth="2.5"
            fill="none"
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.2,
            }}
          />

          <motion.path
            d="M 800 120 L 900 80 L 1000 120 L 1100 160"
            stroke="rgba(0, 206, 168, 0.4)"
            strokeWidth="2.5"
            fill="none"
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.4,
            }}
          />
        </motion.g>

        {/* Interactive neural nodes - React to scroll proximity */}
        {[0.15, 0.5, 0.85].map((position, i) => (
          <motion.g key={i}>
            {/* Outer glow ring */}
            <motion.circle
              cx={position * 1200}
              cy="120"
              r="12"
              fill="none"
              stroke="rgba(145, 94, 255, 0.3)"
              strokeWidth="2"
              animate={{
                scale: nearbyNode === i ? 1.4 : 1.0,
                opacity: nearbyNode === i ? 0.8 : 0.3,
              }}
              style={{
                originX: `${position * 1200}px`,
                originY: "120px",
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
              }}
            />

            {/* Core node with enhanced glow */}
            <motion.circle
              cx={position * 1200}
              cy="120"
              r="7"
              fill={nearbyNode === i ? "rgba(0, 206, 168, 0.9)" : "rgba(145, 94, 255, 0.8)"}
              filter="url(#superGlow)"
              animate={{
                scale: nearbyNode === i ? 1.3 : 1.0,
              }}
              style={{
                originX: `${position * 1200}px`,
                originY: "120px",
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
              }}
            />

            {/* Energy pulse effect around active node */}
            {nearbyNode === i && (
              <motion.circle
                cx={position * 1200}
                cy="120"
                r="7"
                fill="none"
                stroke="rgba(0, 206, 168, 0.6)"
                strokeWidth="2"
                animate={{
                  scale: [1, 3.5],
                  opacity: [1, 0],
                }}
                style={{
                  originX: `${position * 1200}px`,
                  originY: "120px",
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
          </motion.g>
        ))}

        {/* Animated energy flow bar - moves with scroll progress */}
        <motion.rect
          x="0"
          y="80"
          width="1200"
          height="80"
          fill="none"
          animate={{
            x: scrollProgress * 400 - 200,
          }}
          transition={{ type: "spring", stiffness: 80, damping: 25 }}
        >
          <motion.linearGradient id="energyFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(145, 94, 255, 0)" />
            <stop offset="50%" stopColor="rgba(0, 206, 168, 0.4)" />
            <stop offset="100%" stopColor="rgba(145, 94, 255, 0)" />
          </motion.linearGradient>
        </motion.rect>
      </svg>

      {/* Section labels for context */}
      <motion.div
        className="absolute left-8 top-4 text-xs font-semibold text-white/30 uppercase tracking-widest pointer-events-none"
        animate={{
          opacity: scrollProgress < -0.4 ? 1 : 0.3,
        }}
      >
        ↑ Earlier
      </motion.div>

      <motion.div
        className="absolute right-8 bottom-4 text-xs font-semibold text-white/30 uppercase tracking-widest pointer-events-none"
        animate={{
          opacity: scrollProgress > 0.4 ? 1 : 0.3,
        }}
      >
        Next ↓
      </motion.div>
    </motion.div>
  );
};

export default SectionDivider;
