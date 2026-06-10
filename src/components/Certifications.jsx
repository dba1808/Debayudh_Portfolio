import { memo, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { certifications } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant, fadeIn, staggerFadeIn } from "../utils/motion";

/* ─────────── Certificate Achievement Card ─────────── */
const CertificateCard = memo(({ cert, index, onClick }) => {
  return (
    <motion.div
      variants={staggerFadeIn}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group relative flex flex-col justify-between h-full border border-white/10 hover:border-violet-accent/30 shadow-lg hover:shadow-violet-accent/15"
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(index);
        }
      }}
      onMouseEnter={() => {
        window.dispatchEvent(new CustomEvent("neuron-hover", { detail: { cluster: "certifications" } }));
      }}
      onMouseLeave={() => {
        window.dispatchEvent(new CustomEvent("neuron-hover", { detail: { cluster: null } }));
      }}
      aria-label={`View certificate: ${cert.title}`}
    >
      {/* Visual Header / Cover preview */}
      <div className="w-full h-[180px] overflow-hidden relative border-b border-white/5 bg-gradient-to-br from-[#1a1245] to-[#0d0926] flex items-center justify-center group-hover:from-[#221759] group-hover:to-[#0f0a2b] transition-all duration-500">
        
        {/* Soft glowing aura behind emoji */}
        <div className="absolute w-20 h-20 rounded-full bg-violet-accent/15 blur-xl group-hover:bg-violet-accent/25 transition-all duration-500" />
        
        {/* Large Emoji */}
        <span className="text-[52px] inline-block relative z-10 group-hover:scale-115 group-hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] select-none">
          {cert.icon}
        </span>
        
        {/* Credential Category Badge */}
        <span className="absolute top-3 left-3 bg-[#050816]/75 border border-white/10 backdrop-blur-md text-[#00cea8] text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full z-10 font-mono">
          {cert.category}
        </span>

        {/* Hover overlay & icon */}
        <div className="absolute inset-0 bg-[#050816]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-[12px] font-bold flex items-center gap-1.5 bg-violet-accent/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-violet-accent/30 shadow-lg">
            <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Review Document
          </span>
        </div>

        {/* Dynamic Light Sweep effect */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-secondary/50 text-[10px] font-bold tracking-widest uppercase font-mono">
            Verified Achievement
          </span>
          <h3 className="text-white font-extrabold text-[15px] leading-snug mt-1 group-hover:text-violet-accent transition-colors duration-300">
            {cert.title}
          </h3>
          <p className="text-secondary text-[12.5px] font-semibold mt-1">
            {cert.organization}
          </p>
          {cert.subtitle && (
            <p className="text-secondary/60 text-[11px] mt-0.5 leading-normal">
              {cert.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/5">
          <span className="text-secondary/60 text-[11px] font-medium">{cert.duration}</span>
          <span className="bg-violet-accent/10 text-violet-accent border border-violet-accent/20 text-[10px] font-extrabold px-2.5 py-1 rounded-full font-mono">
            {cert.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

/* ─────────── Book-Opening Certificate Modal ─────────── */
const CertificateModal = memo(({ cert, isOpen, onClose, onNext, onPrev, currentIndex, total }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const contentRef = useRef(null);
  const [isMobileModal, setIsMobileModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobileModal(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset state when cert changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [cert]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "ArrowLeft":
          onPrev();
          break;
        case "+":
        case "=":
          setZoom((z) => Math.min(z + 0.25, 3));
          break;
        case "-":
          setZoom((z) => Math.max(z - 0.25, 0.5));
          break;
        default:
          break;
      }
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(Math.max(z + delta, 0.5), 3));
  }, []);

  // Drag to pan
  const handlePointerDown = useCallback((e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
  }, [position, zoom]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: posStartRef.current.x + dx,
      y: posStartRef.current.y + dy,
    });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (!cert) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#050816]/90 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{
              scale: 0.95,
              rotateY: -10,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              rotateY: 0,
              opacity: 1,
            }}
            exit={{
              scale: 0.95,
              rotateY: 10,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 0.5,
            }}
            style={{ perspective: "1200px" }}
            className="relative z-10 w-[95vw] max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between bg-tertiary/90 backdrop-blur-lg rounded-t-2xl px-4 py-3.5 sm:px-5 sm:py-4 border border-white/5 border-b-0">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-white font-bold text-[16px] sm:text-[18px] truncate">
                  {cert.title}
                </h3>
                <p className="text-secondary text-[12px] sm:text-[13px] truncate mt-0.5">
                  {cert.organization}
                  {cert.subtitle ? ` — ${cert.subtitle}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Desktop-only controls in header */}
                {!isMobileModal && (
                  <>
                    {/* Zoom controls */}
                    <button
                      onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors text-[16px] cursor-pointer"
                      aria-label="Zoom out"
                    >
                      −
                    </button>
                    <span className="text-secondary text-[13px] font-mono min-w-[45px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors text-[16px] cursor-pointer"
                      aria-label="Zoom in"
                    >
                      +
                    </button>

                    {/* Full resolution */}
                    <a
                      href={cert.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Open full resolution"
                      title="Open full resolution"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </>
                )}

                {/* Close (Large touch target on mobile) */}
                <button
                  onClick={onClose}
                  className="w-11 h-11 sm:w-8 sm:h-8 rounded-xl sm:rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500/20 hover:border-red-500/30 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Certificate view */}
            <div
              ref={contentRef}
              className={`flex-1 overflow-hidden bg-[#0a0820] border border-white/5 border-t-0 relative ${isMobileModal ? "" : "rounded-b-2xl"}`}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{
                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                touchAction: "none",
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center min-h-[45vh] sm:min-h-[60vh]"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {cert.type === "image" ? (
                  <img
                    src={cert.file}
                    alt={cert.title}
                    className="max-w-full max-h-[68vh] sm:max-h-[75vh] object-contain select-none"
                    draggable={false}
                  />
                ) : (
                  <iframe
                    src={`${cert.file}#toolbar=0&navpanes=0&scrollbar=0`}
                    title={cert.title}
                    className="w-full h-full min-h-[45vh] sm:min-h-[60vh]"
                    style={{ border: "none" }}
                  />
                )}
              </div>
            </div>

            {/* Mobile Bottom Toolbar (Zoom + Ext Link + Nav) */}
            {isMobileModal && (
              <div className="flex flex-col gap-3 bg-tertiary/95 backdrop-blur-lg rounded-b-2xl p-4 border border-white/5 border-t-0 z-20">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 text-[20px] font-bold cursor-pointer"
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                  <span className="text-secondary text-[14px] font-mono min-w-[50px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 text-[20px] font-bold cursor-pointer"
                    aria-label="Zoom in"
                  >
                    +
                  </button>

                  <div className="w-px h-6 bg-white/10 mx-1" />

                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Open full resolution"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>

                {total > 1 && (
                  <div className="flex items-center justify-center gap-5 border-t border-white/5 pt-3">
                    <button
                      onClick={onPrev}
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-violet-accent/20 hover:border-violet-accent/30 transition-all cursor-pointer"
                      aria-label="Previous certificate"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <span className="text-secondary text-[14px] font-bold font-mono">
                      {currentIndex + 1} / {total}
                    </span>
                    <button
                      onClick={onNext}
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-violet-accent/20 hover:border-violet-accent/30 transition-all cursor-pointer"
                      aria-label="Next certificate"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Desktop-only navigation below panel */}
            {!isMobileModal && total > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={onPrev}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-violet-accent/20 hover:border-violet-accent/30 transition-all cursor-pointer"
                  aria-label="Previous certificate"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <span className="text-secondary text-[14px] font-medium">
                  {currentIndex + 1} / {total}
                </span>
                <button
                  onClick={onNext}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-violet-accent/20 hover:border-violet-accent/30 transition-all cursor-pointer"
                  aria-label="Next certificate"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

/* ─────────── Certifications Section ─────────── */
const Certifications = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openCert = useCallback((index) => setSelectedIndex(index), []);
  const closeCert = useCallback(() => setSelectedIndex(null), []);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % certifications.length : null
    );
  }, []);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null
        ? (prev - 1 + certifications.length) % certifications.length
        : null
    );
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Professional Recognition</p>
        <h2 className={styles.sectionHeadText}>Certifications.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-2 sm:mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] mb-6 sm:mb-12"
      >
        Certificates earned through training programmes, university
        collaborations, and competitive AI events. Click any certificate to
        view it in full resolution.
      </motion.p>

      {/* Certificate grid (snapping swipeable list on mobile) */}
      <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible scrollbar-none">
        {certifications.map((cert, index) => (
          <div key={`cert-${index}`} className="min-w-[280px] xs:min-w-[320px] sm:min-w-0 snap-center flex-1">
            <CertificateCard
              cert={cert}
              index={index}
              onClick={openCert}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      <CertificateModal
        cert={selectedIndex !== null ? certifications[selectedIndex] : null}
        isOpen={selectedIndex !== null}
        onClose={closeCert}
        onNext={goNext}
        onPrev={goPrev}
        currentIndex={selectedIndex ?? 0}
        total={certifications.length}
      />
    </>
  );
};

export default SectionWrapper(memo(Certifications), "certifications");
