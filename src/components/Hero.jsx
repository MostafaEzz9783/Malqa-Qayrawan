import { motion } from "framer-motion";

export default function Hero({ t, title, subtitle }) {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-14 pb-8 text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-xs font-bold uppercase tracking-[0.25em] mb-4"
        style={{ color: "#BF7C4A" }}
      >
        {t.hero.eyebrow}
      </motion.p>
      <motion.h1
        key={title}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        className="font-black leading-none mb-4"
        style={{ color: "#F5F3EF", fontSize: "clamp(2.75rem, 7vw, 5rem)", letterSpacing: "-2px" }}
      >
        {title}
      </motion.h1>
      <motion.p
        key={subtitle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="text-sm font-medium"
        style={{ color: "#9C99AE" }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
