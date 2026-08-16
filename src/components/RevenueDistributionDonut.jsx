import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import ChartContainer from "@/components/ui/ChartContainer";
import { sarTooltipFormatter } from "@/lib/format";
import { chartTheme, colors } from "@/lib/theme";

const FEE_COLORS = {
  mathwaaShare: colors.bronze,
  otaFee: colors.purple,
};

function RevenueDistributionDonut({ t, row }) {
  const [hasEnteredView, setHasEnteredView] = useState(false);

  const slices = useMemo(
    () => [
      ...row.deductions.map((deduction, index) => ({
        key: deduction.key,
        name: t.fees[deduction.labelKey],
        value: deduction.amount,
        color: FEE_COLORS[deduction.key] ?? "#8b889c",
        index,
      })),
      {
        key: "netToOwner",
        name: t.kpi.netToOwner,
        value: row.netRevenue,
        color: colors.best,
        index: row.deductions.length,
      },
    ],
    [row, t],
  );

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={() => setHasEnteredView(true)}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ willChange: "opacity, transform" }}
    >
      <ChartContainer title={t.widgets.revenueDistribution} subtitle={t.widgets.revenueDistributionSubtitle} height={240}>
        <div className="flex items-center gap-4 h-full">
          <div className="w-[140px] h-[140px] flex-shrink-0">
            {hasEnteredView ? (
              <PieChart width={140} height={140}>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={64}
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {slices.map((slice) => (
                    <Cell key={slice.key} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={sarTooltipFormatter}
                  contentStyle={chartTheme.tooltipContentStyle}
                  labelStyle={chartTheme.tooltipLabelStyle}
                  itemStyle={chartTheme.tooltipItemStyle}
                  wrapperStyle={chartTheme.tooltipWrapperStyle}
                />
              </PieChart>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            {slices.map((slice) => (
              <div key={slice.key} className="flex items-center justify-between gap-2 text-xs rounded-lg px-2 py-1.5">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="truncate" style={{ color: "#B4B1C4" }}>
                    {slice.name}
                  </span>
                </span>
                <span className="font-bold flex-shrink-0" style={{ color: slice.color, direction: "ltr" }}>
                  {((slice.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </ChartContainer>
    </motion.div>
  );
}

export default memo(RevenueDistributionDonut);
