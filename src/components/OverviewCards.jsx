import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  floatingAnimation,
  cardDepthVariants,
  staggerContainer,
  staggerItem,
  glowPulse,
} from "../utils/premiumAnimations";

/**
 * OverviewCards
 * Premium floating cards showing key areas of expertise
 */
const OverviewCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const cards = [
    {
      id: 1,
      title: "AI & ML",
      description: "Building intelligent systems with deep learning and NLP",
      icon: "🤖",
      color: "from-violet-accent/20 to-violet-accent/5",
      borderColor: "border-violet-accent/30",
    },
    {
      id: 2,
      title: "Agentic AI",
      description: "Creating autonomous agents with advanced decision-making",
      icon: "🧠",
      color: "from-cyan-400/20 to-cyan-400/5",
      borderColor: "border-cyan-400/30",
    },
    {
      id: 3,
      title: "Problem Solving",
      description: "Crafting elegant solutions to complex challenges",
      icon: "⚡",
      color: "from-green-500/20 to-green-500/5",
      borderColor: "border-green-500/30",
    },
  ];

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredCard(null)}
      variants={staggerContainer(0.2, 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            variants={staggerItem}
            onMouseEnter={() => handleCardHover(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative"
          >
            {/* Animated background glow that follows cursor */}
            {hoveredCard === card.id && (
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-50 blur-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${
                    card.id === 1
                      ? "rgba(145, 94, 255, 0.4)"
                      : card.id === 2
                      ? "rgba(0, 206, 168, 0.4)"
                      : "rgba(34, 197, 94, 0.4)"
                  }, transparent 80%)`,
                  left: containerRef.current
                    ? (mousePos.x - 192) + "px"
                    : "0",
                  top: containerRef.current
                    ? (mousePos.y - 192) + "px"
                    : "0",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
              />
            )}

            {/* Card */}
            <motion.div
              variants={cardDepthVariants}
              initial="rest"
              animate={hoveredCard === card.id ? "hover" : "rest"}
              className={`relative h-full rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} backdrop-blur-md p-8 overflow-hidden transition-colors duration-300`}
            >
              {/* Animated gradient border on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  border: `2px solid transparent`,
                  backgroundImage: `linear-gradient(135deg, ${
                    card.id === 1
                      ? "rgba(145, 94, 255, 0.5), rgba(145, 94, 255, 0)"
                      : card.id === 2
                      ? "rgba(0, 206, 168, 0.5), rgba(0, 206, 168, 0)"
                      : "rgba(34, 197, 94, 0.5), rgba(34, 197, 94, 0)"
                  })`,
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
              />

              {/* Icon container with pulse */}
              <motion.div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.color} border ${card.borderColor} flex items-center justify-center text-3xl mb-6 relative z-10`}
                animate={{
                  scale: hoveredCard === card.id ? [1, 1.05, 1] : 1,
                  boxShadow:
                    hoveredCard === card.id
                      ? [
                          "0 0 20px rgba(145, 94, 255, 0.3)",
                          "0 0 40px rgba(145, 94, 255, 0.5)",
                          "0 0 20px rgba(145, 94, 255, 0.3)",
                        ]
                      : "0 0 10px rgba(145, 94, 255, 0.1)",
                }}
                transition={{
                  duration: hoveredCard === card.id ? 1.5 : 0.3,
                  repeat: hoveredCard === card.id ? Infinity : 0,
                }}
              >
                {card.icon}
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Floating particles effect */}
              {hoveredCard === card.id && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className={`absolute w-1 h-1 rounded-full ${
                        card.id === 1
                          ? "bg-violet-accent"
                          : card.id === 2
                          ? "bg-cyan-400"
                          : "bg-green-500"
                      }`}
                      initial={{
                        x: mousePos.x || 0,
                        y: mousePos.y || 0,
                        opacity: 1,
                      }}
                      animate={{
                        x: (mousePos.x || 0) + (Math.random() - 0.5) * 100,
                        y: (mousePos.y || 0) + (Math.random() - 0.5) * 100,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </>
              )}

              {/* Subtle glow that pulses */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
                animate={{
                  opacity: hoveredCard === card.id ? [0.2, 0.4, 0.2] : 0,
                  boxShadow:
                    hoveredCard === card.id
                      ? [
                          `0 0 20px rgba(145, 94, 255, 0.2)`,
                          `0 0 40px rgba(145, 94, 255, 0.4)`,
                          `0 0 20px rgba(145, 94, 255, 0.2)`,
                        ]
                      : "0 0 0px rgba(145, 94, 255, 0)",
                }}
                transition={{
                  duration: 2,
                  repeat: hoveredCard === card.id ? Infinity : 0,
                }}
              />
            </motion.div>

            {/* Floating base animation */}
            {hoveredCard !== card.id && (
              <motion.div
                className="absolute inset-0 -z-10"
                animate={floatingAnimation}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        {/* Blurred background shapes that react to cards */}
        {cards.map((card, i) => (
          <motion.div
            key={`bg-${i}`}
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-0"
            style={{
              background:
                card.id === 1
                  ? "radial-gradient(circle, rgba(145, 94, 255, 0.3) 0%, transparent 70%)"
                  : card.id === 2
                  ? "radial-gradient(circle, rgba(0, 206, 168, 0.3) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)",
              left: `${33 * i}%`,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            animate={{
              opacity: hoveredCard === card.id ? 0.3 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default OverviewCards;
