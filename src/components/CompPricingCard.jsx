import { memo } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { ltrModel } from "@/data/ltrModel";
import { strModel } from "@/data/strModel";
import { marketComps } from "@/data/marketComps";
import { formatPercent } from "@/lib/format";

function RangeBar({ label, unit, comp, selectedValue, color }) {
  const span = comp.max - comp.min;
  const markerPosition = span > 0 ? ((selectedValue - comp.min) / span) * 100 : 50;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: "#F5F3EF" }}>
          {label}
        </span>
        <span className="text-xs font-black" style={{ color, direction: "ltr" }}>
          {formatPercent(selectedValue, 0)} {unit}
        </span>
      </div>
      <div className="relative h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} dir="ltr">
        <div
          className="absolute inset-y-0 rounded-full"
          style={{ left: "0%", right: "0%", background: `linear-gradient(90deg, ${color}33, ${color})` }}
        />
        <div
          className="absolute -top-1.5 w-4 h-4 rounded-full border-2"
          style={{
            left: `calc(${Math.max(0, Math.min(100, markerPosition))}% - 8px)`,
            backgroundColor: color,
            borderColor: "#151522",
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px]" style={{ color: "#6f6c82" }} dir="ltr">
        <span>min {formatPercent(comp.min, 0)}</span>
        <span>avg {formatPercent(comp.avg, 0)}</span>
        <span>max {formatPercent(comp.max, 0)}</span>
      </div>
    </div>
  );
}

function CompPricingCard({ t, scenario }) {
  const ltrPrice = ltrModel.scenarios[scenario].revenueAt100 / (ltrModel.unitCount * 12);
  const strPrice = strModel.scenarios[scenario].revenueAt100 / (strModel.unitCount * 360);

  return (
    <GlassCard id="market-comp" tilt={false} className="p-5 sm:p-6">
      <h3 className="text-sm font-black mb-1" style={{ color: "#F5F3EF" }}>
        {t.widgets.compPricing}
      </h3>
      <p className="text-xs mb-5" style={{ color: "#9C99AE" }}>
        {t.widgets.compPricingSubtitle}
      </p>
      <div className="space-y-5">
        <RangeBar label={t.models.ltr.label} unit={t.widgets.ltrPriceUnit} comp={marketComps.ltr} selectedValue={ltrPrice} color="#E0A876" />
        <RangeBar label={t.models.str.label} unit={t.widgets.strPriceUnit} comp={marketComps.str} selectedValue={strPrice} color="#B4A6F5" />
      </div>
    </GlassCard>
  );
}

export default memo(CompPricingCard);
