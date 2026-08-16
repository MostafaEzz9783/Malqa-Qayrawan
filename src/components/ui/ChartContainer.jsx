import GlassCard from "@/components/ui/GlassCard";

export default function ChartContainer({ title, subtitle, badge, height = 260, children, footer }) {
  return (
    <GlassCard className="p-5 sm:p-6" tilt={false}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          {title && (
            <h3 className="text-sm font-black" style={{ color: "#F5F3EF" }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs mt-1" style={{ color: "#9C99AE" }}>
              {subtitle}
            </p>
          )}
        </div>
        {badge}
      </div>
      <div dir="ltr" style={{ height }}>
        {children}
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </GlassCard>
  );
}
