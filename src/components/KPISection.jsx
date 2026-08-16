import { memo, useMemo } from "react";
import MetricCard from "@/components/ui/MetricCard";
import Sparkline from "@/components/ui/Sparkline";
import { formatSAR, formatPercent } from "@/lib/format";

// STR/Hybrid are priced per night (360 nights/year in this study); LTR is
// priced per month (12 months/year) - ADR/RevPAR use whichever period the
// operating model actually prices in, so they're real derived market
// metrics, not invented ones.
const NIGHTLY_MODELS = new Set(["str", "hybrid"]);

function KPISection({ t, row, sparklineSeries, occupancy, revenueAt100, unitCount, operatingModel }) {
  const revenueSpark = useMemo(() => sparklineSeries.map((point) => ({ value: point.revenue })), [sparklineSeries]);

  const isNightly = NIGHTLY_MODELS.has(operatingModel);
  const period = isNightly ? 360 : 12;
  const adr = revenueAt100 / (unitCount * period);
  const revpar = row.revenue / (unitCount * period);
  const rateUnit = isNightly ? t.kpi.perNight : t.kpi.perMonth;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      <div className="lg:col-span-2">
        <MetricCard
          hero
          label={t.kpi.projectedRevenue}
          value={row.revenue}
          format={formatSAR}
          prefix="SAR "
          accent="#E0A876"
          sparkline={<Sparkline data={revenueSpark} color="#BF7C4A" />}
        />
      </div>

      <MetricCard
        label={t.kpi.occupancy}
        value={occupancy}
        format={(value) => formatPercent(value, 0)}
        suffix="%"
        accent="#3FB88A"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        <MetricCard
          label={isNightly ? t.kpi.adr : t.kpi.avgMonthlyRate}
          value={adr}
          format={formatSAR}
          prefix="SAR "
          suffix={` ${rateUnit}`}
          accent="#B4A6F5"
        />
        <MetricCard
          label={isNightly ? t.kpi.revpar : t.kpi.revenuePerUnitMonthMarket}
          value={revpar}
          format={formatSAR}
          prefix="SAR "
          accent="#E0A876"
        />
      </div>
    </div>
  );
}

export default memo(KPISection);
