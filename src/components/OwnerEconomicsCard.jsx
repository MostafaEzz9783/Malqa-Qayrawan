import { memo } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { formatSAR, formatPercent } from "@/lib/format";

function OwnerEconomicsCard({ t, row }) {
  const marginPercent = row.revenue > 0 ? (row.netRevenue / row.revenue) * 100 : 0;

  return (
    <GlassCard tilt={false} className="p-6">
      <h3 className="text-sm font-black mb-1" style={{ color: "#F5F3EF" }}>
        {t.widgets.ownerEconomics}
      </h3>
      <p className="text-xs mb-5" style={{ color: "#9C99AE" }}>
        {t.widgets.ownerEconomicsSubtitle}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-semibold mb-1" style={{ color: "#9C99AE" }}>
            {t.widgets.ownerMargin}
          </p>
          <p className="text-2xl font-black" style={{ color: "#7DE0B5", direction: "ltr" }}>
            {formatPercent(marginPercent, 1)}%
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold mb-1" style={{ color: "#9C99AE" }}>
            {t.widgets.netPerUnitPerMonth}
          </p>
          <p className="text-2xl font-black" style={{ color: "#E0A876", direction: "ltr" }}>
            SAR {formatSAR(row.monthlyPerUnit)}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

export default memo(OwnerEconomicsCard);
