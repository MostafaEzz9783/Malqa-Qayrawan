export const marketComps = {
  "1bd": {
    unitType: "1Bd",
    period: "month",
    min: 7770,
    avg: 8326,
    max: 9003,
    str: { min: 338, avg: 365.3125, max: 518 },
  },
  studio: {
    unitType: "Studio",
    period: "month",
    min: 6512.184545,
    avg: 7247.027273,
    max: 7981.87,
    str: { min: 265, avg: 299, max: 333 },
  },
  "2bd": {
    unitType: "2Bd",
    period: "month",
    min: 12470.27955,
    avg: 15121.15977,
    max: 17772.04,
    str: { min: 501, avg: 575.9090909, max: 651 },
  },
  // Kept for existing callers that only ever priced the 1Bd comp set.
  ltr: {
    unitType: "1Bd",
    period: "month",
    min: 7770,
    avg: 8326,
    max: 9003,
  },
  str: {
    unitType: "1Bd",
    period: "night",
    min: 338,
    avg: 365.3125,
    max: 518,
  },
  sourceLabel: {
    ar: "دراسة السوق - مقارنة أسعار Airbnb لوحدات الاستوديو وغرفة نوم وغرفتين في الرياض والمناطق المجاورة",
    en: "Market study - Airbnb comps for Studio, 1-bedroom, and 2-bedroom units in Riyadh and nearby districts",
  },
};

export default marketComps;
