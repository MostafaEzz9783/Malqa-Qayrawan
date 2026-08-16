import { memo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

function AssumptionProgress({ t, occupancy, expectedOccupancy }) {
  const deltaPoints = Math.round((occupancy - expectedOccupancy) * 10) / 10;
  const isAbove = deltaPoints >= 0;

  return (
    <GlassCard tilt={false} className="p-6">
      <h3 className="text-sm font-black mb-1" style={{ color: "#F5F3EF" }}>
        {t.widgets.assumptionProgress}
      </h3>
      <p className="text-xs mb-5" style={{ color: "#9C99AE" }}>
        {t.widgets.assumptionProgressSubtitle}
      </p>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold mb-1" style={{ color: "#9C99AE" }}>
            {t.selectors.occupancy}
          </p>
          <p className="text-2xl font-black" style={{ color: "#E0A876", direction: "ltr" }}>
            {occupancy}%
          </p>
        </div>

        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold"
          style={{
            color: isAbove ? "#7DE0B5" : "#F0A899",
            backgroundColor: isAbove ? "rgba(63,184,138,0.14)" : "rgba(229,115,95,0.14)",
          }}
        >
          {isAbove ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {isAbove ? "+" : ""}
          {deltaPoints}pt
        </span>

        <div className="text-right">
          <p className="text-[11px] font-semibold mb-1" style={{ color: "#9C99AE" }}>
            {t.selectors.assumedOccupancy}
          </p>
          <p className="text-2xl font-black" style={{ color: "#B4A6F5", direction: "ltr" }}>
            {expectedOccupancy}%
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

export default memo(AssumptionProgress);
