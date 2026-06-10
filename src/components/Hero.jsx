import { Suspense, lazy, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { styles } from "../styles";

const ComputersCanvas = lazy(() => import("./canvas/Computers"));

const Hero = () => {
  const videoRef = useRef(null);
  const retryPlayRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showComputerScene, setShowComputerScene] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const backgroundX = useTransform(mouseX, (value) => value * 20);
  const backgroundY = useTransform(mouseY, (value) => value * 20);
  const middleX = useTransform(mouseX, (value) => value * -15);
  const middleY = useTransform(mouseY, (value) => value * -15);
  const particleX = useTransform(mouseX, (value) => value * 10);
  const particleY = useTransform(mouseY, (value) => value * 10);
  const accentX = useTransform(mouseX, (value) => value * 5);
  const accentY = useTransform(mouseY, (value) => value * 5);

  const heroParticles = useMemo(() => [0, 1, 2, 3, 4], []);

  const clearRetryListeners = useCallback(() => {
    const retryPlay = retryPlayRef.current;
    if (!retryPlay) return;
    document.removeEventListener("click", retryPlay);
    document.removeEventListener("touchstart", retryPlay);
    document.removeEventListener("scroll", retryPlay);
    retryPlayRef.current = null;
  }, []);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Retry play on user interaction
      const retryPlay = () => {
        video.play().catch(() => {});
        clearRetryListeners();
      };
      clearRetryListeners();
      retryPlayRef.current = retryPlay;
      document.addEventListener("click", retryPlay, { once: true });
      document.addEventListener("touchstart", retryPlay, { once: true, passive: true });
      document.addEventListener("scroll", retryPlay, { once: true, passive: true });
    });
  }, [clearRetryListeners]);

  useEffect(() => {
    attemptPlay();

    // Also retry when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        attemptPlay();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearRetryListeners();
    };
  }, [attemptPlay, clearRetryListeners]);

  // Pause background video when off-screen to save CPU and GPU processing cycles
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.05 }
    );

    const section = video.closest("section");
    if (section) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, []);


  useEffect(() => {
    const scheduleIdle = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 350));
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout;
    const idleId = scheduleIdle(() => setShowComputerScene(true));

    return () => cancelIdle(idleId);
  }, []);

  // Track mouse and touch position for parallax depth effect
  useEffect(() => {
    let frameId = null;
    let latestX = 0;
    let latestY = 0;

    const handleMouseMove = (e) => {
      latestX = (e.clientX / window.innerWidth - 0.5) * 2;
      latestY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        mouseX.set(latestX);
        mouseY.set(latestY);
        frameId = null;
      });
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        latestX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        latestY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;

        if (frameId) return;
        frameId = requestAnimationFrame(() => {
          mouseX.set(latestX);
          mouseY.set(latestY);
          frameId = null;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [mouseX, mouseY]);

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden bg-[#030014]" style={{ background: "#030014" }}>
      {/* Solid dark background — always present to prevent any white flash */}
      <div
        className="absolute inset-0 z-0 bg-[#030014]"
        style={{ background: "linear-gradient(180deg, #030014 0%, #050816 100%)" }}
      />

      {/* Parallax Background Layer 1 - Deepest */}
      <motion.div
        className="absolute inset-0 z-[0.5]"
        style={{
          x: backgroundX,
          y: backgroundY,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div
          style={{
            background: "radial-gradient(ellipse at 20% 50%, rgba(145, 94, 255, 0.15) 0%, transparent 50%)",
          }}
          className="w-full h-full"
        />
      </motion.div>

      {/* Parallax Background Layer 2 - Middle */}
      <motion.div
        className="absolute inset-0 z-[0.6]"
        style={{
          x: middleX,
          y: middleY,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div
          style={{
            background: "radial-gradient(ellipse at 80% 50%, rgba(0, 206, 168, 0.1) 0%, transparent 50%)",
          }}
          className="w-full h-full"
        />
      </motion.div>

      {/* Background Video Layer */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoError(true)}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[2]"
        style={{
          opacity: videoReady && !videoError ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
          background: "transparent",
        }}
      >
        <source src="/write_DEBAYUDH_in_better_way_a.mp4" type="video/mp4" />
      </video>

      {/* Animated gradient fallback - always rendered behind the video to prevent any blank screen flashes */}
      <div
        className="absolute inset-0 z-[1] transition-opacity duration-1000"
        style={{
          opacity: videoReady && !videoError ? 0.35 : 1,
          background: "radial-gradient(ellipse at 30% 30%, rgba(145, 94, 255, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(0, 206, 168, 0.08) 0%, transparent 50%), linear-gradient(180deg, #030014 0%, #050816 100%)",
        }}
      />

      {/* Contrast & Legibility Gradient Shield Mask */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(3,0,20,0.25) 0%, rgba(3,0,20,0.55) 60%, #050816 100%)",
        }}
      />

      {/* Foreground Particle Effects Layer */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          x: particleX,
          y: particleY,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 25 }}
      >
        {/* Floating particles */}
        {heroParticles.map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-violet-accent/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Hero Content Wrapper */}
      <div className="relative z-10 w-full h-full">
        <div
          className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
        >
          {/* Left accent line with parallax */}
          <motion.div
            className='flex flex-col justify-center items-center mt-5'
            style={{
              x: accentX,
              y: accentY,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <motion.div className='w-5 h-5 rounded-full bg-[#915eff] glow-violet' />
            <div className='w-1 sm:h-80 h-40 violet-gradient' />
          </motion.div>

          {/* Hero text with premium reveals */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`${styles.heroHeadText} text-white antialiased tracking-wide subpixel-antialiased drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]`}
            >
              Hi, I'm{" "}
              <span className='animated-gradient-text'>
                Debayudh
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`${styles.heroSubText} mt-2 text-white-100 antialiased tracking-wide subpixel-antialiased drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]`}
            >
              AI/ML Engineer — I build intelligent systems,{" "}
              <br className='sm:block hidden' />
              deep learning models & smart web experiences
            </motion.p>

            {/* Subtle tag line with glow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className='mt-6 flex items-center gap-3'
            >
              <motion.div className='h-[1px] w-12 bg-gradient-to-r from-violet-accent to-transparent' />
              <span className='text-secondary/60 text-sm tracking-[0.3em] uppercase antialiased subpixel-antialiased drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]'>
                Debayudh Bhattacharya
              </span>
            </motion.div>
          </div>
        </div>

        {/* 3D Computer Scene */}
        {showComputerScene && (
          <Suspense fallback={null}>
            <ComputersCanvas />
          </Suspense>
        )}

        {/* Scroll indicator with enhanced animations */}
        <motion.div
          className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <a href='#about'>
            <motion.div
              className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary/40 flex justify-center items-start p-2 hover:border-secondary/80 transition-colors duration-500 group'
              whileHover={{ borderColor: "rgba(145, 94, 255, 0.8)" }}
            >
              <motion.div
                animate={{
                  y: [0, 24, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
                className='w-3 h-3 rounded-full bg-violet-accent group-hover:bg-violet-accent mb-1 shadow-[0_0_8px_rgba(145,94,255,0.6)]'
              />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Hero);
