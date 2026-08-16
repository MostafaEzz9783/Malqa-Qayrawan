const TONE_STYLES = {
  neutral: { bg: "rgba(255,255,255,0.08)", color: "#F5F3EF", border: "rgba(255,255,255,0.14)" },
  bronze: { bg: "rgba(191,124,74,0.14)", color: "#E0A876", border: "rgba(191,124,74,0.35)" },
  purple: { bg: "rgba(91,63,214,0.16)", color: "#B4A6F5", border: "rgba(91,63,214,0.4)" },
  success: { bg: "rgba(63,184,138,0.14)", color: "#7DE0B5", border: "rgba(63,184,138,0.35)" },
  danger: { bg: "rgba(229,115,95,0.14)", color: "#F0A899", border: "rgba(229,115,95,0.35)" },
};

export default function StatusBadge({ children, tone = "neutral", icon: Icon }) {
  const style = TONE_STYLES[tone] ?? TONE_STYLES.neutral;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}` }}
    >
      {Icon && <Icon size={11} />}
      {children}
    </span>
  );
}
