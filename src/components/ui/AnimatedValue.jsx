import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function AnimatedValue({ value, format = (v) => String(v), prefix = "", suffix = "", duration = 950 }) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);
  const frameRef = useRef(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return undefined;
    }

    const startValue = hasMountedRef.current ? displayValue : 0;
    const startTime = performance.now();
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setDisplayValue(startValue + (value - startValue) * eased);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(animate);
      }
    };

    frameRef.current = window.requestAnimationFrame(animate);
    hasMountedRef.current = true;

    // rAF is throttled or fully paused while the tab/pane is backgrounded or
    // not compositing - guarantee the true value lands regardless, so a
    // backgrounded tab never leaves an investor-facing number stuck at 0.
    const safetyTimeoutId = window.setTimeout(() => setDisplayValue(value), duration + 150);

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      window.clearTimeout(safetyTimeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion]);

  const formatted = `${prefix}${format(displayValue)}${suffix}`;

  if (prefersReducedMotion) {
    return <span>{formatted}</span>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={Math.round(value * 100)}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ display: "inline-block" }}
      >
        {formatted}
      </motion.span>
    </AnimatePresence>
  );
}
