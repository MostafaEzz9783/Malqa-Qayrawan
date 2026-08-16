import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WORKBOOKS = {
  malqa: path.join(__dirname, "..", "data-source", "Financial Study - Malqa new.xlsx"),
  qayrawan: path.join(__dirname, "..", "data-source", "Financial Study - Qayrawan new.xlsx"),
};

function assertClose(mismatches, label, actual, expectedValue, tolerance = 0.01) {
  if (typeof actual !== "number" || Number.isNaN(actual)) {
    mismatches.push(`${label}: actual value is not a number (${actual})`);
    return;
  }
  if (Math.abs(actual - expectedValue) > tolerance) {
    mismatches.push(`${label}: ${actual} !== ${expectedValue}`);
  }
}

const mismatches = [];
const workbooks = Object.fromEntries(Object.entries(WORKBOOKS).map(([key, file]) => [key, XLSX.readFile(file)]));

function cellValue(projectKey, sheetName, address) {
  const sheet = workbooks[projectKey].Sheets[sheetName];
  const target = sheet ? sheet[address] : undefined;
  return target ? target.v : undefined;
}

// ---------------------------------------------------------------------------
// 1. Confirm the source workbooks (checked into data-source/) still contain
//    the exact "Revenue at 100% occupancy" totals and fee rate the project
//    data modules were built from - for both Option 1 (LTR) and Option 2.
// ---------------------------------------------------------------------------
const EXPECTED_REVENUE_AT_100 = {
  malqa: {
    option1: { worst: 167311.2, base: 181449.6, best: 198036 },
    option2: { worst: 135960, base: 139920, best: 143880 },
  },
  qayrawan: {
    option1: { worst: 152745.6, base: 179736, best: 196200 },
    option2: { worst: 125347.2, base: 147813.6, best: 162360 },
  },
};

const SHEETS = {
  option1: { summary: "LTR Study Summary" },
  option2: { summary: "Option 2 LTR Study Summary" },
};
const SCENARIO_CELL = { worst: "F11", base: "L11", best: "P11" };
const FEE_RATE_CELL = "T15";

for (const [projectKey, options] of Object.entries(EXPECTED_REVENUE_AT_100)) {
  for (const [optionKey, scenarios] of Object.entries(options)) {
    const sheetName = SHEETS[optionKey].summary;
    for (const [scenarioKey, expected] of Object.entries(scenarios)) {
      const cell = SCENARIO_CELL[scenarioKey];
      assertClose(
        mismatches,
        `xlsx ${projectKey}/${optionKey} ${scenarioKey} rev@100 (${sheetName}!${cell})`,
        cellValue(projectKey, sheetName, cell),
        expected,
        0.5,
      );
    }
    assertClose(
      mismatches,
      `xlsx ${projectKey}/${optionKey} fee rate (${sheetName}!${FEE_RATE_CELL})`,
      cellValue(projectKey, sheetName, FEE_RATE_CELL),
      0.25,
    );
  }
}

// ---------------------------------------------------------------------------
// 2. Confirm the app's computed project data modules reproduce the same
//    source numbers exactly (occupancy x scenario grid, fee cascade).
// ---------------------------------------------------------------------------
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  optimizeDeps: { noDiscovery: true },
});

try {
  const { projects } = await server.ssrLoadModule("/src/data/projects/index.js");

  for (const [projectKey, options] of Object.entries(EXPECTED_REVENUE_AT_100)) {
    const project = projects[projectKey];
    assertClose(mismatches, `${projectKey} project defined`, project ? 1 : 0, 1);
    if (!project) continue;

    for (const [optionKey, scenarios] of Object.entries(options)) {
      const option = project.options[optionKey];
      assertClose(mismatches, `${projectKey}.${optionKey} defined`, option ? 1 : 0, 1);
      if (!option) continue;

      for (const [scenarioKey, expectedRevenueAt100] of Object.entries(scenarios)) {
        assertClose(
          mismatches,
          `${projectKey}.${optionKey}.${scenarioKey}.revenueAt100`,
          option.scenarios[scenarioKey].revenueAt100,
          expectedRevenueAt100,
          0.5,
        );

        for (const occupancy of option.occupancyOptions) {
          const row = option.scenarios[scenarioKey].occupancy[occupancy];
          const expectedRevenue = expectedRevenueAt100 * (occupancy / 100);
          const expectedNet = expectedRevenue * 0.75;
          assertClose(mismatches, `${projectKey}.${optionKey}.${scenarioKey}.${occupancy}.revenue`, row.revenue, expectedRevenue, 1);
          assertClose(mismatches, `${projectKey}.${optionKey}.${scenarioKey}.${occupancy}.netRevenue`, row.netRevenue, expectedNet, 1);
        }
      }
    }
  }

  // Data isolation: the two projects must never share a scenario's revenue.
  if (
    projects.malqa.options.option1.scenarios.base.revenueAt100 === projects.qayrawan.options.option1.scenarios.base.revenueAt100
  ) {
    mismatches.push("data isolation: malqa.option1.base.revenueAt100 equals qayrawan's (cross-project leakage suspected)");
  }

  if (mismatches.length > 0) {
    console.error(mismatches.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("VALIDATION PASSED: Malqa and Qayrawan workbooks match the computed project data within tolerance.");
  }
} finally {
  await server.close();
}
