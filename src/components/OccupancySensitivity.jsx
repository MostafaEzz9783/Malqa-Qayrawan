import { memo, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartContainer from "@/components/ui/ChartContainer";
import { formatSAR, sarTooltipFormatter } from "@/lib/format";
import { chartTheme, colors } from "@/lib/theme";

function OccupancySensitivity({ t, occupancyOptions, scenarioData, selectedOccupancy }) {
  const data = useMemo(
    () =>
      occupancyOptions.map((option) => ({
        occupancy: `${option}%`,
        netRevenue: scenarioData.occupancy[option].netRevenue,
        isSelected: option === selectedOccupancy,
      })),
    [occupancyOptions, scenarioData, selectedOccupancy],
  );

  return (
    <ChartContainer title={t.widgets.occupancySensitivity} subtitle={t.widgets.occupancySensitivitySubtitle} height={240}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="occupancySensitivityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.best} stopOpacity={0.4} />
              <stop offset="100%" stopColor={colors.best} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} vertical={false} />
          <XAxis dataKey="occupancy" tick={chartTheme.axisTick} axisLine={chartTheme.axisLine} tickLine={false} />
          <YAxis tick={chartTheme.axisTickSmall} axisLine={false} tickLine={false} tickFormatter={formatSAR} />
          <Tooltip
            formatter={sarTooltipFormatter}
            contentStyle={chartTheme.tooltipContentStyle}
            labelStyle={chartTheme.tooltipLabelStyle}
            itemStyle={chartTheme.tooltipItemStyle}
            wrapperStyle={chartTheme.tooltipWrapperStyle}
            cursor={false}
          />
          <Area
            type="monotone"
            dataKey="netRevenue"
            stroke={colors.best}
            strokeWidth={2}
            fill="url(#occupancySensitivityFill)"
            isAnimationActive
            animationDuration={500}
            dot={{ r: 3, fill: colors.best, stroke: "#151522", strokeWidth: 1 }}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default memo(OccupancySensitivity);
