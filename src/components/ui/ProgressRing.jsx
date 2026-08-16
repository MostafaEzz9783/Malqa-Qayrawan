import { motion, useReducedMotion } from "framer-motion";

export default function ProgressRing({
  value,
  size = 140,
  strokeWidth = 12,
  color = "#BF7C4A",
  trackColor = "rgba(255,255,255,0.08)",
  label,
  sublabel,
}) {
  const prefersReducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        {label && (
          <span className="font-black" style={{ color: "#F5F3EF", fontSize: size * 0.19 }}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[11px] font-medium mt-1" style={{ color: "#9C99AE" }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
