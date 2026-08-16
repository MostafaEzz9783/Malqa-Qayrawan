import { motion } from "framer-motion";

export default function SegmentedControl({ options, value, onChange, layoutId, size = "md", label }) {
  const padding = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex flex-wrap gap-1 rounded-2xl p-1"
      style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`relative ${padding} rounded-xl font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BF7C4A]`}
            style={{
              color: isActive ? "#151522" : "#9C99AE",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl"
                style={{ background: "linear-gradient(135deg, #E0A876 0%, #BF7C4A 100%)" }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative flex flex-col items-center leading-tight">
              <span>{option.label}</span>
              {option.sublabel && (
                <span
                  className="text-[10px] font-semibold mt-0.5"
                  style={{ color: isActive ? "rgba(21,21,34,0.7)" : "#6f6c82" }}
                >
                  {option.sublabel}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
