import { motion } from "framer-motion";

export default function PremiumButton({ children, icon: Icon, variant = "solid", className = "", ...rest }) {
  const isSolid = variant === "solid";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BF7C4A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151522] ${className}`}
      style={
        isSolid
          ? { background: "linear-gradient(135deg, #E0A876 0%, #BF7C4A 100%)", color: "#151522" }
          : { backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#F5F3EF" }
      }
      {...rest}
    >
      {Icon && <Icon size={15} />}
      {children}
    </motion.button>
  );
}
