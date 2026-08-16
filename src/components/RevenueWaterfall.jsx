import { memo, useMemo } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartContainer from "@/components/ui/ChartContainer";
import { formatSAR, sarTooltipFormatter } from "@/lib/format";
import { chartTheme, colors } from "@/lib/theme";

function buildSteps({ revenueAt100, row, t }) {
  const steps = [];
  let runningValue;

  if (typeof revenueAt100 === "number") {
    steps.push({ name: t.widgets.waterfallRevenueAt100, start: 0, end: revenueAt100, kind: "total" });
    steps.push({ name: t.widgets.waterfallOccupancyAdjusted, start: row.revenue, end: revenueAt100, kind: "decrease" });
    runningValue = row.revenue;
  } else {
    steps.push({ name: t.kpi.projectedRevenue, start: 0, end: row.revenue, kind: "total" });
    runningValue = row.revenue;
  }

  row.deductions.forEach((deduction) => {
    const nextValue = runningValue - deduction.amount;
    steps.push({ name: t.fees[deduction.labelKey], start: nextValue, end: runningValue, kind: "decrease" });
    runningValue = nextValue;
  });

  steps.push({ name: t.kpi.netToOwner, start: 0, end: runningValue, kind: "final" });

  return steps.map((step) => ({
    ...step,
    base: Math.min(step.start, step.end),
    value: Math.abs(step.end - step.start),
  }));
}

const KIND_COLOR = {
  total: colors.bronzeLight,
  decrease: colors.worst,
  final: colors.best,
};

function RevenueWaterfall({ t, row, revenueAt100 }) {
  const steps = useMemo(() => buildSteps({ revenueAt100, row, t }), [revenueAt100, row, t]);

  return (
    <ChartContainer title={t.widgets.revenueWaterfall} subtitle={t.widgets.revenueWaterfallSubtitle} height={280}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={steps} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis
            dataKey="name"
            tick={chartTheme.axisTickSmall}
            axisLine={chartTheme.axisLine}
            tickLine={false}
            interval={0}
            angle={-12}
            textAnchor="end"
            height={50}
          />
          <YAxis tick={chartTheme.axisTickSmall} axisLine={false} tickLine={false} tickFormatter={formatSAR} />
          <Tooltip
            formatter={sarTooltipFormatter}
            contentStyle={chartTheme.tooltipContentStyle}
            labelStyle={chartTheme.tooltipLabelStyle}
            itemStyle={chartTheme.tooltipItemStyle}
            wrapperStyle={chartTheme.tooltipWrapperStyle}
            cursor={false}
          />
          <Bar dataKey="base" stackId="waterfall" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="value" stackId="waterfall" radius={[6, 6, 6, 6]} isAnimationActive animationDuration={500}>
            {steps.map((step) => (
              <Cell key={step.name} fill={KIND_COLOR[step.kind]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default memo(RevenueWaterfall);
