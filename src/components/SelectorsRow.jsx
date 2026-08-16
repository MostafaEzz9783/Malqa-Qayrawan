import { memo, useMemo } from "react";
import SegmentedControl from "@/components/ui/SegmentedControl";
import OccupancySlider from "@/components/OccupancySlider";
import GlassCard from "@/components/ui/GlassCard";

const OPTION_KEYS = ["option1", "option2"];
const SCENARIO_KEYS = ["worst", "base", "best"];

function SelectorsRow({
  t,
  option,
  onOptionChange,
  scenario,
  onScenarioChange,
  occupancy,
  onOccupancyChange,
  occupancyOptions,
}) {
  const optionOptions = useMemo(
    () => OPTION_KEYS.map((key) => ({ value: key, label: t.options[key].label, sublabel: t.options[key].sublabel })),
    [t],
  );

  const scenarioOptions = useMemo(() => SCENARIO_KEYS.map((key) => ({ value: key, label: t.scenarios[key] })), [t]);

  return (
    <GlassCard tilt={false} className="p-5 sm:p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-items-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold" style={{ color: "#9C99AE" }}>
            {t.selectors.option}
          </p>
          <SegmentedControl
            layoutId="option-pill"
            options={optionOptions}
            value={option}
            onChange={onOptionChange}
            label={t.selectors.option}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold" style={{ color: "#9C99AE" }}>
            {t.selectors.scenario}
          </p>
          <SegmentedControl
            layoutId="scenario-pill"
            options={scenarioOptions}
            value={scenario}
            onChange={onScenarioChange}
            label={t.selectors.scenario}
          />
        </div>

        <OccupancySlider options={occupancyOptions} value={occupancy} onChange={onOccupancyChange} t={t} />
      </div>
    </GlassCard>
  );
}

export default memo(SelectorsRow);
