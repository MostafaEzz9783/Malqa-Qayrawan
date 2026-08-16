export default function StatChip({ label, value, note, color = "#F5F3EF", active = false }) {
  return (
    <div
      className="rounded-xl px-3 py-2.5 min-w-[110px]"
      style={{
        backgroundColor: active ? "rgba(191,124,74,0.1)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? "rgba(191,124,74,0.35)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#8b889c" }}>
        {label}
      </p>
      <p className="text-sm font-black" style={{ color, direction: "ltr" }}>
        {value}
      </p>
      {note && (
        <p className="text-[10px] mt-0.5" style={{ color: "#6f6c82" }}>
          {note}
        </p>
      )}
    </div>
  );
}
