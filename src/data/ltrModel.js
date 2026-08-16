import { buildModelScenarios } from "@/data/arqaModelCalculations";

const unitCount = 52;
const occupancyOptions = [60, 70, 80, 90];

// NOTE: the source sheet is internally inconsistent here - the row 14 label reads
// "...Mathwaa share 30%" but the cached formula result actually divides by 0.85
// (a 15% share, per row 15). Neither matches reality: confirmed directly with the
// user that Mathwaa's share is a flat 20% across every model (LTR/STR/Hybrid), so
// that's the rate applied here, not either figure from the sheet.
const feePipeline = [{ key: "mathwaaShare", labelKey: "mathwaaShare", rate: 0.2 }];

export const ltrModel = {
  key: "ltr",
  labelKey: "ltr",
  unitCount,
  occupancyOptions,
  expectedOccupancy: 80,
  feePipeline,
  scenarios: buildModelScenarios({
    unitCount,
    occupancyOptions,
    feePipeline,
    revenueAt100ByScenario: {
      worst: 4972408.707,
      base: 5401206.734,
      best: 5896796.76,
    },
  }),
};

export default ltrModel;
