import { memo, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartContainer from "@/components/ui/ChartContainer";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatSAR, sarTooltipFormatter } from "@/lib/format";
import { chartTheme, colors, modelColor } from "@/lib/theme";

// A soft glowing dot per month, colored by STR/LTR (matches the existing
// legend badge) - the blur filter is defined once in <defs> and reused here.
function GlowDot({ cx, cy, payload }) {
  const fill = modelColor[payload.type] ?? colors.bronze;

  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={fill} opacity={0.35} filter="url(#cashFlowGlow)" />
      <circle cx={cx} cy={cy} r={3.5} fill={fill} stroke="#151522" strokeWidth={1.5} />
    </g>
  );
}

function CashFlowTimeline({ t, monthlySeries, isHybrid }) {
  const data = useMemo(
    () =>
      monthlySeries.map((month) => ({
        name: t.months[month.key],
        netToOwner: month.netToOwner,
        type: month.type,
      })),
    [monthlySeries, t],
  );

  return (
    <ChartContainer
      title={t.widgets.cashFlowTimeline}
      subtitle={t.widgets.cashFlowTimelineSubtitle}
      height={260}
      badge={
        isHybrid && (
          <div className="flex gap-1.5">
            <StatusBadge tone="purple">{t.widgets.strMonth}</StatusBadge>
            <StatusBadge tone="bronze">{t.widgets.ltrMonth}</StatusBadge>
          </div>
        )
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="cashFlowFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.bronze} stopOpacity={0.45} />
              <stop offset="100%" stopColor={colors.bronze} stopOpacity={0} />
            </linearGradient>
            <filter id="cashFlowGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} vertical={false} />
          <XAxis dataKey="name" tick={chartTheme.axisTickSmall} axisLine={chartTheme.axisLine} tickLine={false} />
          <YAxis tick={chartTheme.axisTickSmall} axisLine={false} tickLine={false} tickFormatter={formatSAR} />
          <Tooltip
            formatter={sarTooltipFormatter}
            contentStyle={chartTheme.tooltipContentStyle}
            labelStyle={chartTheme.tooltipLabelStyle}
            itemStyle={chartTheme.tooltipItemStyle}
            wrapperStyle={chartTheme.tooltipWrapperStyle}
            cursor={false}
          />
          {/* Recharts tweens the area's path shape on mount and on every data
              change (e.g. switching operating model), so this both draws the
              curve in on load and morphs smoothly between models for free. */}
          <Area
            type="monotone"
            dataKey="netToOwner"
            stroke={colors.bronze}
            strokeWidth={2.5}
            fill="url(#cashFlowFill)"
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            dot={<GlowDot />}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default memo(CashFlowTimeline);
