import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * SectionDivider
 * Dynamic neural pathway transitions with scroll-aware interactivity
 * Energy flows through connections, nodes pulse near sections, parallax motion creates depth
 */
const SectionDivider = ({ variant = "neural" }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [nearbyNode, setNearbyNode] = useState(null);

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
    if (variant !== "particles") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 60;

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
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
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

      requestAnimationFrame(animate);
    };

    animate();
  }, [variant]);

  if (variant === "particles") {
    return (
      <div 
        ref={containerRef}
        className="relative w-full h-40 flex items-center justify-center bg-gradient-to-b from-transparent via-violet-accent/8 to-transparent overflow-hidden"
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
      </div>
    );
  }

  // Neural pathway variant with scroll interactivity
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-40 flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent via-violet-accent/8 to-transparent"
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
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Super glow for nodes */}
          <filter id="superGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
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
                r: nearbyNode === i ? [12, 18, 12] : [12, 15, 12],
                opacity: nearbyNode === i ? [0.5, 1, 0.5] : [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: nearbyNode === i ? 0.8 : 1.5,
                repeat: Infinity,
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
                r: nearbyNode === i ? [7, 10, 7] : [7, 8, 7],
                boxShadow: nearbyNode === i ? [
                  "0 0 20px rgba(145, 94, 255, 0.8)",
                  "0 0 40px rgba(0, 206, 168, 0.8)",
                  "0 0 20px rgba(145, 94, 255, 0.8)",
                ] : [
                  "0 0 10px rgba(145, 94, 255, 0.4)",
                  "0 0 20px rgba(145, 94, 255, 0.4)",
                  "0 0 10px rgba(145, 94, 255, 0.4)",
                ],
              }}
              transition={{
                duration: nearbyNode === i ? 0.8 : 1.5,
                delay: i * 0.2,
                repeat: Infinity,
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
                  r: [7, 25],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
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
    </div>
  );
};

export default SectionDivider;
