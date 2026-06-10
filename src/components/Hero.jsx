import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { blurToFocusReveal, floatingAnimation } from "../utils/premiumAnimations";

const Hero = () => {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Retry play on user interaction
      const retryPlay = () => {
        video.play().catch(() => {});
        document.removeEventListener("click", retryPlay);
        document.removeEventListener("touchstart", retryPlay);
        document.removeEventListener("scroll", retryPlay);
      };
      document.addEventListener("click", retryPlay, { once: true });
      document.addEventListener("touchstart", retryPlay, { once: true });
      document.addEventListener("scroll", retryPlay, { once: true });
    });
  }, []);

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
    };
  }, [attemptPlay]);

  // Track mouse position for parallax depth effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
          x: mousePos.x * 20,
          y: mousePos.y * 20,
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
          x: mousePos.x * -15,
          y: mousePos.y * -15,
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
        onCanPlayThrough={() => setVideoReady(true)}
        onError={() => setVideoError(true)}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[1]"
        style={{
          opacity: videoReady && !videoError ? 1 : 0,
          transition: "opacity 1.2s ease-in-out",
          background: "transparent",
        }}
      >
        <source src="/write_DEBAYUDH_in_better_way_a.mp4" type="video/mp4" />
      </video>

      {/* Animated gradient fallback shown when video fails or hasn't loaded */}
      {(!videoReady || videoError) && (
        <div
          className="absolute inset-0 z-[1] bg-[#030014]"
          style={{
            background: "radial-gradient(ellipse at 30% 30%, rgba(145, 94, 255, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(0, 206, 168, 0.08) 0%, transparent 50%), linear-gradient(180deg, #030014 0%, #050816 100%)",
          }}
        />
      )}

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
          x: mousePos.x * 10,
          y: mousePos.y * 10,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 25 }}
      >
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
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
              x: mousePos.x * 5,
              y: mousePos.y * 5,
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
        <ComputersCanvas />

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

export default Hero;
