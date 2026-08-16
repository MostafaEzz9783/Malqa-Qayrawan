import { buildModelScenarios } from "@/data/arqaModelCalculations";

// Source: data-source/Financial Study - Malqa new.xlsx
// Fee rate is read from cell T15 on both "LTR Study Summary" and "Option 2 LTR
// Study Summary" - both sheets carry the same flat 25% Mathwaa share.
const feePipeline = [{ key: "mathwaaShare", labelKey: "mathwaaShare", rate: 0.25 }];
const occupancyOptions = [60, 70, 80, 90];

// "LTR Financial Study" sheet, A5: "Option 1 : add additional room instead of
// living room". Room rows/prices come from H7:J10 (Best/Base/Worst columns),
// unit numbers from column L. Two rows share one "Medium room" price by
// design (they reference the same $B$10/$C$10/$D$10 cells).
const option1RoomPricing = [
  { unit: 1, type: "internalMaster", worst: 3900, base: 4200, best: 4500 },
  { unit: 2, type: "mediumRoom", worst: 3200, base: 3499, best: 3900 },
  { unit: 3, type: "mediumRoom", worst: 3200, base: 3499, best: 3900 },
  { unit: 4, type: "externalMaster", worst: 3642.6, base: 3922.8, best: 4203 },
];

// "LTR Study Summary" sheet, F11/L11/P11 (= 'LTR Financial Study'!J12/I12/H12,
// the SUM(H7:H10)*12 total for each scenario column).
const option1RevenueAt100 = { worst: 167311.2, base: 181449.6, best: 198036 };

// "Option 2 LTR Financial Study" sheet, A5: "Option 2 : keep it the same as
// 3BR". Only 3 rooms (no External Master) - H7:J9.
const option2RoomPricing = [
  { unit: 1, type: "internalMaster", worst: 4290, base: 4620, best: 4950 },
  { unit: 2, type: "mediumRoom", worst: 3520, base: 3520, best: 3520 },
  { unit: 3, type: "mediumRoom", worst: 3520, base: 3520, best: 3520 },
];

// "Option 2 LTR Study Summary" sheet, F11/L11/P11.
const option2RevenueAt100 = { worst: 135960, base: 139920, best: 143880 };

function buildOption({ key, roomPricing, revenueAt100ByScenario }) {
  const roomCount = roomPricing.length;

  return {
    key,
    roomCount,
    occupancyOptions,
    feePipeline,
    roomPricing,
    revenueAt100ByScenario,
    scenarios: buildModelScenarios({
      unitCount: roomCount,
      occupancyOptions,
      feePipeline,
      revenueAt100ByScenario,
    }),
  };
}

export const malqaProject = {
  id: "malqa",
  name: { ar: "الملقا", en: "Malqa" },
  location: { ar: "الرياض", en: "Riyadh" },
  locationSubtext: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
  options: {
    option1: buildOption({ key: "option1", roomPricing: option1RoomPricing, revenueAt100ByScenario: option1RevenueAt100 }),
    option2: buildOption({ key: "option2", roomPricing: option2RoomPricing, revenueAt100ByScenario: option2RevenueAt100 }),
  },
};

export default malqaProject;
