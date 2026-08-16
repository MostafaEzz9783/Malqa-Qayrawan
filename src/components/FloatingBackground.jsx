import { motion, useReducedMotion } from "framer-motion";

const SHAPES = [
  { size: 420, top: "-8%", left: "-6%", color: "rgba(191, 124, 74, 0.22)", duration: 26 },
  { size: 360, top: "10%", right: "-8%", color: "rgba(91, 63, 214, 0.20)", duration: 32 },
  { size: 320, bottom: "-10%", left: "18%", color: "rgba(191, 124, 74, 0.14)", duration: 28 },
];

export default function FloatingBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      {SHAPES.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            right: shape.right,
            bottom: shape.bottom,
            backgroundColor: shape.color,
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: [0, -30, 0, 20, 0],
                  x: [0, 20, 0, -15, 0],
                  rotate: [0, 6, 0, -4, 0],
                }
          }
          transition={{ duration: shape.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
