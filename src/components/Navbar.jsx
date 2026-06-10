import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../constants";

/* ─────────── Falling Particle Effect Component ─────────── */
const HoverParticles = () => (
  <div className="absolute left-0 right-0 bottom-0 h-4 overflow-hidden pointer-events-none">
    <div className="falling-particle bg-[#00cea8]" style={{ left: "20%", animationDelay: "0s" }} />
    <div className="falling-particle bg-[#915eff]" style={{ left: "50%", animationDelay: "0.2s" }} />
    <div className="falling-particle bg-[#00cea8]" style={{ left: "80%", animationDelay: "0.1s" }} />
  </div>
);

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isIntroSweeping, setIsIntroSweeping] = useState(true);

  // Monitor scroll for subtle compression
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled((current) => {
          const next = window.scrollY > 40;
          return current === next ? current : next;
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer to track active section dynamically
  useEffect(() => {
    const sections = navLinks.map(link => document.getElementById(link.id)).filter(Boolean);
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          const matchedLink = navLinks.find(link => link.id === id);
          if (matchedLink) {
            setActive(matchedLink.title);
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  // End the intro sweep after animation finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroSweeping(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Close mobile dropdown menu on page scroll
  useEffect(() => {
    if (!toggle) return undefined;
    const handleScroll = () => setToggle(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toggle]);


  // Framer Motion load animation variants
  const navbarVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -25, x: "-50%" },
    show: {
      opacity: 1,
      y: 0,
      x: "-50%",
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.06,
        delayChildren: 0.15
      }
    }
  }), []);

  const childVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  }), []);

  const handleLogoClick = useCallback(() => {
    setActive("");
    window.lenis?.scrollTo(0, { duration: 1.4 });
  }, []);

  const toggleMenu = useCallback(() => setToggle((current) => !current), []);

  return (
    <>
      {/* Dynamic CSS Keyframes tag */}
      <style>{`
        @keyframes particle-fall {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(14px) scale(0.3);
            opacity: 0;
          }
        }
        .falling-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          pointer-events: none;
          animation: particle-fall 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      <motion.nav
        variants={navbarVariants}
        initial="hidden"
        animate="show"
        className={`fixed left-1/2 z-40 transition-all duration-300 w-[90%] max-w-5xl rounded-2xl border shadow-lg`}
        style={{
          transform: "translateX(-50%)",
          top: scrolled ? "8px" : "24px",
          backdropFilter: scrolled ? "blur(20px)" : "blur(12px)",
          backgroundColor: scrolled 
            ? "rgba(5, 8, 22, 0.8)" 
            : "rgba(5, 8, 22, 0.5)",
          borderColor: scrolled 
            ? "rgba(255, 255, 255, 0.15)" 
            : "rgba(255, 255, 255, 0.08)",
          boxShadow: scrolled 
            ? "0 8px 32px rgba(145, 94, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
            : "0 4px 16px rgba(145, 94, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className={`w-full flex justify-between items-center relative overflow-hidden transition-all duration-300 ${scrolled ? "px-6 py-1.5" : "px-6 md:px-8 py-3"}`}>
          
          {/* 1. DB Monogram Redesign Logo & Title */}
          <motion.div variants={childVariants} className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={handleLogoClick}
            >
              {/* Geometric monogram combined D+B symbol */}
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative flex items-center justify-center cursor-pointer group"
              >
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.02" stroke="white" strokeOpacity="0.08" strokeWidth="1"/>
                  <path d="M11 9H20C23.5 9 26 11.5 26 15C26 17.2 25 19 23 20C25 21 26 22.8 26 25C26 28.5 23.5 31 20 31H11V9Z" stroke="url(#dbGrad)" strokeWidth="2.2" strokeLinejoin="round"/>
                  <path d="M11 20H20" stroke="url(#dbGrad)" strokeWidth="2.2"/>
                  <path d="M16 9V31" stroke="url(#dbGrad)" strokeWidth="2.2"/>
                  <defs>
                    <linearGradient id="dbGrad" x1="11" y1="9" x2="26" y2="31" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#915eff"/>
                      <stop offset="100%" stopColor="#00cea8"/>
                    </linearGradient>
                  </defs>
                </svg>
                {/* Soft glow plate behind logo */}
                <div className="absolute inset-0 bg-violet-accent/15 rounded-lg filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>

              <div className="flex flex-col">
                <span className="text-white text-[15px] font-extrabold tracking-wider leading-none transition-colors duration-300 hover:text-violet-accent">
                  Debayudh
                </span>
                <span className="text-secondary/50 text-[9px] font-medium mt-1 leading-none tracking-wide font-mono">
                  Agentic AI Engineer
                </span>
              </div>
            </Link>
          </motion.div>

          {/* 2. Desktop Navigation Link Group */}
          <ul className="list-none hidden lg:flex flex-row items-center gap-2">
            {navLinks.map((nav) => {
              const isActive = active === nav.title;
              const isHovered = hoveredLink === nav.title;

              return (
                <motion.li
                  key={nav.id}
                  variants={childVariants}
                  onMouseEnter={() => setHoveredLink(nav.title)}
                  onMouseLeave={() => setHoveredLink(null)}
                  onClick={() => setActive(nav.title)}
                  whileHover={{ y: -1.5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative py-2 px-3.5 text-[13.5px] font-medium cursor-pointer select-none"
                >
                  <a
                    href={`#${nav.id}`}
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive || isHovered ? "text-white font-semibold" : "text-secondary hover:text-white"
                    }`}
                  >
                    {nav.title}
                  </a>

                  {/* Underline sliding & active indicator */}
                  {(isHovered || (isActive && !hoveredLink)) && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-violet-accent to-[#00cea8] rounded-full shadow-[0_1px_8px_rgba(145,94,255,0.7)]"
                      transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    />
                  )}

                  {/* Falling Light Particle Hover Effect */}
                  {isHovered && <HoverParticles />}
                </motion.li>
              );
            })}
          </ul>

          {/* 3. Mobile Navigation Menu Toggle */}
          <div className="lg:hidden flex justify-end items-center">
            <motion.button
              variants={childVariants}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center items-center gap-1.5 cursor-pointer hover:bg-white/10"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <span
                className={`block w-4 h-[1.5px] bg-white transition-all duration-300 ${
                  toggle ? "rotate-45 translate-y-[4.5px]" : ""
                }`}
              />
              <span
                className={`block w-4 h-[1.5px] bg-white transition-all duration-300 ${
                  toggle ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block w-4 h-[1.5px] bg-white transition-all duration-300 ${
                  toggle ? "-rotate-45 -translate-y-[4.5px]" : ""
                }`}
              />
            </motion.button>
          </div>

          {/* Sweep Light Entrance Animation */}
          {isIntroSweeping && (
            <motion.div
              initial={{ left: "-30%", width: "30%" }}
              animate={{ left: "130%" }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
              className="absolute bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#00cea8] to-transparent pointer-events-none"
            />
          )}

        </div>

        {/* Mobile Dropdown Panel inside the glass frame */}
        <AnimatePresence>
          {toggle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden px-4 pb-4 pt-2 border-t border-white/5 mt-2 overflow-hidden"
            >
              <ul className="list-none flex flex-col gap-1.5">
                {navLinks.map((nav) => {
                  const isActive = active === nav.title;
                  return (
                    <li
                      key={nav.id}
                      className={`font-semibold cursor-pointer text-[15px] rounded-xl transition-all ${
                        isActive 
                          ? "text-white bg-white/5 shadow-inner" 
                          : "text-secondary hover:text-white hover:bg-white/[0.02]"
                      }`}
                      onClick={() => {
                        setToggle(false);
                        setActive(nav.title);
                      }}
                    >
                      <a href={`#${nav.id}`} className="block w-full py-2.5 px-4">{nav.title}</a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>


      </motion.nav>
    </>
  );
};

export default memo(Navbar);
