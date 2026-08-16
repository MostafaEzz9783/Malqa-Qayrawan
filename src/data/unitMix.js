// Real unit-type breakdown of the 52-unit portfolio, from the LTR/STR Financial
// Study sheets (unit numbers 1-46 = 1Bd, 47-49 = Studio, 50-52 = 2Bd).
export const unitMix = [
  {
    key: "1bd",
    type: { ar: "غرفة نوم واحدة", en: "1-Bedroom" },
    count: 46,
    ltrPrice: { worst: 7770, base: 8326, best: 9003 },
    strPrice: { worst: 338, base: 365.3125, best: 518 },
  },
  {
    key: "studio",
    type: { ar: "استوديو", en: "Studio" },
    count: 3,
    ltrPrice: { worst: 6512.184545, base: 7247.027273, best: 7981.87 },
    strPrice: { worst: 265, base: 299, best: 333 },
  },
  {
    key: "2bd",
    type: { ar: "غرفتا نوم", en: "2-Bedroom" },
    count: 3,
    ltrPrice: { worst: 12470.27955, base: 15121.15977, best: 17772.04 },
    strPrice: { worst: 501, base: 575.9090909, best: 651 },
  },
];

export const totalUnitCount = unitMix.reduce((sum, unit) => sum + unit.count, 0);

export default unitMix;
