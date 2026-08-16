import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const DISPLAY_DURATION_MS = 1800;
const REDUCED_DISPLAY_DURATION_MS = 350;

export default function SplashScreen({ text, brandAlt, onDone }) {
  const prefersReducedMotion = useReducedMotion();
  const displayDuration = prefersReducedMotion ? REDUCED_DISPLAY_DURATION_MS : DISPLAY_DURATION_MS;

  useEffect(() => {
    const timer = setTimeout(onDone, displayDuration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayDuration]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#151522" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.15 : 0.5, ease: "easeInOut" }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85, y: -18 }}
        transition={{ duration: prefersReducedMotion ? 0.15 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{ width: 260, height: 260, backgroundColor: "rgba(191, 124, 74, 0.35)" }}
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.08, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {/* Soft light backing plate behind the logo - the logo's wordmark is dark
            purple, which reads poorly straight against the dark splash background,
            so it gets its own light, high-contrast "coin" to sit on. */}
        <div
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 176,
            height: 176,
            backgroundColor: "#FBF9F5",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        />
        <img
          src="/logo.png"
          alt={brandAlt}
          className="relative w-24 h-24 sm:w-28 sm:h-28 object-contain"
        />
      </motion.div>

      <motion.p
        className="mt-10 text-sm font-medium tracking-wide text-center"
        style={{ color: "#9C99AE" }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 0.35, duration: prefersReducedMotion ? 0.15 : 0.4 }}
      >
        {text}
      </motion.p>

      <div
        className="mt-7 w-40 max-w-[50vw] h-[3px] rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #BF7C4A, #E0A876)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: displayDuration / 1000, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
