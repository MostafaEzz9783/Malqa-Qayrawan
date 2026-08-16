import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { projectOrder, projects } from "@/data/projects";
import { buildOccupancyRow } from "@/data/arqaModelCalculations";
import { formatSAR, formatPercent } from "@/lib/format";

// Only compares metrics with an equivalent, identically-defined figure in
// every project's option/scenario grid - if a future project doesn't carry
// the selected option at all, its column shows N/A rather than a guess.
function getRow(project, optionKey, scenario, occupancy) {
  const option = project.options[optionKey];
  if (!option) return null;

  const scenarioData = option.scenarios[scenario];
  if (!scenarioData) return null;

  return (
    scenarioData.occupancy[occupancy] ??
    buildOccupancyRow({
      revenueAt100: scenarioData.revenueAt100,
      occupancyRate: occupancy,
      unitCount: option.roomCount,
      feePipeline: option.feePipeline,
    })
  );
}

function MetricRow({ label, cells }) {
  return (
    <tr style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
      <td className="px-3 py-2.5 rounded-s-lg font-semibold text-xs" style={{ color: "#9C99AE" }}>
        {label}
      </td>
      {cells.map((cell, index) => (
        <td
          key={index}
          className={`px-3 py-2.5 text-end font-bold text-sm ${index === cells.length - 1 ? "rounded-e-lg" : ""}`}
          style={{ color: cell === "N/A" ? "#6f6c82" : "#F5F3EF", direction: "ltr" }}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}

function ProjectComparisonCard({ t, language, optionKey, scenario, occupancy }) {
  const rows = useMemo(
    () => projectOrder.map((id) => ({ id, row: getRow(projects[id], optionKey, scenario, occupancy) })),
    [optionKey, scenario, occupancy],
  );

  const fmt = (value, formatter) => (value === null || value === undefined ? "N/A" : formatter(value));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <GlassCard tilt={false} className="p-5 sm:p-6 mb-6">
        <h3 className="text-sm font-black mb-1" style={{ color: "#F5F3EF" }}>
          {t.widgets.compareProjects}
        </h3>
        <p className="text-xs mb-5" style={{ color: "#9C99AE" }}>
          {t.widgets.compareProjectsSubtitle}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}>
            <thead>
              <tr>
                <th className="text-start px-3 pb-1 text-xs font-semibold" style={{ color: "#8b889c" }} />
                {rows.map(({ id }) => (
                  <th key={id} className="text-end px-3 pb-1 text-xs font-black" style={{ color: "#E0A876" }}>
                    {projects[id].name[language]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <MetricRow
                label={t.kpi.projectedRevenue}
                cells={rows.map(({ row }) => fmt(row?.revenue, (v) => `SAR ${formatSAR(v)}`))}
              />
              <MetricRow
                label={t.kpi.netToOwner}
                cells={rows.map(({ row }) => fmt(row?.netRevenue, (v) => `SAR ${formatSAR(v)}`))}
              />
              <MetricRow
                label={t.widgets.ownerMargin}
                cells={rows.map(({ row }) =>
                  fmt(row && row.revenue > 0 ? (row.netRevenue / row.revenue) * 100 : null, (v) => `${formatPercent(v, 1)}%`),
                )}
              />
              <MetricRow
                label={t.widgets.netPerUnitPerMonth}
                cells={rows.map(({ row }) => fmt(row?.monthlyPerUnit, (v) => `SAR ${formatSAR(v)}`))}
              />
              <MetricRow label={t.selectors.occupancy} cells={rows.map(() => `${occupancy}%`)} />
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default memo(ProjectComparisonCard);
