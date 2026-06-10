import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type = "success", duration = 6000, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose?.();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const isSuccess = type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 80, y: -20 }}
      transition={{ type: "spring", damping: 22, stiffness: 300 }}
      className="toast-card"
    >
      {/* Glow accent */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-[40px] pointer-events-none ${
          isSuccess ? "bg-violet-accent/20" : "bg-red-500/20"
        }`}
      />

      {/* Icon */}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isSuccess
              ? "bg-gradient-to-br from-violet-accent/30 to-[#00cea8]/20 border border-violet-accent/30"
              : "bg-red-500/20 border border-red-500/30"
          }`}
        >
          <span className="text-lg">{isSuccess ? "✓" : "✕"}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-bold uppercase tracking-[0.15em] mb-1 ${
              isSuccess ? "text-violet-accent" : "text-red-400"
            }`}
          >
            {isSuccess ? "Transmission Secure" : "Transmission Failed"}
          </p>
          <p className="text-secondary text-[13px] leading-[20px]">
            {message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full flex items-center justify-center text-secondary hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer text-xs"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isSuccess
              ? "bg-gradient-to-r from-violet-accent to-[#00cea8]"
              : "bg-gradient-to-r from-red-500 to-orange-500"
          }`}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.03 }}
        />
      </div>
    </motion.div>
  );
};

// Container component for managing toast state from parent
export const ToastContainer = ({ toast, onDismiss }) => {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration || 6000}
            onClose={onDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
