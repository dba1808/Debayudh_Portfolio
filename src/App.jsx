import { useState, useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Lenis from "lenis";
import {
  About,
  Contact,
  Experience,
  Hero,
  Navbar,
  Tech,
  Works,
  Resume,
  Certifications,
  JourneyExperience,
  StarsCanvas,
  AmbientLighting,
  ScrollProgressIndicator,
  PremiumFooter,
  SectionDivider as PremiumSectionDivider,
} from "./components";
import AgenticNetworkCanvas from "./components/canvas/AgenticNetworkCanvas";
import { pageReveal } from "./utils/motion";

/* ─── Lenis Ultra-Smooth Scroll Provider ─── */
const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,             // Linear interpolation for buttery momentum deceleration (0.07-0.09 is optimal)
      wheelMultiplier: 0.9,   // Slightly adjusted wheel input for liquid-smooth control
      touchMultiplier: 1.6,   // Smooth touchpad/touch inertia multiplier
      syncTouch: true,        // Sync smooth scroll on precision trackpads and mobile devices
      infinite: false,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with anchor links (hash navigation)
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const hash = target.getAttribute("href");
        const el = document.querySelector(hash);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -80, duration: 1.5 });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className='back-to-top'
          onClick={() => window.lenis?.scrollTo(0, { duration: 1.4 })}
          aria-label='Back to top'
        >
          <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path d='M12 4l-8 8h5v8h6v-8h5z' />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ─── Custom Cursor ─── */
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // High-frequency spring values for buttery-smooth trail tracking
  const springConfig = { damping: 28, stiffness: 220, mass: 0.45 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    setIsMobile(mediaQuery.matches);
    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest("a, button, input, textarea, select, [role='button']")
      ) {
        setHovered(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (
        target.closest("a, button, input, textarea, select, [role='button']")
      ) {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Core Dot with Soft Glow (Moves instantly with cursor) */}
      <motion.div
        className='w-1.5 h-1.5 bg-[#915eff] rounded-full pointer-events-none fixed z-[9999] transform -translate-x-1/2 -translate-y-1/2'
        style={{
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          boxShadow: "0 0 8px rgba(145, 94, 255, 0.8), 0 0 16px rgba(145, 94, 255, 0.4)",
        }}
      />
      {/* Tiny Trailing Ring (Smoothly trails behind via spring dynamics) */}
      <motion.div
        className='w-4.5 h-4.5 bg-[#915eff]/10 border border-[#915eff]/30 rounded-full pointer-events-none fixed z-[9999] transform -translate-x-1/2 -translate-y-1/2'
        animate={{
          scale: hovered ? 1.3 : 1,
          backgroundColor: hovered ? "rgba(145, 94, 255, 0.2)" : "rgba(145, 94, 255, 0.08)",
          borderColor: hovered ? "rgba(145, 94, 255, 0.55)" : "rgba(145, 94, 255, 0.25)",
        }}
        transition={{ duration: 0.15 }}
        style={{
          left: 0,
          top: 0,
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
    </>
  );
};

const App = () => {
  useSmoothScroll();

  return (
    <BrowserRouter>
      <motion.div
        variants={pageReveal}
        initial="hidden"
        animate="show"
        className='relative z-0 bg-primary'
      >
        {/* Premium ambient lighting system */}
        <AmbientLighting />
        
        {/* Scroll progress indicator */}
        <ScrollProgressIndicator />
        
        <CustomCursor />
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
        <PremiumSectionDivider variant="neural" />

        {/* About section with floating Agentic Network Canvas */}
        <div className="relative">
          <div className="absolute inset-0 cyan-purple-bg-highlight z-0" />
          <AgenticNetworkCanvas />
          <About />
        </div>

        <PremiumSectionDivider variant="particles" />
        <Experience />
        <PremiumSectionDivider variant="neural" />
        <Tech />
        <PremiumSectionDivider variant="particles" />
        <div className="relative">
          <div className="absolute inset-0 cyan-purple-bg-highlight z-0" />
          <Works />
        </div>
        <PremiumSectionDivider variant="neural" />
        <Resume />
        <PremiumSectionDivider variant="particles" />
        <Certifications />
        <PremiumSectionDivider variant="neural" />
        <JourneyExperience />
        <PremiumSectionDivider variant="particles" />
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div>

        {/* Premium footer */}
        <PremiumFooter />

        {/* Back to Top */}
        <BackToTop />
      </motion.div>
    </BrowserRouter>
  );
};

export default App;
