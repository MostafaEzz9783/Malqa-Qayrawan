import { memo } from "react";
import ProgressRing from "@/components/ui/ProgressRing";
import GlassCard from "@/components/ui/GlassCard";

function OccupancyRing({ t, occupancy }) {
  return (
    <GlassCard tilt={false} className="p-6 flex flex-col items-center text-center">
      <h3 className="text-sm font-black mb-4" style={{ color: "#F5F3EF" }}>
        {t.widgets.occupancyRing}
      </h3>
      <ProgressRing value={occupancy} label={`${occupancy}%`} color="#BF7C4A" />
    </GlassCard>
  );
}

export default memo(OccupancyRing);
