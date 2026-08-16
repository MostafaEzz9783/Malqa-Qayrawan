import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { motion as motionTokens } from "@/lib/theme";

export default function GlassCard({
  children,
  className = "",
  glow = false,
  tilt = true,
  dark = true,
  as: Component = motion.div,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const enableTilt = tilt && !prefersReducedMotion;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [motionTokens.tiltMaxDeg, -motionTokens.tiltMaxDeg]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-motionTokens.tiltMaxDeg, motionTokens.tiltMaxDeg]), {
    stiffness: 220,
    damping: 22,
  });

  const handleMouseMove = (event) => {
    if (!enableTilt || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Component
      ref={ref}
      className={`relative rounded-3xl border overflow-hidden ${className}`}
      style={{
        backgroundColor: dark ? "#1D1D2D" : "rgba(255,255,255,0.7)",
        borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,15,26,0.08)",
        boxShadow: glow
          ? "0 30px 80px -20px rgba(191, 124, 74, 0.25), 0 10px 30px -10px rgba(0,0,0,0.35)"
          : "0 20px 50px -20px rgba(0,0,0,0.35)",
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={prefersReducedMotion ? undefined : { y: motionTokens.hoverLift, scale: motionTokens.hoverScale }}
      transition={{ duration: motionTokens.duration.base, ease: "easeOut" }}
      {...rest}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(circle at 30% 0%, rgba(191,124,74,0.18), transparent 60%)" }}
        />
      )}
      <div className="relative" style={{ transform: "translateZ(24px)" }}>
        {children}
      </div>
    </Component>
  );
}
