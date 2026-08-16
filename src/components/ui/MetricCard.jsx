import GlassCard from "@/components/ui/GlassCard";
import AnimatedValue from "@/components/ui/AnimatedValue";

export default function MetricCard({
  label,
  value,
  format,
  prefix = "",
  suffix = "",
  sparkline,
  hero = false,
  accent = "#BF7C4A",
  footer,
}) {
  return (
    <GlassCard glow={hero} className={hero ? "p-8" : "p-5"}>
      <div className="min-w-0">
        <p className="text-xs font-semibold mb-2" style={{ color: "#9C99AE" }}>
          {label}
        </p>
        <p
          className={hero ? "text-4xl sm:text-5xl font-black tracking-tight" : "text-xl sm:text-2xl font-black tracking-tight"}
          style={{ color: accent, direction: "ltr" }}
        >
          <AnimatedValue value={value} format={format} prefix={prefix} suffix={suffix} />
        </p>
      </div>
      {sparkline && <div className="mt-3" style={{ height: hero ? 60 : 40 }}>{sparkline}</div>}
      {footer && (
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {footer}
        </div>
      )}
    </GlassCard>
  );
}
