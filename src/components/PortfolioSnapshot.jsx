import { memo, useMemo } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartContainer from "@/components/ui/ChartContainer";
import StatChip from "@/components/ui/StatChip";
import { buildOccupancyRow } from "@/data/arqaModelCalculations";
import { formatSAR, sarTooltipFormatter } from "@/lib/format";
import { chartTheme } from "@/lib/theme";

const OPTION_KEYS = ["option1", "option2"];
const OPTION_COLOR = { option1: "#BF7C4A", option2: "#5B3FD6" };

// Both options share the same occupancy grid today, but this falls back to
// computing the row on the fly (same formula/fee pipeline as every tabulated
// row) if a future option's grid doesn't include the selected occupancy -
// so the comparison never silently swaps in a different occupancy.
function getRowForOption(option, scenario, occupancy) {
  const scenarioData = option.scenarios[scenario];
  const tabulatedRow = scenarioData.occupancy[occupancy];
  if (tabulatedRow) return tabulatedRow;

  return buildOccupancyRow({
    revenueAt100: scenarioData.revenueAt100,
    occupancyRate: occupancy,
    unitCount: option.roomCount,
    feePipeline: option.feePipeline,
  });
}

function PortfolioSnapshot({ t, project, scenario, occupancy }) {
  const data = useMemo(
    () =>
      OPTION_KEYS.map((key) => {
        const option = project.options[key];
        const row = getRowForOption(option, scenario, occupancy);
        return { key, name: t.options[key].label, netRevenue: row.netRevenue };
      }),
    [t, project, scenario, occupancy],
  );

  const subtitle = `${t.widgets.portfolioSnapshotSubtitlePrefix} ${t.scenarios[scenario]} · ${occupancy}%`;

  return (
    <ChartContainer
      title={t.widgets.portfolioSnapshot}
      subtitle={subtitle}
      height={220}
      footer={
        <div className="flex flex-wrap gap-2">
          {OPTION_KEYS.map((key) => (
            <StatChip
              key={key}
              label={t.options[key].label}
              value={`${project.options[key].roomCount} ${t.units.rooms}`}
            />
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="name" tick={chartTheme.axisTick} axisLine={chartTheme.axisLine} tickLine={false} />
          <YAxis tick={chartTheme.axisTickSmall} axisLine={false} tickLine={false} tickFormatter={formatSAR} />
          <Tooltip
            formatter={sarTooltipFormatter}
            contentStyle={chartTheme.tooltipContentStyle}
            labelStyle={chartTheme.tooltipLabelStyle}
            itemStyle={chartTheme.tooltipItemStyle}
            wrapperStyle={chartTheme.tooltipWrapperStyle}
            cursor={false}
          />
          <Bar dataKey="netRevenue" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={500}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={OPTION_COLOR[entry.key]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default memo(PortfolioSnapshot);
