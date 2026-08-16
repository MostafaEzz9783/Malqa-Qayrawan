import { memo } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { formatSAR } from "@/lib/format";

const SCENARIO_KEYS = ["worst", "base", "best"];

function RoomPricingTable({ t, roomPricing, scenario }) {
  return (
    <GlassCard tilt={false} className="p-5 sm:p-6 h-full">
      <h3 className="text-sm font-black mb-1" style={{ color: "#F5F3EF" }}>
        {t.widgets.roomPricing}
      </h3>
      <p className="text-xs mb-5" style={{ color: "#9C99AE" }}>
        {t.widgets.roomPricingSubtitle}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}>
          <thead>
            <tr style={{ color: "#8b889c" }}>
              <th className="text-start font-semibold pb-1 px-2">{t.units.unit}</th>
              {SCENARIO_KEYS.map((key) => (
                <th
                  key={key}
                  className="text-end font-semibold pb-1 px-2"
                  style={{ color: key === scenario ? "#E0A876" : "#8b889c" }}
                >
                  {t.scenarios[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roomPricing.map((room) => (
              <tr key={room.unit} style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                <td className="px-2 py-2 rounded-s-lg font-semibold" style={{ color: "#F5F3EF" }}>
                  {t.roomTypes[room.type]}
                </td>
                {SCENARIO_KEYS.map((key, index) => (
                  <td
                    key={key}
                    className={`px-2 py-2 text-end font-bold ${index === SCENARIO_KEYS.length - 1 ? "rounded-e-lg" : ""}`}
                    style={{ color: key === scenario ? "#E0A876" : "#B4B1C4", direction: "ltr" }}
                  >
                    {formatSAR(room[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

export default memo(RoomPricingTable);
