export function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatSAR(value) {
  return formatNumber(value);
}

export function formatPercent(value, fractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

// Shared Recharts <Tooltip formatter={...}> - every chart in the dashboard
// renders SAR currency values the same way.
export function sarTooltipFormatter(value) {
  return `SAR ${formatSAR(value)}`;
}
