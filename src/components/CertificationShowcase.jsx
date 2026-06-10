import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem, spotlightVariants } from "../utils/premiumAnimations";

/**
 * CertificationShowcase
 * Premium certification display with spotlight effect on hover
 */
const CertificationShowcase = ({ certifications }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications?.map((cert, index) => (
          <motion.div
            key={cert.id || index}
            variants={staggerItem}
            onMouseMove={(e) => handleMouseMove(e, cert.id || index)}
            onMouseLeave={handleMouseLeave}
            className="group relative h-64 rounded-xl overflow-hidden cursor-pointer"
          >
            {/* Card container */}
            <motion.div
              className="relative w-full h-full rounded-xl border border-white/10 overflow-hidden bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"
              animate={{
                y: hoveredId === (cert.id || index) ? -8 : 0,
                boxShadow:
                  hoveredId === (cert.id || index)
                    ? "0 20px 50px rgba(145, 94, 255, 0.25), 0 0 40px rgba(145, 94, 255, 0.15)"
                    : "0 10px 30px rgba(145, 94, 255, 0.1)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Background image or gradient */}
              {cert.image ? (
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-accent/20 to-cyan-400/10" />
              )}

              {/* Spotlight effect */}
              <AnimatePresence>
                {hoveredId === (cert.id || index) && (
                  <motion.div
                    variants={spotlightVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute w-96 h-96 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(145, 94, 255, 0.3) 0%, rgba(145, 94, 255, 0) 70%)",
                      left: spotlightPos.x - 192,
                      top: spotlightPos.y - 192,
                      boxShadow: "0 0 60px rgba(145, 94, 255, 0.5)",
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Animated border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl border border-violet-accent pointer-events-none"
                animate={{
                  boxShadow:
                    hoveredId === (cert.id || index)
                      ? [
                          "inset 0 0 0 1px rgba(145, 94, 255, 0.5)",
                          "inset 0 0 20px rgba(145, 94, 255, 0.3), 0 0 20px rgba(145, 94, 255, 0.2)",
                        ]
                      : "inset 0 0 0 1px rgba(145, 94, 255, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Top section with icon */}
                <div>
                  {cert.icon && (
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl mb-4"
                      animate={{
                        scale: hoveredId === (cert.id || index) ? 1.1 : 1,
                        background:
                          hoveredId === (cert.id || index)
                            ? "rgba(145, 94, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {cert.icon}
                    </motion.div>
                  )}
                </div>

                {/* Bottom section with text */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {cert.title}
                  </h4>
                  <p className="text-sm text-white/70">{cert.issuer}</p>
                  {cert.date && (
                    <p className="text-xs text-white/50 mt-2">{cert.date}</p>
                  )}
                </div>
              </div>

              {/* Floating animation */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  y: hoveredId === (cert.id || index) ? [0, -4, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: hoveredId === (cert.id || index) ? Infinity : 0,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CertificationShowcase;
