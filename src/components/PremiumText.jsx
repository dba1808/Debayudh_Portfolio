import React from "react";
import { motion } from "framer-motion";
import {
  characterReveal,
  gradientSweepReveal,
  blurToFocusReveal,
} from "../utils/premiumAnimations";

/**
 * PremiumText
 * Premium text reveal animations for titles and important text
 */

export const CharacterRevealText = ({ text, delay = 0 }) => {
  const characters = text.split("");

  return (
    <span className="inline-block">
      {characters.map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={characterReveal}
          initial="hidden"
          animate="visible"
          transition={{
            delay: delay + i * 0.03,
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export const GradientSweepText = ({
  text,
  delay = 0,
  className = "text-white",
}) => {
  return (
    <motion.div
      className={className}
      style={{
        backgroundImage: "linear-gradient(90deg, #fff, #00cea8, #915eff, #fff)",
        backgroundSize: "200% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      variants={gradientSweepReveal}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      {text}
    </motion.div>
  );
};

export const BlurToFocusText = ({ text, delay = 0, className = "text-white" }) => {
  return (
    <motion.div
      className={className}
      variants={blurToFocusReveal}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      {text}
    </motion.div>
  );
};

/**
 * PremiumTitle
 * Wrapper for section titles with premium reveal animation
 */
export const PremiumTitle = ({
  text,
  type = "character",
  delay = 0,
  className = "",
}) => {
  const baseClass = `text-4xl md:text-5xl font-bold ${className}`;

  switch (type) {
    case "gradient":
      return (
        <GradientSweepText text={text} delay={delay} className={baseClass} />
      );
    case "blur":
      return <BlurToFocusText text={text} delay={delay} className={baseClass} />;
    case "character":
    default:
      return (
        <div className={baseClass}>
          <CharacterRevealText text={text} delay={delay} />
        </div>
      );
  }
};

/**
 * AnimatedWord
 * Individual word with animation for emphasis
 */
export const AnimatedWord = ({
  word,
  delay = 0,
  type = "glow",
  className = "",
}) => {
  const baseClass = `inline-block font-bold ${className}`;

  if (type === "glow") {
    return (
      <motion.span
        className={baseClass}
        style={{
          textShadow: "0 0 20px rgba(145, 94, 255, 0.5)",
        }}
        animate={{
          textShadow: [
            "0 0 20px rgba(145, 94, 255, 0.5)",
            "0 0 40px rgba(145, 94, 255, 0.8)",
            "0 0 20px rgba(145, 94, 255, 0.5)",
          ],
        }}
        transition={{
          duration: 2,
          delay,
          repeat: Infinity,
        }}
      >
        {word}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={baseClass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {word}
    </motion.span>
  );
};
