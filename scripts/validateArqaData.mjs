import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workbookPath = path.join(__dirname, "..", "data-source", "Financial Study - Arqa.xlsx");

function assertClose(mismatches, label, actual, expectedValue, tolerance = 0.01) {
  if (typeof actual !== "number" || Number.isNaN(actual)) {
    mismatches.push(`${label}: actual value is not a number (${actual})`);
    return;
  }

  if (Math.abs(actual - expectedValue) > tolerance) {
    mismatches.push(`${label}: ${actual} !== ${expectedValue}`);
  }
}

function assertEqual(mismatches, label, actual, expectedValue) {
  if (actual !== expectedValue) {
    mismatches.push(`${label}: ${JSON.stringify(actual)} !== ${JSON.stringify(expectedValue)}`);
  }
}

const mismatches = [];

// ---------------------------------------------------------------------------
// 1. Confirm the source workbook (checked into data-source/) still contains
//    the exact cells this project's hardcoded data modules were built from.
//    This is the 52-unit / 3-type-mix revision of the workbook.
// ---------------------------------------------------------------------------
const workbook = XLSX.readFile(workbookPath);

function cellValue(sheetName, address) {
  const sheet = workbook.Sheets[sheetName];
  const target = sheet ? sheet[address] : undefined;
  return target ? target.v : undefined;
}

assertClose(mismatches, "xlsx LTR worst rev@100", cellValue("LTR Study Summary", "F11"), 4972408.707, 0.5);
assertClose(mismatches, "xlsx LTR base rev@100", cellValue("LTR Study Summary", "L11"), 5401206.734, 0.5);
assertClose(mismatches, "xlsx LTR best rev@100", cellValue("LTR Study Summary", "P11"), 5896796.76, 0.5);
assertClose(mismatches, "xlsx STR worst rev@100", cellValue("STR Study Summary", "F12"), 6424560);
assertClose(mismatches, "xlsx STR base rev@100", cellValue("STR Study Summary", "L12"), 6994476.818, 0.5);
assertClose(mismatches, "xlsx STR best rev@100", cellValue("STR Study Summary", "R12"), 9640800);

assertClose(mismatches, "xlsx Hybrid Model worst rev@100", cellValue("Hybrid Model", "F12"), 3133938.648, 0.5);
assertClose(mismatches, "xlsx Hybrid Model base rev@100", cellValue("Hybrid Model", "L12"), 3417398.091, 0.5);
assertClose(mismatches, "xlsx Hybrid Model best rev@100", cellValue("Hybrid Model", "R12"), 4067480.218, 0.5);

assertClose(mismatches, "xlsx Hybrid Projection worst total revenue/unit", cellValue("Hybrid Projection", "R26"), 75335.06366, 0.01);
assertClose(mismatches, "xlsx Hybrid Projection base total revenue/unit", cellValue("Hybrid Projection", "R16"), 82148.99258, 0.01);
assertClose(mismatches, "xlsx Hybrid Projection best total revenue/unit", cellValue("Hybrid Projection", "R35"), 97775.96677, 0.01);

// CompSet: 1Bd (unchanged), Studio (new), 2Bd (new)
assertClose(mismatches, "xlsx CompSet 1Bd LTR min/avg/max", cellValue("CompSet", "C3"), 7770);
assertClose(mismatches, "xlsx CompSet 1Bd LTR avg", cellValue("CompSet", "B3"), 8326);
assertClose(mismatches, "xlsx CompSet 1Bd LTR max", cellValue("CompSet", "D3"), 9003);
assertClose(mismatches, "xlsx CompSet 1Bd STR avg", cellValue("CompSet", "G2"), 365.3125);
assertClose(mismatches, "xlsx CompSet Studio LTR avg", cellValue("CompSet", "B76"), 7247.027273, 0.001);
assertClose(mismatches, "xlsx CompSet Studio LTR min", cellValue("CompSet", "C76"), 6512.184545, 0.001);
assertClose(mismatches, "xlsx CompSet Studio LTR max", cellValue("CompSet", "D76"), 7981.87);
assertClose(mismatches, "xlsx CompSet Studio STR avg", cellValue("CompSet", "G76"), 299);
assertClose(mismatches, "xlsx CompSet 2Bd LTR avg", cellValue("CompSet", "B80"), 15121.15977, 0.001);
assertClose(mismatches, "xlsx CompSet 2Bd LTR min", cellValue("CompSet", "C80"), 12470.27955, 0.001);
assertClose(mismatches, "xlsx CompSet 2Bd LTR max", cellValue("CompSet", "D80"), 17772.04);
assertClose(mismatches, "xlsx CompSet 2Bd STR avg", cellValue("CompSet", "G80"), 575.9090909, 0.001);

// Unit mix: 46x1Bd + 3xStudio + 3x2Bd = 52 total (LTR Financial Study unit numbering)
assertEqual(mismatches, "xlsx LTR unit 46 is last 1Bd", cellValue("LTR Financial Study", "K52"), "1Bd");
assertEqual(mismatches, "xlsx LTR unit 47 is first Studio", cellValue("LTR Financial Study", "K53"), "Studio");
assertEqual(mismatches, "xlsx LTR unit 50 is first 2Bd", cellValue("LTR Financial Study", "K56"), "2Bd");
assertClose(mismatches, "xlsx LTR total unit count", cellValue("LTR Financial Study", "L58"), 52);

// ---------------------------------------------------------------------------
// 2. Confirm the app's computed data modules reproduce the same source numbers
//    (occupancy x scenario grid, fee cascade) exactly.
// ---------------------------------------------------------------------------
// Revenue (pre-fee) figures come straight from each sheet's "Revenue pre
// deductions" row - correct and unambiguous. LTR's net figures are NOT taken
// from the sheet's own "net" row (internally inconsistent - see the note in
// ltrModel.js): confirmed with the user that Mathwaa's real share is a flat
// 20% across every model, so LTR net here = revenue * 0.8, independently
// computed. STR and Hybrid net figures match the sheet's own OTA->Mathwaa
// cascade exactly (15.5% then 20%), no override needed.
const LTR_EXPECTED = {"worst": {"60": {"revenue": 2983445, "net": 2386756}, "70": {"revenue": 3480686, "net": 2784549}, "80": {"revenue": 3977927, "net": 3182342}, "90": {"revenue": 4475168, "net": 3580134}}, "base": {"60": {"revenue": 3240724, "net": 2592579}, "70": {"revenue": 3780845, "net": 3024676}, "80": {"revenue": 4320965, "net": 3456772}, "90": {"revenue": 4861086, "net": 3888869}}, "best": {"60": {"revenue": 3538078, "net": 2830462}, "70": {"revenue": 4127758, "net": 3302206}, "80": {"revenue": 4717437, "net": 3773950}, "90": {"revenue": 5307117, "net": 4245694}}};

const STR_EXPECTED = {"worst": {"40": {"revenue": 2569824, "net": 1737201}, "50": {"revenue": 3212280, "net": 2171501}, "60": {"revenue": 3854736, "net": 2605802}, "70": {"revenue": 4497192, "net": 3040102}, "80": {"revenue": 5139648, "net": 3474402}, "90": {"revenue": 5782104, "net": 3908702}}, "base": {"40": {"revenue": 2797791, "net": 1891307}, "50": {"revenue": 3497238, "net": 2364133}, "60": {"revenue": 4196686, "net": 2836960}, "70": {"revenue": 4896134, "net": 3309786}, "80": {"revenue": 5595581, "net": 3782613}, "90": {"revenue": 6295029, "net": 4255440}}, "best": {"40": {"revenue": 3856320, "net": 2606872}, "50": {"revenue": 4820400, "net": 3258590}, "60": {"revenue": 5784480, "net": 3910308}, "70": {"revenue": 6748560, "net": 4562027}, "80": {"revenue": 7712640, "net": 5213745}, "90": {"revenue": 8676720, "net": 5865463}}};

const HYBRID_EXPECTED = {"worst": {"40": {"revenue": 1253575, "net": 847417}, "50": {"revenue": 1566969, "net": 1059271}, "60": {"revenue": 1880363, "net": 1271126}, "70": {"revenue": 2193757, "net": 1482980}, "80": {"revenue": 2507151, "net": 1694834}, "90": {"revenue": 2820545, "net": 1906688}}, "base": {"40": {"revenue": 1366959, "net": 924064}, "50": {"revenue": 1708699, "net": 1155081}, "60": {"revenue": 2050439, "net": 1386097}, "70": {"revenue": 2392179, "net": 1617113}, "80": {"revenue": 2733918, "net": 1848129}, "90": {"revenue": 3075658, "net": 2079145}}, "best": {"40": {"revenue": 1626992, "net": 1099847}, "50": {"revenue": 2033740, "net": 1374808}, "60": {"revenue": 2440488, "net": 1649770}, "70": {"revenue": 2847236, "net": 1924732}, "80": {"revenue": 3253984, "net": 2199693}, "90": {"revenue": 3660732, "net": 2474655}}};

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  optimizeDeps: { noDiscovery: true },
});

try {
  const { ltrModel } = await server.ssrLoadModule("/src/data/ltrModel.js");
  const { strModel } = await server.ssrLoadModule("/src/data/strModel.js");
  const { hybridModel } = await server.ssrLoadModule("/src/data/hybridModel.js");
  const { marketComps } = await server.ssrLoadModule("/src/data/marketComps.js");
  const { totalUnitCount } = await server.ssrLoadModule("/src/data/unitMix.js");

  assertClose(mismatches, "ltrModel.unitCount", ltrModel.unitCount, 52);
  assertClose(mismatches, "strModel.unitCount", strModel.unitCount, 52);
  assertClose(mismatches, "hybridModel.unitCount", hybridModel.unitCount, 52);
  assertClose(mismatches, "unitMix.totalUnitCount", totalUnitCount, 52);

  // tolerance = 2 SAR: our model rounds every row to the nearest whole currency
  // unit (matching the project's display convention), the sheet doesn't.
  for (const [scenarioKey, occupancyRows] of Object.entries(LTR_EXPECTED)) {
    for (const [occupancy, expected] of Object.entries(occupancyRows)) {
      const row = ltrModel.scenarios[scenarioKey].occupancy[occupancy];
      assertClose(mismatches, `ltrModel.${scenarioKey}.${occupancy}.revenue`, row.revenue, expected.revenue, 2);
      assertClose(mismatches, `ltrModel.${scenarioKey}.${occupancy}.netRevenue`, row.netRevenue, expected.net, 2);
    }
  }

  for (const [scenarioKey, occupancyRows] of Object.entries(STR_EXPECTED)) {
    for (const [occupancy, expected] of Object.entries(occupancyRows)) {
      const row = strModel.scenarios[scenarioKey].occupancy[occupancy];
      assertClose(mismatches, `strModel.${scenarioKey}.${occupancy}.revenue`, row.revenue, expected.revenue, 2);
      assertClose(mismatches, `strModel.${scenarioKey}.${occupancy}.netRevenue`, row.netRevenue, expected.net, 2);
    }
  }

  for (const [scenarioKey, occupancyRows] of Object.entries(HYBRID_EXPECTED)) {
    for (const [occupancy, expected] of Object.entries(occupancyRows)) {
      const row = hybridModel.scenarios[scenarioKey].occupancy[occupancy];
      assertClose(mismatches, `hybridModel.${scenarioKey}.${occupancy}.revenue`, row.revenue, expected.revenue, 2);
      assertClose(mismatches, `hybridModel.${scenarioKey}.${occupancy}.netRevenue`, row.netRevenue, expected.net, 2);
    }
  }

  assertClose(mismatches, "hybridModel.expectedOccupancy", hybridModel.expectedOccupancy, 73.3, 0.1);
  assertClose(mismatches, "marketComps.1bd.avg", marketComps["1bd"].avg, 8326);
  assertClose(mismatches, "marketComps.studio.avg", marketComps.studio.avg, 7247.027273, 0.001);
  assertClose(mismatches, "marketComps.2bd.avg", marketComps["2bd"].avg, 15121.15977, 0.001);

  if (mismatches.length > 0) {
    console.error(mismatches.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("VALIDATION PASSED: data-source workbook and computed models match within tolerance.");
  }
} finally {
  await server.close();
}
