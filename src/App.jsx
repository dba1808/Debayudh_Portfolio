import { Suspense, lazy, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import AmbientLighting from "./components/AmbientLighting";
import ScrollProgressIndicator from "./components/ScrollProgressIndicator";
import PremiumFooter from "./components/PremiumFooter";
import PremiumSectionDivider from "./components/SectionDivider";
import { useInView } from "./hooks/useInView";
import { pageReveal } from "./utils/motion";
import ErrorBoundary from "./components/ErrorBoundary";

const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Resume = lazy(() => import("./components/Resume"));
const Certifications = lazy(() => import("./components/Certifications"));
const JourneyExperience = lazy(() => import("./components/JourneyExperience"));
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));
const AgenticNetworkCanvas = lazy(() => import("./components/canvas/AgenticNetworkCanvas"));
const ParallaxHighlight = memo(() => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="absolute inset-0 cyan-purple-bg-highlight z-0 pointer-events-none"
    />
  );
});

const SectionFallback = memo(({ minHeight = 360 }) => (
  <div style={{ minHeight }} aria-hidden="true" />
));

const LazyInView = memo(({ children, minHeight = 360, rootMargin = "900px 0px" }) => {
  const [ref, isInView] = useInView({ rootMargin, threshold: 0.01, once: true });

  return (
    <div ref={ref} style={!isInView ? { minHeight } : undefined}>
      {isInView ? (
        <Suspense fallback={<SectionFallback minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
});

/* ─── Lenis Ultra-Smooth Scroll Provider ─── */
const useSmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    // Disable Lenis on touch devices to enable browser native momentum scrolling
    if (window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      lerp: 0.065,            // Slower, liquid-smooth deceleration
      wheelMultiplier: 0.82,  // More cinematic wheel increment scaling
      touchMultiplier: 1.6,   // Smooth touchpad/touch inertia multiplier
      syncTouch: true,        // Sync smooth scroll on precision trackpads and mobile devices
      infinite: false,
    });

    window.lenis = lenis;


    let frameId = null;
    let idleTimer = null;
    let isIdle = false;

    function raf(time) {
      // Stop the RAF chain if hidden/idle.
      if (document.hidden || isIdle) {
        frameId = null;
        return;
      }
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    const startRafIfNeeded = () => {
      if (document.hidden || isIdle) return;
      if (frameId == null) frameId = requestAnimationFrame(raf);
    };

    const stopRaf = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopRaf();
        return;
      }
      // When visible again, resume only if not idle.
      startRafIfNeeded();
    };

    const markActive = () => {
      isIdle = false;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isIdle = true;
        stopRaf();
      }, 900);
      startRafIfNeeded();
    };

    // Start immediately and then go idle after user stops interacting.
    handleVisibility();
    markActive();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("wheel", markActive, { passive: true });
    window.addEventListener("touchstart", markActive, { passive: true });


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
      if (frameId) cancelAnimationFrame(frameId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const toggleVisibility = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible((current) => {
          const next = window.scrollY > 400;
          return current === next ? current : next;
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollTop = useCallback(() => window.lenis?.scrollTo(0, { duration: 1.4 }), []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className='back-to-top'
          onClick={scrollTop}
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
  const springConfig = useMemo(() => ({ damping: 28, stiffness: 220, mass: 0.45 }), []);
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false
  );
  const visibleRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    let lastCursorUpdate = 0;
    const cursorUpdateTargetMs = 1000 / 45; // throttle cursor updates

    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - lastCursorUpdate < cursorUpdateTargetMs) return;
      lastCursorUpdate = now;

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

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
          <ErrorBoundary minHeight="100vh">
            <Hero />
          </ErrorBoundary>
        </div>
        <PremiumSectionDivider variant="neural" />

        {/* About section with floating Agentic Network Canvas */}
        <LazyInView minHeight={650}>
          <div className="relative">
            <ParallaxHighlight />
            <ErrorBoundary minHeight="650px">
              <AgenticNetworkCanvas />
            </ErrorBoundary>
            <About />
          </div>
        </LazyInView>

        <PremiumSectionDivider variant="particles" />
        <LazyInView minHeight={980}>
          <Experience />
        </LazyInView>
        <PremiumSectionDivider variant="neural" />
        <LazyInView minHeight={360}>
          <Tech />
        </LazyInView>
        <PremiumSectionDivider variant="particles" />
        <LazyInView minHeight={720}>
          <div className="relative">
            <ParallaxHighlight />
            <ErrorBoundary minHeight="720px">
              <Works />
            </ErrorBoundary>
          </div>
        </LazyInView>
        <PremiumSectionDivider variant="neural" />
        <LazyInView minHeight={720}>
          <Resume />
        </LazyInView>
        <PremiumSectionDivider variant="particles" />
        <LazyInView minHeight={620}>
          <Certifications />
        </LazyInView>
        <PremiumSectionDivider variant="neural" />
        <LazyInView minHeight={820}>
          <ErrorBoundary minHeight="620px">
            <JourneyExperience />
          </ErrorBoundary>
        </LazyInView>
        <PremiumSectionDivider variant="particles" />
        <LazyInView minHeight={760}>
          <div className='relative z-0'>
            <ErrorBoundary minHeight="600px">
              <Contact />
              <StarsCanvas />
            </ErrorBoundary>
          </div>
        </LazyInView>

        {/* Premium footer */}
        <PremiumFooter />

        {/* Back to Top */}
        <BackToTop />
      </motion.div>
    </BrowserRouter>
  );
};

export default App;
