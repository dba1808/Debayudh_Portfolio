import React from "react";
import { motion } from "framer-motion";

const DeveloperHoldCard = ({
  message = "Experience milestones are being carefully compiled. This log will open automatically upon developer deployment update.",
}) => {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.9, 0.4] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="developer-hold-card"
    >
      {/* Ambient glow orb */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-violet-accent/10 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#00cea8]/8 rounded-full blur-[50px] pointer-events-none" />

      {/* Status indicator */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-violet-accent" />
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-violet-accent animate-ping" />
        </div>
        <span className="text-violet-accent text-xs font-bold uppercase tracking-[0.25em]">
          System Hold — Awaiting Data
        </span>
      </div>

      {/* Main message */}
      <p className="text-secondary text-[15px] leading-[26px] max-w-lg italic">
        {message}
      </p>

      {/* Decorative grid lines */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-accent/20 to-transparent" />
    </motion.div>
  );
};

export default DeveloperHoldCard;
