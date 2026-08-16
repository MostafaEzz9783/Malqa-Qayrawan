import { applyFeePipeline, buildModelScenarios } from "@/data/arqaModelCalculations";

const unitCount = 52;
const occupancyOptions = [40, 50, 60, 70, 80, 90];

// Unlike the previous version of this workbook, "Hybrid Model" is now a real,
// internally-consistent, occupancy-driven sheet in its own right (matching the
// OTA 15.5% -> Mathwaa 20% cascade already used by STR) rather than a stale
// duplicate of the STR tab - so it's built the same way as ltrModel/strModel.
const feePipeline = [
  { key: "otaFee", labelKey: "otaFee", rate: 0.155 },
  { key: "mathwaaShare", labelKey: "mathwaaShare", rate: 0.2 },
];

const strOccupancyAssumption = 60;
const ltrOccupancyAssumption = 80;

// "Hybrid Projection" still supplies the only real month-by-month shape (4
// STR months: Jan-Mar+Dec, 8 LTR months: Apr-Nov) at the fixed assumed
// occupancy above - used only for the Cash Flow Timeline's seasonality, not
// for the occupancy-driven KPIs/sensitivity/waterfall (those use the clean
// "Hybrid Model" scenarios below).
//
// NOTE: the source sheet's STR-month cells were only partly refreshed when the
// portfolio was revised to the new 52-unit / 3-type mix - Base's Jan/Feb/Mar
// got the new blended rate but its Dec cell (and every STR month in Worst and
// Best) still holds the old single-unit-type rate. Reproduced exactly as
// authored, not corrected.
const MONTH_KEYS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH_TYPES = ["str", "str", "str", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "str"];
const PER_UNIT_MONTHLY_REVENUE = {
  worst: [6084, 6084, 6084, 6374.882958, 6374.882958, 6374.882958, 6374.882958, 6374.882958, 6374.882958, 6374.882958, 6374.882958, 6084],
  base: [6725.458479, 6725.458479, 6725.458479, 6924.624017, 6924.624017, 6924.624017, 6924.624017, 6924.624017, 6924.624017, 6924.624017, 6924.624017, 6575.625],
  best: [9324, 9324, 9324, 7559.995846, 7559.995846, 7559.995846, 7559.995846, 7559.995846, 7559.995846, 7559.995846, 7559.995846, 9324],
};

const round = (value) => Math.round(value);
// Cash Flow Timeline shows Mathwaa's flat operator-fee treatment as labeled in
// the "Hybrid Projection" sheet (a simplified single 20% cut, not the OTA+Mathwaa
// cascade used by the occupancy-driven scenarios above) - kept as its own
// pipeline since that's what that sheet's own formulas apply.
const monthlyFeePipeline = [{ key: "mathwaaShare", labelKey: "mathwaaShare", rate: 0.2 }];

function buildMonthlyScenario(perUnitRevenues) {
  const exactMonths = perUnitRevenues.map((perUnitRevenue, index) => {
    const revenue = perUnitRevenue * unitCount;
    const { net, deductions } = applyFeePipeline(revenue, monthlyFeePipeline);

    return {
      key: MONTH_KEYS[index],
      type: MONTH_TYPES[index],
      revenue,
      fee: deductions[0].amount,
      netToOwner: net,
    };
  });

  const months = exactMonths.map((month) => ({
    key: month.key,
    type: month.type,
    revenue: round(month.revenue),
    fee: round(month.fee),
    netToOwner: round(month.netToOwner),
  }));

  return { months };
}

const strMonthCount = MONTH_TYPES.filter((type) => type === "str").length;
const ltrMonthCount = MONTH_TYPES.filter((type) => type === "ltr").length;

export const hybridModel = {
  key: "hybrid",
  labelKey: "hybrid",
  unitCount,
  occupancyOptions,
  feePipeline,
  strOccupancyAssumption,
  ltrOccupancyAssumption,
  expectedOccupancy:
    Math.round(((strOccupancyAssumption * strMonthCount + ltrOccupancyAssumption * ltrMonthCount) / 12) * 10) / 10,
  scenarios: buildModelScenarios({
    unitCount,
    occupancyOptions,
    feePipeline,
    revenueAt100ByScenario: {
      worst: 3133938.648,
      base: 3417398.091,
      best: 4067480.218,
    },
  }),
  monthly: {
    worst: buildMonthlyScenario(PER_UNIT_MONTHLY_REVENUE.worst),
    base: buildMonthlyScenario(PER_UNIT_MONTHLY_REVENUE.base),
    best: buildMonthlyScenario(PER_UNIT_MONTHLY_REVENUE.best),
  },
};

export default hybridModel;
