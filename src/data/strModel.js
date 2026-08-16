import { buildModelScenarios } from "@/data/arqaModelCalculations";

const unitCount = 52;
const occupancyOptions = [40, 50, 60, 70, 80, 90];

const feePipeline = [
  { key: "otaFee", labelKey: "otaFee", rate: 0.155 },
  { key: "mathwaaShare", labelKey: "mathwaaShare", rate: 0.2 },
];

export const strModel = {
  key: "str",
  labelKey: "str",
  unitCount,
  occupancyOptions,
  expectedOccupancy: 60,
  feePipeline,
  scenarios: buildModelScenarios({
    unitCount,
    occupancyOptions,
    feePipeline,
    revenueAt100ByScenario: {
      worst: 6424560,
      base: 6994476.818,
      best: 9640800,
    },
  }),
};

export default strModel;
