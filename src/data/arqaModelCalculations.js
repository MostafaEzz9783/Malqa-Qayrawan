const round = (value) => Math.round(value);

// Different operating models have different occupancy grids (e.g. LTR only
// goes down to 60%, STR/Hybrid go to 40%) - this snaps a target occupancy to
// the nearest value a given model's grid actually supports, so cross-model
// comparisons never fabricate a data point a model doesn't have.
export function closestOccupancyOption(options, target) {
  return options.reduce((closest, option) => (Math.abs(option - target) < Math.abs(closest - target) ? option : closest));
}

export function applyFeePipeline(grossRevenue, feePipeline) {
  let runningNet = grossRevenue;
  const deductions = [];

  for (const fee of feePipeline) {
    const amount = runningNet * fee.rate;
    runningNet -= amount;
    deductions.push({ key: fee.key, labelKey: fee.labelKey, rate: fee.rate, amount });
  }

  return { net: runningNet, deductions };
}

export function buildOccupancyRow({ revenueAt100, occupancyRate, unitCount, feePipeline }) {
  const revenue = revenueAt100 * (occupancyRate / 100);
  const { net, deductions } = applyFeePipeline(revenue, feePipeline);
  const netRevenue = net;
  const annualPerUnit = netRevenue / unitCount;
  const monthlyPerUnit = annualPerUnit / 12;

  return {
    revenue: round(revenue),
    netRevenue: round(netRevenue),
    annualPerUnit: round(annualPerUnit),
    monthlyPerUnit: round(monthlyPerUnit),
    deductions: deductions.map((deduction) => ({ ...deduction, amount: round(deduction.amount) })),
  };
}

export function buildScenario({ revenueAt100, occupancyOptions, unitCount, feePipeline }) {
  const occupancy = occupancyOptions.reduce((rows, rate) => {
    rows[rate] = buildOccupancyRow({ revenueAt100, occupancyRate: rate, unitCount, feePipeline });
    return rows;
  }, {});

  return { revenueAt100, occupancy };
}

export function buildModelScenarios({ unitCount, occupancyOptions, feePipeline, revenueAt100ByScenario }) {
  return Object.entries(revenueAt100ByScenario).reduce((scenarios, [scenarioKey, revenueAt100]) => {
    scenarios[scenarioKey] = buildScenario({ revenueAt100, occupancyOptions, unitCount, feePipeline });
    return scenarios;
  }, {});
}
