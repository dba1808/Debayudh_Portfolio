import { Suspense, lazy, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { styles } from "../styles";

const ComputersCanvas = lazy(() => import("./canvas/Computers"));

const VolumeOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6.5 6.5 0 0 1 0 9.192.75.75 0 0 1-1.06-1.061 5 5 0 0 0 0-7.07.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.94 12l-2.22 2.22a.75.75 0 1 0 1.06 1.06L20 13.06l2.22 2.22a.75.75 0 1 0 1.06-1.06L21.06 12l2.22-2.22a.75.75 0 1 0-1.06-1.06L20 10.94l-2.22-2.22Z" />
  </svg>
);

const Hero = () => {
  const videoRef = useRef(null);
  const retryPlayRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmuteHint, setShowUnmuteHint] = useState(false);
  const [showComputerScene, setShowComputerScene] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
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

  const attemptPlay = useCallback(
    (preferSound = true) => {
      const video = videoRef.current;
      if (!video || videoError) return;

      const playWithCurrentMute = () => {
        video.play().catch(() => {
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
      };

      if (preferSound && !isMuted) {
        video.muted = false;
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          setShowUnmuteHint(true);
          playWithCurrentMute();
        });
        return;
      }

      video.muted = isMuted;
      playWithCurrentMute();
    },
    [clearRetryListeners, isMuted, videoError]
  );

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    video.muted = nextMuted;
    setShowUnmuteHint(false);

    if (!nextMuted) {
      video.play().catch(() => {});
    }
  }, [isMuted]);

  useEffect(() => {
    attemptPlay(true);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        attemptPlay(!isMuted);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearRetryListeners();
    };
  }, [attemptPlay, clearRetryListeners, isMuted]);

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

  const showVideo = !videoError;

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden bg-[#030014]">
      {/* Fallback background when video is missing or still loading */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-700"
        style={{
          opacity: showVideo && videoReady ? 0.15 : 1,
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(145, 94, 255, 0.18) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(0, 206, 168, 0.1) 0%, transparent 50%), linear-gradient(180deg, #030014 0%, #050816 100%)",
        }}
      />

      {/* Full-bleed cinematic background video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        preload="auto"
        muted={isMuted}
        onCanPlay={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
        onError={() => {
          setVideoError(true);
          setVideoReady(false);
        }}
        className="absolute inset-0 z-[1] w-full h-full object-cover object-center pointer-events-none"
        style={{
          opacity: showVideo ? (videoReady ? 1 : 0.6) : 0,
          transition: "opacity 0.8s ease-in-out",
          filter: "brightness(1.05) contrast(1.08) saturate(1.05)",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        <source src="/new_one.mp4" type="video/mp4" />
      </video>

      {/* Left-side text legibility scrim — keeps video visible on the right */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, rgba(3,0,20,0.82) 0%, rgba(3,0,20,0.45) 38%, rgba(3,0,20,0.12) 58%, transparent 72%), linear-gradient(180deg, transparent 70%, rgba(5,8,22,0.85) 100%)",
        }}
      />

      {/* Foreground particles */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{ x: particleX, y: particleY }}
        transition={{ type: "spring", stiffness: 80, damping: 25 }}
      >
        {heroParticles.map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-violet-accent/40"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.35, 0.75, 0.35],
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

      {/* Sound toggle */}
      {!videoError && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute background video" : "Mute background video"}
          aria-pressed={!isMuted}
          className={`absolute top-28 right-6 sm:right-10 z-30 flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 ${
            showUnmuteHint
              ? "border-violet-accent/80 bg-violet-accent/25 shadow-[0_0_24px_rgba(145,94,255,0.45)]"
              : "border-white/20 bg-black/40 hover:border-violet-accent/60 hover:bg-black/55"
          }`}
        >
          {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
          <span className="hidden sm:inline">{isMuted ? "Unmute" : "Mute"}</span>
          {showUnmuteHint && isMuted && (
            <span className="sm:hidden text-xs text-violet-accent">Tap for sound</span>
          )}
        </motion.button>
      )}

      {/* Hero content */}
      <div className="relative z-10 w-full h-full">
        <div
          className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
        >
          <motion.div
            className="flex flex-col justify-center items-center mt-5"
            style={{ x: accentX, y: accentY }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <motion.div className="w-5 h-5 rounded-full bg-[#915eff] glow-violet" />
            <div className="w-1 sm:h-80 h-40 violet-gradient" />
          </motion.div>

          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`${styles.heroHeadText} text-white antialiased tracking-wide subpixel-antialiased drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]`}
            >
              Hi, I&apos;m{" "}
              <span className="animated-gradient-text">Debayudh</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`${styles.heroSubText} mt-2 text-[#f3eeff] font-medium antialiased tracking-wide subpixel-antialiased drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]`}
            >
              AI/ML Engineer — I build intelligent systems,{" "}
              <br className="sm:block hidden" />
              deep learning models & smart web experiences
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-6 flex items-center gap-3"
            >
              <motion.div className="h-[1px] w-12 bg-gradient-to-r from-violet-accent to-transparent" />
              <span className="text-[#c4b5fd] text-sm tracking-[0.3em] uppercase antialiased subpixel-antialiased drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                Debayudh Bhattacharya
              </span>
            </motion.div>
          </div>
        </div>

        {showComputerScene && (
          <Suspense fallback={null}>
            <ComputersCanvas />
          </Suspense>
        )}

        <motion.div
          className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <a href="#about">
            <motion.div
              className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary/40 flex justify-center items-start p-2 hover:border-secondary/80 transition-colors duration-500 group"
              whileHover={{ borderColor: "rgba(145, 94, 255, 0.8)" }}
            >
              <motion.div
                animate={{ y: [0, 24, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
                className="w-3 h-3 rounded-full bg-violet-accent group-hover:bg-violet-accent mb-1 shadow-[0_0_8px_rgba(145,94,255,0.6)]"
              />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Hero);
