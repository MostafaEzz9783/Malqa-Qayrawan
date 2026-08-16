import { memo } from "react";
import { Building2, Percent, TrendingUp, Wallet } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedValue from "@/components/ui/AnimatedValue";
import { formatSAR, formatPercent } from "@/lib/format";

// Real, already-computed figures re-presented as a persuasive summary - no
// new business logic: annualRevenue/netOwnerIncome/revenuePerUnit come
// straight off the selected scenario's row, and yield is the same margin
// calculation OwnerEconomicsCard already uses.
const CARDS = [
  { key: "annualRevenue", icon: TrendingUp, accent: "#E0A876", bg: "rgba(224,168,118,0.14)" },
  { key: "netOwnerIncome", icon: Wallet, accent: "#7DE0B5", bg: "rgba(125,224,181,0.14)" },
  { key: "netOwnerYield", icon: Percent, accent: "#B4A6F5", bg: "rgba(180,166,245,0.14)" },
  { key: "revenuePerUnit", icon: Building2, accent: "#BF7C4A", bg: "rgba(191,124,74,0.14)" },
];

function InvestmentHighlights({ t, row }) {
  const yieldPercent = row.revenue > 0 ? (row.netRevenue / row.revenue) * 100 : 0;

  const metrics = {
    annualRevenue: { value: row.revenue, format: formatSAR, prefix: "SAR " },
    netOwnerIncome: { value: row.netRevenue, format: formatSAR, prefix: "SAR " },
    netOwnerYield: { value: yieldPercent, format: (v) => formatPercent(v, 1), suffix: "%" },
    revenuePerUnit: { value: row.monthlyPerUnit, format: formatSAR, prefix: "SAR ", suffix: ` ${t.kpi.perMonth}` },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {CARDS.map(({ key, icon: Icon, accent, bg }) => {
        const metric = metrics[key];
        return (
          <GlassCard key={key} glow className="p-6">
            <div
              className="inline-flex items-center justify-center rounded-2xl mb-4"
              style={{ width: 40, height: 40, backgroundColor: bg, color: accent }}
            >
              <Icon size={19} />
            </div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#9C99AE" }}>
              {t.highlights[key]}
            </p>
            <p className="text-2xl sm:text-3xl font-black tracking-tight mb-2" style={{ color: accent, direction: "ltr" }}>
              <AnimatedValue value={metric.value} format={metric.format} prefix={metric.prefix} suffix={metric.suffix} />
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#6f6c82" }}>
              {t.highlights[`${key}Subtitle`]}
            </p>
          </GlassCard>
        );
      })}
    </div>
  );
}

export default memo(InvestmentHighlights);
