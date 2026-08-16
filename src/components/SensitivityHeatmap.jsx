import { Fragment, memo, useMemo } from "react";
import ChartContainer from "@/components/ui/ChartContainer";
import { formatSAR } from "@/lib/format";

const SCENARIO_KEYS = ["worst", "base", "best"];

// Cell labels only - the underlying SAR values (used for color, sorting, and
// the title tooltip) are untouched. Below 1,000K stays as whole thousands
// ("987K"); at/above 1,000K it switches to millions with one decimal ("1.1M").
function formatHeatmapCellValue(value) {
  const thousands = value / 1000;
  if (thousands < 1000) {
    return `${Math.round(thousands)}K`;
  }
  return `${(value / 1_000_000).toFixed(1)}M`;
}

function SensitivityHeatmap({ t, model, activeScenario, activeOccupancy }) {
  const { occupancyOptions } = model;

  const { cells, min, max } = useMemo(() => {
    const grid = occupancyOptions.map((occupancy) =>
      SCENARIO_KEYS.map((scenarioKey) => model.scenarios[scenarioKey].occupancy[occupancy].netRevenue),
    );
    const allValues = grid.flat();

    return { cells: grid, min: Math.min(...allValues), max: Math.max(...allValues) };
  }, [occupancyOptions, model]);

  const colorFor = (value) => {
    const ratio = max > min ? (value - min) / (max - min) : 0.5;
    const alpha = 0.12 + ratio * 0.75;
    return `rgba(63, 184, 138, ${alpha})`;
  };

  return (
    <ChartContainer title={t.widgets.sensitivityHeatmap} subtitle={t.widgets.sensitivityHeatmapSubtitle} height="auto">
      <div dir="ltr">
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `56px repeat(${SCENARIO_KEYS.length}, 1fr)` }}
        >
          <div />
          {SCENARIO_KEYS.map((scenarioKey) => (
            <div key={scenarioKey} className="text-center text-[11px] font-bold pb-1" style={{ color: "#9C99AE" }}>
              {t.scenarios[scenarioKey]}
            </div>
          ))}

          {occupancyOptions.map((occupancy, rowIndex) => (
            <Fragment key={occupancy}>
              <div className="flex items-center justify-end pr-2 text-[11px] font-bold" style={{ color: "#9C99AE" }}>
                {occupancy}%
              </div>
              {SCENARIO_KEYS.map((scenarioKey, colIndex) => {
                const value = cells[rowIndex][colIndex];
                const isActive = occupancy === activeOccupancy && scenarioKey === activeScenario;

                return (
                  <div
                    key={`${occupancy}-${scenarioKey}`}
                    className="rounded-lg flex items-center justify-center text-[11px] font-bold py-2.5"
                    style={{
                      backgroundColor: colorFor(value),
                      color: "#F5F3EF",
                      border: isActive ? "2px solid #E0A876" : "2px solid transparent",
                    }}
                    title={`SAR ${formatSAR(value)}`}
                  >
                    {formatHeatmapCellValue(value)}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
}

export default memo(SensitivityHeatmap);
