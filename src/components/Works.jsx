import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import DeveloperHoldCard from "./DeveloperHoldCard";
import { cardDepthVariants } from "../utils/premiumAnimations";

/* ─────────────── 3D Book-Fold Project Card ─────────────── */
const BookCard = ({ index, name, description, detailed_description, features, tags, image, source_code_link, live_demo_link }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className="book-card-wrapper group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setMousePos({ x: 0.5, y: 0.5 });
      }}
    >
      {/* Dynamic glow effect following cursor */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(145, 94, 255, 0.15) 0%, transparent 50%)`,
          filter: "blur(40px)",
        }}
        animate={{
          opacity: isOpen ? 0.3 : 0,
        }}
      />

      <motion.div
        className="book-card-container relative"
        animate={{
          y: isOpen ? -8 : 0,
          boxShadow: isOpen
            ? "0 25px 50px rgba(145, 94, 255, 0.2), 0 0 40px rgba(0, 206, 168, 0.1)"
            : "0 10px 30px rgba(145, 94, 255, 0.08)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* ── Inner / revealed content (sits behind the cover) ── */}
        <div className="book-inner">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-12 h-12 rounded-xl bg-black-100 border border-white/10 flex items-center justify-center text-2xl"
              animate={{
                scale: isOpen ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {image}
            </motion.div>
            <div>
              <h3 className="text-white font-extrabold text-[18px] leading-tight">
                {name}
              </h3>
              <div className="flex gap-1.5 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag.name}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/5 ${tag.color}`}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed description */}
          {detailed_description && (
            <div className="mb-3">
              <h4 className="text-violet-accent text-[11px] font-bold uppercase tracking-wider mb-1.5">
                Project Overview
              </h4>
              <p className="text-secondary text-[12px] leading-[19px]">
                {detailed_description}
              </p>
            </div>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <div className="mb-3">
              <h4 className="text-violet-accent text-[11px] font-bold uppercase tracking-wider mb-1.5">
                Key Features
              </h4>
              <ul className="space-y-1">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-secondary">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
            {/* GitHub link */}
            {source_code_link ? (
              <motion.a
                href={source_code_link}
                target="_blank"
                rel="noreferrer"
                className="locked-link-active"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Source
              </motion.a>
            ) : (
              <div className="locked-link" title="Production Link Pending Sync">
                <span>🔒</span>
                <span>Source Pending</span>
              </div>
            )}

            {/* Live demo link */}
            {live_demo_link ? (
              <motion.a
                href={live_demo_link}
                target="_blank"
                rel="noreferrer"
                className="locked-link-active live"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </motion.a>
            ) : (
              <div className="locked-link" title="Production Link Pending Sync">
                <span>🔒</span>
                <span>Deploy Pending</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Cover / front flap ── */}
        <motion.div
          className="book-cover relative"
          animate={{ rotateY: isOpen ? -135 : 0 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 18,
            mass: 0.8,
          }}
        >
          {/* Animated gradient border on hover */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
            animate={{
              boxShadow: isOpen
                ? "inset 0 0 30px rgba(145, 94, 255, 0.3), 0 0 40px rgba(145, 94, 255, 0.2)"
                : "inset 0 0 15px rgba(145, 94, 255, 0.1)",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Cover content */}
          <div className="relative w-full h-full flex flex-col justify-between p-5 overflow-hidden">
            {/* Ambient glow */}
            <motion.div
              className="absolute -top-12 -right-12 w-32 h-32 bg-violet-accent/10 rounded-full blur-[40px] pointer-events-none"
              animate={{
                opacity: isOpen ? 0.3 : 0.1,
                scale: isOpen ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Top: icon + github */}
            <div className="flex justify-between items-start">
              <motion.div
                className="w-full h-[160px] rounded-xl bg-gradient-to-br from-[#1d1836] to-[#0a0a1a] flex items-center justify-center relative overflow-hidden group"
                animate={{
                  boxShadow: isOpen
                    ? "0 0 30px rgba(145, 94, 255, 0.3), inset 0 0 20px rgba(145, 94, 255, 0.1)"
                    : "inset 0 0 10px rgba(145, 94, 255, 0.05)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-violet-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.span
                  className="text-6xl"
                  animate={{
                    scale: isOpen ? 1.15 : 1,
                    y: isOpen ? -4 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  {image}
                </motion.span>
              </motion.div>
            </div>

            {/* Middle: title + description */}
            <div className="mt-4 flex-1">
              <h3 className="text-white font-bold text-[20px] leading-tight mb-2 flex items-center justify-between">
                <span className="line-clamp-2">{name}</span>
              </h3>
              <p className="text-secondary text-[13px] leading-[20px] line-clamp-3">
                {description}
              </p>
            </div>

            {/* Bottom: tags + CTA */}
            <div className="mt-3">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.map((tag) => (
                  <span
                    key={`cover-${tag.name}`}
                    className={`text-[12px] ${tag.color}`}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-violet-accent text-xs font-bold">
                <span>Open Details</span>
                <span className="transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────── Works Section ─────────────── */
const Works = () => {
  const hasProjects = projects && projects.length > 0;

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText}`}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcase my skills and experience through
          real-world examples of my work. Hover over any project card to reveal
          a 3D fold-out with full details, features, and deployment links.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {hasProjects ? (
          projects.map((project, index) => (
            <BookCard
              key={`project-${index}`}
              index={index}
              {...project}
            />
          ))
        ) : (
          <DeveloperHoldCard message="Project entries are being compiled. New showcases will appear upon deployment update." />
        )}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
