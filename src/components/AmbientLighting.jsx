import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * AmbientLighting
 * Subtle light sources that illuminate the entire site
 */
const AmbientLighting = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary Violet Glow - Top Left */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(145, 94, 255, 0.8) 0%, rgba(145, 94, 255, 0) 70%)",
          top: "-10%",
          left: "-5%",
        }}
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Secondary Cyan Glow - Bottom Right */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-12"
        style={{
          background: "radial-gradient(circle, rgba(0, 206, 168, 0.6) 0%, rgba(0, 206, 168, 0) 70%)",
          bottom: "-10%",
          right: "-5%",
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Tertiary Blue Glow - Center */}
      <motion.div
        className="absolute w-[600px] h-[400px] rounded-full blur-3xl opacity-8"
        style={{
          background: "radial-gradient(ellipse, rgba(100, 150, 255, 0.4) 0%, rgba(100, 150, 255, 0) 70%)",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        animate={{
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Interactive Glow Following Mouse */}
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(145, 94, 255, 0.5) 0%, rgba(145, 94, 255, 0) 70%)",
          x: mousePos.x - 160,
          y: mousePos.y - 160,
        }}
        animate={{
          opacity: [0, 0.08, 0],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Subtle Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 result=%22noise%22/></filter><rect width=%22100%22 height=%22100%22 fill=%22white%22 filter=%22url(%23noise)%22/></svg>')",
          backgroundSize: "100px 100px",
        }}
      />
    </div>
  );
};

export default AmbientLighting;
