export const colors = {
  bronze: "#BF7C4A",
  bronzeLight: "#E0A876",
  purple: "#5B3FD6",
  purpleLight: "#8B76E8",
  canvas: "#F7F6F3",
  darkSurface: "#151522",
  card: "#1D1D2D",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  textPrimary: "#F5F3EF",
  textMuted: "#9C99AE",
  worst: "#E5735F",
  base: "#BF7C4A",
  best: "#3FB88A",
};

export const gradients = {
  bronzePurple: "linear-gradient(135deg, #BF7C4A 0%, #5B3FD6 100%)",
  bronzeGlow: "radial-gradient(circle at 30% 20%, rgba(191, 124, 74, 0.35), transparent 60%)",
  purpleGlow: "radial-gradient(circle at 70% 80%, rgba(91, 63, 214, 0.30), transparent 60%)",
  heroCard: "linear-gradient(160deg, #1D1D2D 0%, #17172a 60%, #1a1530 100%)",
};

export const motion = {
  duration: {
    fast: 0.18,
    base: 0.25,
    slow: 0.4,
  },
  spring: {
    type: "spring",
    stiffness: 260,
    damping: 24,
  },
  softSpring: {
    type: "spring",
    stiffness: 180,
    damping: 22,
  },
  hoverLift: -6,
  hoverScale: 1.02,
  tiltMaxDeg: 6,
  floatLoopSeconds: 26,
  counterEase: [0.16, 1, 0.3, 1],
};

export const scenarioColor = (scenarioKey) => colors[scenarioKey] ?? colors.base;

// Shared per-operating-model color, reused by every widget that breaks a
// value down by LTR/STR/Hybrid (Portfolio Snapshot bars, Cash Flow bars, etc.)
export const modelColor = {
  ltr: "#E0A876",
  str: "#B4A6F5",
  hybrid: "#3FB88A",
};

// Recharts styling shared by every chart widget - kept in one place so the
// dark-theme tooltip/axis look stays consistent without re-typing it per chart.
export const chartTheme = {
  tooltipContentStyle: {
    backgroundColor: "#1D1D2D",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  // Recharts' DefaultTooltipContent otherwise leaves the label/item/wrapper
  // text color unset, which falls back to the browser's default black - all
  // three must be set explicitly so every tooltip's title, item names, and
  // values render in white against the dark background.
  tooltipLabelStyle: { color: "#FFFFFF" },
  tooltipItemStyle: { color: "#FFFFFF" },
  tooltipWrapperStyle: { color: "#FFFFFF" },
  axisTick: { fill: "#9C99AE", fontSize: 11 },
  axisTickSmall: { fill: "#9C99AE", fontSize: 10 },
  axisLine: { stroke: "rgba(255,255,255,0.1)" },
  gridStroke: "rgba(255,255,255,0.06)",
};
