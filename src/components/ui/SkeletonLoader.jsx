export default function SkeletonLoader({ height = 220, className = "" }) {
  return (
    <div
      className={`rounded-3xl overflow-hidden ${className}`}
      style={{ height, backgroundColor: "#1D1D2D", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="w-full h-full animate-shimmer"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
