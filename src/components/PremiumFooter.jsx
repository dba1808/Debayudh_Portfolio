import React from "react";
import { motion } from "framer-motion";

/**
 * PremiumFooter
 * Elegant personal signature footer with ink reveal animation
 */
const PremiumFooter = () => {
  const connections = [
    {
      label: "GitHub",
      url: "https://github.com/dba1808",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/debayudh-bhattacharya-3b375028b",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.5 2h-17C2.1 2 1 3.1 1 4.5v15C1 20.9 2.1 22 3.5 22h17c1.4 0 2.5-1.1 2.5-2.5v-15C23 3.1 21.9 2 20.5 2zM8 19H5v-9h3v9zm-1.5-10.26c-.966 0-1.75-.79-1.75-1.76s.784-1.78 1.75-1.78 1.75.79 1.75 1.78-.784 1.76-1.75 1.76zM19 19h-3v-4.5c0-1.1-.02-2.5-1.52-2.5-1.53 0-1.76 1.19-1.76 2.42V19h-3v-9h2.88v1.23h.04c.4-.76 1.39-1.56 2.86-1.56 3.06 0 3.63 2.01 3.63 4.63V19z" />
        </svg>
      ),
    },
    {
      label: "X (Twitter)",
      url: "https://x.com/DebayudhBh",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.67-5.833 6.67H2.562l7.73-8.835L1.75 2.25h6.969l4.613 6.07L17.537 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Email",
      url: "mailto:bhattacharyadebayudh13@gmail.com",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" opacity="0.3" />
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative w-full bg-gradient-to-t from-[#050816] via-[#050816]/50 to-transparent pt-28 pb-12 px-6 md:px-12 overflow-hidden">
      {/* Soft premium background glow (minimal, not flashy) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-3xl bg-violet-accent/5" />
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[420px] h-[220px] rounded-full blur-3xl bg-[#00cea8]/5" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Connections (keep original social links) */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-10">Connect</h3>

          <div className="flex flex-col items-center gap-1.5 mb-16">
            {connections.map((connection, i) => (
              <motion.a
                key={i}
                href={connection.url}
                target={connection.url.startsWith("http") ? "_blank" : "_self"}
                rel={connection.url.startsWith("http") ? "noopener noreferrer" : ""}
                className="group inline-flex items-center gap-3 text-secondary hover:text-white transition-colors duration-300 py-2.5 px-4 rounded-xl hover:bg-white/5"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <span className="text-violet-accent/0 group-hover:text-violet-accent/100 transition-colors duration-300">
                  {connection.icon}
                </span>
                <span className="text-base">{connection.label}</span>
                {connection.url.startsWith("http") && (
                  <span className="text-xs text-secondary/50 group-hover:text-violet-accent/50 transition-colors duration-300">
                    ↗
                  </span>
                )}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />
        {/* Premium glowing line above signature */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scaleX: 0.75 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="h-px w-[180px] md:w-[260px] bg-gradient-to-r from-transparent via-violet-accent/70 to-transparent" />
        </motion.div>

        {/* Signature block */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Soft glow layer (slow breathing) */}
          <motion.div
            className="relative inline-block"
            animate={{
              filter: [
                "drop-shadow(0 0 14px rgba(145, 94, 255, 0.18))",
                "drop-shadow(0 0 24px rgba(145, 94, 255, 0.28))",
                "drop-shadow(0 0 14px rgba(145, 94, 255, 0.18))",
              ],
              opacity: [0.92, 1, 0.92],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Tiny sparkle particles around the signature (subtle) */}
            <div className="pointer-events-none absolute -left-6 -top-4 w-8 h-8 opacity-70">
              <motion.span
                className="block absolute left-1 top-2 w-1.5 h-1.5 rounded-full bg-violet-accent/60"
                animate={{ scale: [0.9, 1.25, 0.9], opacity: [0.35, 0.9, 0.35] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="block absolute left-4 top-5 w-1 h-1 rounded-full bg-[#00cea8]/60"
                animate={{ scale: [0.85, 1.18, 0.85], opacity: [0.25, 0.75, 0.25] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </div>

            <div className="px-2 sm:px-0">
              <div
                className="text-white font-semibold tracking-wide"
                style={{
                  fontFamily: `"Tangerine", "Segoe Script", "Apple Chancery", cursive`,
                  fontSize: "clamp(32px, 5.2vw, 54px)",
                  lineHeight: 1.05,
                  textShadow: "0 0 26px rgba(145, 94, 255, 0.28)",
                }}
              >
                Debayudh Bhattacharya ❤️
              </div>
            </div>
          </motion.div>

          {/* Year */}
          <div
            className="mt-4 md:mt-6 text-white/40 tracking-[0.34em] font-light"
            style={{ fontSize: "clamp(14px, 2.3vw, 16px)" }}
          >
            2026
          </div>

          {/* Delicate neural-inspired trails (very subtle, not busy) */}
          <div className="relative mt-5 h-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="h-px w-[120px] md:w-[160px] bg-gradient-to-r from-violet-accent/0 via-violet-accent/35 to-[#00cea8]/0"
                animate={{ opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Luxury handwriting font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap');
      `}</style>
    </footer>
  );
};

export default PremiumFooter;
