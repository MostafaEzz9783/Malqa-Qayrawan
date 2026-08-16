import { motion } from "framer-motion";

export default function SectionHeader({ eyebrow, title, action, dark = true }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
      <div>
        {eyebrow && (
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
            style={{ color: "#BF7C4A" }}
          >
            {eyebrow}
          </p>
        )}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-black tracking-tight"
            style={{ color: dark ? "#F5F3EF" : "#151522", fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)" }}
          >
            {title}
          </motion.h2>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
